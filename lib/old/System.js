'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.System = exports.replace = exports.Context = exports.EventTemplate = exports.Template = exports.Top = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _monad = require('./monad');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @typedef TakePair
 * @property {Array<function<} tasks
 * @property {Array<Context>} actors
 */

/**
 * Top
 * @property {Array<Node>} children
 */
var Top = exports.Top = function Top() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Top);

    this.children = children;
};

/**
 * Node is a data structure we use to record the hierachy of the actor system.
 *
 * Rather than store the nodes in here, we store the ids with information about
 * the index, parent and child.
 * @property {number} index
 * @property {string} parent
 * @property {Array<string>} children
 */


var Node = function Node(index, parent, children) {
    _classCallCheck(this, Node);

    this.index = (0, _beof2.default)({ index: index }).optional().number().value;
    this.parent = (0, _beof2.default)({ parent: parent }).optional().instance(Node).value;
    this.children = (0, _beof2.default)({ children: children }).array().value;
};

/**
 * Template is an abstract type that represents information for creating an actor.
 */


var Template = exports.Template = function Template() {
    _classCallCheck(this, Template);
};

/**
 * EventTemplate is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Context →  Context
 */


var EventTemplate = exports.EventTemplate = function (_Template) {
    _inherits(EventTemplate, _Template);

    function EventTemplate(id, start) {
        _classCallCheck(this, EventTemplate);

        var _this = _possibleConstructorReturn(this, (EventTemplate.__proto__ || Object.getPrototypeOf(EventTemplate)).call(this));

        _this.id = id;
        _this.start = start;

        return _this;
    }

    return EventTemplate;
}(Template);

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
        value: function spawn(t) {

            return new Context(this.path, this.tasks.concat(function (sys) {
                return new System(sys.actors.concat(t.start(new Context('{this.path}/' + t.id))), []);
            }));
        }

        /**
         * schedule tasks within a System
         * @summary {System} →  {System}
         */

    }, {
        key: 'schedule',
        value: function schedule(s) {

            return new System(replace(new Context(this.path), this.actors), s.tasks.concat(this.tasks));
        }
    }]);

    return Context;
}();

/**
 * replace a Context within a list of Contexts with a new version.
 * @summary (Context,Array<Context>) →  Array<Context>
 */


var replace = exports.replace = function replace(a, c) {
    return a.map(function (a) {
        return a.path === c.path ? c : a;
    });
};

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
        var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, System);

        this.actors = actors;
        this.tasks = tasks;
    }

    /**
     * spawn a new actor.
     *
     * The actor will be spawned on the next turn of the event loop.
     * @summary Template →  System
     */


    _createClass(System, [{
        key: 'spawn',
        value: function spawn(t) {
            var _this2 = this;

            return new System(this.actors, this.tasks.concat(function (sys) {
                return new System(sys.actors.concat(t.start(new Context(t.id, _this2, []))), []);
            }));
        }

        /**
         * schedule the side effects of this system.
         * @summary () →  IO
         */

    }, {
        key: 'schedule',
        value: function schedule() {

            _monad.IO.of(this.actors.reduce(function (s, a) {
                return a.schedule(s);
            }, this)).chain(function (sys) {
                return sys.tasks.reduce(function (io, t) {
                    return io.map(t);
                }, _monad.IO.of(sys));
            }).chain(function (sys) {
                return _monad.IO.of(function () {
                    return setTimeout(function () {
                        return sys.schedule().run();
                    }, 0);
                });
            });
        }
    }]);

    return System;
}();

