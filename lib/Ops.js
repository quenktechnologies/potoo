'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = exports.stop = exports.output = exports.input = exports.future = exports.receive = exports.update = exports.replace = exports.accept = exports.select = exports.tell = exports.create = exports.raise = exports.put = exports.get = exports.self = exports.make = exports.spawn = exports.system = exports.sspawn = exports.map = exports.NOOP = exports.IOOP = exports.Input = exports.Output = exports.Update = exports.Replace = exports.Stop = exports.Send = exports.Accept = exports.Select = exports.Put = exports.Raise = exports.Get = exports.Self = exports.System = exports.Getter = exports.Op = undefined;

var _uuid = require('uuid');

var _util = require('./util');

var _be = require('./be');

var _monad = require('./monad');

var _Type2 = require('./Type');

var _Match = require('./Match');

var _MVar = require('./MVar');

var _Actor = require('./Actor');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var next = function next(x) {
    return x;
};

/**
 * @module Ops
 *
 * Provides classes that represent instructions the system must carry out
 * and constructor functions.
 */

/**
 * Op is the base class of all instruction classes.
 * @abstract
 */

var Op = exports.Op = function (_Type) {
    _inherits(Op, _Type);

    function Op(props, checks) {
        _classCallCheck(this, Op);

        var _this = _possibleConstructorReturn(this, (Op.__proto__ || Object.getPrototypeOf(Op)).call(this, props, (0, _util.merge)({ next: _be.any }, checks)));

        _this.map = map(_this);

        return _this;
    }

    return Op;
}(_Type2.Type);

/**
 * Getter
 */


var Getter = exports.Getter = function (_Op) {
    _inherits(Getter, _Op);

    function Getter() {
        _classCallCheck(this, Getter);

        return _possibleConstructorReturn(this, (Getter.__proto__ || Object.getPrototypeOf(Getter)).apply(this, arguments));
    }

    return Getter;
}(Op);

/**
 * System
 */


var System = exports.System = function (_Getter) {
    _inherits(System, _Getter);

    function System() {
        _classCallCheck(this, System);

        return _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).apply(this, arguments));
    }

    return System;
}(Getter);

/**
 * Self
 */


var Self = exports.Self = function (_Getter2) {
    _inherits(Self, _Getter2);

    function Self() {
        _classCallCheck(this, Self);

        return _possibleConstructorReturn(this, (Self.__proto__ || Object.getPrototypeOf(Self)).apply(this, arguments));
    }

    return Self;
}(Getter);

/**
 * Get
 */


var Get = exports.Get = function (_Getter3) {
    _inherits(Get, _Getter3);

    function Get(props) {
        _classCallCheck(this, Get);

        return _possibleConstructorReturn(this, (Get.__proto__ || Object.getPrototypeOf(Get)).call(this, props, { id: (0, _be.type)(String) }));
    }

    return Get;
}(Getter);

/**
 * Raise
 */


var Raise = exports.Raise = function (_Op2) {
    _inherits(Raise, _Op2);

    function Raise(props) {
        _classCallCheck(this, Raise);

        return _possibleConstructorReturn(this, (Raise.__proto__ || Object.getPrototypeOf(Raise)).call(this, props, { error: (0, _be.type)(Error) }));
    }

    return Raise;
}(Op);

/**
 * Put
 */


var Put = exports.Put = function (_Op3) {
    _inherits(Put, _Op3);

    function Put(props) {
        _classCallCheck(this, Put);

        return _possibleConstructorReturn(this, (Put.__proto__ || Object.getPrototypeOf(Put)).call(this, props, { actor: (0, _be.type)(_Actor.Actor) }));
    }

    return Put;
}(Op);

/**
 * Select
 */


var Select = exports.Select = function (_Getter4) {
    _inherits(Select, _Getter4);

    function Select(props) {
        _classCallCheck(this, Select);

        return _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props, { path: (0, _be.type)(String) }));
    }

    return Select;
}(Getter);

/**
 * Accept
 */


var Accept = exports.Accept = function (_Op4) {
    _inherits(Accept, _Op4);

    function Accept(props) {
        _classCallCheck(this, Accept);

        return _possibleConstructorReturn(this, (Accept.__proto__ || Object.getPrototypeOf(Accept)).call(this, props, { message: _be.any, actor: (0, _be.type)(_Actor.Actor) }));
    }

    return Accept;
}(Op);

/**
 * Send a message to an actor.
 * @property {to} string
 * @property {*} message
 */


var Send = exports.Send = function (_Op5) {
    _inherits(Send, _Op5);

    function Send(props) {
        _classCallCheck(this, Send);

        return _possibleConstructorReturn(this, (Send.__proto__ || Object.getPrototypeOf(Send)).call(this, props, {
            id: (0, _be.or)((0, _be.type)(String), (0, _be.call)(_uuid.v4)),
            to: (0, _be.type)(String),
            message: _be.any
        }));
    }

    return Send;
}(Op);

/**
 * Stop the system or an actor.
 * @property {string}
 */


