'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.System = exports.actorCheckedLens = exports.actorLens = exports.qLens = exports.drain = exports.receiveMessage = exports.deliverMessage = exports.execSpawn = exports.exec = exports.Drop = exports.Receive = exports.Send = exports.Spawn = exports.Op = undefined;

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

var _lens = require('./lens');

var lens = _interopRequireWildcard(_lens);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/**
 * Op
 */

var Op = exports.Op = function (_Type) {
    _inherits(Op, _Type);

    function Op() {
        _classCallCheck(this, Op);

        return _possibleConstructorReturn(this, (Op.__proto__ || Object.getPrototypeOf(Op)).apply(this, arguments));
    }

    _createClass(Op, [{
        key: 'map',
        value: function map(f) {
            var _this2 = this;

            return (0, _Match.match)(this).caseOf(Spawn, function () {
                return new Spawn((0, _util.merge)(_this2, { next: f(_this2.next) }));
            }).caseOf(Send, function () {
                return new Send((0, _util.merge)(_this2, { next: f(_this2.next) }));
            }).caseOf(Receive, function () {
                return new Receive((0, _util.merge)(_this2, { next: f(_this2.next) }));
            }).end();
        }
    }]);

    return Op;
}(_Type3.Type);

/**
 * Spawn represents a request to create a new actor by its parent.
 */


var Spawn = exports.Spawn = function (_Op) {
    _inherits(Spawn, _Op);

    function Spawn(props) {
        _classCallCheck(this, Spawn);

        return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).call(this, props, {
            template: (0, _be.type)(_Actor.ActorT),
            parent: (0, _be.type)(String),
            next: _be.any
        }));
    }

    return Spawn;
}(Op);

/**
 * Send represents a request to send a message to another actor.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */


var Send = exports.Send = function (_Op2) {
    _inherits(Send, _Op2);

    function Send(props) {
        _classCallCheck(this, Send);

        return _possibleConstructorReturn(this, (Send.__proto__ || Object.getPrototypeOf(Send)).call(this, props, {
            from: (0, _be.type)(String),
            to: (0, _be.type)(String),
            message: _be.any,
            next: _be.any
        }));
    }

    return Send;
}(Op);

/**
 * Receive represents a request to receive the latest message
 */


var Receive = exports.Receive = function (_Op3) {
    _inherits(Receive, _Op3);

    function Receive(props) {
        _classCallCheck(this, Receive);

        return _possibleConstructorReturn(this, (Receive.__proto__ || Object.getPrototypeOf(Receive)).call(this, props, {

            behaviour: (0, _be.type)(Function),
            path: (0, _be.type)(String),
            next: _be.any

        }));
    }

    return Receive;
}(Op);

/**
 * Drop represents a request to drop a message.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */


var Drop = exports.Drop = function (_Send) {
    _inherits(Drop, _Send);

    function Drop() {
        _classCallCheck(this, Drop);

        return _possibleConstructorReturn(this, (Drop.__proto__ || Object.getPrototypeOf(Drop)).apply(this, arguments));
    }

    return Drop;
}(Send);

/**
 * exec
 * @summary { (Free,System) →  System }
 */


var exec = exports.exec = function exec(sys, free) {
    return free.resume().cata(function (x) {
        return (0, _Match.match)(x).caseOf(Spawn, execSpawn(sys)).caseOf(Send, deliverMessage(sys)).caseOf(Receive, receiveMessage(sys)).end();
    }, function (y) {
        return y;
    });
};

/**
 * execSpawn
 * @param {System} sys
 * @param {Spawn} request
 * @return {System}
 */
var execSpawn = exports.execSpawn = function execSpawn(sys) {
    return function (_ref) {
        var parent = _ref.parent,
            template = _ref.template;
        return (0, _Match.match)(template).caseOf(_Actor.LocalT, function (_ref2) {
            var id = _ref2.id,
                start = _ref2.start;
            return lens.set(actorCheckedLens(address(parent, id)), new _Actor.ActorL({
                parent: parent,
                path: address(parent, id),
                ops: start(new _Actor.ActorContext({ self: address(parent, id), parent: parent })),
                template: template
            }), sys);
        }).end();
    };
};

/**
 * deliverMessage
 * @summary {System →  Send →  System}
 */
var deliverMessage = exports.deliverMessage = function deliverMessage(sys) {
    return function (send) {
        return _monad.Maybe.not(sys.actors[send.to]).map(function (actor) {
            return lens.set(actorLens(send.to), actor.accept(send), sys);
        }).orElse(function () {
            return sys.accept(send);
        }).just();
    };
};

