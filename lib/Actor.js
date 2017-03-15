'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = exports.tick = exports.nextTick = exports.select = exports.accept = exports.fold = exports.put = exports.get = exports.map = exports.replace = exports.Future = exports.ActorSTP = exports.ActorCP = exports.ActorFT = exports.ActorL = exports.System = exports.Actor = exports.FutureT = exports.LocalT = exports.ActorT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.DuplicateActorIdError = DuplicateActorIdError;

var _uuid = require('uuid');

var _be = require('./be');

var _Type3 = require('./Type');

var _monad = require('./monad');

var _util = require('./util');

var _Ops = require('./Ops');

var _MVar = require('./MVar');

var _Match = require('./Match');

var _Exec = require('./Exec');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DuplicateActorIdError
 */
function DuplicateActorIdError(path, id) {

    this.message = 'Id \'' + id + '\' at path \'' + path + '\' is in use!';
    this.path = path;
    this.id = id;
    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

DuplicateActorIdError.prototype = Object.create(Error.prototype);
DuplicateActorIdError.prototype.constructor = DuplicateActorIdError;

exports.default = DuplicateActorIdError;

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */

var ActorT = exports.ActorT = function (_Type) {
    _inherits(ActorT, _Type);

    function ActorT() {
        _classCallCheck(this, ActorT);

        return _possibleConstructorReturn(this, (ActorT.__proto__ || Object.getPrototypeOf(ActorT)).apply(this, arguments));
    }

    return ActorT;
}(_Type3.Type);

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */


var LocalT = exports.LocalT = function (_ActorT) {
    _inherits(LocalT, _ActorT);

    function LocalT(props) {
        _classCallCheck(this, LocalT);

        return _possibleConstructorReturn(this, (LocalT.__proto__ || Object.getPrototypeOf(LocalT)).call(this, props, {

            id: (0, _be.type)(String),
            start: (0, _be.or)((0, _be.type)(Function), (0, _be.force)(function () {}))

        }));
    }

    return LocalT;
}(ActorT);

/**
 * FutureT is the template for spawning future actors.
 * @property {string} id
 * @property {string} to
 * @property {Future} future
 */


var FutureT = exports.FutureT = function (_ActorT2) {
    _inherits(FutureT, _ActorT2);

    function FutureT(props) {
        _classCallCheck(this, FutureT);

        return _possibleConstructorReturn(this, (FutureT.__proto__ || Object.getPrototypeOf(FutureT)).call(this, props, {
            id: (0, _be.call)(function () {
                return 'future-' + (0, _uuid.v4)();
            }),
            mvar: (0, _be.type)(_MVar.MVar)
        }));
    }

    return FutureT;
}(ActorT);

/**
 * Actor
 */


var Actor = exports.Actor = function (_Type2) {
    _inherits(Actor, _Type2);

    function Actor(props, checks) {
        _classCallCheck(this, Actor);

        var _this4 = _possibleConstructorReturn(this, (Actor.__proto__ || Object.getPrototypeOf(Actor)).call(this, props, checks));

        _this4.fold = (0, _util.partial)(fold, _this4);
        _this4.map = (0, _util.partial)(map, _this4);

        return _this4;
    }

    return Actor;
}(_Type3.Type);

/**
 * System
 * @property {Array<Op>} ops
 */


var System = exports.System = function (_Actor) {
    _inherits(System, _Actor);

    function System(props) {
        _classCallCheck(this, System);

        var _this5 = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, props, {
            path: (0, _be.force)(''),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            actors: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([]))
        }));

        _this5.spawn = function (t) {
            return _this5.copy({ ops: _this5.ops ? _this5.ops.chain(function () {
                    return (0, _Ops.spawn)(t);
                }) : (0, _Ops.spawn)(t) });
        };
        _this5.tick = function () {
            return tick(_this5, _monad.IO.of(_this5.copy({ ops: null })));
        };
        _this5.start = function () {
            return start(_this5);
        };

        return _this5;
    }

    return System;
}(Actor);

