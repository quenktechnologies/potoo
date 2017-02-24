'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Actor = exports.ActorT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _System = require('./System');

var _Message2 = require('./Message');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
var ActorT = exports.ActorT = function (_Message) {
    _inherits(ActorT, _Message);

    function ActorT() {
        _classCallCheck(this, ActorT);

        return _possibleConstructorReturn(this, (ActorT.__proto__ || Object.getPrototypeOf(ActorT)).apply(this, arguments));
    }

    return ActorT;
}(_Message2.Message);

/**
 * Actor
 */


var Actor = exports.Actor = function () {
    function Actor(path) {
        var tasks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Actor);

        this.path = path;
        this.tasks = tasks;
    }

    /**
     * spawn
     */


    _createClass(Actor, [{
        key: 'spawn',
        value: function spawn(template) {

            (0, _beof2.default)({ template: template }).instance(ActorT);

            return new Actor(this.path, this.tasks.concat(new _Message2.Spawn({ parent: this.path, template: template })));
        }

        /**
         * tell sends a message to another actor within the system.
         * @summary (string,*) →  Actor
         */

    }, {
        key: 'tell',
        value: function tell(s, m) {

            (0, _beof2.default)({ s: s }).string();

            return new Actor(this.path, this.tasks.concat(new _Message2.Tell(s, m)));
        }

        /**
         * schedule tasks within a System
         * @summary {System} →  {System}
         */

    }, {
        key: 'schedule',
        value: function schedule(s) {

            (0, _beof2.default)({ s: s }).instance(_System.System);

            return new _System.System((0, _util.merge)(s.actors, _defineProperty({}, this.path, new Actor(this.path, []))), s.mailboxes, s.tasks.concat(this.tasks), s.io);
        }
    }]);

    return Actor;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rvci5qcyJdLCJuYW1lcyI6WyJBY3RvclQiLCJBY3RvciIsInBhdGgiLCJ0YXNrcyIsInRlbXBsYXRlIiwiaW5zdGFuY2UiLCJjb25jYXQiLCJwYXJlbnQiLCJzIiwibSIsInN0cmluZyIsImFjdG9ycyIsIm1haWxib3hlcyIsImlvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0lBTWFBLE0sV0FBQUEsTTs7Ozs7Ozs7Ozs7O0FBRWI7Ozs7O0lBR2FDLEssV0FBQUEsSztBQUVULG1CQUFZQyxJQUFaLEVBQThCO0FBQUEsWUFBWkMsS0FBWSx1RUFBSixFQUFJOztBQUFBOztBQUUxQixhQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs4QkFHTUMsUSxFQUFVOztBQUVaLGdDQUFLLEVBQUVBLGtCQUFGLEVBQUwsRUFBbUJDLFFBQW5CLENBQTRCTCxNQUE1Qjs7QUFFQSxtQkFBTyxJQUFJQyxLQUFKLENBQVUsS0FBS0MsSUFBZixFQUNILEtBQUtDLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixvQkFBVSxFQUFFQyxRQUFRLEtBQUtMLElBQWYsRUFBcUJFLGtCQUFyQixFQUFWLENBQWxCLENBREcsQ0FBUDtBQUdIOztBQUVEOzs7Ozs7OzZCQUlLSSxDLEVBQUdDLEMsRUFBRzs7QUFFUCxnQ0FBSyxFQUFFRCxJQUFGLEVBQUwsRUFBWUUsTUFBWjs7QUFFQSxtQkFBTyxJQUFJVCxLQUFKLENBQVUsS0FBS0MsSUFBZixFQUFxQixLQUFLQyxLQUFMLENBQVdHLE1BQVgsQ0FBa0IsbUJBQVNFLENBQVQsRUFBWUMsQ0FBWixDQUFsQixDQUFyQixDQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7aUNBSVNELEMsRUFBRzs7QUFFUixnQ0FBSyxFQUFFQSxJQUFGLEVBQUwsRUFBWUgsUUFBWjs7QUFFQSxtQkFBTyxtQkFDSCxpQkFBTUcsRUFBRUcsTUFBUixzQkFDSyxLQUFLVCxJQURWLEVBQ2lCLElBQUlELEtBQUosQ0FBVSxLQUFLQyxJQUFmLEVBQXFCLEVBQXJCLENBRGpCLEVBREcsRUFJSE0sRUFBRUksU0FKQyxFQUtISixFQUFFTCxLQUFGLENBQVFHLE1BQVIsQ0FBZSxLQUFLSCxLQUFwQixDQUxHLEVBTUhLLEVBQUVLLEVBTkMsQ0FBUDtBQVFIIiwiZmlsZSI6IkFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tICcuL1N5c3RlbSc7XG5pbXBvcnQgeyBTcGF3biwgVGVsbCwgUmVjZWl2ZSB9IGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCB7bWVyZ2V9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQWN0b3JUIGlzIGEgdGVtcGxhdGUgZm9yIGNyZWF0aW5nIGFjdG9ycyB0aGF0IHJ1biBpblxuICogdGhlIHNhbWUgZXZlbnQgbG9vcCBhcyB0aGUgc3lzdGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIC0gbXVzdCBiZSB1bmlxdWVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHN0YXJ0IC0gQWN0b3Ig4oaSICBBY3RvclxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JUIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG4vKipcbiAqIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0YXNrcyA9IFtdKSB7XG5cbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy50YXNrcyA9IHRhc2tzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd25cbiAgICAgKi9cbiAgICBzcGF3bih0ZW1wbGF0ZSkge1xuXG4gICAgICAgIGJlb2YoeyB0ZW1wbGF0ZSB9KS5pbnN0YW5jZShBY3RvclQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQWN0b3IodGhpcy5wYXRoLFxuICAgICAgICAgICAgdGhpcy50YXNrcy5jb25jYXQobmV3IFNwYXduKHsgcGFyZW50OiB0aGlzLnBhdGgsIHRlbXBsYXRlIH0pKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZWxsIHNlbmRzIGEgbWVzc2FnZSB0byBhbm90aGVyIGFjdG9yIHdpdGhpbiB0aGUgc3lzdGVtLlxuICAgICAqIEBzdW1tYXJ5IChzdHJpbmcsKikg4oaSICBBY3RvclxuICAgICAqL1xuICAgIHRlbGwocywgbSkge1xuXG4gICAgICAgIGJlb2YoeyBzIH0pLnN0cmluZygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQWN0b3IodGhpcy5wYXRoLCB0aGlzLnRhc2tzLmNvbmNhdChuZXcgVGVsbChzLCBtKSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGUgdGFza3Mgd2l0aGluIGEgU3lzdGVtXG4gICAgICogQHN1bW1hcnkge1N5c3RlbX0g4oaSICB7U3lzdGVtfVxuICAgICAqL1xuICAgIHNjaGVkdWxlKHMpIHtcblxuICAgICAgICBiZW9mKHsgcyB9KS5pbnN0YW5jZShTeXN0ZW0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgU3lzdGVtKFxuICAgICAgICAgICAgbWVyZ2Uocy5hY3RvcnMsIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5wYXRoXTogbmV3IEFjdG9yKHRoaXMucGF0aCwgW10pXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHMubWFpbGJveGVzLFxuICAgICAgICAgICAgcy50YXNrcy5jb25jYXQodGhpcy50YXNrcyksXG4gICAgICAgICAgICBzLmlvKTtcblxuICAgIH1cblxufVxuIl19