/**
 * receiveMessage
 * @summary {System →  Receive →  System}
 */
var receiveMessage = exports.receiveMessage = function receiveMessage(sys) {
    return function (receive) {
        return _monad.Maybe.not(sys.actors[receive.path]).chain(function (actor) {
            return _monad.Maybe.not(actor.mailbox[0]).map(function (msg) {

                if (receive.pattern) if (receive.pattern(msg) === false) return (0, _Type3.copy)(sys, { ops: sys.ops.concat(receive) });

                //@todo error handling on behaviour execution
                return (0, _Type3.copy)(sys, {
                    ops: sys.ops.concat(receive.behaviour(msg)).filter(function (x) {
                        return x;
                    })
                });
            }).orElse(function () {
                return (0, _Type3.copy)(sys, { ops: sys.ops.concat(receive) });
            });
        }).orElse(function () {
            return _monad.Maybe.of(sys.accept(receive));
        }).just();
    };
};

/**
 * drain the ops from an actor
 * @param {System} sys
 * @param {Actor} actor
 * @return {System}
 * @summary {(Actor,System) →  System}
 */
var drain = exports.drain = function drain(sys, actor) {
    return (0, _Type3.copy)(sys, {
        ops: actor.ops ? sys.ops.concat(actor.ops) : sys.ops,
        actors: (0, _util.merge)(sys.actors, _defineProperty({}, actor.path, (0, _Type3.copy)(actor, { ops: null })))
    });
};

/**
 * qLens
 */
var qLens = exports.qLens = function qLens(path) {
    return function (op, sys) {

        if (sys === undefined) {

            return lens.path(path);
        } else {

            return lens.set(lens.path(path), lens.set(lens.index(lens.TAIL), op, lens.path(path)(sys)), sys);
        }
    };
};

/**
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
 * address generates an address for a local actor
 * @summary { (string,string) →  string
 */
var address = function address(p, c) {
    return p === '' ? c : p + '/' + c;
};
var opsLens = qLens('ops');

/**
 * System
 * @property {Array<Op>} ops
 */