/**
 * ActorL
 */


var ActorL = exports.ActorL = function (_Actor2) {
    _inherits(ActorL, _Actor2);

    function ActorL(props) {
        _classCallCheck(this, ActorL);

        return _possibleConstructorReturn(this, (ActorL.__proto__ || Object.getPrototypeOf(ActorL)).call(this, props, {

            id: (0, _be.type)(String),
            parent: (0, _be.type)(String),
            path: (0, _be.type)(String),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mailbox: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            actors: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            template: (0, _be.type)(ActorT)

        }));
    }

    return ActorL;
}(Actor);

/**
 * ActorFT contains a Future, a computation that we expect to be complete sometime
 * later.
 */


var ActorFT = exports.ActorFT = function (_Actor3) {
    _inherits(ActorFT, _Actor3);

    function ActorFT(props) {
        _classCallCheck(this, ActorFT);

        return _possibleConstructorReturn(this, (ActorFT.__proto__ || Object.getPrototypeOf(ActorFT)).call(this, props, {
            path: (0, _be.type)(String),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mvar: (0, _be.type)(_MVar.MVar),
            template: (0, _be.type)(ActorT)
        }));
    }

    return ActorFT;
}(Actor);

/**
 * ActorCP treats a child process like an actor.
 */


var ActorCP = exports.ActorCP = function (_Actor4) {
    _inherits(ActorCP, _Actor4);

    function ActorCP(props) {
        _classCallCheck(this, ActorCP);

        return _possibleConstructorReturn(this, (ActorCP.__proto__ || Object.getPrototypeOf(ActorCP)).call(this, props, {}));
    }

    return ActorCP;
}(Actor);

/**
 * ActorSTP is a stopped Actor ready for removal.
 */


var ActorSTP = exports.ActorSTP = function (_Actor5) {
    _inherits(ActorSTP, _Actor5);

    function ActorSTP(props) {
        _classCallCheck(this, ActorSTP);

        return _possibleConstructorReturn(this, (ActorSTP.__proto__ || Object.getPrototypeOf(ActorSTP)).call(this, props, { path: (0, _be.type)(String) }));
    }

    return ActorSTP;
}(Actor);

/**
 * Future represents some computation we are interested in getting the result of
 *hat may not complete now or run asynchronously. This class serves
 * as an interface for type checking.
 * @interface
 */


var Future = exports.Future = function () {
    function Future() {
        _classCallCheck(this, Future);
    }

    _createClass(Future, [{
        key: 'fork',


        /**
         * fork the Future
         * @param {function} onReject
         * @param {function} onResolve
         */
        value: function fork() {}
    }]);

    return Future;
}();

/**
 * replace an actor with a new version.
 * Returns the parent actor (second arg) updated with the new actor.
 * If the parent path is the same path as the actor to replace, it is
 * replaced instead.
 * No change is made if the actor is not found.
 * @summary (Actor, Actor) →  Actor
 */


var replace = exports.replace = function replace(a, p) {
    return p.path === a.path ? a : p.map(function (c) {
        return c.path === a.path ? a : c.map((0, _util.partial)(replace, a));
    });
};

/**
 * map over an Actor treating it like a Functor
 * @summary {(Actor,Function) →  Actor}
 */
var map = exports.map = function map(a, f) {
    return (0, _Match.match)(a).caseOf(ActorFT, function (a) {
        return a;
    }).caseOf(Actor, function (a) {
        return a.copy({ actors: a.actors.map(f) });
    }).end();
};

/**
 * get a child actor from its parent using its id
 * @summary (string,Actor) →  Actor|null
 */
var get = exports.get = function get(id, a) {
    return a.fold(function (p, c) {
        return p ? p : c.id === id ? c : null;
    });
};

/**
 * put an actor into another making it a child
 * Returns the parent (child,parent) →  parent
 * @summary (Actor, Actor) →  Actor
 */
var put = exports.put = function put(a, p) {
    return p.copy({ actors: p.actors.concat(a) });
};

