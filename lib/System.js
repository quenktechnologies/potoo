'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.address = exports.copy = exports.deliver = exports.createActor = exports.processUserQ = exports.kill = exports.processSysQ = exports.scheduleActors = exports.System = exports.Stopped = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Match = require('./Match');

var _monad = require('./monad');

var _Actor = require('./Actor');

var _Message = require('./Message');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Stopped is used to represent the System that has been stopped (killed)
 * it can not be restarted.
 * @property {() →  IO} io
 */
var Stopped = exports.Stopped = function () {
    function Stopped() {
        var io = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _monad.IO.of(null);

        _classCallCheck(this, Stopped);

        this.io = io;
    }

    _createClass(Stopped, [{
        key: 'spawn',
        value: function spawn() {

            return this;
        }
    }, {
        key: 'tick',
        value: function tick() {

            return this;
        }
    }, {
        key: 'tock',
        value: function tock() {

            return this.io.run();
        }
    }, {
        key: 'start',
        value: function start() {

            return this.tick().tock();
        }
    }]);

    return Stopped;
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
 * @property {Object<string, Actor>} actors
 * @property {Object<string,Array>} mailboxes
 * @property {Array<Task>} tasks
 * @property {Array<System →  IO<System>>} io
 */


var System = exports.System = function () {
    function System() {
        var actors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var mailboxes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { '$': [] };
        var tasks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var io = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        _classCallCheck(this, System);

        (0, _beof2.default)({ actors: actors }).object();
        (0, _beof2.default)({ mailboxes: mailboxes }).object();
        (0, _beof2.default)({ tasks: tasks }).array();
        (0, _beof2.default)({ io: io }).array();

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

            (0, _beof2.default)({ template: template }).instance(_Actor.ActorT);

            return new System(this.actors, this.mailboxes, this.tasks.concat(new _Message.Spawn({ parent: '', template: template })), this.io);
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
         * @summary System => (System →  IO<System>) →  null
         */

    }, {
        key: 'tock',
        value: function tock(f) {

            (0, _beof2.default)({ f: f }).function();

            return this.io.reduce(function (io, f) {
                return io.chain(f);
            }, _monad.IO.of(this)).chain(f).run();
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
    return Object.keys(s.actors).reduce(function (s, k) {
        return s.actors[k].schedule(s);
    }, s);
};

/**
 * processSysQ executes a task from the system queue (FIFO)
 * @summary System →  Either<System,System>
 */
var processSysQ = exports.processSysQ = function processSysQ(s) {
    return (s.mailboxes.$[0] == null ? (0, _monad.left)(s) : (0, _monad.right)(s.mailboxes.$[0])).chain(function (m) {
        return (0, _Match.match)(m).caseOf(_Message.Kill, kill(s)).end(_monad.left, _monad.right);
    }).map(function (s) {
        return console.log(s) || copy(s, {
            mailboxes: (0, _util.merge)(s.mailboxes, { $: s.mailboxes.$.slice(1) })
        });
    });
};

/**
 * kill
 * @summary System →  Kill →  Stopped
 */
var kill = exports.kill = function kill() {
    return function () {
        return new Stopped(function () {
            return console.warn('System is going down!');
        });
    };
};

/**
 * processUserQ
 * @summary System →  System
 */
var processUserQ = exports.processUserQ = function processUserQ(s) {
    return s.tasks.reduce(function (s, t) {
        return (0, _Match.match)(t).caseOf(_Message.Spawn, createActor(s)).caseOf(_Message.Tell, deliver(s)).end(function () {
            return s;
        }, function (s) {
            return s;
        });
    }, s);
};

/**
 * createActor
 * @summary System →  Spawn →  System
 */
var createActor = exports.createActor = function createActor(s) {
    return function (_ref) {
        var template = _ref.template,
            parent = _ref.parent;
        return new System((0, _util.merge)(s.actors, _defineProperty({}, address(parent, template.id), template.start(new _Actor.Actor(address(parent, template.id)))), (0, _util.merge)(s.mailboxes, _defineProperty({}, address(parent, template.id), [])), s.tasks, s.io));
    };
};

/**
 * deliver puts messages in their respective mailboxes.
 * @summary System →  Tell →  System
 */
var deliver = exports.deliver = function deliver(s) {
    return function (_ref2) {
        var to = _ref2.to,
            from = _ref2.from,
            message = _ref2.message;
        return (0, _Match.match)(s.mailboxes[to]).caseOf(Array, function (box) {
            return copy(s, {
                mailboxes: (0, _util.merge)(s.mailboxes, _defineProperty({}, to, box.concat(message)))
            });
        }).caseOf(Function, function (f) {
            return copy(s, { io: s.io.concat(function (s) {
                    return f(message, s);
                }) });
        }).caseOf(null, copy(s, {
            mailboxes: s.mailboxes.$.concat(new _Message.Drop({ to: to, from: from, message: message }))
        })).end(function (s) {
            return s;
        }, function (s) {
            return s;
        });
    };
};

/**
 * copy a System replacing desired keys
 * @summary (System, Object) →  System
 */
var copy = exports.copy = function copy(s, o) {

    (0, _beof2.default)({ s: s }).instance(System);

    return new System(o.actors || s.actors, o.mailboxes || s.mailboxes, o.tasks || s.tasks, o.io || s.io);
};

/**
 * address forms the address path of an Actor
 * @summary (string,string) →  string
 */
var address = exports.address = function address(parent, id) {
    return parent + '/' + id;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW0uanMiXSwibmFtZXMiOlsiU3RvcHBlZCIsImlvIiwib2YiLCJydW4iLCJ0aWNrIiwidG9jayIsIlN5c3RlbSIsImFjdG9ycyIsIm1haWxib3hlcyIsInRhc2tzIiwib2JqZWN0IiwiYXJyYXkiLCJ0ZW1wbGF0ZSIsImluc3RhbmNlIiwiY29uY2F0IiwicGFyZW50IiwicHJvY2Vzc1N5c1EiLCJzY2hlZHVsZUFjdG9ycyIsImNhdGEiLCJwcm9jZXNzVXNlclEiLCJzIiwiZiIsImZ1bmN0aW9uIiwicmVkdWNlIiwiY2hhaW4iLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJPYmplY3QiLCJrZXlzIiwiayIsInNjaGVkdWxlIiwiJCIsIm0iLCJjYXNlT2YiLCJraWxsIiwiZW5kIiwibWFwIiwiY29uc29sZSIsImxvZyIsImNvcHkiLCJzbGljZSIsIndhcm4iLCJ0IiwiY3JlYXRlQWN0b3IiLCJkZWxpdmVyIiwiYWRkcmVzcyIsImlkIiwidG8iLCJmcm9tIiwibWVzc2FnZSIsIkFycmF5IiwiYm94IiwiRnVuY3Rpb24iLCJvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBOzs7OztJQUthQSxPLFdBQUFBLE87QUFFVCx1QkFBOEI7QUFBQSxZQUFsQkMsRUFBa0IsdUVBQWIsVUFBR0MsRUFBSCxDQUFNLElBQU4sQ0FBYTs7QUFBQTs7QUFFMUIsYUFBS0QsRUFBTCxHQUFVQSxFQUFWO0FBRUg7Ozs7Z0NBRU87O0FBRUosbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0EsRUFBTCxDQUFRRSxHQUFSLEVBQVA7QUFFSDs7O2dDQUVPOztBQUVKLG1CQUFPLEtBQUtDLElBQUwsR0FBWUMsSUFBWixFQUFQO0FBRUg7Ozs7OztBQUlMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JhQyxNLFdBQUFB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LENBQUw7QUFBQSxTQVZiLENBRHdCO0FBQUEsS0FBTDtBQUFBLENBQWhCOztBQWFQOzs7O0FBSU8sSUFBTW1CLHNCQUFPLFNBQVBBLElBQU8sQ0FBQ25CLENBQUQsRUFBSWlDLENBQUosRUFBVTs7QUFFMUIsd0JBQUssRUFBRWpDLElBQUYsRUFBTCxFQUFZUCxRQUFaLENBQXFCUCxNQUFyQjs7QUFFQSxXQUFPLElBQUlBLE1BQUosQ0FDSCtDLEVBQUU5QyxNQUFGLElBQVlhLEVBQUViLE1BRFgsRUFFSDhDLEVBQUU3QyxTQUFGLElBQWVZLEVBQUVaLFNBRmQsRUFHSDZDLEVBQUU1QyxLQUFGLElBQVdXLEVBQUVYLEtBSFYsRUFJSDRDLEVBQUVwRCxFQUFGLElBQVFtQixFQUFFbkIsRUFKUCxDQUFQO0FBTUgsQ0FWTTs7QUFZUDs7OztBQUlPLElBQU00Qyw0QkFBVSxTQUFWQSxPQUFVLENBQUM5QixNQUFELEVBQVMrQixFQUFUO0FBQUEsV0FBbUIvQixNQUFuQixTQUE2QitCLEVBQTdCO0FBQUEsQ0FBaEIiLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0IHsgSU8sIGxlZnQsIHJpZ2h0IH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBBY3RvciwgQWN0b3JUIH0gZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgeyBTcGF3biwgVGVsbCwgS2lsbCwgRHJvcCwgUmVjZWl2ZSB9IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogU3RvcHBlZCBpcyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgU3lzdGVtIHRoYXQgaGFzIGJlZW4gc3RvcHBlZCAoa2lsbGVkKVxuICogaXQgY2FuIG5vdCBiZSByZXN0YXJ0ZWQuXG4gKiBAcHJvcGVydHkgeygpIOKGkiAgSU99IGlvXG4gKi9cbmV4cG9ydCBjbGFzcyBTdG9wcGVkIHtcblxuICAgIGNvbnN0cnVjdG9yKGlvID0gSU8ub2YobnVsbCkpIHtcblxuICAgICAgICB0aGlzLmlvID0gaW87XG5cbiAgICB9XG5cbiAgICBzcGF3bigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHRpY2soKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB0b2NrKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlvLnJ1bigpO1xuXG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGljaygpLnRvY2soKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN5c3RlbSBpbXBsZW1lbnRhdGlvbnMgYXJlIHRoZSBzeXN0ZW0gcGFydCBvZiB0aGUgYWN0b3IgbW9kZWzCuS5cbiAqXG4gKiBBIFN5c3RlbSBpcyBlZmZlY3RpdmVseSBhIG1lc2ggbmV0d29yayB3aGVyZSBhbnkgbm9kZSBjYW5cbiAqIGNvbW11bmljYXRlIHdpdGggYW5vdGhlciBwcm92aWRlZCB0aGV5IGhhdmUgYW4gdW5mb3JnYWJsZSBhZGRyZXNzIGZvciB0aGF0IG5vZGVcbiAqIChhbmQgYXJlIGFsbG93ZWQgdG8pLlxuICpcbiAqIFByZXZpb3VzbHkgdGhpcyB3YXMgdGFja2xlZCBhcyBhIGNsYXNzIHdob3NlIHJlZmVyZW5jZSB3YXMgc2hhcmVkIGJldHdlZW4gdGhlXG4gKiBjaGlsZCBhY3RvcnMnIGNvbnRleHRzLiBOb3cgd2Ugc3RpbGwgdGFrZSBhIHNpbWlsbGFyIGFwcHJvYWNoXG4gKiBidXQgaW5zdGVhZCBvZiBiZWluZyBhIHNpbmdsZXRvbiB0aGUgU3lzdGVtJ3MgaW1wbGVtZW50YXRpb24gaXMgaW5mbHVlbmNlZCBieSBNb25hZHMuXG4gKlxuICogV2UgYWxzbyBpbnRlbmQgdG8gdW5pZnkgYWN0b3JzIHRoYXQgcnVuIG9uIHNlcGVyYXRlIHRocmVhZHMvcHJvY2VzcyB3aXRoIG9uZXMgb24gdGhlXG4gKiBtYWluIGxvb3AgdGh1cyBlbGltaW5hdGluZyB0aGUgbmVlZCBmb3IgYW4gZW52aXJvbm1lbnQgc3BlY2lmaWMgU3lzdGVtLlxuICpcbiAqIMK5IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FjdG9yX21vZGVsXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIEFjdG9yPn0gYWN0b3JzXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsQXJyYXk+fSBtYWlsYm94ZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8VGFzaz59IHRhc2tzXG4gKiBAcHJvcGVydHkge0FycmF5PFN5c3RlbSDihpIgIElPPFN5c3RlbT4+fSBpb1xuICovXG5leHBvcnQgY2xhc3MgU3lzdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKGFjdG9ycyA9IHt9LCBtYWlsYm94ZXMgPSB7ICckJzogW10gfSwgdGFza3MgPSBbXSwgaW8gPSBbXSkge1xuXG4gICAgICAgIGJlb2YoeyBhY3RvcnMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyBtYWlsYm94ZXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyB0YXNrcyB9KS5hcnJheSgpO1xuICAgICAgICBiZW9mKHsgaW8gfSkuYXJyYXkoKTtcblxuICAgICAgICB0aGlzLmFjdG9ycyA9IGFjdG9ycztcbiAgICAgICAgdGhpcy5tYWlsYm94ZXMgPSBtYWlsYm94ZXM7XG4gICAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcbiAgICAgICAgdGhpcy5pbyA9IGlvO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd24gYSBuZXcgYWN0b3IuXG4gICAgICpcbiAgICAgKiBUaGUgYWN0b3Igd2lsbCBiZSBzcGF3bmVkIG9uIHRoZSBuZXh0IHR1cm4gb2YgdGhlIGV2ZW50IGxvb3AuXG4gICAgICogQHN1bW1hcnkgQWN0b3JUIOKGkiAgU3lzdGVtXG4gICAgICovXG4gICAgc3Bhd24odGVtcGxhdGUpIHtcblxuICAgICAgICBiZW9mKHsgdGVtcGxhdGUgfSkuaW5zdGFuY2UoQWN0b3JUKTtcblxuICAgICAgICByZXR1cm4gbmV3IFN5c3RlbShcbiAgICAgICAgICAgIHRoaXMuYWN0b3JzLFxuICAgICAgICAgICAgdGhpcy5tYWlsYm94ZXMsXG4gICAgICAgICAgICB0aGlzLnRhc2tzLmNvbmNhdChuZXcgU3Bhd24oeyBwYXJlbnQ6ICcnLCB0ZW1wbGF0ZSB9KSksXG4gICAgICAgICAgICB0aGlzLmlvKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRpY2tcbiAgICAgKiBAc3VtbWFyeSBTeXN0ZW0gPT4gU3lzdGVtXG4gICAgICovXG4gICAgdGljaygpIHtcblxuICAgICAgICByZXR1cm4gcHJvY2Vzc1N5c1Eoc2NoZWR1bGVBY3RvcnModGhpcykpLmNhdGEocHJvY2Vzc1VzZXJRLCBzID0+IHMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9ja1xuICAgICAqIChwZXJmb3JtcyBzaWRlIGVmZmVjdHMgaW1tZWRpYXRlbHkpXG4gICAgICogQHN1bW1hcnkgU3lzdGVtID0+IChTeXN0ZW0g4oaSICBJTzxTeXN0ZW0+KSDihpIgIG51bGxcbiAgICAgKi9cbiAgICB0b2NrKGYpIHtcblxuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuaW9cbiAgICAgICAgICAgIC5yZWR1Y2UoKGlvLCBmKSA9PiBpby5jaGFpbihmKSwgSU8ub2YodGhpcykpXG4gICAgICAgICAgICAuY2hhaW4oZilcbiAgICAgICAgICAgIC5ydW4oKTtcblxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRpY2soKS50b2NrKHMgPT4gSU8ub2YoKCkgPT4gc2V0VGltZW91dCgoKSA9PiBzLnN0YXJ0LCAwKSkpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogc2NoZWR1bGVBY3RvcnNcbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFN5c3RlbVxuICovXG5leHBvcnQgY29uc3Qgc2NoZWR1bGVBY3RvcnMgPSBzID0+XG4gICAgT2JqZWN0LmtleXMocy5hY3RvcnMpLnJlZHVjZSgocywgaykgPT4gcy5hY3RvcnNba10uc2NoZWR1bGUocyksIHMpO1xuXG4vKipcbiAqIHByb2Nlc3NTeXNRIGV4ZWN1dGVzIGEgdGFzayBmcm9tIHRoZSBzeXN0ZW0gcXVldWUgKEZJRk8pXG4gKiBAc3VtbWFyeSBTeXN0ZW0g4oaSICBFaXRoZXI8U3lzdGVtLFN5c3RlbT5cbiAqL1xuZXhwb3J0IGNvbnN0IHByb2Nlc3NTeXNRID0gcyA9PlxuICAgICgocy5tYWlsYm94ZXMuJFswXSA9PSBudWxsKSA/IGxlZnQocykgOiByaWdodChzLm1haWxib3hlcy4kWzBdKSlcbiAgICAuY2hhaW4obSA9PlxuICAgICAgICBtYXRjaChtKVxuICAgICAgICAuY2FzZU9mKEtpbGwsIGtpbGwocykpXG4gICAgICAgIC5lbmQobGVmdCwgcmlnaHQpKVxuICAgIC5tYXAocyA9PiBjb25zb2xlLmxvZyhzKSB8fCBjb3B5KHMsIHtcbiAgICAgICAgbWFpbGJveGVzOiBtZXJnZShzLm1haWxib3hlcywgeyAkOiBzLm1haWxib3hlcy4kLnNsaWNlKDEpIH0pXG4gICAgfSkpXG5cbi8qKlxuICoga2lsbFxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgS2lsbCDihpIgIFN0b3BwZWRcbiAqL1xuZXhwb3J0IGNvbnN0IGtpbGwgPSAoKSA9PiAoKSA9PlxuICAgIG5ldyBTdG9wcGVkKCgpID0+IGNvbnNvbGUud2FybignU3lzdGVtIGlzIGdvaW5nIGRvd24hJykpO1xuXG4vKipcbiAqIHByb2Nlc3NVc2VyUVxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgU3lzdGVtXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9jZXNzVXNlclEgPSBzID0+IHMudGFza3MucmVkdWNlKChzLCB0KSA9PlxuICAgIG1hdGNoKHQpXG4gICAgLmNhc2VPZihTcGF3biwgY3JlYXRlQWN0b3IocykpXG4gICAgLmNhc2VPZihUZWxsLCBkZWxpdmVyKHMpKVxuICAgIC5lbmQoKCkgPT4gcywgcyA9PiBzKSwgcylcblxuLyoqXG4gKiBjcmVhdGVBY3RvclxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgU3Bhd24g4oaSICBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdG9yID0gcyA9PiAoeyB0ZW1wbGF0ZSwgcGFyZW50IH0pID0+XG4gICAgbmV3IFN5c3RlbShcbiAgICAgICAgbWVyZ2Uocy5hY3RvcnMsIHtcblxuICAgICAgICAgICAgICAgIFthZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpXTogdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KG5ldyBBY3RvcihhZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpKSlcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lcmdlKHMubWFpbGJveGVzLCB7XG5cbiAgICAgICAgICAgICAgICBbYWRkcmVzcyhwYXJlbnQsIHRlbXBsYXRlLmlkKV06IFtdXG5cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcy50YXNrcywgcy5pbykpO1xuXG4vKipcbiAqIGRlbGl2ZXIgcHV0cyBtZXNzYWdlcyBpbiB0aGVpciByZXNwZWN0aXZlIG1haWxib3hlcy5cbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFRlbGwg4oaSICBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNvbnN0IGRlbGl2ZXIgPSBzID0+ICh7IHRvLCBmcm9tLCBtZXNzYWdlIH0pID0+XG4gICAgbWF0Y2gocy5tYWlsYm94ZXNbdG9dKVxuICAgIC5jYXNlT2YoQXJyYXksIGJveCA9PiBjb3B5KHMsIHtcbiAgICAgICAgbWFpbGJveGVzOiBtZXJnZShzLm1haWxib3hlcywge1xuICAgICAgICAgICAgW3RvXTogYm94LmNvbmNhdChtZXNzYWdlKVxuICAgICAgICB9KVxuICAgIH0pKVxuICAgIC5jYXNlT2YoRnVuY3Rpb24sIGYgPT4gY29weShzLCB7IGlvOiBzLmlvLmNvbmNhdChzID0+IGYobWVzc2FnZSwgcykpIH0pKVxuICAgIC5jYXNlT2YobnVsbCwgY29weShzLCB7XG4gICAgICAgIG1haWxib3hlczogcy5tYWlsYm94ZXMuJC5jb25jYXQobmV3IERyb3AoeyB0bywgZnJvbSwgbWVzc2FnZSB9KSlcbiAgICB9KSlcbiAgICAuZW5kKHMgPT4gcywgcyA9PiBzKVxuXG4vKipcbiAqIGNvcHkgYSBTeXN0ZW0gcmVwbGFjaW5nIGRlc2lyZWQga2V5c1xuICogQHN1bW1hcnkgKFN5c3RlbSwgT2JqZWN0KSDihpIgIFN5c3RlbVxuICovXG5leHBvcnQgY29uc3QgY29weSA9IChzLCBvKSA9PiB7XG5cbiAgICBiZW9mKHsgcyB9KS5pbnN0YW5jZShTeXN0ZW0pO1xuXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0oXG4gICAgICAgIG8uYWN0b3JzIHx8IHMuYWN0b3JzLFxuICAgICAgICBvLm1haWxib3hlcyB8fCBzLm1haWxib3hlcyxcbiAgICAgICAgby50YXNrcyB8fCBzLnRhc2tzLFxuICAgICAgICBvLmlvIHx8IHMuaW8pO1xuXG59XG5cbi8qKlxuICogYWRkcmVzcyBmb3JtcyB0aGUgYWRkcmVzcyBwYXRoIG9mIGFuIEFjdG9yXG4gKiBAc3VtbWFyeSAoc3RyaW5nLHN0cmluZykg4oaSICBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZHJlc3MgPSAocGFyZW50LCBpZCkgPT4gYCR7cGFyZW50fS8ke2lkfWA7XG4iXX0=