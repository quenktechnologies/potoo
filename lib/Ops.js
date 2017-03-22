'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = exports.make = exports.stop = exports.log = exports.raise = exports.output = exports.input = exports.dequeue = exports.receive = exports.put = exports.update = exports.replace = exports.accept = exports.select = exports.tell = exports.get = exports.system = exports.self = exports.spawn = exports.stream = exports.future = exports.map = exports.noop = exports.NOOP = exports.Log = exports.Input = exports.Output = exports.Update = exports.Replace = exports.Stop = exports.Send = exports.AcceptIO = exports.Accept = exports.Select = exports.Put = exports.Raise = exports.Get = exports.Self = exports.System = exports.Tell = exports.Stream = exports.Future = exports.Spawn = exports.Getter = exports.Op = undefined;

var _uuid = require('uuid');

var _util = require('./util');

var _be = require('./be');

var _monad = require('./monad');

var _Type2 = require('./Type');

var _Match = require('./Match');

var _paths = require('./paths');

var _Actor = require('./Actor');

var Actor = _interopRequireWildcard(_Actor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * Spawn
 * @property {Template} template
 */


var Spawn = exports.Spawn = function (_Op2) {
    _inherits(Spawn, _Op2);

    function Spawn(props) {
        _classCallCheck(this, Spawn);

        return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).call(this, props, { template: (0, _be.type)(Actor.Template) }));
    }

    return Spawn;
}(Op);

/**
 * Future
 */


var Future = exports.Future = function (_Op3) {
    _inherits(Future, _Op3);

    function Future(props) {
        _classCallCheck(this, Future);

        return _possibleConstructorReturn(this, (Future.__proto__ || Object.getPrototypeOf(Future)).call(this, props, { f: (0, _be.type)(Function), to: (0, _be.or)((0, _be.type)(String), (0, _be.force)(null)) }));
    }

    return Future;
}(Op);

/**
 * Stream
 */


var Stream = exports.Stream = function (_Op4) {
    _inherits(Stream, _Op4);

    function Stream(props) {
        _classCallCheck(this, Stream);

        return _possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this, props, { f: (0, _be.type)(Function) }));
    }

    return Stream;
}(Op);

/**
 * Tell
 */


var Tell = exports.Tell = function (_Op5) {
    _inherits(Tell, _Op5);

    function Tell(props) {
        _classCallCheck(this, Tell);

        return _possibleConstructorReturn(this, (Tell.__proto__ || Object.getPrototypeOf(Tell)).call(this, props, { to: (0, _be.type)(String), message: _be.any }));
    }

    return Tell;
}(Op);

/**
 * Receive
 */


var Receive = function (_Op6) {
    _inherits(Receive, _Op6);

    function Receive(props) {
        _classCallCheck(this, Receive);

        return _possibleConstructorReturn(this, (Receive.__proto__ || Object.getPrototypeOf(Receive)).call(this, props, { behaviour: (0, _be.type)(Function) }));
    }

    return Receive;
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


var Raise = exports.Raise = function (_Op7) {
    _inherits(Raise, _Op7);

    function Raise(props) {
        _classCallCheck(this, Raise);

        return _possibleConstructorReturn(this, (Raise.__proto__ || Object.getPrototypeOf(Raise)).call(this, props, { error: (0, _be.type)(Error) }));
    }

    return Raise;
}(Op);

/**
 * Put
 */


var Put = exports.Put = function (_Getter4) {
    _inherits(Put, _Getter4);

    function Put(props) {
        _classCallCheck(this, Put);

        return _possibleConstructorReturn(this, (Put.__proto__ || Object.getPrototypeOf(Put)).call(this, props, { actor: (0, _be.type)(Actor.Actor) }));
    }

    return Put;
}(Getter);

/**
 * Select
 */


var Select = exports.Select = function (_Getter5) {
    _inherits(Select, _Getter5);

    function Select(props) {
        _classCallCheck(this, Select);

        return _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props, { path: (0, _be.type)(String) }));
    }

    return Select;
}(Getter);

/**
 * Accept
 */


var Accept = exports.Accept = function (_Getter6) {
    _inherits(Accept, _Getter6);

    function Accept(props) {
        _classCallCheck(this, Accept);

        return _possibleConstructorReturn(this, (Accept.__proto__ || Object.getPrototypeOf(Accept)).call(this, props, { message: _be.any, actor: (0, _be.type)(Actor.Actor) }));
    }

    return Accept;
}(Getter);

var AcceptIO = exports.AcceptIO = function (_Getter7) {
    _inherits(AcceptIO, _Getter7);

    function AcceptIO(props) {
        _classCallCheck(this, AcceptIO);

        return _possibleConstructorReturn(this, (AcceptIO.__proto__ || Object.getPrototypeOf(AcceptIO)).call(this, props, { message: _be.any, actor: (0, _be.type)(Actor.ActorIO) }));
    }

    return AcceptIO;
}(Getter);

/**
 * Send a message to an actor.
 * @property {to} string
 * @property {*} message
 */