/**
 * fold a data structure into an acumulated simpler one
 * @summary fold :: (Actor, *→ *, *) →  *
 */
var fold = exports.fold = function fold(o, f, accum) {
    return (0, _Match.match)(o).caseOf(ActorFT, function () {
        return accum;
    }).caseOf(Actor, function (a) {
        return a.actors.reduce(f, accum);
    }).end();
};

/**
 * accept allows an Actor to accept the latest message addressed to it.
 * @param {*} m
 * @summary {*,Actor) →  Actor|IO<Actor>|Drop}
 */
var accept = exports.accept = function accept(m, a) {
    return (0, _Match.match)(a).caseOf(ActorL, function (a) {
        return a.copy({ mailbox: a.mailbox.concat(m) });
    }).end();
};

/**
 * select an actor in the system using the specified path.
 * @summary (string, Actor) →  Actor|null
 */
var select = exports.select = function select(p, a) {
    return fold(a, function (hit, child) {
        return hit ? hit : p === child.path ? child : p.startsWith(child.path) ? select(p, child) : null;
    }, null);
};

var nextTick = exports.nextTick = function nextTick(f) {
    return new _monad.IO(function () {
        return process ? process.nextTick(f) : setTimeout(f, 0);
    }).chain(function () {
        return _monad.IO.of(null);
    });
};

/**
 * tick
 * @summary tick :: (Actor, IO<System>) →  IO<System>
 */
var tick = exports.tick = function tick(a, io) {
    return (0, _Exec.exec)(a.copy({ ops: null }), a.fold(function (io, c) {
        return tick(c, io);
    }, io), a.ops);
};

/**
 * start the system.
 * Note: start does not actuall start the system but returns an IO class.
 * @summary start :: System →  IO<null>
 */