exports.default = System;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvU3lzdGVtLmpzeCJdLCJuYW1lcyI6WyJUb3AiLCJjaGlsZHJlbiIsIk5vZGUiLCJpbmRleCIsInBhcmVudCIsIm9wdGlvbmFsIiwibnVtYmVyIiwidmFsdWUiLCJpbnN0YW5jZSIsImFycmF5IiwiVGVtcGxhdGUiLCJFdmVudFRlbXBsYXRlIiwiaWQiLCJzdGFydCIsIkNvbnRleHQiLCJwYXRoIiwidGFza3MiLCJ0IiwiY29uY2F0IiwiU3lzdGVtIiwic3lzIiwiYWN0b3JzIiwicyIsInJlcGxhY2UiLCJhIiwiYyIsIm1hcCIsIm9mIiwicmVkdWNlIiwic2NoZWR1bGUiLCJjaGFpbiIsImlvIiwic2V0VGltZW91dCIsInJ1biJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7O0FBT0E7Ozs7SUFJYUEsRyxXQUFBQSxHLEdBRVQsZUFBMkI7QUFBQSxRQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBRXZCLFNBQUtBLFFBQUwsR0FBZ0JBLFFBQWhCO0FBRUgsQzs7QUFJTDs7Ozs7Ozs7Ozs7SUFTTUMsSSxHQUVGLGNBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCSCxRQUEzQixFQUFxQztBQUFBOztBQUVqQyxTQUFLRSxLQUFMLEdBQWEsb0JBQUssRUFBRUEsWUFBRixFQUFMLEVBQWdCRSxRQUFoQixHQUEyQkMsTUFBM0IsR0FBb0NDLEtBQWpEO0FBQ0EsU0FBS0gsTUFBTCxHQUFjLG9CQUFLLEVBQUVBLGNBQUYsRUFBTCxFQUFpQkMsUUFBakIsR0FBNEJHLFFBQTVCLENBQXFDTixJQUFyQyxFQUEyQ0ssS0FBekQ7QUFDQSxTQUFLTixRQUFMLEdBQWdCLG9CQUFLLEVBQUVBLGtCQUFGLEVBQUwsRUFBbUJRLEtBQW5CLEdBQTJCRixLQUEzQztBQUVILEM7O0FBSUw7Ozs7O0lBR2FHLFEsV0FBQUEsUTs7OztBQUliOzs7Ozs7OztJQU1hQyxhLFdBQUFBLGE7OztBQUVULDJCQUFZQyxFQUFaLEVBQWdCQyxLQUFoQixFQUF1QjtBQUFBOztBQUFBOztBQUduQixjQUFLRCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxjQUFLQyxLQUFMLEdBQWFBLEtBQWI7O0FBSm1CO0FBTXRCOzs7RUFSOEJILFE7O0FBWW5DOzs7OztJQUdhSSxPLFdBQUFBLE87QUFFVCxxQkFBWUMsSUFBWixFQUE4QjtBQUFBLFlBQVpDLEtBQVksdUVBQUosRUFBSTs7QUFBQTs7QUFFMUIsYUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBRUg7O0FBRUQ7Ozs7Ozs7OEJBR01DLEMsRUFBRzs7QUFFTCxtQkFBTyxJQUFJSCxPQUFKLENBQVksS0FBS0MsSUFBakIsRUFDSCxLQUFLQyxLQUFMLENBQVdFLE1BQVgsQ0FDSTtBQUFBLHVCQUFPLElBQUlDLE1BQUosQ0FDSEMsSUFBSUMsTUFBSixDQUFXSCxNQUFYLENBQWtCRCxFQUFFSixLQUFGLENBQ2QsSUFBSUMsT0FBSixrQkFBMkJHLEVBQUVMLEVBQTdCLENBRGMsQ0FBbEIsQ0FERyxFQUV1QyxFQUZ2QyxDQUFQO0FBQUEsYUFESixDQURHLENBQVA7QUFNSDs7QUFFRDs7Ozs7OztpQ0FJU1UsQyxFQUFHOztBQUVSLG1CQUFPLElBQUlILE1BQUosQ0FDSEksUUFBUSxJQUFJVCxPQUFKLENBQVksS0FBS0MsSUFBakIsQ0FBUixFQUFnQyxLQUFLTSxNQUFyQyxDQURHLEVBRUhDLEVBQUVOLEtBQUYsQ0FBUUUsTUFBUixDQUFlLEtBQUtGLEtBQXBCLENBRkcsQ0FBUDtBQUlIOzs7Ozs7QUFJTDs7Ozs7O0FBSU8sSUFBTU8sNEJBQVUsU0FBVkEsT0FBVSxDQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxXQUNuQkQsRUFBRUUsR0FBRixDQUFNO0FBQUEsZUFBTUYsRUFBRVQsSUFBRixLQUFXVSxFQUFFVixJQUFkLEdBQXNCVSxDQUF0QixHQUEwQkQsQ0FBL0I7QUFBQSxLQUFOLENBRG1CO0FBQUEsQ0FBaEI7O0FBR1A7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JhTCxNLFdBQUFBLE07QUFFVCxzQkFBcUM7QUFBQSxZQUF6QkUsTUFBeUIsdUVBQWhCLEVBQWdCO0FBQUEsWUFBWkwsS0FBWSx1RUFBSixFQUFJOztBQUFBOztBQUVqQyxhQUFLSyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFLTCxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs7Ozs4QkFNTUMsQyxFQUFHO0FBQUE7O0FBRUwsbUJBQU8sSUFBSUUsTUFBSixDQUFXLEtBQUtFLE1BQWhCLEVBQ0gsS0FBS0wsS0FBTCxDQUFXRSxNQUFYLENBQ0k7QUFBQSx1QkFBTyxJQUFJQyxNQUFKLENBQ0hDLElBQUlDLE1BQUosQ0FBV0gsTUFBWCxDQUFrQkQsRUFBRUosS0FBRixDQUFRLElBQUlDLE9BQUosQ0FBWUcsRUFBRUwsRUFBZCxVQUF3QixFQUF4QixDQUFSLENBQWxCLENBREcsRUFDc0QsRUFEdEQsQ0FBUDtBQUFBLGFBREosQ0FERyxDQUFQO0FBS0g7O0FBR0Q7Ozs7Ozs7bUNBSVc7O0FBRVAsc0JBQUdlLEVBQUgsQ0FBTSxLQUFLTixNQUFMLENBQVlPLE1BQVosQ0FBbUIsVUFBQ04sQ0FBRCxFQUFJRSxDQUFKO0FBQUEsdUJBQVVBLEVBQUVLLFFBQUYsQ0FBV1AsQ0FBWCxDQUFWO0FBQUEsYUFBbkIsRUFBNEMsSUFBNUMsQ0FBTixFQUNLUSxLQURMLENBQ1c7QUFBQSx1QkFBT1YsSUFBSUosS0FBSixDQUFVWSxNQUFWLENBQWlCLFVBQUNHLEVBQUQsRUFBS2QsQ0FBTDtBQUFBLDJCQUFXYyxHQUFHTCxHQUFILENBQU9ULENBQVAsQ0FBWDtBQUFBLGlCQUFqQixFQUF1QyxVQUFHVSxFQUFILENBQU1QLEdBQU4sQ0FBdkMsQ0FBUDtBQUFBLGFBRFgsRUFFS1UsS0FGTCxDQUVXO0FBQUEsdUJBQU8sVUFBR0gsRUFBSCxDQUFNO0FBQUEsMkJBQU1LLFdBQVc7QUFBQSwrQkFBTVosSUFBSVMsUUFBSixHQUFlSSxHQUFmLEVBQU47QUFBQSxxQkFBWCxFQUF1QyxDQUF2QyxDQUFOO0FBQUEsaUJBQU4sQ0FBUDtBQUFBLGFBRlg7QUFJSDs7Ozs7O2tCQUlVZCxNIiwiZmlsZSI6IlN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IHsgSU8gfSBmcm9tICcuL21vbmFkJztcblxuLyoqXG4gKlxuICogQHR5cGVkZWYgVGFrZVBhaXJcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8ZnVuY3Rpb248fSB0YXNrc1xuICogQHByb3BlcnR5IHtBcnJheTxDb250ZXh0Pn0gYWN0b3JzXG4gKi9cblxuLyoqXG4gKiBUb3BcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8Tm9kZT59IGNoaWxkcmVuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3Age1xuXG4gICAgY29uc3RydWN0b3IoY2hpbGRyZW4gPSBbXSkge1xuXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE5vZGUgaXMgYSBkYXRhIHN0cnVjdHVyZSB3ZSB1c2UgdG8gcmVjb3JkIHRoZSBoaWVyYWNoeSBvZiB0aGUgYWN0b3Igc3lzdGVtLlxuICpcbiAqIFJhdGhlciB0aGFuIHN0b3JlIHRoZSBub2RlcyBpbiBoZXJlLCB3ZSBzdG9yZSB0aGUgaWRzIHdpdGggaW5mb3JtYXRpb24gYWJvdXRcbiAqIHRoZSBpbmRleCwgcGFyZW50IGFuZCBjaGlsZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBpbmRleFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhcmVudFxuICogQHByb3BlcnR5IHtBcnJheTxzdHJpbmc+fSBjaGlsZHJlblxuICovXG5jbGFzcyBOb2RlIHtcblxuICAgIGNvbnN0cnVjdG9yKGluZGV4LCBwYXJlbnQsIGNoaWxkcmVuKSB7XG5cbiAgICAgICAgdGhpcy5pbmRleCA9IGJlb2YoeyBpbmRleCB9KS5vcHRpb25hbCgpLm51bWJlcigpLnZhbHVlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IGJlb2YoeyBwYXJlbnQgfSkub3B0aW9uYWwoKS5pbnN0YW5jZShOb2RlKS52YWx1ZTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGJlb2YoeyBjaGlsZHJlbiB9KS5hcnJheSgpLnZhbHVlO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVGVtcGxhdGUgaXMgYW4gYWJzdHJhY3QgdHlwZSB0aGF0IHJlcHJlc2VudHMgaW5mb3JtYXRpb24gZm9yIGNyZWF0aW5nIGFuIGFjdG9yLlxuICovXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUge1xuXG59XG5cbi8qKlxuICogRXZlbnRUZW1wbGF0ZSBpcyBhIHRlbXBsYXRlIGZvciBjcmVhdGluZyBhY3RvcnMgdGhhdCBydW4gaW5cbiAqIHRoZSBzYW1lIGV2ZW50IGxvb3AgYXMgdGhlIHN5c3RlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCAtIG11c3QgYmUgdW5pcXVlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzdGFydCAtIENvbnRleHQg4oaSICBDb250ZXh0XG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudFRlbXBsYXRlIGV4dGVuZHMgVGVtcGxhdGUge1xuXG4gICAgY29uc3RydWN0b3IoaWQsIHN0YXJ0KSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDb250ZXh0XG4gKi9cbmV4cG9ydCBjbGFzcyBDb250ZXh0IHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRhc2tzID0gW10pIHtcblxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLnRhc2tzID0gdGFza3M7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzcGF3blxuICAgICAqL1xuICAgIHNwYXduKHQpIHtcblxuICAgICAgICByZXR1cm4gbmV3IENvbnRleHQodGhpcy5wYXRoLFxuICAgICAgICAgICAgdGhpcy50YXNrcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgc3lzID0+IG5ldyBTeXN0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHN5cy5hY3RvcnMuY29uY2F0KHQuc3RhcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ29udGV4dChge3RoaXMucGF0aH0vJHt0LmlkfWApKSksIFtdKSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGUgdGFza3Mgd2l0aGluIGEgU3lzdGVtXG4gICAgICogQHN1bW1hcnkge1N5c3RlbX0g4oaSICB7U3lzdGVtfVxuICAgICAqL1xuICAgIHNjaGVkdWxlKHMpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN5c3RlbShcbiAgICAgICAgICAgIHJlcGxhY2UobmV3IENvbnRleHQodGhpcy5wYXRoKSwgdGhpcy5hY3RvcnMpLFxuICAgICAgICAgICAgcy50YXNrcy5jb25jYXQodGhpcy50YXNrcykpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogcmVwbGFjZSBhIENvbnRleHQgd2l0aGluIGEgbGlzdCBvZiBDb250ZXh0cyB3aXRoIGEgbmV3IHZlcnNpb24uXG4gKiBAc3VtbWFyeSAoQ29udGV4dCxBcnJheTxDb250ZXh0Pikg4oaSICBBcnJheTxDb250ZXh0PlxuICovXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IChhLCBjKSA9PlxuICAgIGEubWFwKGEgPT4gKGEucGF0aCA9PT0gYy5wYXRoKSA/IGMgOiBhKTtcblxuLyoqXG4gKiBTeXN0ZW0gaW1wbGVtZW50YXRpb25zIGFyZSB0aGUgc3lzdGVtIHBhcnQgb2YgdGhlIGFjdG9yIG1vZGVswrkuXG4gKlxuICogQSBTeXN0ZW0gaXMgZWZmZWN0aXZlbHkgYSBtZXNoIG5ldHdvcmsgd2hlcmUgYW55IG5vZGUgY2FuXG4gKiBjb21tdW5pY2F0ZSB3aXRoIGFub3RoZXIgcHJvdmlkZWQgdGhleSBoYXZlIGFuIHVuZm9yZ2FibGUgYWRkcmVzcyBmb3IgdGhhdCBub2RlXG4gKiAoYW5kIGFyZSBhbGxvd2VkIHRvKS5cbiAqXG4gKiBQcmV2aW91c2x5IHRoaXMgd2FzIHRhY2tsZWQgYXMgYSBjbGFzcyB3aG9zZSByZWZlcmVuY2Ugd2FzIHNoYXJlZCBiZXR3ZWVuIHRoZVxuICogY2hpbGQgYWN0b3JzJyBjb250ZXh0cy4gTm93IHdlIHN0aWxsIHRha2UgYSBzaW1pbGxhciBhcHByb2FjaFxuICogYnV0IGluc3RlYWQgb2YgYmVpbmcgYSBzaW5nbGV0b24gdGhlIFN5c3RlbSdzIGltcGxlbWVudGF0aW9uIGlzIGluZmx1ZW5jZWQgYnkgTW9uYWRzLlxuICpcbiAqIFdlIGFsc28gaW50ZW5kIHRvIHVuaWZ5IGFjdG9ycyB0aGF0IHJ1biBvbiBzZXBlcmF0ZSB0aHJlYWRzL3Byb2Nlc3Mgd2l0aCBvbmVzIG9uIHRoZVxuICogbWFpbiBsb29wIHRodXMgZWxpbWluYXRpbmcgdGhlIG5lZWQgZm9yIGFuIGVudmlyb25tZW50IHNwZWNpZmljIFN5c3RlbS5cbiAqXG4gKiDCuSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BY3Rvcl9tb2RlbFxuICovXG5leHBvcnQgY2xhc3MgU3lzdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKGFjdG9ycyA9IFtdLCB0YXNrcyA9IFtdKSB7XG5cbiAgICAgICAgdGhpcy5hY3RvcnMgPSBhY3RvcnM7XG4gICAgICAgIHRoaXMudGFza3MgPSB0YXNrcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNwYXduIGEgbmV3IGFjdG9yLlxuICAgICAqXG4gICAgICogVGhlIGFjdG9yIHdpbGwgYmUgc3Bhd25lZCBvbiB0aGUgbmV4dCB0dXJuIG9mIHRoZSBldmVudCBsb29wLlxuICAgICAqIEBzdW1tYXJ5IFRlbXBsYXRlIOKGkiAgU3lzdGVtXG4gICAgICovXG4gICAgc3Bhd24odCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3lzdGVtKHRoaXMuYWN0b3JzLFxuICAgICAgICAgICAgdGhpcy50YXNrcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgc3lzID0+IG5ldyBTeXN0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHN5cy5hY3RvcnMuY29uY2F0KHQuc3RhcnQobmV3IENvbnRleHQodC5pZCwgdGhpcywgW10pKSksIFtdKSkpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBzY2hlZHVsZSB0aGUgc2lkZSBlZmZlY3RzIG9mIHRoaXMgc3lzdGVtLlxuICAgICAqIEBzdW1tYXJ5ICgpIOKGkiAgSU9cbiAgICAgKi9cbiAgICBzY2hlZHVsZSgpIHtcblxuICAgICAgICBJTy5vZih0aGlzLmFjdG9ycy5yZWR1Y2UoKHMsIGEpID0+IGEuc2NoZWR1bGUocyksIHRoaXMpKVxuICAgICAgICAgICAgLmNoYWluKHN5cyA9PiBzeXMudGFza3MucmVkdWNlKChpbywgdCkgPT4gaW8ubWFwKHQpLCBJTy5vZihzeXMpKSlcbiAgICAgICAgICAgIC5jaGFpbihzeXMgPT4gSU8ub2YoKCkgPT4gc2V0VGltZW91dCgoKSA9PiBzeXMuc2NoZWR1bGUoKS5ydW4oKSwgMCkpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTeXN0ZW1cbiJdfQ==