var System = exports.System = function (_Type2) {
    _inherits(System, _Type2);

    function System(props) {
        _classCallCheck(this, System);

        return _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, props, {
            ops: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            actors: (0, _be.or)((0, _be.type)(Object), (0, _be.force)({}))
        }));
    }

    /**
     * accept a message for the system actor. Usually a dead letter or system command.
     * @param {Send} message
     */


    _createClass(System, [{
        key: 'accept',
        value: function accept(message) {

            //@todo filter our and log dropped messages
            console.log('dead message', message);
            return this;
        }

        /**
         * spawn a new actor
         * @param {ActorT} template
         * @return {System}
         */

    }, {
        key: 'spawn',
        value: function spawn(template) {

            return new System(lens.set(opsLens, _monad.Free.liftF(new Spawn({ template: template, parent: '' })), this));
        }

        /**
         * tick acts as the scheduler, scheduling system computations including
         * those of child actors.
         * @summary { () →  System}
         */

    }, {
        key: 'tick',
        value: function tick() {

            return (0, _util.oreduce)(this.actors, drain, this);
        }

        /** tock runs the computations of the actor system.
         * @summary { System →  Free →  System}
         */

    }, {
        key: 'tock',
        value: function tock(f) {

            return this.ops.slice().reduce(exec, (0, _Type3.copy)(this, { ops: [] }));
        }
    }, {
        key: 'start',
        value: function start() {}
    }]);

    return System;
}(_Type3.Type);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW0uanMiXSwibmFtZXMiOlsiSW52YWxpZEFjdG9yUGF0aEVycm9yIiwibGVucyIsInBhdGgiLCJtZXNzYWdlIiwic3RhY2siLCJFcnJvciIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsImhhc093blByb3BlcnR5IiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJPcCIsImYiLCJjYXNlT2YiLCJTcGF3biIsIm5leHQiLCJTZW5kIiwiUmVjZWl2ZSIsImVuZCIsInByb3BzIiwidGVtcGxhdGUiLCJwYXJlbnQiLCJTdHJpbmciLCJmcm9tIiwidG8iLCJiZWhhdmlvdXIiLCJGdW5jdGlvbiIsIkRyb3AiLCJleGVjIiwic3lzIiwiZnJlZSIsInJlc3VtZSIsImNhdGEiLCJ4IiwiZXhlY1NwYXduIiwiZGVsaXZlck1lc3NhZ2UiLCJyZWNlaXZlTWVzc2FnZSIsInkiLCJpZCIsInN0YXJ0Iiwic2V0IiwiYWN0b3JDaGVja2VkTGVucyIsImFkZHJlc3MiLCJvcHMiLCJzZWxmIiwibm90IiwiYWN0b3JzIiwic2VuZCIsIm1hcCIsImFjdG9yTGVucyIsImFjdG9yIiwiYWNjZXB0Iiwib3JFbHNlIiwianVzdCIsInJlY2VpdmUiLCJjaGFpbiIsIm1haWxib3giLCJwYXR0ZXJuIiwibXNnIiwiY29uY2F0IiwiZmlsdGVyIiwib2YiLCJkcmFpbiIsInFMZW5zIiwib3AiLCJ1bmRlZmluZWQiLCJpbmRleCIsIlRBSUwiLCJwIiwiYyIsIm9wc0xlbnMiLCJTeXN0ZW0iLCJBcnJheSIsImNvbnNvbGUiLCJsb2ciLCJsaWZ0RiIsInNsaWNlIiwicmVkdWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFhZ0JBLHFCLEdBQUFBLHFCOztBQWJoQjs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztJQUFZQyxJOzs7Ozs7Ozs7Ozs7OztBQUVaOzs7O0FBSU8sU0FBU0QscUJBQVQsQ0FBK0JF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TyxLQUFLK0IsR0FBTCxDQUFTaUMsS0FBVCxHQUFpQkMsTUFBakIsQ0FBd0JqRCxJQUF4QixFQUE4QixpQkFBSyxJQUFMLEVBQVcsRUFBRWUsS0FBSyxFQUFQLEVBQVgsQ0FBOUIsQ0FBUDtBQUVIOzs7Z0NBRU8sQ0FJUCIsImZpbGUiOiJTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvcGVydHkgZnJvbSAncHJvcGVydHktc2Vlayc7XG5pbXBvcnQgeyBtZXJnZSwgb3JlZHVjZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB0eXBlLCBmb3JjZSwgYW55LCBvciB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgbWF0Y2ggfSBmcm9tICcuL01hdGNoJztcbmltcG9ydCB7IE1heWJlLCBGcmVlIH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBUeXBlLCBjb3B5IH0gZnJvbSAnLi9UeXBlJztcbmltcG9ydCB7IEFjdG9yVCwgTG9jYWxULCBBY3RvckwsIEFjdG9yQ29udGV4dCB9IGZyb20gJy4vQWN0b3InO1xuaW1wb3J0ICogYXMgbGVucyBmcm9tICcuL2xlbnMnO1xuXG4vKipcbiAqIEludmFsaWRBY3RvclBhdGhFcnJvclxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEludmFsaWRBY3RvclBhdGhFcnJvcihwYXRoKSB7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBgVGhlIHBhdGggJyR7cGF0aH0nIGlzIGVpdGhlciBpbnZhbGlkIG9yIGluIHVzZSFgO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuSW52YWxpZEFjdG9yUGF0aEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkludmFsaWRBY3RvclBhdGhFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbnZhbGlkQWN0b3JQYXRoRXJyb3I7XG5cbi8qKlxuICogT3BcbiAqL1xuZXhwb3J0IGNsYXNzIE9wIGV4dGVuZHMgVHlwZSB7XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBtYXRjaCh0aGlzKVxuICAgICAgICAgICAgLmNhc2VPZihTcGF3biwgKCkgPT4gbmV3IFNwYXduKG1lcmdlKHRoaXMsIHsgbmV4dDogZih0aGlzLm5leHQpIH0pKSlcbiAgICAgICAgICAgIC5jYXNlT2YoU2VuZCwgKCkgPT4gbmV3IFNlbmQobWVyZ2UodGhpcywgeyBuZXh0OiBmKHRoaXMubmV4dCkgfSkpKVxuICAgICAgICAgICAgLmNhc2VPZihSZWNlaXZlLCAoKSA9PiBuZXcgUmVjZWl2ZShtZXJnZSh0aGlzLCB7IG5leHQ6IGYodGhpcy5uZXh0KSB9KSkpXG4gICAgICAgICAgICAuZW5kKCk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTcGF3biByZXByZXNlbnRzIGEgcmVxdWVzdCB0byBjcmVhdGUgYSBuZXcgYWN0b3IgYnkgaXRzIHBhcmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwYXduIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgdGVtcGxhdGU6IHR5cGUoQWN0b3JUKSxcbiAgICAgICAgICAgIHBhcmVudDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgbmV4dDogYW55XG4gICAgICAgIH0pO1xuXG4gICAgfVxufVxuXG4vKipcbiAqIFNlbmQgcmVwcmVzZW50cyBhIHJlcXVlc3QgdG8gc2VuZCBhIG1lc3NhZ2UgdG8gYW5vdGhlciBhY3Rvci5cbiAqIEBwcm9wZXJ0eSB7dG99IHN0cmluZ1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGZyb21cbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgU2VuZCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGZyb206IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHRvOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBtZXNzYWdlOiBhbnksXG4gICAgICAgICAgICBuZXh0OiBhbnlcbiAgICAgICAgfSk7XG5cbiAgICB9XG59XG5cbi8qKlxuICogUmVjZWl2ZSByZXByZXNlbnRzIGEgcmVxdWVzdCB0byByZWNlaXZlIHRoZSBsYXRlc3QgbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgUmVjZWl2ZSBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgYmVoYXZpb3VyOiB0eXBlKEZ1bmN0aW9uKSxcbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG5leHQ6IGFueVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRHJvcCByZXByZXNlbnRzIGEgcmVxdWVzdCB0byBkcm9wIGEgbWVzc2FnZS5cbiAqIEBwcm9wZXJ0eSB7dG99IHN0cmluZ1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGZyb21cbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgRHJvcCBleHRlbmRzIFNlbmQge31cblxuLyoqXG4gKiBleGVjXG4gKiBAc3VtbWFyeSB7IChGcmVlLFN5c3RlbSkg4oaSICBTeXN0ZW0gfVxuICovXG5leHBvcnQgY29uc3QgZXhlYyA9IChzeXMsIGZyZWUpID0+XG4gICAgZnJlZVxuICAgIC5yZXN1bWUoKVxuICAgIC5jYXRhKHggPT4gbWF0Y2goeClcbiAgICAgICAgLmNhc2VPZihTcGF3biwgZXhlY1NwYXduKHN5cykpXG4gICAgICAgIC5jYXNlT2YoU2VuZCwgZGVsaXZlck1lc3NhZ2Uoc3lzKSlcbiAgICAgICAgLmNhc2VPZihSZWNlaXZlLCByZWNlaXZlTWVzc2FnZShzeXMpKVxuICAgICAgICAuZW5kKCksIHkgPT4geSlcblxuLyoqXG4gKiBleGVjU3Bhd25cbiAqIEBwYXJhbSB7U3lzdGVtfSBzeXNcbiAqIEBwYXJhbSB7U3Bhd259IHJlcXVlc3RcbiAqIEByZXR1cm4ge1N5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWNTcGF3biA9IHN5cyA9PiAoeyBwYXJlbnQsIHRlbXBsYXRlIH0pID0+IG1hdGNoKHRlbXBsYXRlKVxuICAgIC5jYXNlT2YoTG9jYWxULCAoeyBpZCwgc3RhcnQgfSkgPT5cbiAgICAgICAgbGVucy5zZXQoXG4gICAgICAgICAgICBhY3RvckNoZWNrZWRMZW5zKGFkZHJlc3MocGFyZW50LCBpZCkpLFxuICAgICAgICAgICAgbmV3IEFjdG9yTCh7XG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIHBhdGg6IGFkZHJlc3MocGFyZW50LCBpZCksXG4gICAgICAgICAgICAgICAgb3BzOiBzdGFydChuZXcgQWN0b3JDb250ZXh0KHsgc2VsZjogYWRkcmVzcyhwYXJlbnQsIGlkKSwgcGFyZW50IH0pKSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgfSksIHN5cykpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIGRlbGl2ZXJNZXNzYWdlXG4gKiBAc3VtbWFyeSB7U3lzdGVtIOKGkiAgU2VuZCDihpIgIFN5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IGRlbGl2ZXJNZXNzYWdlID0gc3lzID0+IHNlbmQgPT5cbiAgICBNYXliZVxuICAgIC5ub3Qoc3lzLmFjdG9yc1tzZW5kLnRvXSlcbiAgICAubWFwKGFjdG9yID0+IGxlbnMuc2V0KGFjdG9yTGVucyhzZW5kLnRvKSwgYWN0b3IuYWNjZXB0KHNlbmQpLCBzeXMpKVxuICAgIC5vckVsc2UoKCkgPT4gc3lzLmFjY2VwdChzZW5kKSlcbiAgICAuanVzdCgpO1xuXG4vKipcbiAqIHJlY2VpdmVNZXNzYWdlXG4gKiBAc3VtbWFyeSB7U3lzdGVtIOKGkiAgUmVjZWl2ZSDihpIgIFN5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlY2VpdmVNZXNzYWdlID0gc3lzID0+IHJlY2VpdmUgPT5cbiAgICBNYXliZVxuICAgIC5ub3Qoc3lzLmFjdG9yc1tyZWNlaXZlLnBhdGhdKVxuICAgIC5jaGFpbihhY3RvciA9PlxuICAgICAgICBNYXliZVxuICAgICAgICAubm90KGFjdG9yLm1haWxib3hbMF0pXG4gICAgICAgIC5tYXAobXNnID0+IHtcblxuICAgICAgICAgICAgaWYgKHJlY2VpdmUucGF0dGVybilcbiAgICAgICAgICAgICAgICBpZiAocmVjZWl2ZS5wYXR0ZXJuKG1zZykgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29weShzeXMsIHsgb3BzOiBzeXMub3BzLmNvbmNhdChyZWNlaXZlKSB9KTtcblxuICAgICAgICAgICAgICAgIC8vQHRvZG8gZXJyb3IgaGFuZGxpbmcgb24gYmVoYXZpb3VyIGV4ZWN1dGlvblxuICAgICAgICAgICAgcmV0dXJuIGNvcHkoc3lzLCB7XG4gICAgICAgICAgICAgICAgb3BzOiBzeXMub3BzLmNvbmNhdChyZWNlaXZlLmJlaGF2aW91cihtc2cpKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KVxuICAgICAgICAub3JFbHNlKCgpID0+IGNvcHkoc3lzLCB7IG9wczogc3lzLm9wcy5jb25jYXQocmVjZWl2ZSkgfSkpKVxuICAgIC5vckVsc2UoKCkgPT4gTWF5YmUub2Yoc3lzLmFjY2VwdChyZWNlaXZlKSkpXG4gICAgLmp1c3QoKTtcblxuXG4vKipcbiAqIGRyYWluIHRoZSBvcHMgZnJvbSBhbiBhY3RvclxuICogQHBhcmFtIHtTeXN0ZW19IHN5c1xuICogQHBhcmFtIHtBY3Rvcn0gYWN0b3JcbiAqIEByZXR1cm4ge1N5c3RlbX1cbiAqIEBzdW1tYXJ5IHsoQWN0b3IsU3lzdGVtKSDihpIgIFN5c3RlbX1cbiAqL1xuZXhwb3J0IGNvbnN0IGRyYWluID0gKHN5cywgYWN0b3IpID0+XG4gICAgY29weShzeXMsIHtcbiAgICAgICAgb3BzOiBhY3Rvci5vcHMgPyBzeXMub3BzLmNvbmNhdChhY3Rvci5vcHMpIDogc3lzLm9wcyxcbiAgICAgICAgYWN0b3JzOiBtZXJnZShzeXMuYWN0b3JzLCB7XG4gICAgICAgICAgICBbYWN0b3IucGF0aF06IGNvcHkoYWN0b3IsIHsgb3BzOiBudWxsIH0pXG4gICAgICAgIH0pXG4gICAgfSk7XG5cblxuLyoqXG4gKiBxTGVuc1xuICovXG5leHBvcnQgY29uc3QgcUxlbnMgPSBwYXRoID0+IChvcCwgc3lzKSA9PiB7XG5cbiAgICBpZiAoc3lzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICByZXR1cm4gbGVucy5wYXRoKHBhdGgpXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHJldHVybiBsZW5zLnNldChsZW5zLnBhdGgocGF0aCksXG4gICAgICAgICAgICBsZW5zLnNldChsZW5zLmluZGV4KGxlbnMuVEFJTCksIG9wLCBsZW5zLnBhdGgocGF0aCkoc3lzKSksIHN5cyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBhY3RvckxlbnNcbiAqL1xuZXhwb3J0IGNvbnN0IGFjdG9yTGVucyA9IHBhdGggPT4gKGFjdG9yLCBzeXMpID0+IChzeXMgPT09IHVuZGVmaW5lZCkgP1xuICAgIGFjdG9yLmFjdG9yc1twYXRoXSA6IHByb3BlcnR5KGBhY3RvcnNbJHtwYXRofV1gLCBhY3Rvciwgc3lzKTtcblxuLyoqXG4gKiBhY3RvckNoZWNrZWRMZW5zXG4gKi9cbmV4cG9ydCBjb25zdCBhY3RvckNoZWNrZWRMZW5zID0gcGF0aCA9PiAoYWN0b3IsIHN5cykgPT4ge1xuXG4gICAgaWYgKHN5cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBpZiAocHJvcGVydHkoYGFjdG9yc1ske3BhdGh9XWAsIHN5cykgIT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkQWN0b3JQYXRoRXJyb3IocGF0aCk7XG5cbiAgICByZXR1cm4gYWN0b3JMZW5zKHBhdGgpKGFjdG9yLCBzeXMpO1xuXG59XG5cbi8qKlxuICogYWRkcmVzcyBnZW5lcmF0ZXMgYW4gYWRkcmVzcyBmb3IgYSBsb2NhbCBhY3RvclxuICogQHN1bW1hcnkgeyAoc3RyaW5nLHN0cmluZykg4oaSICBzdHJpbmdcbiAqL1xuY29uc3QgYWRkcmVzcyA9IChwLCBjKSA9PiAocCA9PT0gJycpID8gYyA6IGAke3B9LyR7Y31gO1xuY29uc3Qgb3BzTGVucyA9IHFMZW5zKCdvcHMnKTtcblxuLyoqXG4gKiBTeXN0ZW1cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8T3A+fSBvcHNcbiAqL1xuZXhwb3J0IGNsYXNzIFN5c3RlbSBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIGFjdG9yczogb3IodHlwZShPYmplY3QpLCBmb3JjZSh7fSkpXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWNjZXB0IGEgbWVzc2FnZSBmb3IgdGhlIHN5c3RlbSBhY3Rvci4gVXN1YWxseSBhIGRlYWQgbGV0dGVyIG9yIHN5c3RlbSBjb21tYW5kLlxuICAgICAqIEBwYXJhbSB7U2VuZH0gbWVzc2FnZVxuICAgICAqL1xuICAgIGFjY2VwdChtZXNzYWdlKSB7XG5cbiAgICAgICAgLy9AdG9kbyBmaWx0ZXIgb3VyIGFuZCBsb2cgZHJvcHBlZCBtZXNzYWdlc1xuICAgICAgICBjb25zb2xlLmxvZygnZGVhZCBtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd24gYSBuZXcgYWN0b3JcbiAgICAgKiBAcGFyYW0ge0FjdG9yVH0gdGVtcGxhdGVcbiAgICAgKiBAcmV0dXJuIHtTeXN0ZW19XG4gICAgICovXG4gICAgc3Bhd24odGVtcGxhdGUpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN5c3RlbShsZW5zLnNldChvcHNMZW5zLFxuICAgICAgICAgICAgRnJlZS5saWZ0RihuZXcgU3Bhd24oeyB0ZW1wbGF0ZSwgcGFyZW50OiAnJyB9KSksIHRoaXMpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRpY2sgYWN0cyBhcyB0aGUgc2NoZWR1bGVyLCBzY2hlZHVsaW5nIHN5c3RlbSBjb21wdXRhdGlvbnMgaW5jbHVkaW5nXG4gICAgICogdGhvc2Ugb2YgY2hpbGQgYWN0b3JzLlxuICAgICAqIEBzdW1tYXJ5IHsgKCkg4oaSICBTeXN0ZW19XG4gICAgICovXG4gICAgdGljaygpIHtcblxuICAgICAgICByZXR1cm4gb3JlZHVjZSh0aGlzLmFjdG9ycywgZHJhaW4sIHRoaXMpO1xuXG4gICAgfVxuXG4gICAgLyoqIHRvY2sgcnVucyB0aGUgY29tcHV0YXRpb25zIG9mIHRoZSBhY3RvciBzeXN0ZW0uXG4gICAgICogQHN1bW1hcnkgeyBTeXN0ZW0g4oaSICBGcmVlIOKGkiAgU3lzdGVtfVxuICAgICAqL1xuICAgIHRvY2soZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLm9wcy5zbGljZSgpLnJlZHVjZShleGVjLCBjb3B5KHRoaXMsIHsgb3BzOiBbXSB9KSk7XG5cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcblxuXG5cbiAgICB9XG5cbn1cbiJdfQ==