var Send = exports.Send = function (_Op8) {
    _inherits(Send, _Op8);

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


var Stop = exports.Stop = function (_Op9) {
    _inherits(Stop, _Op9);

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


var Replace = exports.Replace = function (_Op10) {
    _inherits(Replace, _Op10);

    function Replace(props) {
        _classCallCheck(this, Replace);

        return _possibleConstructorReturn(this, (Replace.__proto__ || Object.getPrototypeOf(Replace)).call(this, props, {

            actor: (0, _be.type)(Actor.Actor)

        }));
    }

    return Replace;
}(Op);

/**
 * Update
 */


var Update = exports.Update = function (_Op11) {
    _inherits(Update, _Op11);

    function Update(props) {
        _classCallCheck(this, Update);

        return _possibleConstructorReturn(this, (Update.__proto__ || Object.getPrototypeOf(Update)).call(this, props, { actor: (0, _be.type)(Actor.Actor) }));
    }

    return Update;
}(Op);

/**
 * Output
 */


var Output = exports.Output = function (_Op12) {
    _inherits(Output, _Op12);

    function Output(props) {
        _classCallCheck(this, Output);

        return _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).call(this, props, { f: (0, _be.type)(Function) }));
    }

    return Output;
}(Op);

/**
 * Input
 */


var Input = exports.Input = function (_Getter8) {
    _inherits(Input, _Getter8);

    function Input(props) {
        _classCallCheck(this, Input);

        return _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props, { f: (0, _be.type)(Function) }));
    }

    return Input;
}(Getter);

/**
 * Log
 * @property {Op} op
 * @property {Free<Op, null>} [next]
 */


var Log = exports.Log = function (_Getter9) {
    _inherits(Log, _Getter9);

    function Log(props) {
        _classCallCheck(this, Log);

        return _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, props, { op: (0, _be.type)(Op) }));
    }

    return Log;
}(Getter);

var NOOP = exports.NOOP = function (_Op13) {
    _inherits(NOOP, _Op13);

    function NOOP() {
        _classCallCheck(this, NOOP);

        return _possibleConstructorReturn(this, (NOOP.__proto__ || Object.getPrototypeOf(NOOP)).apply(this, arguments));
    }

    return NOOP;
}(Op);

var noop = exports.noop = function noop() {
    return (0, _monad.liftF)(new NOOP());
};

/**
 * map over an Op
 * @summary {Op<A> →  (A→ B) Op<B>}
 */
var map = exports.map = function map(op) {
    return function (f) {
        return (0, _Match.match)(op).caseOf(Getter, function (_ref) {
            var next = _ref.next;
            return op.copy({ next: (0, _util.compose)(f, next) });
        }).caseOf(Op, function (_ref2) {
            var next = _ref2.next;
            return op.copy({ next: f(next) });
        }).end();
    };
};

/**
 * future spawns a temporary child actor that listens waits
 * on the result of a user supplied Future.
 * @param {Future} ft
 * @return {Free<SpawnIO,null>}
 * @summary {  ((null →  Future),string) →  Free<O,*> }
 */
var future = exports.future = function future(f, to) {
    return log(new Future({ f: f, to: to })).chain(function () {
        return spawn(new Actor.FutureT({ f: f, to: to }));
    });
};

/**
 * stream a potentially infinite amount of messages to the actor.
 * @summary stream :: (((* →  IO) →  IO),string) →  Free<Put, N>
 */
var stream = exports.stream = function stream(f, to) {
    return log(new Stream({ f: f, to: to })).chain(function () {
        return spawn(new Actor.StreamT({ f: f, to: to, id: 'stream-' + (0, _uuid.v4)() }));
    });
};

/**
 * spawn creates a new spawn request
 * @param {Template} template
 * @return {Free}
 * @summary {Template →  Free<Raise|Update, null>}
 */
var spawn = exports.spawn = function spawn(template) {
    return log(new Spawn({ template: template })).chain(self).chain((0, _util.partial)(make, template));
};

/**
 * self gets the actor for the current context.
 * @summary {self :: null →  Free<F, ActorL>
 */
var self = exports.self = function self() {
    return (0, _monad.liftF)(new Self({ next: next }));
};

/**
 * system provides the system
 * @summary system :: () →  Free<System,null>
 */
var system = exports.system = function system() {
    return (0, _monad.liftF)(new System({ next: next }));
};

/**
 * get returns a child actor based on id if it exists
 * @summary {(string) →  Free<Get, Actor|null>
 */
var get = exports.get = function get(id) {
    return (0, _monad.liftF)(new Get({ id: id, next: next }));
};

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
var tell = exports.tell = function tell(to, message) {
    return log(new Tell({ to: to, message: message })).chain(self).chain(function (src) {
        return select(to).chain(function (dest) {
            return (0, _Match.match)(dest).caseOf(Actor.ActorIO, function (a) {
                return accept({ to: to, message: message }, a);
            }).caseOf(Actor.Actor, function (a) {
                return accept(message, a);
            }).end();
        }).chain(src.path === to || src.path == null ? update : replace);
    });
};

/**
 * select an actor based on an address
 * @summary select :: string →  Free<F,Actor>
 */