var Stop = exports.Stop = function (_Op6) {
    _inherits(Stop, _Op6);

    function Stop(props) {
        _classCallCheck(this, Stop);

        return _possibleConstructorReturn(this, (Stop.__proto__ || Object.getPrototypeOf(Stop)).call(this, props, {

            path: (0, _be.type)(String),
            next: _be.any

        }));
    }

    return Stop;
}(Op);

/**
 * Replace
 * @private
 */


var Replace = exports.Replace = function (_Op7) {
    _inherits(Replace, _Op7);

    function Replace(props) {
        _classCallCheck(this, Replace);

        return _possibleConstructorReturn(this, (Replace.__proto__ || Object.getPrototypeOf(Replace)).call(this, props, {

            actor: (0, _be.type)(_Actor.Actor)

        }));
    }

    return Replace;
}(Op);

/**
 * Update
 */


var Update = exports.Update = function (_Op8) {
    _inherits(Update, _Op8);

    function Update(props) {
        _classCallCheck(this, Update);

        return _possibleConstructorReturn(this, (Update.__proto__ || Object.getPrototypeOf(Update)).call(this, props, { actor: (0, _be.type)(_Actor.Actor) }));
    }

    return Update;
}(Op);

/**
 * Output
 */


var Output = exports.Output = function (_Op9) {
    _inherits(Output, _Op9);

    function Output(props) {
        _classCallCheck(this, Output);

        return _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).call(this, props, { iof: (0, _be.type)(Function) }));
    }

    return Output;
}(Op);

/**
 * Input
 */


var Input = exports.Input = function (_Getter5) {
    _inherits(Input, _Getter5);

    function Input(props) {
        _classCallCheck(this, Input);

        return _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props, { iof: (0, _be.type)(Function) }));
    }

    return Input;
}(Getter);

/**
 * IOOP
 * @property {function} io
 */


var IOOP = exports.IOOP = function (_Op10) {
    _inherits(IOOP, _Op10);

    function IOOP(props) {
        _classCallCheck(this, IOOP);

        return _possibleConstructorReturn(this, (IOOP.__proto__ || Object.getPrototypeOf(IOOP)).call(this, props, { f: (0, _be.type)(Function) }));
    }

    return IOOP;
}(Op);

/**
 * NOOP
 * @private
 */


var NOOP = exports.NOOP = function (_Op11) {
    _inherits(NOOP, _Op11);

    function NOOP() {
        _classCallCheck(this, NOOP);

        return _possibleConstructorReturn(this, (NOOP.__proto__ || Object.getPrototypeOf(NOOP)).apply(this, arguments));
    }

    return NOOP;
}(Op);

/**
 * map over an Op
 * @summary {Op<A> →  (A→ B) Op<B>}
 */


var map = exports.map = function map(op) {
    return function (f) {
        return (0, _Match.match)(op).caseOf(System, function (_ref) {
            var next = _ref.next;
            return new System({ next: (0, _util.compose)(f, next) });
        }).caseOf(Self, function (_ref2) {
            var next = _ref2.next;
            return new Self({ next: (0, _util.compose)(f, next) });
        }).caseOf(Get, function (_ref3) {
            var id = _ref3.id,
                next = _ref3.next;
            return new Get({ id: id, next: (0, _util.compose)(f, next) });
        }).caseOf(Raise, next).caseOf(Put, function (_ref4) {
            var actor = _ref4.actor,
                next = _ref4.next;
            return new Put({ actor: actor, next: (0, _util.compose)(f, next) });
        }).caseOf(Select, function (_ref5) {
            var path = _ref5.path,
                next = _ref5.next;
            return new Select({ path: path, next: (0, _util.compose)(f, next) });
        }).caseOf(Accept, function (_ref6) {
            var message = _ref6.message,
                actor = _ref6.actor,
                next = _ref6.next;
            return new Accept({ message: message, actor: actor, next: (0, _util.compose)(f, next) });
        }).caseOf(Replace, function (_ref7) {
            var actor = _ref7.actor,
                next = _ref7.next;
            return new Replace({ actor: actor, next: f(next) });
        }).caseOf(Update, function (_ref8) {
            var actor = _ref8.actor,
                next = _ref8.next;
            return new Update({ actor: actor, next: f(next) });
        }).caseOf(Output, function (_ref9) {
            var iof = _ref9.iof,
                next = _ref9.next;
            return new Output({ iof: iof, next: f(next) });
        }).caseOf(Input, function (_ref10) {
            var iof = _ref10.iof,
                next = _ref10.next;
            return new Input({ iof: iof, next: (0, _util.compose)(f, next) });
        }).end();
    };
};

/**
 * sspawn a child actor on the System
 * @summary sspawn :: ActorT →  Free<F,V>
 */
var sspawn = exports.sspawn = function sspawn(t) {
    return system().chain(function (s) {
        return make(s, t, replace);
    });
};

/**
 * system provides the system
 * @summary system :: () →  Free<System,null>
 */
var system = exports.system = function system() {
    return (0, _monad.liftF)(new System({ next: next }));
};

/**
 * spawn creates a new spawn request
 * @param {ActorT} template
 * @return {Free}
 * @summary {ActorT →  Free<Raise|Update, null>}
 */
var spawn = exports.spawn = function spawn(t) {
    return self().chain(function (a) {
        return make(a, t, update);
    });
};

