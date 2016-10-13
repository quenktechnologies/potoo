'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _RefState = require('../RefState');

var _RefState2 = _interopRequireDefault(_RefState);

var _Reference2 = require('../Reference');

var _Reference3 = _interopRequireDefault(_Reference2);

var _RemoteMessage = require('../RemoteMessage');

var _RemoteMessage2 = _interopRequireDefault(_RemoteMessage);

var _InvalidMessageError = require('../InvalidMessageError');

var _InvalidMessageError2 = _interopRequireDefault(_InvalidMessageError);

var _ChildActiveState = require('./ChildActiveState');

var _ChildActiveState2 = _interopRequireDefault(_ChildActiveState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ChildReference
 */
var ChildReference = function (_Reference) {
    _inherits(ChildReference, _Reference);

    function ChildReference(state, path, remotePath, concern, context, provider, child) {
        _classCallCheck(this, ChildReference);

        //look out for messages from the child process
        var _this = _possibleConstructorReturn(this, (ChildReference.__proto__ || Object.getPrototypeOf(ChildReference)).call(this, state));

        child.on('message', function (message) {

            var m;

            try {
                m = JSON.parse(message);
                _assert2.default.ok((typeof m === 'undefined' ? 'undefined' : _typeof(m)) === 'object');
            } catch (e) {
                return context.publish(new _InvalidMessageError2.default(message, path));
            }

            if (_RefState2.default.equals(m, _RefState2.default.Active)) _this._state = new _ChildActiveState2.default(child, path, remotePath, concern, context, provider);else if (_RefState2.default.equals(m, _RefState2.default.Paused)) _this._state = new _RefState2.default.Paused(path, concern, context, provider);else if (_RefState2.default.equals(m, _RefState2.default.Stopped)) _this._state = new _RefState2.default.Stopped(path, concern, context, provider);else if (_RemoteMessage2.default.is(m)) context.select(m.to).accept(m.body, _this);
        });

        return _this;
    }

    return ChildReference;
}(_Reference3.default);

exports.default = ChildReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL0NoaWxkUmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIkNoaWxkUmVmZXJlbmNlIiwic3RhdGUiLCJwYXRoIiwicmVtb3RlUGF0aCIsImNvbmNlcm4iLCJjb250ZXh0IiwicHJvdmlkZXIiLCJjaGlsZCIsIm9uIiwibSIsIkpTT04iLCJwYXJzZSIsIm1lc3NhZ2UiLCJvayIsImUiLCJwdWJsaXNoIiwiZXF1YWxzIiwiQWN0aXZlIiwiX3N0YXRlIiwiUGF1c2VkIiwiU3RvcHBlZCIsImlzIiwic2VsZWN0IiwidG8iLCJhY2NlcHQiLCJib2R5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxjOzs7QUFFRiw0QkFBWUMsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUJDLFVBQXpCLEVBQXFDQyxPQUFyQyxFQUE4Q0MsT0FBOUMsRUFBdURDLFFBQXZELEVBQWlFQyxLQUFqRSxFQUF3RTtBQUFBOztBQUlwRTtBQUpvRSxvSUFFOUROLEtBRjhEOztBQUtwRU0sY0FBTUMsRUFBTixDQUFTLFNBQVQsRUFBb0IsbUJBQVc7O0FBRTNCLGdCQUFJQyxDQUFKOztBQUVBLGdCQUFJO0FBQ0FBLG9CQUFJQyxLQUFLQyxLQUFMLENBQVdDLE9BQVgsQ0FBSjtBQUNBLGlDQUFPQyxFQUFQLENBQVUsUUFBT0osQ0FBUCx5Q0FBT0EsQ0FBUCxPQUFhLFFBQXZCO0FBQ0gsYUFIRCxDQUdFLE9BQU9LLENBQVAsRUFBVTtBQUNSLHVCQUFPVCxRQUFRVSxPQUFSLENBQWdCLGtDQUF3QkgsT0FBeEIsRUFBaUNWLElBQWpDLENBQWhCLENBQVA7QUFDSDs7QUFFRCxnQkFBSSxtQkFBU2MsTUFBVCxDQUFnQlAsQ0FBaEIsRUFBbUIsbUJBQVNRLE1BQTVCLENBQUosRUFDSSxNQUFLQyxNQUFMLEdBQWMsK0JBQXFCWCxLQUFyQixFQUE0QkwsSUFBNUIsRUFBa0NDLFVBQWxDLEVBQThDQyxPQUE5QyxFQUF1REMsT0FBdkQsRUFBZ0VDLFFBQWhFLENBQWQsQ0FESixLQUdLLElBQUksbUJBQVNVLE1BQVQsQ0FBZ0JQLENBQWhCLEVBQW1CLG1CQUFTVSxNQUE1QixDQUFKLEVBQ0QsTUFBS0QsTUFBTCxHQUFjLElBQUksbUJBQVNDLE1BQWIsQ0FBb0JqQixJQUFwQixFQUEwQkUsT0FBMUIsRUFBbUNDLE9BQW5DLEVBQTRDQyxRQUE1QyxDQUFkLENBREMsS0FHQSxJQUFJLG1CQUFTVSxNQUFULENBQWdCUCxDQUFoQixFQUFtQixtQkFBU1csT0FBNUIsQ0FBSixFQUNELE1BQUtGLE1BQUwsR0FBYyxJQUFJLG1CQUFTRSxPQUFiLENBQXFCbEIsSUFBckIsRUFBMkJFLE9BQTNCLEVBQW9DQyxPQUFwQyxFQUE2Q0MsUUFBN0MsQ0FBZCxDQURDLEtBR0EsSUFBSSx3QkFBY2UsRUFBZCxDQUFpQlosQ0FBakIsQ0FBSixFQUNESixRQUFRaUIsTUFBUixDQUFlYixFQUFFYyxFQUFqQixFQUFxQkMsTUFBckIsQ0FBNEJmLEVBQUVnQixJQUE5QjtBQUVQLFNBdkJEOztBQUxvRTtBQThCdkU7Ozs7O2tCQUlVekIsYyIsImZpbGUiOiJDaGlsZFJlZmVyZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBSZWZTdGF0ZSBmcm9tICcuLi9SZWZTdGF0ZSc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5pbXBvcnQgUmVtb3RlTWVzc2FnZSBmcm9tICcuLi9SZW1vdGVNZXNzYWdlJztcbmltcG9ydCBJbnZhbGlkTWVzc2FnZUVycm9yIGZyb20gJy4uL0ludmFsaWRNZXNzYWdlRXJyb3InO1xuaW1wb3J0IENoaWxkQWN0aXZlU3RhdGUgZnJvbSAnLi9DaGlsZEFjdGl2ZVN0YXRlJztcblxuLyoqXG4gKiBDaGlsZFJlZmVyZW5jZVxuICovXG5jbGFzcyBDaGlsZFJlZmVyZW5jZSBleHRlbmRzIFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSwgcGF0aCwgcmVtb3RlUGF0aCwgY29uY2VybiwgY29udGV4dCwgcHJvdmlkZXIsIGNoaWxkKSB7XG5cbiAgICAgICAgc3VwZXIoc3RhdGUpO1xuXG4gICAgICAgIC8vbG9vayBvdXQgZm9yIG1lc3NhZ2VzIGZyb20gdGhlIGNoaWxkIHByb2Nlc3NcbiAgICAgICAgY2hpbGQub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IHtcblxuICAgICAgICAgICAgdmFyIG07XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbSA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0Lm9rKHR5cGVvZiBtID09PSAnb2JqZWN0Jyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQucHVibGlzaChuZXcgSW52YWxpZE1lc3NhZ2VFcnJvcihtZXNzYWdlLCBwYXRoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChSZWZTdGF0ZS5lcXVhbHMobSwgUmVmU3RhdGUuQWN0aXZlKSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBDaGlsZEFjdGl2ZVN0YXRlKGNoaWxkLCBwYXRoLCByZW1vdGVQYXRoLCBjb25jZXJuLCBjb250ZXh0LCBwcm92aWRlcik7XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKFJlZlN0YXRlLmVxdWFscyhtLCBSZWZTdGF0ZS5QYXVzZWQpKVxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gbmV3IFJlZlN0YXRlLlBhdXNlZChwYXRoLCBjb25jZXJuLCBjb250ZXh0LCBwcm92aWRlcik7XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKFJlZlN0YXRlLmVxdWFscyhtLCBSZWZTdGF0ZS5TdG9wcGVkKSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBSZWZTdGF0ZS5TdG9wcGVkKHBhdGgsIGNvbmNlcm4sIGNvbnRleHQsIHByb3ZpZGVyKTtcblxuICAgICAgICAgICAgZWxzZSBpZiAoUmVtb3RlTWVzc2FnZS5pcyhtKSlcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNlbGVjdChtLnRvKS5hY2NlcHQobS5ib2R5LCB0aGlzKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlsZFJlZmVyZW5jZVxuIl19