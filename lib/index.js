'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.merge = exports.replaceActor = exports.deliver = exports.createActor = exports.userDQ = exports.processUserQ = exports.kill = exports.processSysQ = exports.scheduleActors = exports.System = exports.Context = exports.ActorT = exports.Receive = exports.Kill = exports.Tell = exports.Spawn = exports.Task = exports.Message = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _monad = require('./monad');

var _Match = require('./Match');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
var Message = exports.Message = function Message() {
    var _this = this;

    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Message);

    Object.keys(src).forEach(function (k) {
        return _this[k] = src[k];
    });
};

/**
 * Task
 */


var Task = exports.Task = function (_Message) {
    _inherits(Task, _Message);

    function Task() {
        _classCallCheck(this, Task);

        return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
    }

    return Task;
}(Message);

/**
 * Spawn
 * @property {string} parent
 * @property {ActorT} template
 */


var Spawn = exports.Spawn = function (_Task) {
    _inherits(Spawn, _Task);

    function Spawn() {
        _classCallCheck(this, Spawn);

        return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).apply(this, arguments));
    }

    return Spawn;
}(Task);

/**
 * Tell
 * @property {string} to
 * @property {*} message
 */


var Tell = exports.Tell = function Tell(to, message) {
    _classCallCheck(this, Tell);

    this.to = to;
    this.message = message;
};

/**
 * Kill an Actor
 */


var Kill = exports.Kill = function Kill() {
    _classCallCheck(this, Kill);
};

/**
 * Receive
 * @property {string} path
 * @property {Behaviour} behaviour
 */


var Receive = exports.Receive = function Receive(path, behaviour) {
    _classCallCheck(this, Receive);

    this.path = path;
    this.behaviour = behaviour;
};

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Context →  Context
 */


var ActorT = exports.ActorT = function ActorT(id, start) {
    _classCallCheck(this, ActorT);

    this.id = id;
    this.start = start;
};

/**
 * Context
 */


var Context = exports.Context = function () {
    function Context(path) {
        var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Context);

        this.path = path;
        this.tasks = tasks;
    }

    /**
     * spawn
     */


    _createClass(Context, [{
        key: 'spawn',
        value: function spawn(template) {

            (0, _beof2.default)({ template: template }).instance(ActorT);

            return new Context(this.path, this.tasks.concat(new Spawn({ parent: this.path, template: template })));
        }

        /**
         * tell sends a message to another actor within the system.
         * @summary (string,*) →  Context
         */

    }, {
        key: 'tell',
        value: function tell(s, m) {

            (0, _beof2.default)({ s: s }).string();

            return new Context(this.path, this.tasks.concat(new Tell(s, m)));
        }

        /**
         * schedule tasks within a System
         * @summary {System} →  {System}
         */

    }, {
        key: 'schedule',
        value: function schedule(s) {

            (0, _beof2.default)({ s: s }).instance(System);

            return new System(replaceActor(new Context(this.path, []), s.actors), s.mailboxes, s.tasks.concat(this.tasks), s.io);
        }
    }]);

    return Context;
}();

/**
 * System implementations are the system part of the actor model¹.
 *
 * A System is effectively a mesh network where any node can
 * communicate with another provided they have an unforgable address for that node
 * (and are allowed to).
 *
 * Previously this was tackled as a class whose reference was shared between the
 * child actors' contexts. Now we still take a simillar approach
 * but instead of being a singleton the System's implementation is influenced by Monads.
 *
 * We also intend to unify actors that run on seperate threads/process with ones on the
 * main loop thus eliminating the need for an environment specific System.
 *
 * ¹ https://en.wikipedia.org/wiki/Actor_model
 */