/**
 * make a child actor
 * @summary sspawn :: (Actor, ActorT, Actor →  Free<F,V>) →  Free<F,V>
 */
var make = exports.make = function make(parent, template, after) {
    return _monad.Maybe.not((0, _Actor.get)(template.id, parent)).map(function () {
        return raise(new _Actor.DuplicateActorIdError(parent.path, template.id));
    }).orJust(create(parent.path, template).chain(after)).extract();
};

/**
 * self gets the actor for the current context.
 * @summary {self :: null →  Free<F, ActorL>
 */
var self = exports.self = function self() {
    return (0, _monad.liftF)(new Self({ next: next }));
};

/**
 * get returns a child actor based on id if it exists
 * @summary {(string) →  Free<Get, Actor|null>
 */
var get = exports.get = function get(id) {
    return (0, _monad.liftF)(new Get({ id: id, next: next }));
};

/**
 * put a new child actor into the list of children
 * @summary Actor →  Free<F,null>
 */
var put = exports.put = function put(actor) {
    return (0, _monad.liftF)(new Put({ actor: actor, next: next }));
};

/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 * @summary raise :: Error →  Free<null,Error>
 */
var raise = exports.raise = function raise(error) {
    return (0, _monad.liftF)(new Raise({ error: error }));
};

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, ActorT)  →  Free<Op,Actor>
 */
var create = exports.create = function create(parent, template) {
    return (0, _Match.match)(template).caseOf(_Actor.LocalT, function (_ref11) {
        var id = _ref11.id,
            start = _ref11.start;
        return put(new _Actor.ActorL({
            id: id,
            parent: parent,
            path: _address(parent, id),
            ops: start(),
            template: template
        }));
    }).caseOf(_Actor.FutureT, function (_ref12) {
        var id = _ref12.id,
            mvar = _ref12.mvar;
        return put(new _Actor.ActorFT({
            id: id,
            parent: parent,
            path: _address(parent, id),
            ops: receive(next),
            mvar: mvar,
            template: template
        }));
    }).end();
};

var _address = function _address(parent, id) {
    return parent === '' || parent === '/' ? id : parent + '/' + id;
};

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
var tell = exports.tell = function tell(to, message) {
    return self().chain(function (a) {
        return select(to).chain((0, _util.partial)(accept, message)).chain(a.path === to ? update : replace);
    });
};

/**
 * select an actor based on an address
 * @summary select :: string →  Free<F,Actor>
 */
var select = exports.select = function select(path) {
    return (0, _monad.liftF)(new Select({ path: path, next: next }));
};

/**
 * accept a message
 * @summary accept :: (*, Actor) →  Free<F,Actor>
 */
var accept = exports.accept = function accept(message, actor) {
    return (0, _monad.liftF)(new Accept({ message: message, actor: actor, next: next }));
};

/**
 * replace an actor with the latest version
 * @summary replace :: Actor →  Free<F,null>
 */
var replace = exports.replace = function replace(actor) {
    return (0, _monad.liftF)(new Replace({ actor: actor }));
};

/**
 * update the current actor to the latest version
 * @summary update :: Actor →  Free<F,null>
 */
var update = exports.update = function update(actor) {
    return (0, _monad.liftF)(new Update({ actor: actor }));
};

/**
 * receive the next message with the specified behaviour
 * @summary receive :: (* →  Free<F,*>) →  Free<null,null>
 */
var receive = exports.receive = function receive(behaviour) {
    return self().chain(function (a) {
        return (0, _Match.match)(a).caseOf(_Actor.ActorFT, function (_ref13) {
            var mvar = _ref13.mvar;
            return input(function () {
                return mvar.take();
            }).chain(function (v) {
                return v !== null ? behaviour(v) : update(a.copy({ ops: receive(behaviour) }));
            });
        }).caseOf(_Actor.ActorL, function (a) {
            return update(a.copy({
                ops: _monad.Maybe.not(a.mailbox[0]).map(behaviour).orElse(function () {
                    return receive(behaviour);
                }).extract()
            }));
        }).end();
    });
};

/**
 * future spawns a temporary child actor that listens waits
 * on the result of a user supplied Future.
 * @param {Future} ft
 * @return {Free<SpawnIO,null>}
 * @summary {  (null →  Future) →  Free<Spawn, null> }
 */
var future = exports.future = function future(f) {
    return self().chain(function (a) {
        return input(function () {
            return (0, _MVar.makeMVar)().chain(function (mvar) {
                return _monad.IO.of({
                    abort: f().fork(function (error) {
                        return mvar.put(raise(error));
                    }, function (m) {
                        return mvar.put(tell(a.path, m));
                    }),
                    mvar: mvar
                });
            });
        }).chain(function (_ref14) {
            var abort = _ref14.abort,
                mvar = _ref14.mvar;
            return spawn(new _Actor.FutureT({ mvar: mvar, abort: abort }));
        });
    });
};

/**
 * input is used for executing side effects and getting the result.
 * @summary input :: (null →  IO<*>)→  Free<Input, null>
 */
var input = exports.input = function input(iof) {
    return (0, _monad.liftF)(new Input({ iof: iof, next: next }));
};