var start = exports.start = function start(s) {
    return (0, _Match.match)(s).caseOf(System, function (s) {
        return tick(s, _monad.IO.of(s)).chain(function (s) {
            return nextTick(function () {
                return start(s);
            });
        });
    }).end();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rvci5qcyJdLCJuYW1lcyI6WyJEdXBsaWNhdGVBY3RvcklkRXJyb3IiLCJwYXRoIiwiaWQiLCJtZXNzYWdlIiwic3RhY2siLCJFcnJvciIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsImhhc093blByb3BlcnR5IiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJBY3RvclQiLCJMb2NhbFQiLCJwcm9wcyIsIlN0cmluZyIsInN0YXJ0IiwiRnVuY3Rpb24iLCJGdXR1cmVUIiwibXZhciIsIkFjdG9yIiwiY2hlY2tzIiwiZm9sZCIsIm1hcCIsIlN5c3RlbSIsIm9wcyIsImFjdG9ycyIsIkFycmF5Iiwic3Bhd24iLCJjb3B5IiwiY2hhaW4iLCJ0IiwidGljayIsIm9mIiwiQWN0b3JMIiwicGFyZW50IiwibWFpbGJveCIsInRlbXBsYXRlIiwiQWN0b3JGVCIsIkFjdG9yQ1AiLCJBY3RvclNUUCIsIkZ1dHVyZSIsInJlcGxhY2UiLCJhIiwicCIsImMiLCJmIiwiY2FzZU9mIiwiZW5kIiwiZ2V0IiwicHV0IiwiY29uY2F0IiwibyIsImFjY3VtIiwicmVkdWNlIiwiYWNjZXB0IiwibSIsInNlbGVjdCIsImhpdCIsImNoaWxkIiwic3RhcnRzV2l0aCIsIm5leHRUaWNrIiwicHJvY2VzcyIsInNldFRpbWVvdXQiLCJpbyIsInMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQWFnQkEscUIsR0FBQUEscUI7O0FBYmhCOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBOzs7QUFHTyxTQUFTQSxxQkFBVCxDQUErQkMsSUFBL0IsRUFBcUNDLEVBQXJDLEVBQXlDOztBQUU1QyxTQUFLQyxPQUFMLGFBQXNCRCxFQUF0QixxQkFBc0NELElBQXRDO0FBQ0EsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0UsS0FB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SjtBQUFBLFdBQ2hCLGdCQUFLckIsRUFBRWQsSUFBRixDQUFPLEVBQUVKLEtBQUssSUFBUCxFQUFQLENBQUwsRUFBNEJrQixFQUFFckIsSUFBRixDQUFPLFVBQUMwQyxFQUFELEVBQUtuQixDQUFMO0FBQUEsZUFBV2IsS0FBS2EsQ0FBTCxFQUFRbUIsRUFBUixDQUFYO0FBQUEsS0FBUCxFQUErQkEsRUFBL0IsQ0FBNUIsRUFBZ0VyQixFQUFFbEIsR0FBbEUsQ0FEZ0I7QUFBQSxDQUFiOztBQUdQOzs7OztBQUtPLElBQU1ULHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxXQUFLLGtCQUFNaUQsQ0FBTixFQUNyQmxCLE1BRHFCLENBQ2R2QixNQURjLEVBQ047QUFBQSxlQUFLUSxLQUFLaUMsQ0FBTCxFQUFRLFVBQUdoQyxFQUFILENBQU1nQyxDQUFOLENBQVIsRUFBa0JuQyxLQUFsQixDQUF3QjtBQUFBLG1CQUFLK0IsU0FBUztBQUFBLHVCQUFNN0MsTUFBTWlELENBQU4sQ0FBTjtBQUFBLGFBQVQsQ0FBTDtBQUFBLFNBQXhCLENBQUw7QUFBQSxLQURNLEVBRXJCakIsR0FGcUIsRUFBTDtBQUFBLENBQWQiLCJmaWxlIjoiQWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgdHlwZSwgZm9yY2UsIGNhbGwsIGtpbmQsIG9yIH0gZnJvbSAnLi9iZSc7XG5pbXBvcnQgeyBUeXBlIH0gZnJvbSAnLi9UeXBlJztcbmltcG9ydCB7IElPLCBGcmVlIH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBwYXJ0aWFsIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnLi9PcHMnO1xuaW1wb3J0IHsgTVZhciB9IGZyb20gJy4vTVZhcic7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJy4vRXhlYyc7XG5cbi8qKlxuICogRHVwbGljYXRlQWN0b3JJZEVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEdXBsaWNhdGVBY3RvcklkRXJyb3IocGF0aCwgaWQpIHtcblxuICAgIHRoaXMubWVzc2FnZSA9IGBJZCAnJHtpZH0nIGF0IHBhdGggJyR7cGF0aH0nIGlzIGluIHVzZSFgO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuRHVwbGljYXRlQWN0b3JJZEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkR1cGxpY2F0ZUFjdG9ySWRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEdXBsaWNhdGVBY3RvcklkRXJyb3I7XG5cbmV4cG9ydCBkZWZhdWx0IER1cGxpY2F0ZUFjdG9ySWRFcnJvclxuXG4vKipcbiAqIEFjdG9yVCBpcyBhIHRlbXBsYXRlIGZvciBjcmVhdGluZyBhY3RvcnMgdGhhdCBydW4gaW5cbiAqIHRoZSBzYW1lIGV2ZW50IGxvb3AgYXMgdGhlIHN5c3RlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCAtIG11c3QgYmUgdW5pcXVlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzdGFydCAtIEFjdG9yIOKGkiAgQWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yVCBleHRlbmRzIFR5cGUge31cblxuLyoqXG4gKiBMb2NhbFQgaXMgYSB0ZW1wbGF0ZSBmb3IgY3JlYXRpbmcgYSBsb2NhbCBhY3RvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzdGFydFxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxUIGV4dGVuZHMgQWN0b3JUIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHN0YXJ0OiBvcih0eXBlKEZ1bmN0aW9uKSwgZm9yY2UoKCkgPT4ge30pKVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRnV0dXJlVCBpcyB0aGUgdGVtcGxhdGUgZm9yIHNwYXduaW5nIGZ1dHVyZSBhY3RvcnMuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHtGdXR1cmV9IGZ1dHVyZVxuICovXG5leHBvcnQgY2xhc3MgRnV0dXJlVCBleHRlbmRzIEFjdG9yVCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBpZDogY2FsbCgoKSA9PiBgZnV0dXJlLSR7djQoKX1gKSxcbiAgICAgICAgICAgIG12YXI6IHR5cGUoTVZhcilcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvclxuICovXG5leHBvcnQgY2xhc3MgQWN0b3IgZXh0ZW5kcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjaGVja3MpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgY2hlY2tzKTtcblxuICAgICAgICB0aGlzLmZvbGQgPSBwYXJ0aWFsKGZvbGQsIHRoaXMpO1xuICAgICAgICB0aGlzLm1hcCA9IHBhcnRpYWwobWFwLCB0aGlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN5c3RlbVxuICogQHByb3BlcnR5IHtBcnJheTxPcD59IG9wc1xuICovXG5leHBvcnQgY2xhc3MgU3lzdGVtIGV4dGVuZHMgQWN0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgcGF0aDogZm9yY2UoJycpLFxuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEZyZWUpLCBmb3JjZShudWxsKSksXG4gICAgICAgICAgICBhY3RvcnM6IG9yKHR5cGUoQXJyYXkpLCBmb3JjZShbXSkpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNwYXduID0gdCA9PiB0aGlzLmNvcHkoeyBvcHM6IHRoaXMub3BzID8gdGhpcy5vcHMuY2hhaW4oKCkgPT4gc3Bhd24odCkpIDogc3Bhd24odCkgfSk7XG4gICAgICAgIHRoaXMudGljayA9ICgpID0+IHRpY2sodGhpcywgSU8ub2YodGhpcy5jb3B5KHsgb3BzOiBudWxsIH0pKSk7XG4gICAgICAgIHRoaXMuc3RhcnQgPSAoKSA9PiBzdGFydCh0aGlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFjdG9yTFxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JMIGV4dGVuZHMgQWN0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBpZDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgcGFyZW50OiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKG51bGwpKSxcbiAgICAgICAgICAgIG1haWxib3g6IG9yKHR5cGUoQXJyYXkpLCBmb3JjZShbXSkpLFxuICAgICAgICAgICAgYWN0b3JzOiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0eXBlKEFjdG9yVClcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFjdG9yRlQgY29udGFpbnMgYSBGdXR1cmUsIGEgY29tcHV0YXRpb24gdGhhdCB3ZSBleHBlY3QgdG8gYmUgY29tcGxldGUgc29tZXRpbWVcbiAqIGxhdGVyLlxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JGVCBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgbXZhcjogdHlwZShNVmFyKSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0eXBlKEFjdG9yVClcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvckNQIHRyZWF0cyBhIGNoaWxkIHByb2Nlc3MgbGlrZSBhbiBhY3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yQ1AgZXh0ZW5kcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7fSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvclNUUCBpcyBhIHN0b3BwZWQgQWN0b3IgcmVhZHkgZm9yIHJlbW92YWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvclNUUCBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgcGF0aDogdHlwZShTdHJpbmcpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRnV0dXJlIHJlcHJlc2VudHMgc29tZSBjb21wdXRhdGlvbiB3ZSBhcmUgaW50ZXJlc3RlZCBpbiBnZXR0aW5nIHRoZSByZXN1bHQgb2ZcbiAqaGF0IG1heSBub3QgY29tcGxldGUgbm93IG9yIHJ1biBhc3luY2hyb25vdXNseS4gVGhpcyBjbGFzcyBzZXJ2ZXNcbiAqIGFzIGFuIGludGVyZmFjZSBmb3IgdHlwZSBjaGVja2luZy5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEZ1dHVyZSB7XG5cbiAgICAvKipcbiAgICAgKiBmb3JrIHRoZSBGdXR1cmVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblJlamVjdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uUmVzb2x2ZVxuICAgICAqL1xuICAgIGZvcmsoKSB7fVxuXG59XG5cbi8qKlxuICogcmVwbGFjZSBhbiBhY3RvciB3aXRoIGEgbmV3IHZlcnNpb24uXG4gKiBSZXR1cm5zIHRoZSBwYXJlbnQgYWN0b3IgKHNlY29uZCBhcmcpIHVwZGF0ZWQgd2l0aCB0aGUgbmV3IGFjdG9yLlxuICogSWYgdGhlIHBhcmVudCBwYXRoIGlzIHRoZSBzYW1lIHBhdGggYXMgdGhlIGFjdG9yIHRvIHJlcGxhY2UsIGl0IGlzXG4gKiByZXBsYWNlZCBpbnN0ZWFkLlxuICogTm8gY2hhbmdlIGlzIG1hZGUgaWYgdGhlIGFjdG9yIGlzIG5vdCBmb3VuZC5cbiAqIEBzdW1tYXJ5IChBY3RvciwgQWN0b3IpIOKGkiAgQWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSAoYSwgcCkgPT5cbiAgICBwLnBhdGggPT09IGEucGF0aCA/XG4gICAgYSA6IHAubWFwKGMgPT4gYy5wYXRoID09PSBhLnBhdGggPyBhIDogYy5tYXAocGFydGlhbChyZXBsYWNlLCBhKSkpO1xuXG4vKipcbiAqIG1hcCBvdmVyIGFuIEFjdG9yIHRyZWF0aW5nIGl0IGxpa2UgYSBGdW5jdG9yXG4gKiBAc3VtbWFyeSB7KEFjdG9yLEZ1bmN0aW9uKSDihpIgIEFjdG9yfVxuICovXG5leHBvcnQgY29uc3QgbWFwID0gKGEsIGYpID0+IG1hdGNoKGEpXG4gICAgLmNhc2VPZihBY3RvckZULCBhID0+IGEpXG4gICAgLmNhc2VPZihBY3RvciwgYSA9PiBhLmNvcHkoeyBhY3RvcnM6IGEuYWN0b3JzLm1hcChmKSB9KSlcbiAgICAuZW5kKCk7XG5cbi8qKlxuICogZ2V0IGEgY2hpbGQgYWN0b3IgZnJvbSBpdHMgcGFyZW50IHVzaW5nIGl0cyBpZFxuICogQHN1bW1hcnkgKHN0cmluZyxBY3Rvcikg4oaSICBBY3RvcnxudWxsXG4gKi9cbmV4cG9ydCBjb25zdCBnZXQgPSAoaWQsIGEpID0+IGEuZm9sZCgocCwgYykgPT4gcCA/IHAgOiBjLmlkID09PSBpZCA/IGMgOiBudWxsKTtcblxuLyoqXG4gKiBwdXQgYW4gYWN0b3IgaW50byBhbm90aGVyIG1ha2luZyBpdCBhIGNoaWxkXG4gKiBSZXR1cm5zIHRoZSBwYXJlbnQgKGNoaWxkLHBhcmVudCkg4oaSICBwYXJlbnRcbiAqIEBzdW1tYXJ5IChBY3RvciwgQWN0b3IpIOKGkiAgQWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IHB1dCA9IChhLCBwKSA9PiBwLmNvcHkoeyBhY3RvcnM6IHAuYWN0b3JzLmNvbmNhdChhKSB9KTtcblxuLyoqXG4gKiBmb2xkIGEgZGF0YSBzdHJ1Y3R1cmUgaW50byBhbiBhY3VtdWxhdGVkIHNpbXBsZXIgb25lXG4gKiBAc3VtbWFyeSBmb2xkIDo6IChBY3RvciwgKuKGkiAqLCAqKSDihpIgICpcbiAqL1xuZXhwb3J0IGNvbnN0IGZvbGQgPSAobywgZiwgYWNjdW0pID0+IG1hdGNoKG8pXG4gICAgLmNhc2VPZihBY3RvckZULCAoKSA9PiBhY2N1bSlcbiAgICAuY2FzZU9mKEFjdG9yLCBhID0+IGEuYWN0b3JzLnJlZHVjZShmLCBhY2N1bSkpXG4gICAgLmVuZCgpXG5cbi8qKlxuICogYWNjZXB0IGFsbG93cyBhbiBBY3RvciB0byBhY2NlcHQgdGhlIGxhdGVzdCBtZXNzYWdlIGFkZHJlc3NlZCB0byBpdC5cbiAqIEBwYXJhbSB7Kn0gbVxuICogQHN1bW1hcnkgeyosQWN0b3IpIOKGkiAgQWN0b3J8SU88QWN0b3I+fERyb3B9XG4gKi9cbmV4cG9ydCBjb25zdCBhY2NlcHQgPSAobSwgYSkgPT4gbWF0Y2goYSlcbiAgICAuY2FzZU9mKEFjdG9yTCwgYSA9PiBhLmNvcHkoeyBtYWlsYm94OiBhLm1haWxib3guY29uY2F0KG0pIH0pKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBzZWxlY3QgYW4gYWN0b3IgaW4gdGhlIHN5c3RlbSB1c2luZyB0aGUgc3BlY2lmaWVkIHBhdGguXG4gKiBAc3VtbWFyeSAoc3RyaW5nLCBBY3Rvcikg4oaSICBBY3RvcnxudWxsXG4gKi9cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSAocCwgYSkgPT4gZm9sZChhLCAoaGl0LCBjaGlsZCkgPT5cbiAgICAoaGl0ID9cbiAgICAgICAgaGl0IDpcbiAgICAgICAgcCA9PT0gY2hpbGQucGF0aCA/XG4gICAgICAgIGNoaWxkIDpcbiAgICAgICAgcC5zdGFydHNXaXRoKGNoaWxkLnBhdGgpID9cbiAgICAgICAgc2VsZWN0KHAsIGNoaWxkKSA6IG51bGwpLCBudWxsKTtcblxuZXhwb3J0IGNvbnN0IG5leHRUaWNrID0gZiA9PlxuICAgIG5ldyBJTygoKSA9PiAocHJvY2VzcykgPyBwcm9jZXNzLm5leHRUaWNrKGYpIDogc2V0VGltZW91dChmLCAwKSlcbiAgICAuY2hhaW4oKCkgPT4gSU8ub2YobnVsbCkpO1xuXG4vKipcbiAqIHRpY2tcbiAqIEBzdW1tYXJ5IHRpY2sgOjogKEFjdG9yLCBJTzxTeXN0ZW0+KSDihpIgIElPPFN5c3RlbT5cbiAqL1xuZXhwb3J0IGNvbnN0IHRpY2sgPSAoYSwgaW8pID0+XG4gICAgZXhlYyhhLmNvcHkoeyBvcHM6IG51bGwgfSksIGEuZm9sZCgoaW8sIGMpID0+IHRpY2soYywgaW8pLCBpbyksIGEub3BzKTtcblxuLyoqXG4gKiBzdGFydCB0aGUgc3lzdGVtLlxuICogTm90ZTogc3RhcnQgZG9lcyBub3QgYWN0dWFsbCBzdGFydCB0aGUgc3lzdGVtIGJ1dCByZXR1cm5zIGFuIElPIGNsYXNzLlxuICogQHN1bW1hcnkgc3RhcnQgOjogU3lzdGVtIOKGkiAgSU88bnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHN0YXJ0ID0gcyA9PiBtYXRjaChzKVxuICAgIC5jYXNlT2YoU3lzdGVtLCBzID0+IHRpY2socywgSU8ub2YocykpLmNoYWluKHMgPT4gbmV4dFRpY2soKCkgPT4gc3RhcnQocykpKSlcbiAgICAuZW5kKCk7XG4iXX0=