var System = exports.System = function () {
    function System() {
        var actors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var mailboxes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { '$': [] };
        var tasks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var io = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _monad.IO.of(null);

        _classCallCheck(this, System);

        (0, _beof2.default)({ actors: actors }).array();
        (0, _beof2.default)({ mailboxes: mailboxes }).object();
        (0, _beof2.default)({ tasks: tasks }).array();
        (0, _beof2.default)({ io: io }).instance(_monad.IO);

        this.actors = actors;
        this.mailboxes = mailboxes;
        this.tasks = tasks;
        this.io = io;
    }

    /**
     * spawn a new actor.
     *
     * The actor will be spawned on the next turn of the event loop.
     * @summary ActorT →  System
     */


    _createClass(System, [{
        key: 'spawn',
        value: function spawn(template) {

            (0, _beof2.default)({ template: template }).instance(ActorT);

            return new System(this.actors, this.mailboxes, this.tasks.concat(new Spawn({ parent: '', template: template })), this.io);
        }

        /**
         * tick
         * @summary System => System
         */

    }, {
        key: 'tick',
        value: function tick() {

            return processSysQ(scheduleActors(this)).cata(processUserQ, function (s) {
                return s;
            });
        }

        /**
         * tock
         * (performs side effects immediately)
         * @summary System => (System →  System) →  IO<null>
         */

    }, {
        key: 'tock',
        value: function tock(f) {

            (0, _beof2.default)({ f: f }).function();

            return this.io.chain(function (s) {
                return s == null ? _monad.IO.of(null) : _monad.IO.of(function () {
                    return f(s);
                });
            }).run();
        }
    }, {
        key: 'start',
        value: function start() {

            return this.tick().tock(function (s) {
                return _monad.IO.of(function () {
                    return setTimeout(function () {
                        return s.start;
                    }, 0);
                });
            });
        }
    }]);

    return System;
}();

/**
 * scheduleActors
 * @summary System →  System
 */


var scheduleActors = exports.scheduleActors = function scheduleActors(s) {
    return s.actors.reduce(function (s, a) {
        return a.schedule(s);
    }, s);
};

/**
 * processSysQ
 * @summary System →  Either<System,System>
 */
var processSysQ = exports.processSysQ = function processSysQ(s) {
    return (s.mailboxes.$[0] == null ? (0, _monad.left)(s) : (0, _monad.right)(s.mailboxes.$[0])).map(function (m) {
        return (0, _Match.match)(m).caseOf(Kill, function () {
            return kill(s);
        }).end(_monad.left, _monad.right);
    });
};

/**
 * kill
 * @summary System →  Kill → System
 */
var kill = exports.kill = function kill() {
    return function () {
        return new System([], {}, [], _monad.IO.of(function () {
            return console.warn('System is going down!');
        }));
    };
};

/**
 * processUserQ
 * @summary System →  System
 */
var processUserQ = exports.processUserQ = function processUserQ(s) {
    return s.tasks.reduce(userDQ, s);
};

/**
 * userDQ handles a task generated by the user level
 * @summary (System, Task) →  System
 */
var userDQ = exports.userDQ = function userDQ(s, t) {
    return (0, _Match.match)(t).caseOf(Spawn, createActor(s)).caseOf(Tell, deliver(s)).end(function (t) {
        return t;
    }, function (t) {
        return t;
    });
};

/**
 * createActor
 * @summary System →  Spawn →  IO<System>
 */
var createActor = exports.createActor = function createActor(s) {
    return function (_ref) {
        var template = _ref.template,
            parent = _ref.parent;
        return new System(s.actors.concat(template.start(new Context(parent + '/' + template.id))), merge(s.mailboxes, _defineProperty({}, parent.path + '/' + template.id, [])), s.tasks, s.io);
    };
};

/**
 * deliver puts messages in their respective mailboxes.
 * @summary System →  Tell →  IO<System>
 */
var deliver = exports.deliver = function deliver(s) {
    return function (_ref2) {
        var to = _ref2.to,
            message = _ref2.message;
        return _monad.Maybe.not(s.mailboxes[to]).map(function (box) {
            return merge(s.mailboxes, _defineProperty({}, to, box.concat(message)));
        }).map(function (boxes) {
            return new System(s.actors, boxes, s.tasks, s.io);
        });
    };
};

/**
 * replaceActor replaces a Context within a list of Contexts with a new version.
 * @summary (Context,Array<Context>) →  Array<Context>
 */