/**
 * output is used for executing side effects when we don't care about the result
 * @summary output :: (* →  IO<null>) →  Free<Output, null>
 */
var output = exports.output = function output(iof) {
    return (0, _monad.liftF)(new Output({ iof: iof }));
};

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
var stop = exports.stop = function stop(path) {
    return (0, _monad.liftF)(new Stop({ path: path }));
};

var _noop = new NOOP();

/**
 * noop
 * @private
 */
var noop = exports.noop = function noop() {
    return _noop;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PcHMuanMiXSwibmFtZXMiOlsibmV4dCIsIngiLCJPcCIsInByb3BzIiwiY2hlY2tzIiwibWFwIiwiR2V0dGVyIiwiU3lzdGVtIiwiU2VsZiIsIkdldCIsImlkIiwiU3RyaW5nIiwiUmFpc2UiLCJlcnJvciIsIkVycm9yIiwiUHV0IiwiYWN0b3IiLCJTZWxlY3QiLCJwYXRoIiwiQWNjZXB0IiwibWVzc2FnZSIsIlNlbmQiLCJ0byIsIlN0b3AiLCJSZXBsYWNlIiwiVXBkYXRlIiwiT3V0cHV0IiwiaW9mIiwiRnVuY3Rpb24iLCJJbnB1dCIsIklPT1AiLCJmIiwiTk9PUCIsIm9wIiwiY2FzZU9mIiwiZW5kIiwic3NwYXduIiwic3lzdGVtIiwiY2hhaW4iLCJtYWtlIiwicyIsInQiLCJyZXBsYWNlIiwic3Bhd24iLCJzZWxmIiwiYSIsInVwZGF0ZSIsInBhcmVudCIsInRlbXBsYXRlIiwiYWZ0ZXIiLCJub3QiLCJyYWlzZSIsIm9ySnVzdCIsImNyZWF0ZSIsImV4dHJhY3QiLCJnZXQiLCJwdXQiLCJzdGFydCIsIl9hZGRyZXNzIiwib3BzIiwibXZhciIsInJlY2VpdmUiLCJ0ZWxsIiwic2VsZWN0IiwiYWNjZXB0IiwiaW5wdXQiLCJ0YWtlIiwidiIsImJlaGF2aW91ciIsImNvcHkiLCJtYWlsYm94Iiwib3JFbHNlIiwiZnV0dXJlIiwib2YiLCJhYm9ydCIsImZvcmsiLCJtIiwib3V0cHV0Iiwic3RvcCIsIl9ub29wIiwibm9vcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTztBQUFBLFdBQUtDLENBQUw7QUFBQSxDQUFiOztBQUVBOzs7Ozs7O0FBT0E7Ozs7O0lBSWFDLEUsV0FBQUEsRTs7O0FBRVQsZ0JBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUEsNEdBRWpCRCxLQUZpQixFQUVWLGlC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Yjs7QUFFUCxJQUFNNkQsUUFBUSxJQUFJL0MsSUFBSixFQUFkOztBQUVBOzs7O0FBSU8sSUFBTWdELHNCQUFPLFNBQVBBLElBQU87QUFBQSxXQUFNRCxLQUFOO0FBQUEsQ0FBYiIsImZpbGUiOiJPcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgbWVyZ2UsIHBhcnRpYWwsIGNvbXBvc2UgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgdHlwZSwgYW55LCBjYWxsLCBvciB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgbGlmdEYsIE1heWJlLCBJTyB9IGZyb20gJy4vbW9uYWQnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0IHsgbWFrZU1WYXIgfSBmcm9tICcuL01WYXInO1xuaW1wb3J0IHsgQWN0b3IsIExvY2FsVCwgRnV0dXJlVCwgQWN0b3JMLCBBY3RvckZULCBEdXBsaWNhdGVBY3RvcklkRXJyb3IsIGdldCBhcyBjaGlsZEdldCB9IGZyb20gJy4vQWN0b3InO1xuXG5jb25zdCBuZXh0ID0geCA9PiB4O1xuXG4vKipcbiAqIEBtb2R1bGUgT3BzXG4gKlxuICogUHJvdmlkZXMgY2xhc3NlcyB0aGF0IHJlcHJlc2VudCBpbnN0cnVjdGlvbnMgdGhlIHN5c3RlbSBtdXN0IGNhcnJ5IG91dFxuICogYW5kIGNvbnN0cnVjdG9yIGZ1bmN0aW9ucy5cbiAqL1xuXG4vKipcbiAqIE9wIGlzIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBpbnN0cnVjdGlvbiBjbGFzc2VzLlxuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBPcCBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNoZWNrcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCBtZXJnZSh7IG5leHQ6IGFueSB9LCBjaGVja3MpKTtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXAodGhpcyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBHZXR0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEdldHRlciBleHRlbmRzIE9wIHt9XG5cbi8qKlxuICogU3lzdGVtXG4gKi9cbmV4cG9ydCBjbGFzcyBTeXN0ZW0gZXh0ZW5kcyBHZXR0ZXIge31cblxuLyoqXG4gKiBTZWxmXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxmIGV4dGVuZHMgR2V0dGVyIHt9XG5cbi8qKlxuICogR2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBHZXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBpZDogdHlwZShTdHJpbmcpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogUmFpc2VcbiAqL1xuZXhwb3J0IGNsYXNzIFJhaXNlIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBlcnJvcjogdHlwZShFcnJvcikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBQdXRcbiAqL1xuZXhwb3J0IGNsYXNzIFB1dCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgYWN0b3I6IHR5cGUoQWN0b3IpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU2VsZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3QgZXh0ZW5kcyBHZXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBwYXRoOiB0eXBlKFN0cmluZykgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY2NlcHRcbiAqL1xuZXhwb3J0IGNsYXNzIEFjY2VwdCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgbWVzc2FnZTogYW55LCBhY3RvcjogdHlwZShBY3RvcikgfSk7XG5cbiAgICB9XG5cbn1cblxuXG5cbi8qKlxuICogU2VuZCBhIG1lc3NhZ2UgdG8gYW4gYWN0b3IuXG4gKiBAcHJvcGVydHkge3RvfSBzdHJpbmdcbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgU2VuZCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiBvcih0eXBlKFN0cmluZyksIGNhbGwodjQpKSxcbiAgICAgICAgICAgIHRvOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBtZXNzYWdlOiBhbnlcbiAgICAgICAgfSk7XG5cbiAgICB9XG59XG5cbi8qKlxuICogU3RvcCB0aGUgc3lzdGVtIG9yIGFuIGFjdG9yLlxuICogQHByb3BlcnR5IHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjbGFzcyBTdG9wIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBuZXh0OiBhbnlcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFJlcGxhY2VcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBsYWNlIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBhY3RvcjogdHlwZShBY3RvcilcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFVwZGF0ZVxuICovXG5leHBvcnQgY2xhc3MgVXBkYXRlIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBhY3RvcjogdHlwZShBY3RvcikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBPdXRwdXRcbiAqL1xuZXhwb3J0IGNsYXNzIE91dHB1dCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgaW9mOiB0eXBlKEZ1bmN0aW9uKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIElucHV0XG4gKi9cbmV4cG9ydCBjbGFzcyBJbnB1dCBleHRlbmRzIEdldHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGlvZjogdHlwZShGdW5jdGlvbikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBJT09QXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBpb1xuICovXG5leHBvcnQgY2xhc3MgSU9PUCBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgZjogdHlwZShGdW5jdGlvbikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBOT09QXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTk9PUCBleHRlbmRzIE9wIHt9XG5cbi8qKlxuICogbWFwIG92ZXIgYW4gT3BcbiAqIEBzdW1tYXJ5IHtPcDxBPiDihpIgIChB4oaSIEIpIE9wPEI+fVxuICovXG5leHBvcnQgY29uc3QgbWFwID0gb3AgPT4gZiA9PiBtYXRjaChvcClcbiAgICAuY2FzZU9mKFN5c3RlbSwgKHsgbmV4dCB9KSA9PiBuZXcgU3lzdGVtKHsgbmV4dDogY29tcG9zZShmLCBuZXh0KSB9KSlcbiAgICAuY2FzZU9mKFNlbGYsICh7IG5leHQgfSkgPT4gbmV3IFNlbGYoeyBuZXh0OiBjb21wb3NlKGYsIG5leHQpIH0pKVxuICAgIC5jYXNlT2YoR2V0LCAoeyBpZCwgbmV4dCB9KSA9PiBuZXcgR2V0KHsgaWQsIG5leHQ6IGNvbXBvc2UoZiwgbmV4dCkgfSkpXG4gICAgLmNhc2VPZihSYWlzZSwgbmV4dClcbiAgICAuY2FzZU9mKFB1dCwgKHsgYWN0b3IsIG5leHQgfSkgPT4gbmV3IFB1dCh7IGFjdG9yLCBuZXh0OiBjb21wb3NlKGYsIG5leHQpIH0pKVxuICAgIC5jYXNlT2YoU2VsZWN0LCAoeyBwYXRoLCBuZXh0IH0pID0+IG5ldyBTZWxlY3QoeyBwYXRoLCBuZXh0OiBjb21wb3NlKGYsIG5leHQpIH0pKVxuICAgIC5jYXNlT2YoQWNjZXB0LCAoeyBtZXNzYWdlLCBhY3RvciwgbmV4dCB9KSA9PiBuZXcgQWNjZXB0KHsgbWVzc2FnZSwgYWN0b3IsIG5leHQ6IGNvbXBvc2UoZiwgbmV4dCkgfSkpXG4gICAgLmNhc2VPZihSZXBsYWNlLCAoeyBhY3RvciwgbmV4dCB9KSA9PiBuZXcgUmVwbGFjZSh7IGFjdG9yLCBuZXh0OiBmKG5leHQpIH0pKVxuICAgIC5jYXNlT2YoVXBkYXRlLCAoeyBhY3RvciwgbmV4dCB9KSA9PiBuZXcgVXBkYXRlKHsgYWN0b3IsIG5leHQ6IGYobmV4dCkgfSkpXG4gICAgLmNhc2VPZihPdXRwdXQsICh7IGlvZiwgbmV4dCB9KSA9PiBuZXcgT3V0cHV0KHsgaW9mLCBuZXh0OiBmKG5leHQpIH0pKVxuICAgIC5jYXNlT2YoSW5wdXQsICh7IGlvZiwgbmV4dCB9KSA9PiBuZXcgSW5wdXQoeyBpb2YsIG5leHQ6IGNvbXBvc2UoZiwgbmV4dCkgfSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHNzcGF3biBhIGNoaWxkIGFjdG9yIG9uIHRoZSBTeXN0ZW1cbiAqIEBzdW1tYXJ5IHNzcGF3biA6OiBBY3RvclQg4oaSICBGcmVlPEYsVj5cbiAqL1xuZXhwb3J0IGNvbnN0IHNzcGF3biA9IHQgPT4gc3lzdGVtKCkuY2hhaW4ocyA9PiBtYWtlKHMsIHQsIHJlcGxhY2UpKTtcblxuLyoqXG4gKiBzeXN0ZW0gcHJvdmlkZXMgdGhlIHN5c3RlbVxuICogQHN1bW1hcnkgc3lzdGVtIDo6ICgpIOKGkiAgRnJlZTxTeXN0ZW0sbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHN5c3RlbSA9ICgpID0+IGxpZnRGKG5ldyBTeXN0ZW0oeyBuZXh0IH0pKTtcblxuLyoqXG4gKiBzcGF3biBjcmVhdGVzIGEgbmV3IHNwYXduIHJlcXVlc3RcbiAqIEBwYXJhbSB7QWN0b3JUfSB0ZW1wbGF0ZVxuICogQHJldHVybiB7RnJlZX1cbiAqIEBzdW1tYXJ5IHtBY3RvclQg4oaSICBGcmVlPFJhaXNlfFVwZGF0ZSwgbnVsbD59XG4gKi9cbmV4cG9ydCBjb25zdCBzcGF3biA9IHQgPT4gc2VsZigpLmNoYWluKGEgPT4gbWFrZShhLCB0LCB1cGRhdGUpKTtcblxuLyoqXG4gKiBtYWtlIGEgY2hpbGQgYWN0b3JcbiAqIEBzdW1tYXJ5IHNzcGF3biA6OiAoQWN0b3IsIEFjdG9yVCwgQWN0b3Ig4oaSICBGcmVlPEYsVj4pIOKGkiAgRnJlZTxGLFY+XG4gKi9cbmV4cG9ydCBjb25zdCBtYWtlID0gKHBhcmVudCwgdGVtcGxhdGUsIGFmdGVyKSA9PlxuICAgIE1heWJlXG4gICAgLm5vdChjaGlsZEdldCh0ZW1wbGF0ZS5pZCwgcGFyZW50KSlcbiAgICAubWFwKCgpID0+IHJhaXNlKG5ldyBEdXBsaWNhdGVBY3RvcklkRXJyb3IocGFyZW50LnBhdGgsIHRlbXBsYXRlLmlkKSkpXG4gICAgLm9ySnVzdChjcmVhdGUocGFyZW50LnBhdGgsIHRlbXBsYXRlKS5jaGFpbihhZnRlcikpXG4gICAgLmV4dHJhY3QoKTtcblxuLyoqXG4gKiBzZWxmIGdldHMgdGhlIGFjdG9yIGZvciB0aGUgY3VycmVudCBjb250ZXh0LlxuICogQHN1bW1hcnkge3NlbGYgOjogbnVsbCDihpIgIEZyZWU8RiwgQWN0b3JMPlxuICovXG5leHBvcnQgY29uc3Qgc2VsZiA9ICgpID0+IGxpZnRGKG5ldyBTZWxmKHsgbmV4dCB9KSk7XG5cbi8qKlxuICogZ2V0IHJldHVybnMgYSBjaGlsZCBhY3RvciBiYXNlZCBvbiBpZCBpZiBpdCBleGlzdHNcbiAqIEBzdW1tYXJ5IHsoc3RyaW5nKSDihpIgIEZyZWU8R2V0LCBBY3RvcnxudWxsPlxuICovXG5leHBvcnQgY29uc3QgZ2V0ID0gaWQgPT4gbGlmdEYobmV3IEdldCh7IGlkLCBuZXh0IH0pKTtcblxuLyoqXG4gKiBwdXQgYSBuZXcgY2hpbGQgYWN0b3IgaW50byB0aGUgbGlzdCBvZiBjaGlsZHJlblxuICogQHN1bW1hcnkgQWN0b3Ig4oaSICBGcmVlPEYsbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHB1dCA9IGFjdG9yID0+IGxpZnRGKG5ldyBQdXQoeyBhY3RvciwgbmV4dCB9KSk7XG5cbi8qKlxuICogcmFpc2UgYW4gZXJyb3Igd2l0aGluIHRoZSBzeXN0ZW0uXG4gKiBUaGlzIGZ1bmN0aW9uIGdpdmVzIHRoZSBzdXBlcnZpc29yIChpZiBhbnkpIGEgY2hhbmNlIHRvXG4gKiBpbnRlcmNlcHQgYW5kIHJlYWN0IHRvIHRoZSBlcnJvci4gSXQgYWxzbyB0ZXJtaW5hdGVzXG4gKiB0aGUgY3VycmVudCBjaGFpbiBvZiBpbnN0cnVjdGlvbnMuXG4gKiBAc3VtbWFyeSByYWlzZSA6OiBFcnJvciDihpIgIEZyZWU8bnVsbCxFcnJvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IHJhaXNlID0gZXJyb3IgPT4gbGlmdEYobmV3IFJhaXNlKHsgZXJyb3IgfSkpO1xuXG4vKipcbiAqIGNyZWF0ZSBhbiBhY3RvciwgdGhhdCdzIGl0IGRvZXMgbm90IGFkZCBpdCB0byB0aGUgc3lzdGVtIG9yXG4gKiBhbnl0aGluZyBlbHNlLlxuICogQHN1bW1hcnkgY3JlYXRlIDo6IChzdHJpbmcsIEFjdG9yVCkgIOKGkiAgRnJlZTxPcCxBY3Rvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IChwYXJlbnQsIHRlbXBsYXRlKSA9PiBtYXRjaCh0ZW1wbGF0ZSlcbiAgICAuY2FzZU9mKExvY2FsVCwgKHsgaWQsIHN0YXJ0IH0pID0+IHB1dChuZXcgQWN0b3JMKHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgcGF0aDogX2FkZHJlc3MocGFyZW50LCBpZCksXG4gICAgICAgIG9wczogc3RhcnQoKSxcbiAgICAgICAgdGVtcGxhdGVcbiAgICB9KSkpXG4gICAgLmNhc2VPZihGdXR1cmVULCAoeyBpZCwgbXZhciB9KSA9PiBwdXQobmV3IEFjdG9yRlQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBwYXRoOiBfYWRkcmVzcyhwYXJlbnQsIGlkKSxcbiAgICAgICAgb3BzOiByZWNlaXZlKG5leHQpLFxuICAgICAgICBtdmFyLFxuICAgICAgICB0ZW1wbGF0ZVxuICAgIH0pKSlcbiAgICAuZW5kKCk7XG5cbmNvbnN0IF9hZGRyZXNzID0gKHBhcmVudCwgaWQpID0+ICgocGFyZW50ID09PSAnJykgfHwgKHBhcmVudCA9PT0gJy8nKSkgPyBpZCA6IGAke3BhcmVudH0vJHtpZH1gO1xuXG4vKipcbiAqIHRlbGwgYW5vdGhlciBhY3RvciBhIG1lc3NhZ2VcbiAqIEBzdW1tYXJ5IHRlbGwgOjogKHN0cmluZywqKSDihpIgIEZyZWU8RiwgQWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCB0ZWxsID0gKHRvLCBtZXNzYWdlKSA9PlxuICAgIHNlbGYoKVxuICAgIC5jaGFpbihhID0+IHNlbGVjdCh0bylcbiAgICAgICAgLmNoYWluKHBhcnRpYWwoYWNjZXB0LCBtZXNzYWdlKSlcbiAgICAgICAgLmNoYWluKGEucGF0aCA9PT0gdG8gPyB1cGRhdGUgOiByZXBsYWNlKSk7XG5cbi8qKlxuICogc2VsZWN0IGFuIGFjdG9yIGJhc2VkIG9uIGFuIGFkZHJlc3NcbiAqIEBzdW1tYXJ5IHNlbGVjdCA6OiBzdHJpbmcg4oaSICBGcmVlPEYsQWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSBwYXRoID0+IGxpZnRGKG5ldyBTZWxlY3QoeyBwYXRoLCBuZXh0IH0pKTtcblxuLyoqXG4gKiBhY2NlcHQgYSBtZXNzYWdlXG4gKiBAc3VtbWFyeSBhY2NlcHQgOjogKCosIEFjdG9yKSDihpIgIEZyZWU8RixBY3Rvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IGFjY2VwdCA9IChtZXNzYWdlLCBhY3RvcikgPT4gbGlmdEYobmV3IEFjY2VwdCh7IG1lc3NhZ2UsIGFjdG9yLCBuZXh0IH0pKTtcblxuLyoqXG4gKiByZXBsYWNlIGFuIGFjdG9yIHdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uXG4gKiBAc3VtbWFyeSByZXBsYWNlIDo6IEFjdG9yIOKGkiAgRnJlZTxGLG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gYWN0b3IgPT4gbGlmdEYobmV3IFJlcGxhY2UoeyBhY3RvciB9KSk7XG5cbi8qKlxuICogdXBkYXRlIHRoZSBjdXJyZW50IGFjdG9yIHRvIHRoZSBsYXRlc3QgdmVyc2lvblxuICogQHN1bW1hcnkgdXBkYXRlIDo6IEFjdG9yIOKGkiAgRnJlZTxGLG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGUgPSBhY3RvciA9PiBsaWZ0RihuZXcgVXBkYXRlKHsgYWN0b3IgfSkpO1xuXG4vKipcbiAqIHJlY2VpdmUgdGhlIG5leHQgbWVzc2FnZSB3aXRoIHRoZSBzcGVjaWZpZWQgYmVoYXZpb3VyXG4gKiBAc3VtbWFyeSByZWNlaXZlIDo6ICgqIOKGkiAgRnJlZTxGLCo+KSDihpIgIEZyZWU8bnVsbCxudWxsPlxuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZSA9IGJlaGF2aW91ciA9PlxuICAgIHNlbGYoKVxuICAgIC5jaGFpbihhID0+IG1hdGNoKGEpXG4gICAgICAgIC5jYXNlT2YoQWN0b3JGVCwgKHsgbXZhciB9KSA9PlxuICAgICAgICAgICAgaW5wdXQoKCkgPT4gbXZhci50YWtlKCkpXG4gICAgICAgICAgICAuY2hhaW4odiA9PiB2ICE9PSBudWxsID8gYmVoYXZpb3VyKHYpIDogdXBkYXRlKGEuY29weSh7IG9wczogcmVjZWl2ZShiZWhhdmlvdXIpIH0pKSkpXG4gICAgICAgIC5jYXNlT2YoQWN0b3JMLCBhID0+IHVwZGF0ZShhLmNvcHkoe1xuICAgICAgICAgICAgb3BzOiBNYXliZVxuICAgICAgICAgICAgICAgIC5ub3QoYS5tYWlsYm94WzBdKVxuICAgICAgICAgICAgICAgIC5tYXAoYmVoYXZpb3VyKVxuICAgICAgICAgICAgICAgIC5vckVsc2UoKCkgPT4gcmVjZWl2ZShiZWhhdmlvdXIpKVxuICAgICAgICAgICAgICAgIC5leHRyYWN0KClcbiAgICAgICAgfSkpKS5lbmQoKSk7XG5cbi8qKlxuICogZnV0dXJlIHNwYXducyBhIHRlbXBvcmFyeSBjaGlsZCBhY3RvciB0aGF0IGxpc3RlbnMgd2FpdHNcbiAqIG9uIHRoZSByZXN1bHQgb2YgYSB1c2VyIHN1cHBsaWVkIEZ1dHVyZS5cbiAqIEBwYXJhbSB7RnV0dXJlfSBmdFxuICogQHJldHVybiB7RnJlZTxTcGF3bklPLG51bGw+fVxuICogQHN1bW1hcnkgeyAgKG51bGwg4oaSICBGdXR1cmUpIOKGkiAgRnJlZTxTcGF3biwgbnVsbD4gfVxuICovXG5leHBvcnQgY29uc3QgZnV0dXJlID0gZiA9PlxuICAgIHNlbGYoKVxuICAgIC5jaGFpbihhID0+XG4gICAgICAgIGlucHV0KCgpID0+XG4gICAgICAgICAgICBtYWtlTVZhcigpXG4gICAgICAgICAgICAuY2hhaW4obXZhciA9PiBJTy5vZih7XG4gICAgICAgICAgICAgICAgYWJvcnQ6IGYoKS5mb3JrKGVycm9yID0+IG12YXIucHV0KHJhaXNlKGVycm9yKSksIG0gPT4gbXZhci5wdXQodGVsbChhLnBhdGgsIG0pKSksXG4gICAgICAgICAgICAgICAgbXZhclxuICAgICAgICAgICAgfSkpKVxuICAgICAgICAuY2hhaW4oKHsgYWJvcnQsIG12YXIgfSkgPT4gc3Bhd24obmV3IEZ1dHVyZVQoeyBtdmFyLCBhYm9ydCB9KSkpKTtcblxuLyoqXG4gKiBpbnB1dCBpcyB1c2VkIGZvciBleGVjdXRpbmcgc2lkZSBlZmZlY3RzIGFuZCBnZXR0aW5nIHRoZSByZXN1bHQuXG4gKiBAc3VtbWFyeSBpbnB1dCA6OiAobnVsbCDihpIgIElPPCo+KeKGkiAgRnJlZTxJbnB1dCwgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGlucHV0ID0gaW9mID0+IGxpZnRGKG5ldyBJbnB1dCh7IGlvZiwgbmV4dCB9KSk7XG5cbi8qKlxuICogb3V0cHV0IGlzIHVzZWQgZm9yIGV4ZWN1dGluZyBzaWRlIGVmZmVjdHMgd2hlbiB3ZSBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN1bHRcbiAqIEBzdW1tYXJ5IG91dHB1dCA6OiAoKiDihpIgIElPPG51bGw+KSDihpIgIEZyZWU8T3V0cHV0LCBudWxsPlxuICovXG5leHBvcnQgY29uc3Qgb3V0cHV0ID0gaW9mID0+IGxpZnRGKG5ldyBPdXRwdXQoeyBpb2YgfSkpO1xuXG4vKipcbiAqIHN0b3AgY3JlYXRlcyBhIG5ldyBTdG9wIHJlcXVlc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICovXG5leHBvcnQgY29uc3Qgc3RvcCA9IHBhdGggPT4gbGlmdEYobmV3IFN0b3AoeyBwYXRoIH0pKTtcblxuY29uc3QgX25vb3AgPSBuZXcgTk9PUCgpO1xuXG4vKipcbiAqIG5vb3BcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBub29wID0gKCkgPT4gX25vb3A7XG4iXX0=