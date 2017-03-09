'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.System = exports.Effect = exports.removeActor = exports.putActor = exports.address = exports.log = exports.reconcile = exports.putEffect = exports.runEffects = exports.execIOOP = exports.execStop = exports.execReceive = exports.execSend = exports.execSpawn = exports.exec = exports.actorCheckedLens = exports.actorLens = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.InvalidActorPathError = InvalidActorPathError;

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

var _util = require('./util');

var _be = require('./be');

var _Match = require('./Match');

var _monad = require('./monad');

var _Type3 = require('./Type');

var _Actor = require('./Actor');

var _Op = require('./Op');

var Op = _interopRequireWildcard(_Op);

var _lens = require('./lens');

var lens = _interopRequireWildcard(_lens);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * InvalidActorPathError
 * @param {string} path
 */
function InvalidActorPathError(path) {

    this.message = 'The path \'' + path + '\' is either invalid or in use!';
    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

InvalidActorPathError.prototype = Object.create(Error.prototype);
InvalidActorPathError.prototype.constructor = InvalidActorPathError;

/**(m.orElse(() => Maybe.of(r)).just())
 * actorLens
 */
var actorLens = exports.actorLens = function actorLens(path) {
    return function (actor, sys) {
        return sys === undefined ? actor.actors[path] : (0, _propertySeek2.default)('actors[' + path + ']', actor, sys);
    };
};

/**
 * actorCheckedLens
 */
var actorCheckedLens = exports.actorCheckedLens = function actorCheckedLens(path) {
    return function (actor, sys) {

        if (sys === undefined) if ((0, _propertySeek2.default)('actors[' + path + ']', sys) != null) throw new InvalidActorPathError(path);

        return actorLens(path)(actor, sys);
    };
};

/**
 * exec executes the Op provide an effect as the result
 * @summary {(Op, Actor) →  Effect}
 */
var exec = exports.exec = function exec(op, a) {
    return (0, _Match.match)(op).caseOf(Op.Spawn, execSpawn(a)).caseOf(Op.Send, execSend(a)).caseOf(Op.Receive, execReceive(a)).caseOf(Op.Stop, execStop(a)).caseOf(Op.IOOP, execIOOP(a)).caseOf(Op.NOOP, function () {}).end();
};

/**
 * execSpawn
 * @param {Actor} a
 * @summary {Actor →  Spawn →  Actor}
 */
var execSpawn = exports.execSpawn = function execSpawn(a) {
    return function (op) {
        return (0, _Match.match)(op.template).caseOf(_Actor.LocalT, function (_ref) {
            var id = _ref.id,
                start = _ref.start;
            return new _Actor.ActorL({
                parent: a.path,
                path: address(a.path, id),
                ops: start(),
                template: op.template
            });
        }).end();
    };
};

/**
 * execSend
 *@summary {Actor →  Send →  System →  Actor|IO|Drop
 */
var execSend = exports.execSend = function execSend(a) {
    return function (op) {
        return function (s) {
            return _monad.Maybe.not(s.actors[op.to]).map(function (actor) {
                return (0, _Actor.accept)(actor, op.message);
            }).orElse(function () {
                return _monad.Maybe.of(Op.drop(op.to, a.path, op.message));
            }).extract();
        };
    };
};

/**
 * execReceive
 * @summary {Actor →  Receive →  Actor}
 */
var execReceive = exports.execReceive = function execReceive(a) {
    return function (op) {
        return _monad.Maybe.not((0, _util.head)(a.mailbox)).map(function () {
            return (0, _Actor.process)(a, op.behaviour);
        })
        // .orElse(()=> Maybe.of(repeat(a, op)))
        .orElse(function () {
            return _monad.Maybe.of(a);
        }).extract();
    };
};

/**
 * execStop
 * @summary { () →  ActorSTP }
 */
var execStop = exports.execStop = function execStop() {
    return function (op) {
        return new _Actor.ActorSTP({ path: op.path });
    };
};

/**
 * execIOOP
 * @summary {(Actor, System) →  IO}
 */
var execIOOP = exports.execIOOP = function execIOOP(a) {
    return function (op) {
        return op.f(a);
    };
};

/**
 * runEffects turns the Ops of an Actor into effects to be applied to the system.
 * @summary {(Free<Op,null>, Actor, Array<Effect>) →  Array<Effect>}
 */
var runEffects = exports.runEffects = function runEffects(f, a, table) {
    return _monad.Maybe.not(f).map(function (f) {
        return f.resume().cata(function (op) {
            return runEffects(f.next, a, putEffect(exec(a, op), op, a, table));
        }, function () {
            return table;
        });
    }).orElse(function () {
        return _monad.Maybe.of(table);
    }).extract();
};

/**
 * putEffect creates a new entry into the effect table.
 * @summary {(Op,Actor,Effect,Array) →  Array }
 */
var putEffect = exports.putEffect = function putEffect(op, actor, effect, table) {
    return table.concat(new Effect({ op: op, actor: actor, effect: effect }));
};

/**
 *  an actor's effect with the system.
 * @summary {(Effect,  System) →  System}
 */
var reconcile = exports.reconcile = function reconcile(a, s) {
    return (0, _Match.match)(a).caseOf(_Actor.ActorSTP, function (a) {
        return removeActor(a.path, s);
    }).caseOf(_Actor.Actor, function (a) {
        return putActor(a, s);
    }).caseOf(_Actor.ActorList, function (l) {
        return l.reduce(reconcile, s);
    }).caseOf(Op.Drop, function (op) {
        return log(op, s.actors[op.from], s);
    }).caseOf(_monad.IO, function (io) {
        return s.copy({ io: io.concat(io) });
    }).caseOf(Function, function (f) {
        return reconcile(s, f(s));
    }).orElse(function () {
        return s;
    }).end();
};

/**
 * log an Op to the oplog
 * @param {Op} op
 * @param {Actor} actor
 * @param {System} s
 * @summary {(Op, Actor, System) →  System}
 */
var log = exports.log = function log(op, actor, s) {

    console.log(actor.path, op);
    return s;
};

/**
 * address generates an address for a local actor
 * @summary { (string,string) →  string
 */
var address = exports.address = function address(p, c) {
    return p === '' ? c : p + '/' + c;
};

/**
 * putActor
 * @private
 * @summary {(Actor, System) → System}
 */
var putActor = exports.putActor = function putActor(a, s) {
    return lens.set(actorCheckedLens(a.path), a, s);
};

/**
 * removeActor
 * @private
 * @summary {(string, System) →  System}
 */
var removeActor = exports.removeActor = function removeActor(p, s) {
    return Object.keys(s.actors).reduce(function (o, k) {

        if (k === p) return o;

        o[k] = s.actors[k];

        return o;
    }, {});
};

var nextClock = function nextClock(f) {
    return new _monad.IO(function () {
        return _Actor.process ? _Actor.process.nextTick(f) : setTimeout(f, 0);
    }).chain(function () {
        return _monad.IO.of(null);
    });
};

/**
 * Effect
 */

var Effect = exports.Effect = function (_Type) {
    _inherits(Effect, _Type);

    function Effect(props) {
        _classCallCheck(this, Effect);

        return _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this, props, {
            op: (0, _be.type)(Op.Op),
            effect: _be.any,
            actor: (0, _be.type)(_Actor.Actor)
        }));
    }

    return Effect;
}(_Type3.Type);