var select = exports.select = function select(path) {
    return path === _paths.paths.SELF ? self() : (0, _monad.liftF)(new Select({ path: path, next: next }));
};

/**
 * accept a message
 * @summary accept :: (*, Actor) →  Free<F,Actor>
 */
var accept = exports.accept = function accept(message, actor) {
    return (0, _Match.match)(actor).caseOf(Actor.ActorIO, function () {
        return (0, _monad.liftF)(new AcceptIO({ message: message, actor: actor, next: next }));
    }).caseOf(Actor.Actor, function () {
        return (0, _monad.liftF)(new Accept({ message: message, actor: actor, next: next }));
    }).end();
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
 * put a new child actor into the list of children
 * @summary Actor →  Free<F,null>
 */
var put = exports.put = function put(actor) {
    return (0, _monad.liftF)(new Put({ actor: actor, next: next }));
};

/**
 * receive the next message and handle it with the passed behaviour
 * @summary receive :: (* → Free<F,*>) →  Free<null, null>
 */
var receive = exports.receive = function receive(behaviour) {
    return log(new Receive({ behaviour: behaviour })).chain(function () {
        return _receive(behaviour);
    });
};

var _receive = function _receive(behaviour) {
    return self().chain((0, _util.partial)(dequeue, behaviour));
};

/**
 * dequeue a message from an actor's mailbox
 * @summary dequeue :: (b, a) →  Free<O,*>
 */
var dequeue = exports.dequeue = function dequeue(b, a) {
    return (0, _Match.match)(a).caseOf(Actor.ActorIO, function (_ref3) {
        var mvar = _ref3.mvar;
        return input(function () {
            return mvar.take().map(_monad.Maybe.not);
        }).chain(function (mayb) {
            return mayb.map(function (m) {
                return a.copy({ ops: b(m) });
            }).orJust(a.copy({ ops: _receive(b) })).map(update).extract();
        });
    }).caseOf(Actor.ActorL, function (a) {
        return _monad.Maybe.not(a.mailbox[0]).map(function (m) {
            return a.copy({ ops: b(m) });
        }).orJust(a.copy({ ops: _receive(b) })).map(update).extract();
    }).end();
};

/**
 * input is used for executing side effects and getting the result.
 * @summary input :: (null →  IO<*>)→  Free<Input, null>
 */
var input = exports.input = function input(f) {
    return log(new Input({ f: f, next: next })).chain(_monad.liftF);
};

/**
 * output is used for executing side effects when we don't care about the result
 * @summary output :: (* →  IO<null>) →  Free<Output, null>
 */
var output = exports.output = function output(f) {
    return log(new Output({ f: f })).chain(_monad.liftF);
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
 * log an Op
 * @summary log :: Op →  Free<Log, null>
 */
var log = exports.log = function log(op) {
    return (0, _monad.liftF)(new Log({ op: op, next: next }));
};

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
var stop = exports.stop = function stop(path) {
    return (0, _monad.liftF)(new Stop({ path: path }));
};

/**
 * make a child actor
 * @summary make :: (Template, Actor) →  Free<Raise,N>|Free<Put,N>
 */
var make = exports.make = function make(template, parent) {
    return _monad.Maybe.not(Actor.get(template.id, parent)).map(function () {
        return raise(new Actor.DuplicateActorIdError(parent.path, template.id));
    }).orJust(create(parent.path, template).chain(update)).extract();
};

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, Template)  →  Free<Op,Actor>
 */
var create = exports.create = function create(parent, template) {
    return (0, _Match.match)(Actor.fromTemplate(parent, template)).caseOf(_monad.IO, function (io) {
        return input(function () {
            return io;
        }).chain(function (a) {
            return put(a);
        });
    }).caseOf(Actor.Actor, put).end();
};

/* Helpers */
var next = function next(x) {
    return x;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PcHMuanMiXSwibmFtZXMiOlsiQWN0b3IiLCJPcCIsInByb3BzIiwiY2hlY2tzIiwibmV4dCIsIm1hcCIsIkdldHRlciIsIlNwYXduIiwidGVtcGxhdGUiLCJUZW1wbGF0ZSIsIkZ1dHVyZSIsImYiLCJGdW5jdGlvbiIsInRvIiwiU3RyaW5nIiwiU3RyZWFtIiwiVGVsbCIsIm1lc3NhZ2UiLCJSZWNlaXZlIiwiYmVoYXZpb3VyIiwiU3lzdGVtIiwiU2VsZiIsIkdldCIsImlkIiwiUmFpc2UiLCJlcnJvciIsIkVycm9yIiwiUHV0IiwiYWN0b3IiLCJTZWxlY3QiLCJwYXRoIiwiQWNjZXB0IiwiQWNjZXB0SU8iLCJBY3RvcklPIiwiU2VuZCIsIlN0b3AiLCJSZXBsYWNlIiwiVXBkYXRlIiwiT3V0cHV0IiwiSW5wdXQiLCJMb2ciLCJvcCIsIk5PT1AiLCJub29wIiwiY2FzZU9mIiwiY29weSIsImVuZCIsImZ1dHVyZSIsImxvZyIsImNoYWluIiwic3Bhd24iLCJGdXR1cmVUIiwic3RyZWFtIiwiU3RyZWFtVCIsInNlbGYiLCJtYWtlIiwic3lzdGVtIiwiZ2V0IiwidGVsbCIsInNlbGVjdCIsImRlc3QiLCJhY2NlcHQiLCJhIiwic3JjIiwidXBkYXRlIiwicmVwbGFjZSIsIlNFTEYiLCJwdXQiLCJyZWNlaXZlIiwiX3JlY2VpdmUiLCJkZXF1ZXVlIiwiYiIsIm12YXIiLCJpbnB1dCIsInRha2UiLCJub3QiLCJtYXliIiwib3BzIiwibSIsIm9ySnVzdCIsImV4dHJhY3QiLCJBY3RvckwiLCJtYWlsYm94Iiwib3V0cHV0IiwicmFpc2UiLCJzdG9wIiwicGFyZW50IiwiRHVwbGljYXRlQWN0b3JJZEVycm9yIiwiY3JlYXRlIiwiZnJvbVRlbXBsYXRlIiwiaW8iLCJ4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlBLEs7Ozs7Ozs7Ozs7QUFFWjs7Ozs7OztBQU9BOzs7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QyxNQURELFlBQ1k7QUFBQSxlQUFNNkIsTUFBTTtBQUFBLG1CQUFNaUIsRUFBTjtBQUFBLFNBQU4sRUFBZ0J6QyxLQUFoQixDQUFzQjtBQUFBLG1CQUFLa0IsSUFBSUwsQ0FBSixDQUFMO0FBQUEsU0FBdEIsQ0FBTjtBQUFBLEtBRFosRUFFQ2xCLE1BRkQsQ0FFUTVDLE1BQU1BLEtBRmQsRUFFcUJtRSxHQUZyQixFQUdDckIsR0FIRCxFQURrQjtBQUFBLENBQWY7O0FBTVA7QUFDQSxJQUFNMUMsT0FBTyxTQUFQQSxJQUFPO0FBQUEsV0FBS3VGLENBQUw7QUFBQSxDQUFiIiwiZmlsZSI6Ik9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBtZXJnZSwgY29tcG9zZSwgcGFydGlhbCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB0eXBlLCBhbnksIGNhbGwsIG9yLCBmb3JjZSB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgbGlmdEYsIE1heWJlLCBJTyB9IGZyb20gJy4vbW9uYWQnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0IHsgcGF0aHMgfSBmcm9tICcuL3BhdGhzJztcbmltcG9ydCAqIGFzIEFjdG9yIGZyb20gJy4vQWN0b3InO1xuXG4vKipcbiAqIEBtb2R1bGUgT3BzXG4gKlxuICogUHJvdmlkZXMgY2xhc3NlcyB0aGF0IHJlcHJlc2VudCBpbnN0cnVjdGlvbnMgdGhlIHN5c3RlbSBtdXN0IGNhcnJ5IG91dFxuICogYW5kIGNvbnN0cnVjdG9yIGZ1bmN0aW9ucy5cbiAqL1xuXG4vKipcbiAqIE9wIGlzIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBpbnN0cnVjdGlvbiBjbGFzc2VzLlxuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBPcCBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNoZWNrcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCBtZXJnZSh7IG5leHQ6IGFueSB9LCBjaGVja3MpKTtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXAodGhpcyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBHZXR0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEdldHRlciBleHRlbmRzIE9wIHt9XG5cbi8qKlxuICogU3Bhd25cbiAqIEBwcm9wZXJ0eSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGF3biBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgdGVtcGxhdGU6IHR5cGUoQWN0b3IuVGVtcGxhdGUpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRnV0dXJlXG4gKi9cbmV4cG9ydCBjbGFzcyBGdXR1cmUgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGY6IHR5cGUoRnVuY3Rpb24pLCB0bzogb3IodHlwZShTdHJpbmcpLCBmb3JjZShudWxsKSkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTdHJlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbSBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgZjogdHlwZShGdW5jdGlvbikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBUZWxsXG4gKi9cbmV4cG9ydCBjbGFzcyBUZWxsIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyB0bzogdHlwZShTdHJpbmcpLCBtZXNzYWdlOiBhbnkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSZWNlaXZlXG4gKi9cbmNsYXNzIFJlY2VpdmUgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGJlaGF2aW91cjogdHlwZShGdW5jdGlvbikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNsYXNzIFN5c3RlbSBleHRlbmRzIEdldHRlciB7fVxuXG4vKipcbiAqIFNlbGZcbiAqL1xuZXhwb3J0IGNsYXNzIFNlbGYgZXh0ZW5kcyBHZXR0ZXIge31cblxuLyoqXG4gKiBHZXRcbiAqL1xuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEdldHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGlkOiB0eXBlKFN0cmluZykgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSYWlzZVxuICovXG5leHBvcnQgY2xhc3MgUmFpc2UgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGVycm9yOiB0eXBlKEVycm9yKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFB1dFxuICovXG5leHBvcnQgY2xhc3MgUHV0IGV4dGVuZHMgR2V0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgYWN0b3I6IHR5cGUoQWN0b3IuQWN0b3IpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU2VsZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3QgZXh0ZW5kcyBHZXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBwYXRoOiB0eXBlKFN0cmluZykgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY2NlcHRcbiAqL1xuZXhwb3J0IGNsYXNzIEFjY2VwdCBleHRlbmRzIEdldHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IG1lc3NhZ2U6IGFueSwgYWN0b3I6IHR5cGUoQWN0b3IuQWN0b3IpIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBBY2NlcHRJTyBleHRlbmRzIEdldHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IG1lc3NhZ2U6IGFueSwgYWN0b3I6IHR5cGUoQWN0b3IuQWN0b3JJTykgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSB0byBhbiBhY3Rvci5cbiAqIEBwcm9wZXJ0eSB7dG99IHN0cmluZ1xuICogQHByb3BlcnR5IHsqfSBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBTZW5kIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgaWQ6IG9yKHR5cGUoU3RyaW5nKSwgY2FsbCh2NCkpLFxuICAgICAgICAgICAgdG86IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFueVxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuLyoqXG4gKiBTdG9wIHRoZSBzeXN0ZW0gb3IgYW4gYWN0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG5leHQ6IGFueVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogUmVwbGFjZVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFJlcGxhY2UgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIGFjdG9yOiB0eXBlKEFjdG9yLkFjdG9yKVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVXBkYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGRhdGUgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGFjdG9yOiB0eXBlKEFjdG9yLkFjdG9yKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE91dHB1dFxuICovXG5leHBvcnQgY2xhc3MgT3V0cHV0IGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBmOiB0eXBlKEZ1bmN0aW9uKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIElucHV0XG4gKi9cbmV4cG9ydCBjbGFzcyBJbnB1dCBleHRlbmRzIEdldHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGY6IHR5cGUoRnVuY3Rpb24pIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogTG9nXG4gKiBAcHJvcGVydHkge09wfSBvcFxuICogQHByb3BlcnR5IHtGcmVlPE9wLCBudWxsPn0gW25leHRdXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2cgZXh0ZW5kcyBHZXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBvcDogdHlwZShPcCkgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIE5PT1AgZXh0ZW5kcyBPcCB7fVxuXG5leHBvcnQgY29uc3Qgbm9vcCA9ICgpID0+IGxpZnRGKG5ldyBOT09QKCkpO1xuXG4vKipcbiAqIG1hcCBvdmVyIGFuIE9wXG4gKiBAc3VtbWFyeSB7T3A8QT4g4oaSICAoQeKGkiBCKSBPcDxCPn1cbiAqL1xuZXhwb3J0IGNvbnN0IG1hcCA9IG9wID0+IGYgPT4gbWF0Y2gob3ApXG4gICAgLmNhc2VPZihHZXR0ZXIsICh7IG5leHQgfSkgPT4gb3AuY29weSh7IG5leHQ6IGNvbXBvc2UoZiwgbmV4dCkgfSkpXG4gICAgLmNhc2VPZihPcCwgKHsgbmV4dCB9KSA9PiBvcC5jb3B5KHsgbmV4dDogZihuZXh0KSB9KSlcbiAgICAuZW5kKCk7XG5cbi8qKlxuICogZnV0dXJlIHNwYXducyBhIHRlbXBvcmFyeSBjaGlsZCBhY3RvciB0aGF0IGxpc3RlbnMgd2FpdHNcbiAqIG9uIHRoZSByZXN1bHQgb2YgYSB1c2VyIHN1cHBsaWVkIEZ1dHVyZS5cbiAqIEBwYXJhbSB7RnV0dXJlfSBmdFxuICogQHJldHVybiB7RnJlZTxTcGF3bklPLG51bGw+fVxuICogQHN1bW1hcnkgeyAgKChudWxsIOKGkiAgRnV0dXJlKSxzdHJpbmcpIOKGkiAgRnJlZTxPLCo+IH1cbiAqL1xuZXhwb3J0IGNvbnN0IGZ1dHVyZSA9IChmLCB0bykgPT5cbiAgICBsb2cobmV3IEZ1dHVyZSh7IGYsIHRvIH0pKVxuICAgIC5jaGFpbigoKSA9PiBzcGF3bihuZXcgQWN0b3IuRnV0dXJlVCh7IGYsIHRvIH0pKSk7XG5cbi8qKlxuICogc3RyZWFtIGEgcG90ZW50aWFsbHkgaW5maW5pdGUgYW1vdW50IG9mIG1lc3NhZ2VzIHRvIHRoZSBhY3Rvci5cbiAqIEBzdW1tYXJ5IHN0cmVhbSA6OiAoKCgqIOKGkiAgSU8pIOKGkiAgSU8pLHN0cmluZykg4oaSICBGcmVlPFB1dCwgTj5cbiAqL1xuZXhwb3J0IGNvbnN0IHN0cmVhbSA9IChmLCB0bykgPT5cbiAgICBsb2cobmV3IFN0cmVhbSh7IGYsIHRvIH0pKVxuICAgIC5jaGFpbigoKSA9PiBzcGF3bihuZXcgQWN0b3IuU3RyZWFtVCh7IGYsIHRvLCBpZDogYHN0cmVhbS0ke3Y0KCl9YCB9KSkpO1xuXG4vKipcbiAqIHNwYXduIGNyZWF0ZXMgYSBuZXcgc3Bhd24gcmVxdWVzdFxuICogQHBhcmFtIHtUZW1wbGF0ZX0gdGVtcGxhdGVcbiAqIEByZXR1cm4ge0ZyZWV9XG4gKiBAc3VtbWFyeSB7VGVtcGxhdGUg4oaSICBGcmVlPFJhaXNlfFVwZGF0ZSwgbnVsbD59XG4gKi9cbmV4cG9ydCBjb25zdCBzcGF3biA9IHRlbXBsYXRlID0+XG4gICAgbG9nKG5ldyBTcGF3bih7IHRlbXBsYXRlIH0pKVxuICAgIC5jaGFpbihzZWxmKVxuICAgIC5jaGFpbihwYXJ0aWFsKG1ha2UsIHRlbXBsYXRlKSlcblxuLyoqXG4gKiBzZWxmIGdldHMgdGhlIGFjdG9yIGZvciB0aGUgY3VycmVudCBjb250ZXh0LlxuICogQHN1bW1hcnkge3NlbGYgOjogbnVsbCDihpIgIEZyZWU8RiwgQWN0b3JMPlxuICovXG5leHBvcnQgY29uc3Qgc2VsZiA9ICgpID0+IGxpZnRGKG5ldyBTZWxmKHsgbmV4dCB9KSk7XG5cbi8qKlxuICogc3lzdGVtIHByb3ZpZGVzIHRoZSBzeXN0ZW1cbiAqIEBzdW1tYXJ5IHN5c3RlbSA6OiAoKSDihpIgIEZyZWU8U3lzdGVtLG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCBzeXN0ZW0gPSAoKSA9PiBsaWZ0RihuZXcgU3lzdGVtKHsgbmV4dCB9KSk7XG5cbi8qKlxuICogZ2V0IHJldHVybnMgYSBjaGlsZCBhY3RvciBiYXNlZCBvbiBpZCBpZiBpdCBleGlzdHNcbiAqIEBzdW1tYXJ5IHsoc3RyaW5nKSDihpIgIEZyZWU8R2V0LCBBY3RvcnxudWxsPlxuICovXG5leHBvcnQgY29uc3QgZ2V0ID0gaWQgPT4gbGlmdEYobmV3IEdldCh7IGlkLCBuZXh0IH0pKTtcblxuLyoqXG4gKiB0ZWxsIGFub3RoZXIgYWN0b3IgYSBtZXNzYWdlXG4gKiBAc3VtbWFyeSB0ZWxsIDo6IChzdHJpbmcsKikg4oaSICBGcmVlPEYsIEFjdG9yPlxuICovXG5leHBvcnQgY29uc3QgdGVsbCA9ICh0bywgbWVzc2FnZSkgPT5cbiAgICBsb2cobmV3IFRlbGwoeyB0bywgbWVzc2FnZSB9KSlcbiAgICAuY2hhaW4oc2VsZilcbiAgICAuY2hhaW4oc3JjID0+XG4gICAgICAgIHNlbGVjdCh0bylcbiAgICAgICAgLmNoYWluKGRlc3QgPT4gbWF0Y2goZGVzdClcbiAgICAgICAgICAgIC5jYXNlT2YoQWN0b3IuQWN0b3JJTywgYSA9PiBhY2NlcHQoeyB0bywgbWVzc2FnZSB9LCBhKSlcbiAgICAgICAgICAgIC5jYXNlT2YoQWN0b3IuQWN0b3IsIGEgPT4gYWNjZXB0KG1lc3NhZ2UsIGEpKS5lbmQoKSlcbiAgICAgICAgLmNoYWluKChzcmMucGF0aCA9PT0gdG8gfHwgc3JjLnBhdGggPT0gbnVsbCkgPyB1cGRhdGUgOiByZXBsYWNlKSk7XG5cbi8qKlxuICogc2VsZWN0IGFuIGFjdG9yIGJhc2VkIG9uIGFuIGFkZHJlc3NcbiAqIEBzdW1tYXJ5IHNlbGVjdCA6OiBzdHJpbmcg4oaSICBGcmVlPEYsQWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSBwYXRoID0+IHBhdGggPT09IHBhdGhzLlNFTEYgPyBzZWxmKCkgOiBsaWZ0RihuZXcgU2VsZWN0KHsgcGF0aCwgbmV4dCB9KSk7XG5cbi8qKlxuICogYWNjZXB0IGEgbWVzc2FnZVxuICogQHN1bW1hcnkgYWNjZXB0IDo6ICgqLCBBY3Rvcikg4oaSICBGcmVlPEYsQWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCBhY2NlcHQgPSAobWVzc2FnZSwgYWN0b3IpID0+IG1hdGNoKGFjdG9yKVxuICAgIC5jYXNlT2YoQWN0b3IuQWN0b3JJTywgKCkgPT4gbGlmdEYobmV3IEFjY2VwdElPKHsgbWVzc2FnZSwgYWN0b3IsIG5leHQgfSkpKVxuICAgIC5jYXNlT2YoQWN0b3IuQWN0b3IsICgpID0+IGxpZnRGKG5ldyBBY2NlcHQoeyBtZXNzYWdlLCBhY3RvciwgbmV4dCB9KSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHJlcGxhY2UgYW4gYWN0b3Igd2l0aCB0aGUgbGF0ZXN0IHZlcnNpb25cbiAqIEBzdW1tYXJ5IHJlcGxhY2UgOjogQWN0b3Ig4oaSICBGcmVlPEYsbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBhY3RvciA9PiBsaWZ0RihuZXcgUmVwbGFjZSh7IGFjdG9yIH0pKTtcblxuLyoqXG4gKiB1cGRhdGUgdGhlIGN1cnJlbnQgYWN0b3IgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uXG4gKiBAc3VtbWFyeSB1cGRhdGUgOjogQWN0b3Ig4oaSICBGcmVlPEYsbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZSA9IGFjdG9yID0+IGxpZnRGKG5ldyBVcGRhdGUoeyBhY3RvciB9KSk7XG5cbi8qKlxuICogcHV0IGEgbmV3IGNoaWxkIGFjdG9yIGludG8gdGhlIGxpc3Qgb2YgY2hpbGRyZW5cbiAqIEBzdW1tYXJ5IEFjdG9yIOKGkiAgRnJlZTxGLG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCBwdXQgPSBhY3RvciA9PiBsaWZ0RihuZXcgUHV0KHsgYWN0b3IsIG5leHQgfSkpO1xuXG4vKipcbiAqIHJlY2VpdmUgdGhlIG5leHQgbWVzc2FnZSBhbmQgaGFuZGxlIGl0IHdpdGggdGhlIHBhc3NlZCBiZWhhdmlvdXJcbiAqIEBzdW1tYXJ5IHJlY2VpdmUgOjogKCog4oaSIEZyZWU8RiwqPikg4oaSICBGcmVlPG51bGwsIG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlID0gYmVoYXZpb3VyID0+XG4gICAgbG9nKG5ldyBSZWNlaXZlKHsgYmVoYXZpb3VyIH0pKVxuICAgIC5jaGFpbigoKSA9PiBfcmVjZWl2ZShiZWhhdmlvdXIpKTtcblxuY29uc3QgX3JlY2VpdmUgPSBiZWhhdmlvdXIgPT5cbiAgICBzZWxmKClcbiAgICAuY2hhaW4ocGFydGlhbChkZXF1ZXVlLCBiZWhhdmlvdXIpKVxuXG4vKipcbiAqIGRlcXVldWUgYSBtZXNzYWdlIGZyb20gYW4gYWN0b3IncyBtYWlsYm94XG4gKiBAc3VtbWFyeSBkZXF1ZXVlIDo6IChiLCBhKSDihpIgIEZyZWU8TywqPlxuICovXG5leHBvcnQgY29uc3QgZGVxdWV1ZSA9IChiLCBhKSA9PiBtYXRjaChhKVxuICAgIC5jYXNlT2YoQWN0b3IuQWN0b3JJTywgKHsgbXZhciB9KSA9PlxuICAgICAgICBpbnB1dCgoKSA9PlxuICAgICAgICAgICAgbXZhclxuICAgICAgICAgICAgLnRha2UoKVxuICAgICAgICAgICAgLm1hcChNYXliZS5ub3QpKVxuICAgICAgICAuY2hhaW4obWF5YiA9PlxuICAgICAgICAgICAgbWF5YlxuICAgICAgICAgICAgLm1hcChtID0+IGEuY29weSh7IG9wczogYihtKSB9KSlcbiAgICAgICAgICAgIC5vckp1c3QoYS5jb3B5KHsgb3BzOiBfcmVjZWl2ZShiKSB9KSlcbiAgICAgICAgICAgIC5tYXAodXBkYXRlKVxuICAgICAgICAgICAgLmV4dHJhY3QoKSkpXG4gICAgLmNhc2VPZihBY3Rvci5BY3RvckwsIGEgPT5cbiAgICAgICAgTWF5YmVcbiAgICAgICAgLm5vdChhLm1haWxib3hbMF0pXG4gICAgICAgIC5tYXAobSA9PiBhLmNvcHkoeyBvcHM6IGIobSkgfSkpXG4gICAgICAgIC5vckp1c3QoYS5jb3B5KHsgb3BzOiBfcmVjZWl2ZShiKSB9KSlcbiAgICAgICAgLm1hcCh1cGRhdGUpXG4gICAgICAgIC5leHRyYWN0KCkpLmVuZCgpO1xuXG4vKipcbiAqIGlucHV0IGlzIHVzZWQgZm9yIGV4ZWN1dGluZyBzaWRlIGVmZmVjdHMgYW5kIGdldHRpbmcgdGhlIHJlc3VsdC5cbiAqIEBzdW1tYXJ5IGlucHV0IDo6IChudWxsIOKGkiAgSU88Kj4p4oaSICBGcmVlPElucHV0LCBudWxsPlxuICovXG5leHBvcnQgY29uc3QgaW5wdXQgPSBmID0+IGxvZyhuZXcgSW5wdXQoeyBmLCBuZXh0IH0pKS5jaGFpbihsaWZ0Rik7XG5cbi8qKlxuICogb3V0cHV0IGlzIHVzZWQgZm9yIGV4ZWN1dGluZyBzaWRlIGVmZmVjdHMgd2hlbiB3ZSBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN1bHRcbiAqIEBzdW1tYXJ5IG91dHB1dCA6OiAoKiDihpIgIElPPG51bGw+KSDihpIgIEZyZWU8T3V0cHV0LCBudWxsPlxuICovXG5leHBvcnQgY29uc3Qgb3V0cHV0ID0gZiA9PiBsb2cobmV3IE91dHB1dCh7IGYgfSkpLmNoYWluKGxpZnRGKTtcblxuLyoqXG4gKiByYWlzZSBhbiBlcnJvciB3aXRoaW4gdGhlIHN5c3RlbS5cbiAqIFRoaXMgZnVuY3Rpb24gZ2l2ZXMgdGhlIHN1cGVydmlzb3IgKGlmIGFueSkgYSBjaGFuY2UgdG9cbiAqIGludGVyY2VwdCBhbmQgcmVhY3QgdG8gdGhlIGVycm9yLiBJdCBhbHNvIHRlcm1pbmF0ZXNcbiAqIHRoZSBjdXJyZW50IGNoYWluIG9mIGluc3RydWN0aW9ucy5cbiAqIEBzdW1tYXJ5IHJhaXNlIDo6IEVycm9yIOKGkiAgRnJlZTxudWxsLEVycm9yPlxuICovXG5leHBvcnQgY29uc3QgcmFpc2UgPSBlcnJvciA9PiBsaWZ0RihuZXcgUmFpc2UoeyBlcnJvciB9KSk7XG5cbi8qKlxuICogbG9nIGFuIE9wXG4gKiBAc3VtbWFyeSBsb2cgOjogT3Ag4oaSICBGcmVlPExvZywgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGxvZyA9IG9wID0+IGxpZnRGKG5ldyBMb2coeyBvcCwgbmV4dCB9KSk7XG5cbi8qKlxuICogc3RvcCBjcmVhdGVzIGEgbmV3IFN0b3AgcmVxdWVzdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKi9cbmV4cG9ydCBjb25zdCBzdG9wID0gcGF0aCA9PiBsaWZ0RihuZXcgU3RvcCh7IHBhdGggfSkpO1xuXG4vKipcbiAqIG1ha2UgYSBjaGlsZCBhY3RvclxuICogQHN1bW1hcnkgbWFrZSA6OiAoVGVtcGxhdGUsIEFjdG9yKSDihpIgIEZyZWU8UmFpc2UsTj58RnJlZTxQdXQsTj5cbiAqL1xuZXhwb3J0IGNvbnN0IG1ha2UgPSAodGVtcGxhdGUsIHBhcmVudCkgPT5cbiAgICBNYXliZVxuICAgIC5ub3QoQWN0b3IuZ2V0KHRlbXBsYXRlLmlkLCBwYXJlbnQpKVxuICAgIC5tYXAoKCkgPT4gcmFpc2UobmV3IEFjdG9yLkR1cGxpY2F0ZUFjdG9ySWRFcnJvcihwYXJlbnQucGF0aCwgdGVtcGxhdGUuaWQpKSlcbiAgICAub3JKdXN0KGNyZWF0ZShwYXJlbnQucGF0aCwgdGVtcGxhdGUpLmNoYWluKHVwZGF0ZSkpXG4gICAgLmV4dHJhY3QoKTtcblxuLyoqXG4gKiBjcmVhdGUgYW4gYWN0b3IsIHRoYXQncyBpdCBkb2VzIG5vdCBhZGQgaXQgdG8gdGhlIHN5c3RlbSBvclxuICogYW55dGhpbmcgZWxzZS5cbiAqIEBzdW1tYXJ5IGNyZWF0ZSA6OiAoc3RyaW5nLCBUZW1wbGF0ZSkgIOKGkiAgRnJlZTxPcCxBY3Rvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IChwYXJlbnQsIHRlbXBsYXRlKSA9PlxuICAgIG1hdGNoKEFjdG9yLmZyb21UZW1wbGF0ZShwYXJlbnQsIHRlbXBsYXRlKSlcbiAgICAuY2FzZU9mKElPLCBpbyA9PiBpbnB1dCgoKSA9PiBpbykuY2hhaW4oYSA9PiBwdXQoYSkpKVxuICAgIC5jYXNlT2YoQWN0b3IuQWN0b3IsIHB1dClcbiAgICAuZW5kKCk7XG5cbi8qIEhlbHBlcnMgKi9cbmNvbnN0IG5leHQgPSB4ID0+IHg7XG4iXX0=