var replaceActor = exports.replaceActor = function replaceActor(a, c) {
    return a.map(function (a) {
        return a.path === c.path ? c : a;
    });
};

/**
 * merge two objects easily
 * @summary (Object, Object) →  Object
 */
var merge = exports.merge = function merge(o1, o2) {
    return Object.assign({}, o1, o2);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic3JjIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrIiwiVGFzayIsIlNwYXduIiwiVGVsbCIsInRvIiwibWVzc2FnZSIsIktpbGwiLCJSZWNlaXZlIiwicGF0aCIsImJlaGF2aW91ciIsIkFjdG9yVCIsImlkIiwic3RhcnQiLCJDb250ZXh0IiwidGFza3MiLCJ0ZW1wbGF0ZSIsImluc3RhbmNlIiwiY29uY2F0IiwicGFyZW50IiwicyIsIm0iLCJzdHJpbmciLCJTeXN0ZW0iLCJyZXBsYWNlQWN0b3IiLCJhY3RvcnMiLCJtYWlsYm94ZXMiLCJpbyIsIm9mIiwiYXJyYXkiLCJvYmplY3QiLCJwcm9jZXNzU3lzUSIsInNjaGVkdWxlQWN0b3JzIiwiY2F0YSIsInByb2Nlc3NVc2VyUSIsImYiLCJmdW5jdGlvbiIsImNoYWluIiwicnVuIiwidGljayIsInRvY2siLCJzZXRUaW1lb3V0IiwicmVkdWNlIiwiYSIsInNjaGVkdWxlIiwiJCIsIm1hcCIsImNhc2VPZiIsImtpbGwiLCJlbmQiLCJjb25zb2xlIiwid2FybiIsInVzZXJEUSIsInQiLCJjcmVhdGVBY3RvciIsImRlbGl2ZXIiLCJtZXJnZSIsIm5vdCIsImJveCIsImJveGVzIiwiYyIsIm8xIiwibzIiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7SUFNYUEsTyxXQUFBQSxPLEdBRVQsbUJBQXNCO0FBQUE7O0FBQUEsUUFBVkMsR0FBVSx1RUFBSixFQUFJOztBQUFBOztBQUVsQkMsV0FBT0MsSUFBUCxDQUFZRixHQUFaLEVBQWlCRyxPQUFqQixDQUF5QjtBQUFBLGVBQUssTUFBS0MsQ0FBTCxJQUFVSixJQUFJSSxDQUFKLENBQWY7QUFBQSxLQUF6QjtBQUVILEM7O0FBSUw7Ozs7O0lBR2FDLEksV0FBQUEsSTs7Ozs7Ozs7OztFQUFhTixPOztBQUUxQjs7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RUFBdkMsQ0FBVDtBQUFBLFNBTEwsQ0FEd0I7QUFBQSxLQUFMO0FBQUEsQ0FBaEI7O0FBUVA7Ozs7QUFJTyxJQUFNSCxzQ0FBZSxTQUFmQSxZQUFlLENBQUNtQixDQUFELEVBQUlpQixDQUFKO0FBQUEsV0FDeEJqQixFQUFFRyxHQUFGLENBQU07QUFBQSxlQUFNSCxFQUFFbEMsSUFBRixLQUFXbUQsRUFBRW5ELElBQWQsR0FBc0JtRCxDQUF0QixHQUEwQmpCLENBQS9CO0FBQUEsS0FBTixDQUR3QjtBQUFBLENBQXJCOztBQUdQOzs7O0FBSU8sSUFBTWEsd0JBQVEsU0FBUkEsS0FBUSxDQUFDSyxFQUFELEVBQUtDLEVBQUw7QUFBQSxXQUFZaEUsT0FBT2lFLE1BQVAsQ0FBYyxFQUFkLEVBQWtCRixFQUFsQixFQUFzQkMsRUFBdEIsQ0FBWjtBQUFBLENBQWQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCB7IElPLCBsZWZ0LCByaWdodCwgTWF5YmUgfSBmcm9tICcuL21vbmFkJztcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi9NYXRjaCc7XG5cbi8qKlxuICogTWVzc2FnZSBjb3BpZXMgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgYW5kIGFzc2lnbnMgdGhlbSB0byBpdHNlbGYuXG4gKlxuICogVGhpcyBjbGFzcyBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYWRob2MgdHlwZSBoaWVhcmNoaWVzIGZvciB5b3VyIGNvZGUgYmFzZXMgbWVzc2FnZXMuXG4gKiBAcGFyYW0ge29iamVjdH0gc3JjXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcblxuICAgIGNvbnN0cnVjdG9yKHNyYyA9IHt9KSB7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoc3JjKS5mb3JFYWNoKGsgPT4gdGhpc1trXSA9IHNyY1trXSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBUYXNrXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG4vKipcbiAqIFNwYXduXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGFyZW50XG4gKiBAcHJvcGVydHkge0FjdG9yVH0gdGVtcGxhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFNwYXduIGV4dGVuZHMgVGFzayB7fVxuXG4vKipcbiAqIFRlbGxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHsqfSBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBUZWxsIHtcblxuICAgIGNvbnN0cnVjdG9yKHRvLCBtZXNzYWdlKSB7XG5cbiAgICAgICAgdGhpcy50byA9IHRvXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBLaWxsIGFuIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBLaWxsIHt9XG5cbi8qKlxuICogUmVjZWl2ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhdGhcbiAqIEBwcm9wZXJ0eSB7QmVoYXZpb3VyfSBiZWhhdmlvdXJcbiAqL1xuZXhwb3J0IGNsYXNzIFJlY2VpdmUge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgYmVoYXZpb3VyKSB7XG5cbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5iZWhhdmlvdXIgPSBiZWhhdmlvdXI7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvclQgaXMgYSB0ZW1wbGF0ZSBmb3IgY3JlYXRpbmcgYWN0b3JzIHRoYXQgcnVuIGluXG4gKiB0aGUgc2FtZSBldmVudCBsb29wIGFzIHRoZSBzeXN0ZW0uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgLSBtdXN0IGJlIHVuaXF1ZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc3RhcnQgLSBDb250ZXh0IOKGkiAgQ29udGV4dFxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JUIHtcblxuICAgIGNvbnN0cnVjdG9yKGlkLCBzdGFydCkge1xuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQ29udGV4dFxuICovXG5leHBvcnQgY2xhc3MgQ29udGV4dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0YXNrcyA9IFtdKSB7XG5cbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd25cbiAgICAgKi9cbiAgICBzcGF3bih0ZW1wbGF0ZSkge1xuXG4gICAgICAgIGJlb2YoeyB0ZW1wbGF0ZSB9KS5pbnN0YW5jZShBY3RvclQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQ29udGV4dCh0aGlzLnBhdGgsXG4gICAgICAgICAgICB0aGlzLnRhc2tzLmNvbmNhdChuZXcgU3Bhd24oeyBwYXJlbnQ6IHRoaXMucGF0aCwgdGVtcGxhdGUgfSkpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGwgc2VuZHMgYSBtZXNzYWdlIHRvIGFub3RoZXIgYWN0b3Igd2l0aGluIHRoZSBzeXN0ZW0uXG4gICAgICogQHN1bW1hcnkgKHN0cmluZywqKSDihpIgIENvbnRleHRcbiAgICAgKi9cbiAgICB0ZWxsKHMsIG0pIHtcblxuICAgICAgICBiZW9mKHsgcyB9KS5zdHJpbmcoKTtcblxuICAgICAgICByZXR1cm4gbmV3IENvbnRleHQodGhpcy5wYXRoLCB0aGlzLnRhc2tzLmNvbmNhdChuZXcgVGVsbChzLCBtKSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGUgdGFza3Mgd2l0aGluIGEgU3lzdGVtXG4gICAgICogQHN1bW1hcnkge1N5c3RlbX0g4oaSICB7U3lzdGVtfVxuICAgICAqL1xuICAgIHNjaGVkdWxlKHMpIHtcblxuICAgICAgICBiZW9mKHsgcyB9KS5pbnN0YW5jZShTeXN0ZW0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3lzdGVtKFxuICAgICAgICAgICAgcmVwbGFjZUFjdG9yKG5ldyBDb250ZXh0KHRoaXMucGF0aCwgW10pLCBzLmFjdG9ycyksXG4gICAgICAgICAgICBzLm1haWxib3hlcyxcbiAgICAgICAgICAgIHMudGFza3MuY29uY2F0KHRoaXMudGFza3MpLFxuICAgICAgICAgICAgcy5pbyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTeXN0ZW0gaW1wbGVtZW50YXRpb25zIGFyZSB0aGUgc3lzdGVtIHBhcnQgb2YgdGhlIGFjdG9yIG1vZGVswrkuXG4gKlxuICogQSBTeXN0ZW0gaXMgZWZmZWN0aXZlbHkgYSBtZXNoIG5ldHdvcmsgd2hlcmUgYW55IG5vZGUgY2FuXG4gKiBjb21tdW5pY2F0ZSB3aXRoIGFub3RoZXIgcHJvdmlkZWQgdGhleSBoYXZlIGFuIHVuZm9yZ2FibGUgYWRkcmVzcyBmb3IgdGhhdCBub2RlXG4gKiAoYW5kIGFyZSBhbGxvd2VkIHRvKS5cbiAqXG4gKiBQcmV2aW91c2x5IHRoaXMgd2FzIHRhY2tsZWQgYXMgYSBjbGFzcyB3aG9zZSByZWZlcmVuY2Ugd2FzIHNoYXJlZCBiZXR3ZWVuIHRoZVxuICogY2hpbGQgYWN0b3JzJyBjb250ZXh0cy4gTm93IHdlIHN0aWxsIHRha2UgYSBzaW1pbGxhciBhcHByb2FjaFxuICogYnV0IGluc3RlYWQgb2YgYmVpbmcgYSBzaW5nbGV0b24gdGhlIFN5c3RlbSdzIGltcGxlbWVudGF0aW9uIGlzIGluZmx1ZW5jZWQgYnkgTW9uYWRzLlxuICpcbiAqIFdlIGFsc28gaW50ZW5kIHRvIHVuaWZ5IGFjdG9ycyB0aGF0IHJ1biBvbiBzZXBlcmF0ZSB0aHJlYWRzL3Byb2Nlc3Mgd2l0aCBvbmVzIG9uIHRoZVxuICogbWFpbiBsb29wIHRodXMgZWxpbWluYXRpbmcgdGhlIG5lZWQgZm9yIGFuIGVudmlyb25tZW50IHNwZWNpZmljIFN5c3RlbS5cbiAqXG4gKiDCuSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BY3Rvcl9tb2RlbFxuICovXG5leHBvcnQgY2xhc3MgU3lzdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKGFjdG9ycyA9IFtdLCBtYWlsYm94ZXMgPSB7ICckJzogW10gfSwgdGFza3MgPSBbXSwgaW8gPSBJTy5vZihudWxsKSkge1xuXG4gICAgICAgIGJlb2YoeyBhY3RvcnMgfSkuYXJyYXkoKTtcbiAgICAgICAgYmVvZih7IG1haWxib3hlcyB9KS5vYmplY3QoKTtcbiAgICAgICAgYmVvZih7IHRhc2tzIH0pLmFycmF5KCk7XG4gICAgICAgIGJlb2YoeyBpbyB9KS5pbnN0YW5jZShJTyk7XG5cbiAgICAgICAgdGhpcy5hY3RvcnMgPSBhY3RvcnM7XG4gICAgICAgIHRoaXMubWFpbGJveGVzID0gbWFpbGJveGVzO1xuICAgICAgICB0aGlzLnRhc2tzID0gdGFza3M7XG4gICAgICAgIHRoaXMuaW8gPSBpbztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNwYXduIGEgbmV3IGFjdG9yLlxuICAgICAqXG4gICAgICogVGhlIGFjdG9yIHdpbGwgYmUgc3Bhd25lZCBvbiB0aGUgbmV4dCB0dXJuIG9mIHRoZSBldmVudCBsb29wLlxuICAgICAqIEBzdW1tYXJ5IEFjdG9yVCDihpIgIFN5c3RlbVxuICAgICAqL1xuICAgIHNwYXduKHRlbXBsYXRlKSB7XG5cbiAgICAgICAgYmVvZih7IHRlbXBsYXRlIH0pLmluc3RhbmNlKEFjdG9yVCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0oXG4gICAgICAgICAgICB0aGlzLmFjdG9ycyxcbiAgICAgICAgICAgIHRoaXMubWFpbGJveGVzLFxuICAgICAgICAgICAgdGhpcy50YXNrcy5jb25jYXQobmV3IFNwYXduKHsgcGFyZW50OiAnJywgdGVtcGxhdGUgfSkpLCB0aGlzLmlvKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRpY2tcbiAgICAgKiBAc3VtbWFyeSBTeXN0ZW0gPT4gU3lzdGVtXG4gICAgICovXG4gICAgdGljaygpIHtcblxuICAgICAgICByZXR1cm4gcHJvY2Vzc1N5c1Eoc2NoZWR1bGVBY3RvcnModGhpcykpLmNhdGEocHJvY2Vzc1VzZXJRLCBzID0+IHMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9ja1xuICAgICAqIChwZXJmb3JtcyBzaWRlIGVmZmVjdHMgaW1tZWRpYXRlbHkpXG4gICAgICogQHN1bW1hcnkgU3lzdGVtID0+IChTeXN0ZW0g4oaSICBTeXN0ZW0pIOKGkiAgSU88bnVsbD5cbiAgICAgKi9cbiAgICB0b2NrKGYpIHtcblxuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlvLmNoYWluKHMgPT4gKHMgPT0gbnVsbCkgPyBJTy5vZihudWxsKSA6IElPLm9mKCgpID0+IGYocykpKS5ydW4oKTtcblxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRpY2soKS50b2NrKHMgPT4gSU8ub2YoKCkgPT4gc2V0VGltZW91dCgoKSA9PiBzLnN0YXJ0LCAwKSkpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogc2NoZWR1bGVBY3RvcnNcbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFN5c3RlbVxuICovXG5leHBvcnQgY29uc3Qgc2NoZWR1bGVBY3RvcnMgPSBzID0+IHMuYWN0b3JzLnJlZHVjZSgocywgYSkgPT4gYS5zY2hlZHVsZShzKSwgcyk7XG5cbi8qKlxuICogcHJvY2Vzc1N5c1FcbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIEVpdGhlcjxTeXN0ZW0sU3lzdGVtPlxuICovXG5leHBvcnQgY29uc3QgcHJvY2Vzc1N5c1EgPSBzID0+XG4gICAgKChzLm1haWxib3hlcy4kWzBdID09IG51bGwpID8gbGVmdChzKSA6IHJpZ2h0KHMubWFpbGJveGVzLiRbMF0pKVxuICAgIC5tYXAobSA9PlxuICAgICAgICBtYXRjaChtKVxuICAgICAgICAuY2FzZU9mKEtpbGwsICgpID0+IGtpbGwocykpXG4gICAgICAgIC5lbmQobGVmdCwgcmlnaHQpKTtcblxuLyoqXG4gKiBraWxsXG4gKiBAc3VtbWFyeSBTeXN0ZW0g4oaSICBLaWxsIOKGkiBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNvbnN0IGtpbGwgPSAoKSA9PiAoKSA9PlxuICAgIG5ldyBTeXN0ZW0oW10sIHt9LCBbXSxcbiAgICAgICAgSU8ub2YoKCkgPT4gY29uc29sZS53YXJuKCdTeXN0ZW0gaXMgZ29pbmcgZG93biEnKSkpO1xuXG4vKipcbiAqIHByb2Nlc3NVc2VyUVxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgU3lzdGVtXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9jZXNzVXNlclEgPSBzID0+XG4gICAgcy50YXNrcy5yZWR1Y2UodXNlckRRLCBzKTtcblxuLyoqXG4gKiB1c2VyRFEgaGFuZGxlcyBhIHRhc2sgZ2VuZXJhdGVkIGJ5IHRoZSB1c2VyIGxldmVsXG4gKiBAc3VtbWFyeSAoU3lzdGVtLCBUYXNrKSDihpIgIFN5c3RlbVxuICovXG5leHBvcnQgY29uc3QgdXNlckRRID0gKHMsIHQpID0+XG4gICAgbWF0Y2godClcbiAgICAuY2FzZU9mKFNwYXduLCBjcmVhdGVBY3RvcihzKSlcbiAgICAuY2FzZU9mKFRlbGwsIGRlbGl2ZXIocykpXG4gICAgLmVuZCh0PT50LCB0PT50KTtcblxuLyoqXG4gKiBjcmVhdGVBY3RvclxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgU3Bhd24g4oaSICBJTzxTeXN0ZW0+XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvciA9IHMgPT4gKHsgdGVtcGxhdGUsIHBhcmVudCB9KSA9PlxuICAgIG5ldyBTeXN0ZW0oXG4gICAgICAgIHMuYWN0b3JzLmNvbmNhdCh0ZW1wbGF0ZS5zdGFydChuZXcgQ29udGV4dChgJHtwYXJlbnR9LyR7dGVtcGxhdGUuaWR9YCkpKSxcbiAgICAgICAgbWVyZ2Uocy5tYWlsYm94ZXMsIHtcbiAgICAgICAgICAgIFtgJHtwYXJlbnQucGF0aH0vJHt0ZW1wbGF0ZS5pZH1gXTogW11cbiAgICAgICAgfSksXG4gICAgICAgIHMudGFza3MsIHMuaW8pO1xuXG4vKipcbiAqIGRlbGl2ZXIgcHV0cyBtZXNzYWdlcyBpbiB0aGVpciByZXNwZWN0aXZlIG1haWxib3hlcy5cbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFRlbGwg4oaSICBJTzxTeXN0ZW0+XG4gKi9cbmV4cG9ydCBjb25zdCBkZWxpdmVyID0gcyA9PiAoeyB0bywgbWVzc2FnZSB9KSA9PlxuICAgIE1heWJlXG4gICAgLm5vdChzLm1haWxib3hlc1t0b10pXG4gICAgLm1hcChib3ggPT4gbWVyZ2Uocy5tYWlsYm94ZXMsIHtcbiAgICAgICAgW3RvXTogYm94LmNvbmNhdChtZXNzYWdlKVxuICAgIH0pKVxuICAgIC5tYXAoYm94ZXMgPT4gbmV3IFN5c3RlbShzLmFjdG9ycywgYm94ZXMsIHMudGFza3MsIHMuaW8pKTtcblxuLyoqXG4gKiByZXBsYWNlQWN0b3IgcmVwbGFjZXMgYSBDb250ZXh0IHdpdGhpbiBhIGxpc3Qgb2YgQ29udGV4dHMgd2l0aCBhIG5ldyB2ZXJzaW9uLlxuICogQHN1bW1hcnkgKENvbnRleHQsQXJyYXk8Q29udGV4dD4pIOKGkiAgQXJyYXk8Q29udGV4dD5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlcGxhY2VBY3RvciA9IChhLCBjKSA9PlxuICAgIGEubWFwKGEgPT4gKGEucGF0aCA9PT0gYy5wYXRoKSA/IGMgOiBhKTtcblxuLyoqXG4gKiBtZXJnZSB0d28gb2JqZWN0cyBlYXNpbHlcbiAqIEBzdW1tYXJ5IChPYmplY3QsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gKG8xLCBvMikgPT4gT2JqZWN0LmFzc2lnbih7fSwgbzEsIG8yKTtcbiJdfQ==