/**
 * System
 * @property {Array<Op>} ops
 */


var System = exports.System = function (_Type2) {
    _inherits(System, _Type2);

    function System(props) {
        _classCallCheck(this, System);

        var _this2 = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, props, {
            path: (0, _be.force)(''),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(Op.noopF())),
            io: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            oplog: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            actors: (0, _be.or)((0, _be.type)(Object), (0, _be.force)({}))
        }));

        _this2.map = (0, _util.partial)(_Actor.map, _this2);
        _this2.reduce = function (f) {
            return Object.keys(_this2.actors).reduce(function (s, k) {
                return f(s, _this2.actors[k]);
            }, _this2);
        };

        return _this2;
    }

    /**
     * drop a message
     * @param {Send} op
     * @param {Actor} actor
     * @summary {Send →  System}
     */


    _createClass(System, [{
        key: 'drop',
        value: function drop(op, actor) {

            return log(Op.drop(op.to, op.message), actor, this);
        }

        /**
         * spawn a new actor
         * @param {ActorT} template
         * @return {System}
         */

    }, {
        key: 'spawn',
        value: function spawn(template) {

            return this.copy({ ops: this.ops.chain(function () {
                    return Op.spawnF(template);
                }) });
        }

        /**
         * tick acts as the scheduler, scheduling system computations including
         * those of child actors.
         * @summary { () →  System}
         */

    }, {
        key: 'tick',
        value: function tick() {

            return this.map(function (a) {
                return runEffects((0, _Actor.next)(a), a, []);
            }).reduce(function (s, a) {
                return putActor(a.map(function () {
                    return null;
                }), reconcile(s, a));
            });
        }

        /** tock runs the computations of the actor system.
         * @summary { () →  IO<System>}
         */

    }, {
        key: 'tock',
        value: function tock() {

            return this.io.reduce(function (io, ion) {
                return io.chain(function (s) {
                    return ion.map(function (r) {
                        return reconcile(s, r);
                    });
                });
            }, _monad.IO.of(this.copy({ io: [] })));
        }

        /**
         * go
         * @summary { () => IO<null> }
         */

    }, {
        key: 'clock',
        value: function clock() {

            return this.tick().tock().chain(function (s) {
                return nextClock(function () {
                    return s.clock().run();
                });
            });
        }
    }]);

    return System;
}(_Type3.Type);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW0uanMiXSwibmFtZXMiOlsiSW52YWxpZEFjdG9yUGF0aEVycm9yIiwiT3AiLCJsZW5zIiwicGF0aCIsIm1lc3NhZ2UiLCJzdGFjayIsIkVycm9yIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiaGFzT3duUHJvcGVydHkiLCJjYXB0dXJlU3RhY2tUcmFjZSIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsImFjdG9yTGVucyIsImFjdG9yIiwic3lzIiwidW5kZWZpbmVkIiwiYWN0b3JzIiwiYWN0b3JDaGVja2VkTGVucyIsImV4ZWMiLCJvcCIsImEiLCJjYXNlT2YiLCJTcGF3biIsImV4ZWNTcGF3biIsIlNlbmQiLCJleGVjU2VuZCIsIlJlY2VpdmUiLCJleGVjUmVjZWl2ZSIsIlN0b3AiLCJleGVjU3RvcCIsIklPT1AiLCJleGVjSU9PUCIsIk5PT1AiLCJlbmQiLCJ0ZW1wbGF0ZSIsImlkIiwic3RhcnQiLCJwYXJlbnQiLCJhZGRyZXNzIiwib3BzIiwibm90IiwicyIsInRvIiwibWFwIiwib3JFbHNlIiwib2YiLCJkcm9wIiwiZXh0cmFjdCIsIm1haWxib3giLCJiZWhhdmlvdXIiLCJmIiwicnVuRWZmZWN0cyIsInRhYmxlIiwicmVzdW1lIiwiY2F0YSIsIm5leHQiLCJwdXRFZmZlY3QiLCJlZmZlY3QiLCJjb25jYXQiLCJFZmZlY3QiLCJyZWNvbmNpbGUiLCJyZW1vdmVBY3RvciIsInB1dEFjdG9yIiwibCIsInJlZHVjZSIsIkRyb3AiLCJsb2ciLCJmcm9tIiwiY29weSIsImlvIiwiRnVuY3Rpb24iLCJjb25zb2xlIiwicCIsImMiLCJzZXQiLCJrZXlzIiwibyIsImsiLCJuZXh0Q2xvY2siLCJuZXh0VGljayIsInNldFRpbWVvdXQiLCJjaGFpbiIsInByb3BzIiwiU3lzdGVtIiwibm9vcEYiLCJBcnJheSIsIm9wbG9nIiwic3Bhd25GIiwiaW9uIiwiciIsInRpY2siLCJ0b2NrIiwiY2xvY2siLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQWNnQkEscUIsR0FBQUEscUI7O0FBZGhCOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlDLEU7O0FBQ1o7O0lBQVlDLEk7Ozs7Ozs7Ozs7OztBQUVaOzs7O0FBSU8sU0FBU0YscUJBQVQsQ0FBK0JHLElBQS9CLEVBQXFDOztBQUV4QyxTQUFLQyxPQUFMLG1CQUE0QkQsSUFBNUI7QUFDQSxTQUFLRSxLQUFMLEdBQWMsSUFBSUMsS0FBSixDQUFVLEtBQUtGLE9BQWYsQ0FBRCxDQUEwQkMsS0FBdkM7QUFDQSxTQUFLRSxJQUFMLEdBQVksS0FBS0MsV0FBTCxDQUFpQkQsSUFBN0I7O0FBRUEsUUFBSUQsTUFBTUcsY0FBTixDQUFxQixtQkFBckIsQ0FBSixFQUNJSCxNQUFNSSxpQkFBTixDQUF3QixJQUF4QixFQUE4QixLQUFLRixXQUFuQztBQUVQOztBQUVEUixzQkFBc0JXLFNBQXRCLEdBQWtDQyxPQUFPQyxNQUFQLENBQWNQLE1BQU1LLFNBQXBCLENBQWxDO0FBQ0FYLHNCQUFzQlcsU0FBdEIsQ0FBZ0NILFdBQWhDLEdBQThDUixxQkFBOUM7O0FBRUE7OztBQUdPLElBQU1jLGdDQUFZLFNBQVpBLFNBQVk7QUFBQSxXQUFRLFVBQUNDLEtBQUQsRUFBUUMsR0FBUjtBQUFBLGVBQWlCQSxRQUFRQyxTQUFULEdBQzdDRixNQUFNRyxNQUFOLENBQWFmLElBQWIsQ0FENkMsR0FDeEIsd0NBQW1CQSxJQUFuQixRQUE0QlksS0FBNUIsRUFBbUNDLEdBQW5DLENBRFE7QUFBQSxLQUFSO0FBQUEsQ0FBbEI7O0FBR1A7OztBQUdPLElBQU1HLDhDQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsV0FBUSxVQUFDSixLQUFELEVBQVFDLEdBQVIsRUFBZ0I7O0FBRXBELFlBQUlBLFFBQVFDLFNBQVosRUFDSSxJQUFJLHdDQUFtQmQsSUFBbkIsUUFBNEJhLEdBQTVCLEtBQW9DLElBQXhDLEVBQ0ksTUFBTSxJQUFJaEIscUJBQUosQ0FBMEJHLElBQTFCLENBQU47O0FBRVIsZUFBT1csVUFBVVgsSUFBVixFQUFnQlksS0FBaEIsRUFBdUJDLEdBQXZCLENBQVA7QUFFSCxLQVIrQjtBQUFBLENBQXpCOztBQVVQOzs7O0FBSU8sSUFBTUksc0JBQU8sU0FBUEEsSUFBTyxDQUFDQyxFQUFELEVBQUtDLENBQUw7QUFBQSxXQUFXLGtCQUFNRCxFQUFOLEVBQzFCRSxNQUQwQixDQUNuQnRCLEdBQUd1QixLQURnQixFQUNUQyxVQUFVSCxDQUFWLENBRFMsRUFFMUJDLE1BRjBCLENBRW5CdEIsR0FBR3lCLElBRmdCLEVBRVZDLFNBQVNMLENBQVQsQ0FGVSxFQUcxQkMsTUFIMEIsQ0FHbkJ0QixHQUFHMkIsT0FIZ0IsRUFHUEMsWUFBWVAsQ0FBWixDQUhPLEVBSTFCQyxNQUowQixDQUluQnRCLEdBQUc2QixJQUpnQixFQUlWQyxTQUFTVCxDQUFULENBSlUsRUFLMUJDLE1BTDBCLENBS25CdEIsR0FBRytCLElBTGdCLEVBS1ZDLFNBQVNYLENBQVQsQ0FMVSxFQU0xQkMsTUFOMEIsQ0FNbkJ0QixHQUFHaUMsSUFOZ0IsRUFNVixZQUFNLENBQUUsQ0FORSxFQU8xQkMsR0FQMEIsRUFBWDtBQUFBLENBQWI7O0FBVVA7Ozs7O0FBS08sSUFBTVYsZ0NBQVksU0FBWkEsU0FBWTtBQUFBLFdBQUs7QUFBQSxlQUMxQixrQkFBTUosR0FBR2UsUUFBVCxFQUNDYixNQURELGdCQUNnQjtBQUFBLGdCQUFHYyxFQUFILFFBQUdBLEVBQUg7QUFBQSxnQkFBT0MsS0FBUCxRQUFPQSxLQUFQO0FBQUEsbUJBQW1CLGtCQUFXO0FBQzFDQyx3QkFBUWpCLEVBQUVuQixJQURnQztBQUUxQ0Esc0JBQU1xQyxRQUFRbEIsRUFBRW5CLElBQVYsRUFBZ0JrQyxFQUFoQixDQUZvQztBQUcxQ0kscUJBQUtILE9BSHFDO0FBSTFDRiwwQkFBVWYsR0FBR2U7QUFKNkIsYUFBWCxDQUFuQjtBQUFBLFNBRGhCLEVBT0NELEdBUEQsRUFEMEI7QUFBQSxLQUFMO0FBQUEsQ0FBbEI7O0FBVVA7Ozs7QUFJTyxJQUFNUiw4QkFBVyxTQUFYQSxRQUFXO0FBQUEsV0FBSztBQUFBLGVBQU07QUFBQSxtQkFDL0IsYUFDQ2UsR0FERCxDQUNLQyxFQUFFekIsTUFBRixDQUFTRyxHQUFHdUIsRUFBWixDQURMLEVBRUNDLEdBRkQsQ0FFSztBQUFBLHVCQUFTLG1CQUFPOUIsS0FBUCxFQUFjTSxHQUFHakIsT0FBakIsQ0FBVDtBQUFBLGFBRkwsRUFHQzBDLE1BSEQsQ0FHUTtBQUFBLHVCQUFNLGFBQU1DLEVBQU4sQ0FBUzlDLEdBQUcrQyxJQUFILENBQVEzQixHQUFHdUIsRUFBWCxFQUFldEIsRUFBRW5CLElBQWpCLEVBQXVCa0IsR0FBR2pCLE9BQTFCLENBQVQsQ0FBTjtBQUFBLGFBSFIsRUFJQzZDLE9BSkQsRUFEK0I7QUFBQSxTQUFOO0FBQUEsS0FBTDtBQUFBLENBQWpCOztBQU9QOzs7O0FBSU8sSUFBTXBCLG9DQUFjLFNBQWRBLFdBQWM7QUFBQSxXQUFLO0FBQUEsZUFDNUIsYUFDQ2EsR0FERCxDQUNLLGdCQUFLcEIsRUFBRTRCLE9BQVAsQ0FETCxFQUVDTCxHQUZELENBRUs7QUFBQSxtQkFBTSxvQkFBUXZCLENBQVIsRUFBV0QsR0FBRzhCLFNBQWQsQ0FBTjtBQUFBLFNBRkw7QUFHQTtBQUhBLFNBSUNMLE1BSkQsQ0FJUTtBQUFBLG1CQUFNLGFBQU1DLEVBQU4sQ0FBU3pCLENBQVQsQ0FBTjtBQUFBLFNBSlIsRUFLQzJCLE9BTEQsRUFENEI7QUFBQSxLQUFMO0FBQUEsQ0FBcEI7O0FBUVA7Ozs7QUFJTyxJQUFNbEIsOEJBQVcsU0FBWEEsUUFBVztBQUFBLFdBQU07QUFBQSxlQUFNLG9CQUFhLEVBQUU1QixNQUFNa0IsR0FBR2xCLElBQVgsRUFBYixDQUFOO0FBQUEsS0FBTjtBQUFBLENBQWpCOztBQUVQOzs7O0FBSU8sSUFBTThCLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxXQUFLO0FBQUEsZUFBTVosR0FBRytCLENBQUgsQ0FBSzlCLENBQUwsQ0FBTjtBQUFBLEtBQUw7QUFBQSxDQUFqQjs7QUFFUDs7OztBQUlPLElBQU0rQixrQ0FBYSxTQUFiQSxVQUFhLENBQUNELENBQUQsRUFBSTlCLENBQUosRUFBT2dDLEtBQVA7QUFBQSxXQUN0QixhQUNDWixHQURELENBQ0tVLENBREwsRUFFQ1AsR0FGRCxDQUVLO0FBQUEsZUFDRE8sRUFBRUcsTUFBRixHQUNDQyxJQURELENBQ007QUFBQSxtQkFDRkgsV0FBV0QsRUFBRUssSUFBYixFQUFtQm5DLENBQW5CLEVBQXNCb0MsVUFBVXRDLEtBQUtFLENBQUwsRUFBUUQsRUFBUixDQUFWLEVBQXVCQSxFQUF2QixFQUEyQkMsQ0FBM0IsRUFBOEJnQyxLQUE5QixDQUF0QixDQURFO0FBQUEsU0FETixFQUdJO0FBQUEsbUJBQU1BLEtBQU47QUFBQSxTQUhKLENBREM7QUFBQSxLQUZMLEVBT0NSLE1BUEQsQ0FPUTtBQUFBLGVBQU0sYUFBTUMsRUFBTixDQUFTTyxLQUFULENBQU47QUFBQSxLQVBSLEVBUUNMLE9BUkQsRUFEc0I7QUFBQSxDQUFuQjs7QUFXUDs7OztBQUlPLElBQU1TLGdDQUFZLFNBQVpBLFNBQVksQ0FBQ3JDLEVBQUQsRUFBS04sS0FBTCxFQUFZNEMsTUFBWixFQUFvQkwsS0FBcEI7QUFBQSxXQUNyQkEsTUFBTU0sTUFBTixDQUFhLElBQUlDLE1BQUosQ0FBVyxFQUFFeEMsTUFBRixFQUFNTixZQUFOLEVBQWE0QyxjQUFiLEVBQVgsQ0FBYixDQURxQjtBQUFBLENBQWxCOztBQUdQOzs7O0FBSU8sSUFBTUcsZ0NBQVksU0FBWkEsU0FBWSxDQUFDeEMsQ0FBRCxFQUFJcUIsQ0FBSjtBQUFBLFdBQVUsa0JBQU1yQixDQUFOLEVBQzlCQyxNQUQ4QixrQkFDYjtBQUFBLGVBQUt3QyxZQUFZekMsRUFBRW5CLElBQWQsRUFBb0J3QyxDQUFwQixDQUFMO0FBQUEsS0FEYSxFQUU5QnBCLE1BRjhCLGVBRWhCO0FBQUEsZUFBS3lDLFNBQVMxQyxDQUFULEVBQVlxQixDQUFaLENBQUw7QUFBQSxLQUZnQixFQUc5QnBCLE1BSDhCLG1CQUdaO0FBQUEsZUFBSzBDLEVBQUVDLE1BQUYsQ0FBU0osU0FBVCxFQUFvQm5CLENBQXBCLENBQUw7QUFBQSxLQUhZLEVBSTlCcEIsTUFKOEIsQ0FJdkJ0QixHQUFHa0UsSUFKb0IsRUFJZDtBQUFBLGVBQU1DLElBQUkvQyxFQUFKLEVBQVFzQixFQUFFekIsTUFBRixDQUFTRyxHQUFHZ0QsSUFBWixDQUFSLEVBQTJCMUIsQ0FBM0IsQ0FBTjtBQUFBLEtBSmMsRUFLOUJwQixNQUw4QixZQUtuQjtBQUFBLGVBQU1vQixFQUFFMkIsSUFBRixDQUFPLEVBQUVDLElBQUlBLEdBQUdYLE1BQUgsQ0FBVVcsRUFBVixDQUFOLEVBQVAsQ0FBTjtBQUFBLEtBTG1CLEVBTTlCaEQsTUFOOEIsQ0FNdkJpRCxRQU51QixFQU1iO0FBQUEsZUFBS1YsVUFBVW5CLENBQVYsRUFBYVMsRUFBRVQsQ0FBRixDQUFiLENBQUw7QUFBQSxLQU5hLEVBTzlCRyxNQVA4QixDQU92QjtBQUFBLGVBQU1ILENBQU47QUFBQSxLQVB1QixFQVE5QlIsR0FSOEIsRUFBVjtBQUFBLENBQWxCOztBQVVQOzs7Ozs7O0FBT08sSUFBTWlDLG9CQUFNLFNBQU5BLEdBQU0sQ0FBQy9DLEVBQUQsRUFBS04sS0FBTCxFQUFZNEIsQ0FBWixFQUFrQjs7QUFFakM4QixZQUFRTCxHQUFSLENBQVlyRCxNQUFNWixJQUFsQixFQUF3QmtCLEVBQXhCO0FBQ0EsV0FBT3NCLENBQVA7QUFFSCxDQUxNOztBQU9QOzs7O0FBSU8sSUFBTUgsNEJBQVUsU0FBVkEsT0FBVSxDQUFDa0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBV0QsTUFBTSxFQUFQLEdBQWFDLENBQWIsR0FBb0JELENBQXBCLFNBQXlCQyxDQUFuQztBQUFBLENBQWhCOztBQUVQOzs7OztBQUtPLElBQU1YLDhCQUFXLFNBQVhBLFFBQVcsQ0FBQzFDLENBQUQsRUFBSXFCLENBQUo7QUFBQSxXQUNwQnpDLEtBQUswRSxHQUFMLENBQVN6RCxpQkFBaUJHLEVBQUVuQixJQUFuQixDQUFULEVBQW1DbUIsQ0FBbkMsRUFBc0NxQixDQUF0QyxDQURvQjtBQUFBLENBQWpCOztBQUdQOzs7OztBQUtPLElBQU1vQixvQ0FBYyxTQUFkQSxXQUFjLENBQUNXLENBQUQsRUFBSS9CLENBQUo7QUFBQSxXQUFVL0IsT0FBT2lFLElBQVAsQ0FBWWxDLEVBQUV6QixNQUFkLEVBQXNCZ0QsTUFBdEIsQ0FBNkIsVUFBQ1ksQ0FBRCxFQUFJQyxDQUFKLEVBQVU7O0FBRXhFLFlBQUlBLE1BQU1MLENBQVYsRUFDSSxPQUFPSSxDQUFQOztBQUVKQSxVQUFFQyxDQUFGLElBQU9wQyxFQUFFekIsTUFBRixDQUFTNkQsQ0FBVCxDQUFQOztBQUVBLGVBQU9ELENBQVA7QUFFSCxLQVRvQyxFQVNsQyxFQVRrQyxDQUFWO0FBQUEsQ0FBcEI7O0FBV1AsSUFBTUUsWUFBWSxTQUFaQSxTQUFZO0FBQUEsV0FDZCxjQUFPO0FBQUEsZUFBTSxpQkFBWSxlQUFRQyxRQUFSLENBQWlCN0IsQ0FBakIsQ0FBWixHQUFrQzhCLFdBQVc5QixDQUFYLEVBQWMsQ0FBZCxDQUF4QztBQUFBLEtBQVAsRUFDQytCLEtBREQsQ0FDTztBQUFBLGVBQU0sVUFBR3BDLEVBQUgsQ0FBTSxJQUFOLENBQU47QUFBQSxLQURQLENBRGM7QUFBQSxDQUFsQjs7QUFJQTs7OztJQUdhYyxNLFdBQUFBLE07OztBQUVULG9CQUFZdUIsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtHQUVUQSxLQUZTLEVBRUY7QUFDVC9ELGdCQUFJLGNBQUtwQixHQUFHQSxFQUFSLENBREs7QUFFVDBELDJCQUZTO0FBR1Q1QyxtQkFBTztBQUhFLFNBRkU7QUFRbEI7Ozs7O0FBSUw7Ozs7OztJQUlhc0UsTSxXQUFBQSxNOzs7QUFFVCxvQkFBWUQsS0FBWixFQUFtQjtBQUFBOztBQUFBLHFIQUVUQSxLQUZTLEVBRUY7QUFDVGpGLGtCQUFNLGVBQU0sRUFBTixDQURHO0FBRVRzQyxpQkFBSyxZQUFHLDBCQUFILEVBQWUsZUFBTXhDLEdBQUdxRixLQUFILEVBQU4sQ0FBZixDQUZJO0FBR1RmLGdCQUFJLFlBQUcsY0FBS2dCLEtBQUwsQ0FBSCxFQUFnQixlQUFNLEVBQU4sQ0FBaEIsQ0FISztBQUlUQyxtQkFBTyxZQUFHLGNBQUtELEtBQUwsQ0FBSCxFQUFnQixlQUFNLEVBQU4sQ0FBaEIsQ0FKRTtBQUtUckUsb0JBQVEsWUFBRyxjQUFLTixNQUFMLENBQUgsRUFBaUIsZUFBTSxFQUFOLENBQWpCO0FBTEMsU0FGRTs7QUFVZixlQUFLaUMsR0FBTCxHQUFXLHNDQUFYO0FBQ0EsZUFBS3FCLE1BQUwsR0FBYztBQUFBLG1CQUFLdEQsT0FBT2lFLElBQVAsQ0FBWSxPQUFLM0QsTUFBakIsRUFBeUJnRCxNQUF6QixDQUFnQyxVQUFDdkIsQ0FBRCxFQUFJb0MsQ0FBSjtBQUFBLHVCQUFRM0IsRUFBRVQsQ0FBRixFQUFLLE9BQUt6QixNQUFMLENBQVk2RCxDQUFaLENBQUwsQ0FBUjtBQUFBLGFBQWhDLFNBQUw7QUFBQSxTQUFkOztBQVhlO0FBYWxCOztBQUVEOzs7Ozs7Ozs7OzZCQU1LMUQsRSxFQUFJTixLLEVBQU87O0FBRVosbUJBQU9xRCxJQUFJbkUsR0FBRytDLElBQUgsQ0FBUTNCLEdBQUd1QixFQUFYLEVBQWV2QixHQUFHakIsT0FBbEIsQ0FBSixFQUFnQ1csS0FBaEMsRUFBdUMsSUFBdkMsQ0FBUDtBQUVIOztBQUVEOzs7Ozs7Ozs4QkFLTXFCLFEsRUFBVTs7QUFFWixtQkFBTyxLQUFLa0MsSUFBTCxDQUFVLEVBQUU3QixLQUFLLEtBQUtBLEdBQUwsQ0FBUzBDLEtBQVQsQ0FBZTtBQUFBLDJCQUFNbEYsR0FBR3dGLE1BQUgsQ0FBVXJELFFBQVYsQ0FBTjtBQUFBLGlCQUFmLENBQVAsRUFBVixDQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7OytCQUtPOztBQUVILG1CQUFPLEtBQ0ZTLEdBREUsQ0FDRTtBQUFBLHVCQUFLUSxXQUFXLGlCQUFLL0IsQ0FBTCxDQUFYLEVBQW9CQSxDQUFwQixFQUF1QixFQUF2QixDQUFMO0FBQUEsYUFERixFQUVGNEMsTUFGRSxDQUVLLFVBQUN2QixDQUFELEVBQUlyQixDQUFKO0FBQUEsdUJBQVUwQyxTQUFTMUMsRUFBRXVCLEdBQUYsQ0FBTTtBQUFBLDJCQUFNLElBQU47QUFBQSxpQkFBTixDQUFULEVBQTRCaUIsVUFBVW5CLENBQVYsRUFBYXJCLENBQWIsQ0FBNUIsQ0FBVjtBQUFBLGFBRkwsQ0FBUDtBQUlIOztBQUVEOzs7Ozs7K0JBR087O0FBRUgsbUJBQU8sS0FBS2lELEVBQUwsQ0FDRkwsTUFERSxDQUNLLFVBQUNLLEVBQUQsRUFBS21CLEdBQUw7QUFBQSx1QkFBYW5CLEdBQUdZLEtBQUgsQ0FBUztBQUFBLDJCQUMxQk8sSUFBSTdDLEdBQUosQ0FBUTtBQUFBLCtCQUFLaUIsVUFBVW5CLENBQVYsRUFBYWdELENBQWIsQ0FBTDtBQUFBLHFCQUFSLENBRDBCO0FBQUEsaUJBQVQsQ0FBYjtBQUFBLGFBREwsRUFFaUMsVUFBRzVDLEVBQUgsQ0FBTSxLQUFLdUIsSUFBTCxDQUFVLEVBQUVDLElBQUksRUFBTixFQUFWLENBQU4sQ0FGakMsQ0FBUDtBQUlIOztBQUVEOzs7Ozs7O2dDQUlROztBQUVKLG1CQUFPLEtBQUtxQixJQUFMLEdBQVlDLElBQVosR0FBbUJWLEtBQW5CLENBQXlCO0FBQUEsdUJBQUtILFVBQVU7QUFBQSwyQkFBTXJDLEVBQUVtRCxLQUFGLEdBQVVDLEdBQVYsRUFBTjtBQUFBLGlCQUFWLENBQUw7QUFBQSxhQUF6QixDQUFQO0FBRUgiLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb3BlcnR5IGZyb20gJ3Byb3BlcnR5LXNlZWsnO1xuaW1wb3J0IHsgaGVhZCwgcGFydGlhbCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB0eXBlLCBmb3JjZSwgYW55LCBvciB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgbWF0Y2ggfSBmcm9tICcuL01hdGNoJztcbmltcG9ydCB7IE1heWJlLCBJTywgRnJlZSB9IGZyb20gJy4vbW9uYWQnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgeyBBY3RvciwgQWN0b3JTLCBMb2NhbFQsIEFjdG9yTCwgQWN0b3JTVFAsIEFjdG9yTGlzdCwgbmV4dCwgbWFwLCBhY2NlcHQsIHByb2Nlc3MgfSBmcm9tICcuL0FjdG9yJztcbmltcG9ydCAqIGFzIE9wIGZyb20gJy4vT3AnO1xuaW1wb3J0ICogYXMgbGVucyBmcm9tICcuL2xlbnMnO1xuXG4vKipcbiAqIEludmFsaWRBY3RvclBhdGhFcnJvclxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEludmFsaWRBY3RvclBhdGhFcnJvcihwYXRoKSB7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBgVGhlIHBhdGggJyR7cGF0aH0nIGlzIGVpdGhlciBpbnZhbGlkIG9yIGluIHVzZSFgO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuSW52YWxpZEFjdG9yUGF0aEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkludmFsaWRBY3RvclBhdGhFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbnZhbGlkQWN0b3JQYXRoRXJyb3I7XG5cbi8qKihtLm9yRWxzZSgoKSA9PiBNYXliZS5vZihyKSkuanVzdCgpKVxuICogYWN0b3JMZW5zXG4gKi9cbmV4cG9ydCBjb25zdCBhY3RvckxlbnMgPSBwYXRoID0+IChhY3Rvciwgc3lzKSA9PiAoc3lzID09PSB1bmRlZmluZWQpID9cbiAgICBhY3Rvci5hY3RvcnNbcGF0aF0gOiBwcm9wZXJ0eShgYWN0b3JzWyR7cGF0aH1dYCwgYWN0b3IsIHN5cyk7XG5cbi8qKlxuICogYWN0b3JDaGVja2VkTGVuc1xuICovXG5leHBvcnQgY29uc3QgYWN0b3JDaGVja2VkTGVucyA9IHBhdGggPT4gKGFjdG9yLCBzeXMpID0+IHtcblxuICAgIGlmIChzeXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgaWYgKHByb3BlcnR5KGBhY3RvcnNbJHtwYXRofV1gLCBzeXMpICE9IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZEFjdG9yUGF0aEVycm9yKHBhdGgpO1xuXG4gICAgcmV0dXJuIGFjdG9yTGVucyhwYXRoKShhY3Rvciwgc3lzKTtcblxufVxuXG4vKipcbiAqIGV4ZWMgZXhlY3V0ZXMgdGhlIE9wIHByb3ZpZGUgYW4gZWZmZWN0IGFzIHRoZSByZXN1bHRcbiAqIEBzdW1tYXJ5IHsoT3AsIEFjdG9yKSDihpIgIEVmZmVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWMgPSAob3AsIGEpID0+IG1hdGNoKG9wKVxuICAgIC5jYXNlT2YoT3AuU3Bhd24sIGV4ZWNTcGF3bihhKSlcbiAgICAuY2FzZU9mKE9wLlNlbmQsIGV4ZWNTZW5kKGEpKVxuICAgIC5jYXNlT2YoT3AuUmVjZWl2ZSwgZXhlY1JlY2VpdmUoYSkpXG4gICAgLmNhc2VPZihPcC5TdG9wLCBleGVjU3RvcChhKSlcbiAgICAuY2FzZU9mKE9wLklPT1AsIGV4ZWNJT09QKGEpKVxuICAgIC5jYXNlT2YoT3AuTk9PUCwgKCkgPT4ge30pXG4gICAgLmVuZCgpO1xuXG5cbi8qKlxuICogZXhlY1NwYXduXG4gKiBAcGFyYW0ge0FjdG9yfSBhXG4gKiBAc3VtbWFyeSB7QWN0b3Ig4oaSICBTcGF3biDihpIgIEFjdG9yfVxuICovXG5leHBvcnQgY29uc3QgZXhlY1NwYXduID0gYSA9PiBvcCA9PlxuICAgIG1hdGNoKG9wLnRlbXBsYXRlKVxuICAgIC5jYXNlT2YoTG9jYWxULCAoeyBpZCwgc3RhcnQgfSkgPT4gbmV3IEFjdG9yTCh7XG4gICAgICAgIHBhcmVudDogYS5wYXRoLFxuICAgICAgICBwYXRoOiBhZGRyZXNzKGEucGF0aCwgaWQpLFxuICAgICAgICBvcHM6IHN0YXJ0KCksXG4gICAgICAgIHRlbXBsYXRlOiBvcC50ZW1wbGF0ZVxuICAgIH0pKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBleGVjU2VuZFxuICpAc3VtbWFyeSB7QWN0b3Ig4oaSICBTZW5kIOKGkiAgU3lzdGVtIOKGkiAgQWN0b3J8SU98RHJvcFxuICovXG5leHBvcnQgY29uc3QgZXhlY1NlbmQgPSBhID0+IG9wID0+IHMgPT5cbiAgICBNYXliZVxuICAgIC5ub3Qocy5hY3RvcnNbb3AudG9dKVxuICAgIC5tYXAoYWN0b3IgPT4gYWNjZXB0KGFjdG9yLCBvcC5tZXNzYWdlKSlcbiAgICAub3JFbHNlKCgpID0+IE1heWJlLm9mKE9wLmRyb3Aob3AudG8sIGEucGF0aCwgb3AubWVzc2FnZSkpKVxuICAgIC5leHRyYWN0KCk7XG5cbi8qKlxuICogZXhlY1JlY2VpdmVcbiAqIEBzdW1tYXJ5IHtBY3RvciDihpIgIFJlY2VpdmUg4oaSICBBY3Rvcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWNSZWNlaXZlID0gYSA9PiBvcCA9PlxuICAgIE1heWJlXG4gICAgLm5vdChoZWFkKGEubWFpbGJveCkpXG4gICAgLm1hcCgoKSA9PiBwcm9jZXNzKGEsIG9wLmJlaGF2aW91cikpXG4gICAgLy8gLm9yRWxzZSgoKT0+IE1heWJlLm9mKHJlcGVhdChhLCBvcCkpKVxuICAgIC5vckVsc2UoKCkgPT4gTWF5YmUub2YoYSkpXG4gICAgLmV4dHJhY3QoKTtcblxuLyoqXG4gKiBleGVjU3RvcFxuICogQHN1bW1hcnkgeyAoKSDihpIgIEFjdG9yU1RQIH1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWNTdG9wID0gKCkgPT4gb3AgPT4gbmV3IEFjdG9yU1RQKHsgcGF0aDogb3AucGF0aCB9KTtcblxuLyoqXG4gKiBleGVjSU9PUFxuICogQHN1bW1hcnkgeyhBY3RvciwgU3lzdGVtKSDihpIgIElPfVxuICovXG5leHBvcnQgY29uc3QgZXhlY0lPT1AgPSBhID0+IG9wID0+IG9wLmYoYSk7XG5cbi8qKlxuICogcnVuRWZmZWN0cyB0dXJucyB0aGUgT3BzIG9mIGFuIEFjdG9yIGludG8gZWZmZWN0cyB0byBiZSBhcHBsaWVkIHRvIHRoZSBzeXN0ZW0uXG4gKiBAc3VtbWFyeSB7KEZyZWU8T3AsbnVsbD4sIEFjdG9yLCBBcnJheTxFZmZlY3Q+KSDihpIgIEFycmF5PEVmZmVjdD59XG4gKi9cbmV4cG9ydCBjb25zdCBydW5FZmZlY3RzID0gKGYsIGEsIHRhYmxlKSA9PlxuICAgIE1heWJlXG4gICAgLm5vdChmKVxuICAgIC5tYXAoZiA9PlxuICAgICAgICBmLnJlc3VtZSgpXG4gICAgICAgIC5jYXRhKG9wID0+XG4gICAgICAgICAgICBydW5FZmZlY3RzKGYubmV4dCwgYSwgcHV0RWZmZWN0KGV4ZWMoYSwgb3ApLCBvcCwgYSwgdGFibGUpKSxcbiAgICAgICAgICAgICgpID0+IHRhYmxlKSlcbiAgICAub3JFbHNlKCgpID0+IE1heWJlLm9mKHRhYmxlKSlcbiAgICAuZXh0cmFjdCgpO1xuXG4vKipcbiAqIHB1dEVmZmVjdCBjcmVhdGVzIGEgbmV3IGVudHJ5IGludG8gdGhlIGVmZmVjdCB0YWJsZS5cbiAqIEBzdW1tYXJ5IHsoT3AsQWN0b3IsRWZmZWN0LEFycmF5KSDihpIgIEFycmF5IH1cbiAqL1xuZXhwb3J0IGNvbnN0IHB1dEVmZmVjdCA9IChvcCwgYWN0b3IsIGVmZmVjdCwgdGFibGUpID0+XG4gICAgdGFibGUuY29uY2F0KG5ldyBFZmZlY3QoeyBvcCwgYWN0b3IsIGVmZmVjdCB9KSk7XG5cbi8qKlxuICogIGFuIGFjdG9yJ3MgZWZmZWN0IHdpdGggdGhlIHN5c3RlbS5cbiAqIEBzdW1tYXJ5IHsoRWZmZWN0LCAgU3lzdGVtKSDihpIgIFN5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlY29uY2lsZSA9IChhLCBzKSA9PiBtYXRjaChhKVxuICAgIC5jYXNlT2YoQWN0b3JTVFAsIGEgPT4gcmVtb3ZlQWN0b3IoYS5wYXRoLCBzKSlcbiAgICAuY2FzZU9mKEFjdG9yLCBhID0+IHB1dEFjdG9yKGEsIHMpKVxuICAgIC5jYXNlT2YoQWN0b3JMaXN0LCBsID0+IGwucmVkdWNlKHJlY29uY2lsZSwgcykpXG4gICAgLmNhc2VPZihPcC5Ecm9wLCBvcCA9PiBsb2cob3AsIHMuYWN0b3JzW29wLmZyb21dLCBzKSlcbiAgICAuY2FzZU9mKElPLCBpbyA9PiBzLmNvcHkoeyBpbzogaW8uY29uY2F0KGlvKSB9KSlcbiAgICAuY2FzZU9mKEZ1bmN0aW9uLCBmID0+IHJlY29uY2lsZShzLCBmKHMpKSlcbiAgICAub3JFbHNlKCgpID0+IHMpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIGxvZyBhbiBPcCB0byB0aGUgb3Bsb2dcbiAqIEBwYXJhbSB7T3B9IG9wXG4gKiBAcGFyYW0ge0FjdG9yfSBhY3RvclxuICogQHBhcmFtIHtTeXN0ZW19IHNcbiAqIEBzdW1tYXJ5IHsoT3AsIEFjdG9yLCBTeXN0ZW0pIOKGkiAgU3lzdGVtfVxuICovXG5leHBvcnQgY29uc3QgbG9nID0gKG9wLCBhY3RvciwgcykgPT4ge1xuXG4gICAgY29uc29sZS5sb2coYWN0b3IucGF0aCwgb3ApO1xuICAgIHJldHVybiBzO1xuXG59XG5cbi8qKlxuICogYWRkcmVzcyBnZW5lcmF0ZXMgYW4gYWRkcmVzcyBmb3IgYSBsb2NhbCBhY3RvclxuICogQHN1bW1hcnkgeyAoc3RyaW5nLHN0cmluZykg4oaSICBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZHJlc3MgPSAocCwgYykgPT4gKHAgPT09ICcnKSA/IGMgOiBgJHtwfS8ke2N9YDtcblxuLyoqXG4gKiBwdXRBY3RvclxuICogQHByaXZhdGVcbiAqIEBzdW1tYXJ5IHsoQWN0b3IsIFN5c3RlbSkg4oaSIFN5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IHB1dEFjdG9yID0gKGEsIHMpID0+XG4gICAgbGVucy5zZXQoYWN0b3JDaGVja2VkTGVucyhhLnBhdGgpLCBhLCBzKTtcblxuLyoqXG4gKiByZW1vdmVBY3RvclxuICogQHByaXZhdGVcbiAqIEBzdW1tYXJ5IHsoc3RyaW5nLCBTeXN0ZW0pIOKGkiAgU3lzdGVtfVxuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlQWN0b3IgPSAocCwgcykgPT4gT2JqZWN0LmtleXMocy5hY3RvcnMpLnJlZHVjZSgobywgaykgPT4ge1xuXG4gICAgaWYgKGsgPT09IHApXG4gICAgICAgIHJldHVybiBvO1xuXG4gICAgb1trXSA9IHMuYWN0b3JzW2tdO1xuXG4gICAgcmV0dXJuIG87XG5cbn0sIHt9KTtcblxuY29uc3QgbmV4dENsb2NrID0gZiA9PlxuICAgIG5ldyBJTygoKSA9PiAocHJvY2VzcykgPyBwcm9jZXNzLm5leHRUaWNrKGYpIDogc2V0VGltZW91dChmLCAwKSlcbiAgICAuY2hhaW4oKCkgPT4gSU8ub2YobnVsbCkpO1xuXG4vKipcbiAqIEVmZmVjdFxuICovXG5leHBvcnQgY2xhc3MgRWZmZWN0IGV4dGVuZHMgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBvcDogdHlwZShPcC5PcCksXG4gICAgICAgICAgICBlZmZlY3Q6IGFueSxcbiAgICAgICAgICAgIGFjdG9yOiB0eXBlKEFjdG9yKVxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN5c3RlbVxuICogQHByb3BlcnR5IHtBcnJheTxPcD59IG9wc1xuICovXG5leHBvcnQgY2xhc3MgU3lzdGVtIGV4dGVuZHMgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBwYXRoOiBmb3JjZSgnJyksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKE9wLm5vb3BGKCkpKSxcbiAgICAgICAgICAgIGlvOiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIG9wbG9nOiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIGFjdG9yczogb3IodHlwZShPYmplY3QpLCBmb3JjZSh7fSkpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1hcCA9IHBhcnRpYWwobWFwLCB0aGlzKTtcbiAgICAgICAgdGhpcy5yZWR1Y2UgPSBmID0+IE9iamVjdC5rZXlzKHRoaXMuYWN0b3JzKS5yZWR1Y2UoKHMsIGspPT5mKHMsIHRoaXMuYWN0b3JzW2tdKSwgdGhpcyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkcm9wIGEgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7U2VuZH0gb3BcbiAgICAgKiBAcGFyYW0ge0FjdG9yfSBhY3RvclxuICAgICAqIEBzdW1tYXJ5IHtTZW5kIOKGkiAgU3lzdGVtfVxuICAgICAqL1xuICAgIGRyb3Aob3AsIGFjdG9yKSB7XG5cbiAgICAgICAgcmV0dXJuIGxvZyhPcC5kcm9wKG9wLnRvLCBvcC5tZXNzYWdlKSwgYWN0b3IsIHRoaXMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd24gYSBuZXcgYWN0b3JcbiAgICAgKiBAcGFyYW0ge0FjdG9yVH0gdGVtcGxhdGVcbiAgICAgKiBAcmV0dXJuIHtTeXN0ZW19XG4gICAgICovXG4gICAgc3Bhd24odGVtcGxhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgb3BzOiB0aGlzLm9wcy5jaGFpbigoKSA9PiBPcC5zcGF3bkYodGVtcGxhdGUpKSB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRpY2sgYWN0cyBhcyB0aGUgc2NoZWR1bGVyLCBzY2hlZHVsaW5nIHN5c3RlbSBjb21wdXRhdGlvbnMgaW5jbHVkaW5nXG4gICAgICogdGhvc2Ugb2YgY2hpbGQgYWN0b3JzLlxuICAgICAqIEBzdW1tYXJ5IHsgKCkg4oaSICBTeXN0ZW19XG4gICAgICovXG4gICAgdGljaygpIHtcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgLm1hcChhID0+IHJ1bkVmZmVjdHMobmV4dChhKSwgYSwgW10pKVxuICAgICAgICAgICAgLnJlZHVjZSgocywgYSkgPT4gcHV0QWN0b3IoYS5tYXAoKCkgPT4gbnVsbCksIHJlY29uY2lsZShzLCBhKSkpXG5cbiAgICB9XG5cbiAgICAvKiogdG9jayBydW5zIHRoZSBjb21wdXRhdGlvbnMgb2YgdGhlIGFjdG9yIHN5c3RlbS5cbiAgICAgKiBAc3VtbWFyeSB7ICgpIOKGkiAgSU88U3lzdGVtPn1cbiAgICAgKi9cbiAgICB0b2NrKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlvXG4gICAgICAgICAgICAucmVkdWNlKChpbywgaW9uKSA9PiBpby5jaGFpbihzID0+XG4gICAgICAgICAgICAgICAgaW9uLm1hcChyID0+IHJlY29uY2lsZShzLCByKSkpLCBJTy5vZih0aGlzLmNvcHkoeyBpbzogW10gfSkpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdvXG4gICAgICogQHN1bW1hcnkgeyAoKSA9PiBJTzxudWxsPiB9XG4gICAgICovXG4gICAgY2xvY2soKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGljaygpLnRvY2soKS5jaGFpbihzID0+IG5leHRDbG9jaygoKSA9PiBzLmNsb2NrKCkucnVuKCkpKTtcblxuICAgIH1cblxufVxuIl19