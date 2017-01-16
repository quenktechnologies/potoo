'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Guardian = require('./Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

var _dispatch = require('./dispatch');

var _funcs = require('./funcs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */
var IsomorphicSystem = function () {
    function IsomorphicSystem() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? { log: { level: 4 } } : arguments[0];

        _classCallCheck(this, IsomorphicSystem);

        var log = options.log;


        this._subs = [(0, _funcs.or)((0, _funcs.insof)(_dispatch.DroppedMessage, (0, _funcs.ok)(log.level <= 4, function (m) {
            return console.warn('DroppedMessage: to ' + m.to + ' message: ' + m.message + '.');
        })), (0, _funcs.insof)(_dispatch.UnhandledMessage, (0, _funcs.ok)(log.level <= 4, function (m) {
            return console.warn('UnhandledMessage: to ' + m.to + ' message: ' + m.message + '.');
        })))];
        this._guardian = new _Guardian2.default(this);
    }

    /**
     * create a new IsomorphicSystem
     * @param {object} options
     * @returns {IsomorphicSystem}
     */


    _createClass(IsomorphicSystem, [{
        key: 'select',
        value: function select(path) {

            return this._guardian.tree.select(path);
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this._guardian.spawn(spec, name);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(f) {

            this._subs.push(f);
            return this;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(f) {

            var i = this._subs.indexOf(f);

            if (i > 0) this._subs.splice(i, 1);

            return this;
        }
    }, {
        key: 'publish',
        value: function publish(evt) {
            var _this = this;

            this._subs.forEach(function (s) {
                return s.call(_this, evt);
            });
        }
    }], [{
        key: 'create',
        value: function create() {

            return new IsomorphicSystem();
        }
    }]);

    return IsomorphicSystem;
}();

exports.default = IsomorphicSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Jc29tb3JwaGljU3lzdGVtLmpzIl0sIm5hbWVzIjpbIklzb21vcnBoaWNTeXN0ZW0iLCJvcHRpb25zIiwibG9nIiwibGV2ZWwiLCJfc3VicyIsImNvbnNvbGUiLCJ3YXJuIiwibSIsInRvIiwibWVzc2FnZSIsIl9ndWFyZGlhbiIsInBhdGgiLCJ0cmVlIiwic2VsZWN0Iiwic3BlYyIsIm5hbWUiLCJzcGF3biIsImYiLCJwdXNoIiwiaSIsImluZGV4T2YiLCJzcGxpY2UiLCJldnQiLCJmb3JFYWNoIiwicyIsImNhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsZ0I7QUFFRixnQ0FBNkM7QUFBQSxZQUFqQ0MsT0FBaUMseURBQXZCLEVBQUVDLEtBQUssRUFBRUMsT0FBTyxDQUFULEVBQVAsRUFBdUI7O0FBQUE7O0FBQUEsWUFFbkNELEdBRm1DLEdBRTNCRCxPQUYyQixDQUVuQ0MsR0FGbUM7OztBQUl6QyxhQUFLRSxLQUFMLEdBQWEsQ0FDVCxlQUFHLDRDQUFzQixlQUFJRixJQUFJQyxLQUFKLElBQWEsQ0FBakIsRUFBcUI7QUFBQSxtQkFDdENFLFFBQVFDLElBQVIseUJBQW1DQyxFQUFFQyxFQUFyQyxrQkFBb0RELEVBQUVFLE9BQXRELE9BRHNDO0FBQUEsU0FBckIsQ0FBdEIsQ0FBSCxFQUdJLDhDQUF3QixlQUFJUCxJQUFJQyxLQUFKLElBQWEsQ0FBakIsRUFBcUI7QUFBQSxtQkFDekNFLFFBQVFDLElBQVIsMkJBQXFDQyxFQUFFQyxFQUF2QyxrQkFBc0RELEVBQUVFLE9BQXhELE9BRHlDO0FBQUEsU0FBckIsQ0FBeEIsQ0FISixDQURTLENBQWI7QUFRQSxhQUFLQyxTQUFMLEdBQWlCLHVCQUFhLElBQWIsQ0FBakI7QUFFSDs7QUFFRDs7Ozs7Ozs7OytCQVdPQyxJLEVBQU07O0FBRVQsbUJBQU8sS0FBS0QsU0FBTCxDQUFlRSxJQUFmLENBQW9CQyxNQUFwQixDQUEyQkYsSUFBM0IsQ0FBUDtBQUVIOzs7OEJBRUtHLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtMLFNBQUwsQ0FBZU0sS0FBZixDQUFxQkYsSUFBckIsRUFBMkJDLElBQTNCLENBQVA7QUFFSDs7O2tDQUVTRSxDLEVBQUc7O0FBRVQsaUJBQUtiLEtBQUwsQ0FBV2MsSUFBWCxDQUFnQkQsQ0FBaEI7QUFDQSxtQkFBTyxJQUFQO0FBRUg7OztvQ0FFV0EsQyxFQUFHOztBQUVYLGdCQUFJRSxJQUFJLEtBQUtmLEtBQUwsQ0FBV2dCLE9BQVgsQ0FBbUJILENBQW5CLENBQVI7O0FBRUEsZ0JBQUlFLElBQUksQ0FBUixFQUNJLEtBQUtmLEtBQUwsQ0FBV2lCLE1BQVgsQ0FBa0JGLENBQWxCLEVBQXFCLENBQXJCOztBQUVKLG1CQUFPLElBQVA7QUFFSDs7O2dDQUVPRyxHLEVBQUs7QUFBQTs7QUFFVCxpQkFBS2xCLEtBQUwsQ0FBV21CLE9BQVgsQ0FBbUI7QUFBQSx1QkFBS0MsRUFBRUMsSUFBRixRQUFhSCxHQUFiLENBQUw7QUFBQSxhQUFuQjtBQUVIOzs7aUNBeENlOztBQUVaLG1CQUFPLElBQUl0QixnQkFBSixFQUFQO0FBRUg7Ozs7OztrQkF3Q1VBLGdCIiwiZmlsZSI6Iklzb21vcnBoaWNTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBHdWFyZGlhbiBmcm9tICcuL0d1YXJkaWFuJztcbmltcG9ydCB7IERyb3BwZWRNZXNzYWdlLCBVbmhhbmRsZWRNZXNzYWdlIH0gZnJvbSAnLi9kaXNwYXRjaCc7XG5pbXBvcnQgeyBvciwgaW5zb2YsIG9rIH0gZnJvbSAnLi9mdW5jcyc7XG5cbi8qKlxuICogSXNvbW9ycGhpY1N5c3RlbSByZXByZXNlbnRzIGEgY29sbGVjdGlvbiBvZiByZWxhdGVkIENvbmNlcm5zIHRoYXQgc2hhcmUgYSBwYXJlbnQgQ29udGV4dC5cbiAqIFVzZSB0aGVtIHRvIGNyZWF0ZSB0byByZXByZXNlbnQgdGhlIGd1YXJkaWFuIG9mIGEgdHJlZSB5b3VyIGFwcGxpY2F0aW9uIHdpbGxcbiAqIGJyYW5jaCBpbnRvLlxuICogQGltcGxlbWVudHMge1N5c3RlbX1cbiAqL1xuY2xhc3MgSXNvbW9ycGhpY1N5c3RlbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0geyBsb2c6IHsgbGV2ZWw6IDQgfSB9KSB7XG5cbiAgICAgICAgdmFyIHsgbG9nIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMuX3N1YnMgPSBbXG4gICAgICAgICAgICBvcihpbnNvZihEcm9wcGVkTWVzc2FnZSwgb2soKGxvZy5sZXZlbCA8PSA0KSwgbSA9PlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYERyb3BwZWRNZXNzYWdlOiB0byAke20udG99IG1lc3NhZ2U6ICR7bS5tZXNzYWdlfS5gKSkpLFxuXG4gICAgICAgICAgICAgICAgaW5zb2YoVW5oYW5kbGVkTWVzc2FnZSwgb2soKGxvZy5sZXZlbCA8PSA0KSwgbSA9PlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuaGFuZGxlZE1lc3NhZ2U6IHRvICR7bS50b30gbWVzc2FnZTogJHttLm1lc3NhZ2V9LmApKSkpXG5cbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5fZ3VhcmRpYW4gPSBuZXcgR3VhcmRpYW4odGhpcyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBuZXcgSXNvbW9ycGhpY1N5c3RlbVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybnMge0lzb21vcnBoaWNTeXN0ZW19XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElzb21vcnBoaWNTeXN0ZW0oKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1YXJkaWFuLnRyZWUuc2VsZWN0KHBhdGgpO1xuXG4gICAgfVxuXG4gICAgc3Bhd24oc3BlYywgbmFtZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9ndWFyZGlhbi5zcGF3bihzcGVjLCBuYW1lKTtcblxuICAgIH1cblxuICAgIHN1YnNjcmliZShmKSB7XG5cbiAgICAgICAgdGhpcy5fc3Vicy5wdXNoKGYpO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlKGYpIHtcblxuICAgICAgICB2YXIgaSA9IHRoaXMuX3N1YnMuaW5kZXhPZihmKTtcblxuICAgICAgICBpZiAoaSA+IDApXG4gICAgICAgICAgICB0aGlzLl9zdWJzLnNwbGljZShpLCAxKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHB1Ymxpc2goZXZ0KSB7XG5cbiAgICAgICAgdGhpcy5fc3Vicy5mb3JFYWNoKHMgPT4gcy5jYWxsKHRoaXMsIGV2dCkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElzb21vcnBoaWNTeXN0ZW1cbiJdfQ==