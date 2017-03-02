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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvaW5kZXguanMiXSwibmFtZXMiOlsiTWVzc2FnZSIsInNyYyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiayIsIlRhc2siLCJTcGF3biIsIlRlbGwiLCJ0byIsIm1lc3NhZ2UiLCJLaWxsIiwiUmVjZWl2ZSIsInBhdGgiLCJiZWhhdmlvdXIiLCJBY3RvclQiLCJpZCIsInN0YXJ0IiwiQ29udGV4dCIsInRhc2tzIiwidGVtcGxhdGUiLCJpbnN0YW5jZSIsImNvbmNhdCIsInBhcmVudCIsInMiLCJtIiwic3RyaW5nIiwiU3lzdGVtIiwicmVwbGFjZUFjdG9yIiwiYWN0b3JzIiwibWFpbGJveGVzIiwiaW8iLCJvZiIsImFycmF5Iiwib2JqZWN0IiwicHJvY2Vzc1N5c1EiLCJzY2hlZHVsZUFjdG9ycyIsImNhdGEiLCJwcm9jZXNzVXNlclEiLCJmIiwiZnVuY3Rpb24iLCJjaGFpbiIsInJ1biIsInRpY2siLCJ0b2NrIiwic2V0VGltZW91dCIsInJlZHVjZSIsImEiLCJzY2hlZHVsZSIsIiQiLCJtYXAiLCJjYXNlT2YiLCJraWxsIiwiZW5kIiwiY29uc29sZSIsIndhcm4iLCJ1c2VyRFEiLCJ0IiwiY3JlYXRlQWN0b3IiLCJkZWxpdmVyIiwibWVyZ2UiLCJub3QiLCJib3giLCJib3hlcyIsImMiLCJvMSIsIm8yIiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0lBTWFBLE8sV0FBQUEsTyxHQUVULG1CQUFzQjtBQUFBOztBQUFBLFFBQVZDLEdBQVUsdUVBQUosRUFBSTs7QUFBQTs7QUFFbEJDLFdBQU9DLElBQVAsQ0FBWUYsR0FBWixFQUFpQkcsT0FBakIsQ0FBeUI7QUFBQSxlQUFLLE1BQUtDLENBQUwsSUFBVUosSUFBSUksQ0FBSixDQUFmO0FBQUEsS0FBekI7QUFFSCxDOztBQUlMOzs7OztJQUdhQyxJLFdBQUFBLEk7Ozs7Ozs7Ozs7RUFBYU4sTzs7QUFFMUI7Ozs7Ozs7SUFLYU8sSyxXQUFBQSxLOzs7Ozs7Ozs7O0VBQWNELEk7O0FBRTNCOzs7Ozs7O0lBS2FFLEksV0FBQUEsSSxHQUVULGNBQVlDLEVBQVosRUFBZ0JDLE9BQWhCLEVBQXlCO0FBQUE7O0FBRXJCLFNBQUtELEVBQUwsR0FBVUEsRUFBVjtBQUNBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUVILEM7O0FBSUw7Ozs7O0lBR2FDLEksV0FBQUEsSTs7OztBQUViOzs7Ozs7O0lBS2FDLE8sV0FBQUEsTyxHQUVULGlCQUFZQyxJQUFaLEVBQWtCQyxTQUFsQixFQUE2QjtBQUFBOztBQUV6QixTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUVILEM7O0FBSUw7Ozs7Ozs7O0lBTWFDLE0sV0FBQUEsTSxHQUVULGdCQUFZQyxFQUFaLEVBQWdCQyxLQUFoQixFQUF1QjtBQUFBOztBQUVuQixTQUFLRCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFFSCxDOztBQUlMOzs7OztJQUdhQyxPLFdBQUFBLE87QUFFVCxxQkFBWUwsSUFBWixFQUE4QjtBQUFBLFlBQVpNLEtBQVksdUVBQUosRUFBSTs7QUFBQTs7QUFFMUIsYUFBS04sSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS00sS0FBTCxHQUFhQSxLQUFiO0FBRUg7O0FBRUQ7Ozs7Ozs7OEJBR01DLFEsRUFBVTs7QUFFWixnQ0FBSyxFQUFFQSxrQkFBRixFQUFMLEVBQW1CQyxRQUFuQixDQUE0Qk4sTUFBNUI7O0FBRUEsbUJBQU8sSUFBSUcsT0FBSixDQUFZLEtBQUtMLElBQWpCLEVBQ0gsS0FBS00sS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlmLEtBQUosQ0FBVSxFQUFFZ0IsUUFBUSxLQUFLVixJQUFmLEVBQXFCTyxrQkFBckIsRUFBVixDQUFsQixDQURHLENBQVA7QUFHSDs7QUFFRDs7Ozs7Ozs2QkFJS0ksQyxFQUFHQyxDLEVBQUc7O0FBRVAsZ0NBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlFLE1BQVo7O0FBRUEsbUJBQU8sSUFBSVIsT0FBSixDQUFZLEtBQUtMLElBQWpCLEVBQXVCLEtBQUtNLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJZCxJQUFKLENBQVNnQixDQUFULEVBQVlDLENBQVosQ0FBbEIsQ0FBdkIsQ0FBUDtBQUVIOztBQUVEOzs7Ozs7O2lDQUlTRCxDLEVBQUc7O0FBRVIsZ0NBQUssRUFBRUEsSUFBRixFQUFMLEVBQVlILFFBQVosQ0FBcUJNLE1BQXJCOztBQUVBLG1CQUFPLElBQUlBLE1BQUosQ0FDSEMsYUFBYSxJQUFJVixPQUFKLENBQVksS0FBS0wsSUFBakIsRUFBdUIsRUFBdkIsQ0FBYixFQUF5Q1csRUFBRUssTUFBM0MsQ0FERyxFQUVITCxFQUFFTSxTQUZDLEVBR0hOLEVBQUVMLEtBQUYsQ0FBUUcsTUFBUixDQUFlLEtBQUtILEtBQXBCLENBSEcsRUFJSEssRUFBRU8sRUFKQyxDQUFQO0FBTUg7Ozs7OztBQUlMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQmFKLE0sV0FBQUEsTTtBQUVULHNCQUFnRjtBQUFBLFlBQXBFRSxNQUFvRSx1RUFBM0QsRUFBMkQ7QUFBQSxZQUF2REMsU0FBdUQsdUVBQTNDLEVBQUUsS0FBSyxFQUFQLEVBQTJDO0FBQUEsWUFBOUJYLEtBQThCLHVFQUF0QixFQUFzQjtBQUFBLFlBQWxCWSxFQUFrQix1RUFBYixVQUFHQyxFQUFILENBQU0sSUFBTixDQUFhOztBQUFBOztBQUU1RSw0QkFBSyxFQUFFSCxjQUFGLEVBQUwsRUFBaUJJLEtBQWpCO0FBQ0EsNEJBQUssRUFBRUgsb0JBQUYsRUFBTCxFQUFvQkksTUFBcEI7QUFDQSw0QkFBSyxFQUFFZixZQUFGLEVBQUwsRUFBZ0JjLEtBQWhCO0FBQ0EsNEJBQUssRUFBRUYsTUFBRixFQUFMLEVBQWFWLFFBQWI7O0FBRUEsYUFBS1EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxhQUFLWCxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLWSxFQUFMLEdBQVVBLEVBQVY7QUFFSDs7QUFFRDs7Ozs7Ozs7Ozs4QkFNTVgsUSxFQUFVOztBQUVaLGdDQUFLLEVBQUVBLGtCQUFGLEVBQUwsRUFBbUJDLFFBQW5CLENBQTRCTixNQUE1Qjs7QUFFQSxtQkFBTyxJQUFJWSxNQUFKLENBQ0gsS0FBS0UsTUFERixFQUVILEtBQUtDLFNBRkYsRUFHSCxLQUFLWCxLQUFMLENBQVdHLE1BQVgsQ0FBa0IsSUFBSWYsS0FBSixDQUFVLEVBQUVnQixRQUFRLEVBQVYsRUFBY0gsa0JBQWQsRUFBVixDQUFsQixDQUhHLEVBR3FELEtBQUtXLEVBSDFELENBQVA7QUFLSDs7QUFFRDs7Ozs7OzsrQkFJTzs7QUFFSCxtQkFBT0ksWUFBWUMsZUFBZSxJQUFmLENBQVosRUFBa0NDLElBQWxDLENBQXVDQyxZQUF2QyxFQUFxRDtBQUFBLHVCQUFLZCxDQUFMO0FBQUEsYUFBckQsQ0FBUDtBQUVIOztBQUVEOzs7Ozs7Ozs2QkFLS2UsQyxFQUFHOztBQUVKLGdDQUFLLEVBQUVBLElBQUYsRUFBTCxFQUFZQyxRQUFaOztBQUVBLG1CQUFPLEtBQUtULEVBQUwsQ0FBUVUsS0FBUixDQUFjO0FBQUEsdUJBQU1qQixLQUFLLElBQU4sR0FBYyxVQUFHUSxFQUFILENBQU0sSUFBTixDQUFkLEdBQTRCLFVBQUdBLEVBQUgsQ0FBTTtBQUFBLDJCQUFNTyxFQUFFZixDQUFGLENBQU47QUFBQSxpQkFBTixDQUFqQztBQUFBLGFBQWQsRUFBa0VrQixHQUFsRSxFQUFQO0FBRUg7OztnQ0FFTzs7QUFFSixtQkFBTyxLQUFLQyxJQUFMLEdBQVlDLElBQVosQ0FBaUI7QUFBQSx1QkFBSyxVQUFHWixFQUFILENBQU07QUFBQSwyQkFBTWEsV0FBVztBQUFBLCtCQUFNckIsRUFBRVAsS0FBUjtBQUFBLHFCQUFYLEVBQTBCLENBQTFCLENBQU47QUFBQSxpQkFBTixDQUFMO0FBQUEsYUFBakIsQ0FBUDtBQUVIOzs7Ozs7QUFJTDs7Ozs7O0FBSU8sSUFBTW1CLDBDQUFpQixTQUFqQkEsY0FBaUI7QUFBQSxXQUFLWixFQUFFSyxNQUFGLENBQVNpQixNQUFULENBQWdCLFVBQUN0QixDQUFELEVBQUl1QixDQUFKO0FBQUEsZUFBVUEsRUFBRUMsUUFBRixDQUFXeEIsQ0FBWCxDQUFWO0FBQUEsS0FBaEIsRUFBeUNBLENBQXpDLENBQUw7QUFBQSxDQUF2Qjs7QUFFUDs7OztBQUlPLElBQU1XLG9DQUFjLFNBQWRBLFdBQWM7QUFBQSxXQUN2QixDQUFFWCxFQUFFTSxTQUFGLENBQVltQixDQUFaLENBQWMsQ0FBZCxLQUFvQixJQUFyQixHQUE2QixpQkFBS3pCLENBQUwsQ0FBN0IsR0FBdUMsa0JBQU1BLEVBQUVNLFNBQUYsQ0FBWW1CLENBQVosQ0FBYyxDQUFkLENBQU4sQ0FBeEMsRUFDQ0MsR0FERCxDQUNLO0FBQUEsZUFDRCxrQkFBTXpCLENBQU4sRUFDQzBCLE1BREQsQ0FDUXhDLElBRFIsRUFDYztBQUFBLG1CQUFNeUMsS0FBSzVCLENBQUwsQ0FBTjtBQUFBLFNBRGQsRUFFQzZCLEdBRkQsMkJBREM7QUFBQSxLQURMLENBRHVCO0FBQUEsQ0FBcEI7O0FBT1A7Ozs7QUFJTyxJQUFNRCxzQkFBTyxTQUFQQSxJQUFPO0FBQUEsV0FBTTtBQUFBLGVBQ3RCLElBQUl6QixNQUFKLENBQVcsRUFBWCxFQUFlLEVBQWYsRUFBbUIsRUFBbkIsRUFDSSxVQUFHSyxFQUFILENBQU07QUFBQSxtQkFBTXNCLFFBQVFDLElBQVIsQ0FBYSx1QkFBYixDQUFOO0FBQUEsU0FBTixDQURKLENBRHNCO0FBQUEsS0FBTjtBQUFBLENBQWI7O0FBSVA7Ozs7QUFJTyxJQUFNakIsc0NBQWUsU0FBZkEsWUFBZTtBQUFBLFdBQ3hCZCxFQUFFTCxLQUFGLENBQVEyQixNQUFSLENBQWVVLE1BQWYsRUFBdUJoQyxDQUF2QixDQUR3QjtBQUFBLENBQXJCOztBQUdQOzs7O0FBSU8sSUFBTWdDLDBCQUFTLFNBQVRBLE1BQVMsQ0FBQ2hDLENBQUQsRUFBSWlDLENBQUo7QUFBQSxXQUNsQixrQkFBTUEsQ0FBTixFQUNDTixNQURELENBQ1E1QyxLQURSLEVBQ2VtRCxZQUFZbEMsQ0FBWixDQURmLEVBRUMyQixNQUZELENBRVEzQyxJQUZSLEVBRWNtRCxRQUFRbkMsQ0FBUixDQUZkLEVBR0M2QixHQUhELENBR0s7QUFBQSxlQUFHSSxDQUFIO0FBQUEsS0FITCxFQUdXO0FBQUEsZUFBR0EsQ0FBSDtBQUFBLEtBSFgsQ0FEa0I7QUFBQSxDQUFmOztBQU1QOzs7O0FBSU8sSUFBTUMsb0NBQWMsU0FBZEEsV0FBYztBQUFBLFdBQUs7QUFBQSxZQUFHdEMsUUFBSCxRQUFHQSxRQUFIO0FBQUEsWUFBYUcsTUFBYixRQUFhQSxNQUFiO0FBQUEsZUFDNUIsSUFBSUksTUFBSixDQUNJSCxFQUFFSyxNQUFGLENBQVNQLE1BQVQsQ0FBZ0JGLFNBQVNILEtBQVQsQ0FBZSxJQUFJQyxPQUFKLENBQWVLLE1BQWYsU0FBeUJILFNBQVNKLEVBQWxDLENBQWYsQ0FBaEIsQ0FESixFQUVJNEMsTUFBTXBDLEVBQUVNLFNBQVIsc0JBQ1FQLE9BQU9WLElBRGYsU0FDdUJPLFNBQVNKLEVBRGhDLEVBQ3VDLEVBRHZDLEVBRkosRUFLSVEsRUFBRUwsS0FMTixFQUthSyxFQUFFTyxFQUxmLENBRDRCO0FBQUEsS0FBTDtBQUFBLENBQXBCOztBQVFQOzs7O0FBSU8sSUFBTTRCLDRCQUFVLFNBQVZBLE9BQVU7QUFBQSxXQUFLO0FBQUEsWUFBR2xELEVBQUgsU0FBR0EsRUFBSDtBQUFBLFlBQU9DLE9BQVAsU0FBT0EsT0FBUDtBQUFBLGVBQ3hCLGFBQ0NtRCxHQURELENBQ0tyQyxFQUFFTSxTQUFGLENBQVlyQixFQUFaLENBREwsRUFFQ3lDLEdBRkQsQ0FFSztBQUFBLG1CQUFPVSxNQUFNcEMsRUFBRU0sU0FBUixzQkFDUHJCLEVBRE8sRUFDRnFELElBQUl4QyxNQUFKLENBQVdaLE9BQVgsQ0FERSxFQUFQO0FBQUEsU0FGTCxFQUtDd0MsR0FMRCxDQUtLO0FBQUEsbUJBQVMsSUFBSXZCLE1BQUosQ0FBV0gsRUFBRUssTUFBYixFQUFxQmtDLEtBQXJCLEVBQTRCdkMsRUFBRUwsS0FBOUIsRUFBcUNLLEVBQUVPLEVBQXZDLENBQVQ7QUFBQSxTQUxMLENBRHdCO0FBQUEsS0FBTDtBQUFBLENBQWhCOztBQVFQOzs7O0FBSU8sSUFBTUgsc0NBQWUsU0FBZkEsWUFBZSxDQUFDbUIsQ0FBRCxFQUFJaUIsQ0FBSjtBQUFBLFdBQ3hCakIsRUFBRUcsR0FBRixDQUFNO0FBQUEsZUFBTUgsRUFBRWxDLElBQUYsS0FBV21ELEVBQUVuRCxJQUFkLEdBQXNCbUQsQ0FBdEIsR0FBMEJqQixDQUEvQjtBQUFBLEtBQU4sQ0FEd0I7QUFBQSxDQUFyQjs7QUFHUDs7OztBQUlPLElBQU1hLHdCQUFRLFNBQVJBLEtBQVEsQ0FBQ0ssRUFBRCxFQUFLQyxFQUFMO0FBQUEsV0FBWWhFLE9BQU9pRSxNQUFQLENBQWMsRUFBZCxFQUFrQkYsRUFBbEIsRUFBc0JDLEVBQXRCLENBQVo7QUFBQSxDQUFkIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgeyBJTywgbGVmdCwgcmlnaHQsIE1heWJlIH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuXG4vKipcbiAqIE1lc3NhZ2UgY29waWVzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFuZCBhc3NpZ25zIHRoZW0gdG8gaXRzZWxmLlxuICpcbiAqIFRoaXMgY2xhc3MgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGFkaG9jIHR5cGUgaGllYXJjaGllcyBmb3IgeW91ciBjb2RlIGJhc2VzIG1lc3NhZ2VzLlxuICogQHBhcmFtIHtvYmplY3R9IHNyY1xuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihzcmMgPSB7fSkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrID0+IHRoaXNba10gPSBzcmNba10pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVGFza1xuICovXG5leHBvcnQgY2xhc3MgVGFzayBleHRlbmRzIE1lc3NhZ2Uge31cblxuLyoqXG4gKiBTcGF3blxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhcmVudFxuICogQHByb3BlcnR5IHtBY3RvclR9IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGF3biBleHRlbmRzIFRhc2sge31cblxuLyoqXG4gKiBUZWxsXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9cbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgVGVsbCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0bywgbWVzc2FnZSkge1xuXG4gICAgICAgIHRoaXMudG8gPSB0b1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogS2lsbCBhbiBBY3RvclxuICovXG5leHBvcnQgY2xhc3MgS2lsbCB7fVxuXG4vKipcbiAqIFJlY2VpdmVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXRoXG4gKiBAcHJvcGVydHkge0JlaGF2aW91cn0gYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNlaXZlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIGJlaGF2aW91cikge1xuXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuYmVoYXZpb3VyID0gYmVoYXZpb3VyO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JUIGlzIGEgdGVtcGxhdGUgZm9yIGNyZWF0aW5nIGFjdG9ycyB0aGF0IHJ1biBpblxuICogdGhlIHNhbWUgZXZlbnQgbG9vcCBhcyB0aGUgc3lzdGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIC0gbXVzdCBiZSB1bmlxdWVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHN0YXJ0IC0gQ29udGV4dCDihpIgIENvbnRleHRcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yVCB7XG5cbiAgICBjb25zdHJ1Y3RvcihpZCwgc3RhcnQpIHtcblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENvbnRleHRcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgdGFza3MgPSBbXSkge1xuXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNwYXduXG4gICAgICovXG4gICAgc3Bhd24odGVtcGxhdGUpIHtcblxuICAgICAgICBiZW9mKHsgdGVtcGxhdGUgfSkuaW5zdGFuY2UoQWN0b3JUKTtcblxuICAgICAgICByZXR1cm4gbmV3IENvbnRleHQodGhpcy5wYXRoLFxuICAgICAgICAgICAgdGhpcy50YXNrcy5jb25jYXQobmV3IFNwYXduKHsgcGFyZW50OiB0aGlzLnBhdGgsIHRlbXBsYXRlIH0pKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZWxsIHNlbmRzIGEgbWVzc2FnZSB0byBhbm90aGVyIGFjdG9yIHdpdGhpbiB0aGUgc3lzdGVtLlxuICAgICAqIEBzdW1tYXJ5IChzdHJpbmcsKikg4oaSICBDb250ZXh0XG4gICAgICovXG4gICAgdGVsbChzLCBtKSB7XG5cbiAgICAgICAgYmVvZih7IHMgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDb250ZXh0KHRoaXMucGF0aCwgdGhpcy50YXNrcy5jb25jYXQobmV3IFRlbGwocywgbSkpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNjaGVkdWxlIHRhc2tzIHdpdGhpbiBhIFN5c3RlbVxuICAgICAqIEBzdW1tYXJ5IHtTeXN0ZW19IOKGkiAge1N5c3RlbX1cbiAgICAgKi9cbiAgICBzY2hlZHVsZShzKSB7XG5cbiAgICAgICAgYmVvZih7IHMgfSkuaW5zdGFuY2UoU3lzdGVtKTtcblxuICAgICAgICByZXR1cm4gbmV3IFN5c3RlbShcbiAgICAgICAgICAgIHJlcGxhY2VBY3RvcihuZXcgQ29udGV4dCh0aGlzLnBhdGgsIFtdKSwgcy5hY3RvcnMpLFxuICAgICAgICAgICAgcy5tYWlsYm94ZXMsXG4gICAgICAgICAgICBzLnRhc2tzLmNvbmNhdCh0aGlzLnRhc2tzKSxcbiAgICAgICAgICAgIHMuaW8pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU3lzdGVtIGltcGxlbWVudGF0aW9ucyBhcmUgdGhlIHN5c3RlbSBwYXJ0IG9mIHRoZSBhY3RvciBtb2RlbMK5LlxuICpcbiAqIEEgU3lzdGVtIGlzIGVmZmVjdGl2ZWx5IGEgbWVzaCBuZXR3b3JrIHdoZXJlIGFueSBub2RlIGNhblxuICogY29tbXVuaWNhdGUgd2l0aCBhbm90aGVyIHByb3ZpZGVkIHRoZXkgaGF2ZSBhbiB1bmZvcmdhYmxlIGFkZHJlc3MgZm9yIHRoYXQgbm9kZVxuICogKGFuZCBhcmUgYWxsb3dlZCB0bykuXG4gKlxuICogUHJldmlvdXNseSB0aGlzIHdhcyB0YWNrbGVkIGFzIGEgY2xhc3Mgd2hvc2UgcmVmZXJlbmNlIHdhcyBzaGFyZWQgYmV0d2VlbiB0aGVcbiAqIGNoaWxkIGFjdG9ycycgY29udGV4dHMuIE5vdyB3ZSBzdGlsbCB0YWtlIGEgc2ltaWxsYXIgYXBwcm9hY2hcbiAqIGJ1dCBpbnN0ZWFkIG9mIGJlaW5nIGEgc2luZ2xldG9uIHRoZSBTeXN0ZW0ncyBpbXBsZW1lbnRhdGlvbiBpcyBpbmZsdWVuY2VkIGJ5IE1vbmFkcy5cbiAqXG4gKiBXZSBhbHNvIGludGVuZCB0byB1bmlmeSBhY3RvcnMgdGhhdCBydW4gb24gc2VwZXJhdGUgdGhyZWFkcy9wcm9jZXNzIHdpdGggb25lcyBvbiB0aGVcbiAqIG1haW4gbG9vcCB0aHVzIGVsaW1pbmF0aW5nIHRoZSBuZWVkIGZvciBhbiBlbnZpcm9ubWVudCBzcGVjaWZpYyBTeXN0ZW0uXG4gKlxuICogwrkgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQWN0b3JfbW9kZWxcbiAqL1xuZXhwb3J0IGNsYXNzIFN5c3RlbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihhY3RvcnMgPSBbXSwgbWFpbGJveGVzID0geyAnJCc6IFtdIH0sIHRhc2tzID0gW10sIGlvID0gSU8ub2YobnVsbCkpIHtcblxuICAgICAgICBiZW9mKHsgYWN0b3JzIH0pLmFycmF5KCk7XG4gICAgICAgIGJlb2YoeyBtYWlsYm94ZXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyB0YXNrcyB9KS5hcnJheSgpO1xuICAgICAgICBiZW9mKHsgaW8gfSkuaW5zdGFuY2UoSU8pO1xuXG4gICAgICAgIHRoaXMuYWN0b3JzID0gYWN0b3JzO1xuICAgICAgICB0aGlzLm1haWxib3hlcyA9IG1haWxib3hlcztcbiAgICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuICAgICAgICB0aGlzLmlvID0gaW87XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzcGF3biBhIG5ldyBhY3Rvci5cbiAgICAgKlxuICAgICAqIFRoZSBhY3RvciB3aWxsIGJlIHNwYXduZWQgb24gdGhlIG5leHQgdHVybiBvZiB0aGUgZXZlbnQgbG9vcC5cbiAgICAgKiBAc3VtbWFyeSBBY3RvclQg4oaSICBTeXN0ZW1cbiAgICAgKi9cbiAgICBzcGF3bih0ZW1wbGF0ZSkge1xuXG4gICAgICAgIGJlb2YoeyB0ZW1wbGF0ZSB9KS5pbnN0YW5jZShBY3RvclQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3lzdGVtKFxuICAgICAgICAgICAgdGhpcy5hY3RvcnMsXG4gICAgICAgICAgICB0aGlzLm1haWxib3hlcyxcbiAgICAgICAgICAgIHRoaXMudGFza3MuY29uY2F0KG5ldyBTcGF3bih7IHBhcmVudDogJycsIHRlbXBsYXRlIH0pKSwgdGhpcy5pbyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aWNrXG4gICAgICogQHN1bW1hcnkgU3lzdGVtID0+IFN5c3RlbVxuICAgICAqL1xuICAgIHRpY2soKSB7XG5cbiAgICAgICAgcmV0dXJuIHByb2Nlc3NTeXNRKHNjaGVkdWxlQWN0b3JzKHRoaXMpKS5jYXRhKHByb2Nlc3NVc2VyUSwgcyA9PiBzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvY2tcbiAgICAgKiAocGVyZm9ybXMgc2lkZSBlZmZlY3RzIGltbWVkaWF0ZWx5KVxuICAgICAqIEBzdW1tYXJ5IFN5c3RlbSA9PiAoU3lzdGVtIOKGkiAgU3lzdGVtKSDihpIgIElPPG51bGw+XG4gICAgICovXG4gICAgdG9jayhmKSB7XG5cbiAgICAgICAgYmVvZih7IGYgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pby5jaGFpbihzID0+IChzID09IG51bGwpID8gSU8ub2YobnVsbCkgOiBJTy5vZigoKSA9PiBmKHMpKSkucnVuKCk7XG5cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50aWNrKCkudG9jayhzID0+IElPLm9mKCgpID0+IHNldFRpbWVvdXQoKCkgPT4gcy5zdGFydCwgMCkpKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIHNjaGVkdWxlQWN0b3JzXG4gKiBAc3VtbWFyeSBTeXN0ZW0g4oaSICBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNvbnN0IHNjaGVkdWxlQWN0b3JzID0gcyA9PiBzLmFjdG9ycy5yZWR1Y2UoKHMsIGEpID0+IGEuc2NoZWR1bGUocyksIHMpO1xuXG4vKipcbiAqIHByb2Nlc3NTeXNRXG4gKiBAc3VtbWFyeSBTeXN0ZW0g4oaSICBFaXRoZXI8U3lzdGVtLFN5c3RlbT5cbiAqL1xuZXhwb3J0IGNvbnN0IHByb2Nlc3NTeXNRID0gcyA9PlxuICAgICgocy5tYWlsYm94ZXMuJFswXSA9PSBudWxsKSA/IGxlZnQocykgOiByaWdodChzLm1haWxib3hlcy4kWzBdKSlcbiAgICAubWFwKG0gPT5cbiAgICAgICAgbWF0Y2gobSlcbiAgICAgICAgLmNhc2VPZihLaWxsLCAoKSA9PiBraWxsKHMpKVxuICAgICAgICAuZW5kKGxlZnQsIHJpZ2h0KSk7XG5cbi8qKlxuICoga2lsbFxuICogQHN1bW1hcnkgU3lzdGVtIOKGkiAgS2lsbCDihpIgU3lzdGVtXG4gKi9cbmV4cG9ydCBjb25zdCBraWxsID0gKCkgPT4gKCkgPT5cbiAgICBuZXcgU3lzdGVtKFtdLCB7fSwgW10sXG4gICAgICAgIElPLm9mKCgpID0+IGNvbnNvbGUud2FybignU3lzdGVtIGlzIGdvaW5nIGRvd24hJykpKTtcblxuLyoqXG4gKiBwcm9jZXNzVXNlclFcbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFN5c3RlbVxuICovXG5leHBvcnQgY29uc3QgcHJvY2Vzc1VzZXJRID0gcyA9PlxuICAgIHMudGFza3MucmVkdWNlKHVzZXJEUSwgcyk7XG5cbi8qKlxuICogdXNlckRRIGhhbmRsZXMgYSB0YXNrIGdlbmVyYXRlZCBieSB0aGUgdXNlciBsZXZlbFxuICogQHN1bW1hcnkgKFN5c3RlbSwgVGFzaykg4oaSICBTeXN0ZW1cbiAqL1xuZXhwb3J0IGNvbnN0IHVzZXJEUSA9IChzLCB0KSA9PlxuICAgIG1hdGNoKHQpXG4gICAgLmNhc2VPZihTcGF3biwgY3JlYXRlQWN0b3IocykpXG4gICAgLmNhc2VPZihUZWxsLCBkZWxpdmVyKHMpKVxuICAgIC5lbmQodD0+dCwgdD0+dCk7XG5cbi8qKlxuICogY3JlYXRlQWN0b3JcbiAqIEBzdW1tYXJ5IFN5c3RlbSDihpIgIFNwYXduIOKGkiAgSU88U3lzdGVtPlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0b3IgPSBzID0+ICh7IHRlbXBsYXRlLCBwYXJlbnQgfSkgPT5cbiAgICBuZXcgU3lzdGVtKFxuICAgICAgICBzLmFjdG9ycy5jb25jYXQodGVtcGxhdGUuc3RhcnQobmV3IENvbnRleHQoYCR7cGFyZW50fS8ke3RlbXBsYXRlLmlkfWApKSksXG4gICAgICAgIG1lcmdlKHMubWFpbGJveGVzLCB7XG4gICAgICAgICAgICBbYCR7cGFyZW50LnBhdGh9LyR7dGVtcGxhdGUuaWR9YF06IFtdXG4gICAgICAgIH0pLFxuICAgICAgICBzLnRhc2tzLCBzLmlvKTtcblxuLyoqXG4gKiBkZWxpdmVyIHB1dHMgbWVzc2FnZXMgaW4gdGhlaXIgcmVzcGVjdGl2ZSBtYWlsYm94ZXMuXG4gKiBAc3VtbWFyeSBTeXN0ZW0g4oaSICBUZWxsIOKGkiAgSU88U3lzdGVtPlxuICovXG5leHBvcnQgY29uc3QgZGVsaXZlciA9IHMgPT4gKHsgdG8sIG1lc3NhZ2UgfSkgPT5cbiAgICBNYXliZVxuICAgIC5ub3Qocy5tYWlsYm94ZXNbdG9dKVxuICAgIC5tYXAoYm94ID0+IG1lcmdlKHMubWFpbGJveGVzLCB7XG4gICAgICAgIFt0b106IGJveC5jb25jYXQobWVzc2FnZSlcbiAgICB9KSlcbiAgICAubWFwKGJveGVzID0+IG5ldyBTeXN0ZW0ocy5hY3RvcnMsIGJveGVzLCBzLnRhc2tzLCBzLmlvKSk7XG5cbi8qKlxuICogcmVwbGFjZUFjdG9yIHJlcGxhY2VzIGEgQ29udGV4dCB3aXRoaW4gYSBsaXN0IG9mIENvbnRleHRzIHdpdGggYSBuZXcgdmVyc2lvbi5cbiAqIEBzdW1tYXJ5IChDb250ZXh0LEFycmF5PENvbnRleHQ+KSDihpIgIEFycmF5PENvbnRleHQ+XG4gKi9cbmV4cG9ydCBjb25zdCByZXBsYWNlQWN0b3IgPSAoYSwgYykgPT5cbiAgICBhLm1hcChhID0+IChhLnBhdGggPT09IGMucGF0aCkgPyBjIDogYSk7XG5cbi8qKlxuICogbWVyZ2UgdHdvIG9iamVjdHMgZWFzaWx5XG4gKiBAc3VtbWFyeSAoT2JqZWN0LCBPYmplY3QpIOKGkiAgT2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBtZXJnZSA9IChvMSwgbzIpID0+IE9iamVjdC5hc3NpZ24oe30sIG8xLCBvMik7XG4iXX0=