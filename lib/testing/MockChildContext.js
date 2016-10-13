'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockSystem = require('./MockSystem');

var _MockSystem2 = _interopRequireDefault(_MockSystem);

var _MockDispatcher = require('./MockDispatcher');

var _MockDispatcher2 = _interopRequireDefault(_MockDispatcher);

var _MockMailbox = require('./MockMailbox');

var _MockMailbox2 = _interopRequireDefault(_MockMailbox);

var _MockReference = require('./MockReference');

var _MockReference2 = _interopRequireDefault(_MockReference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockChildContext
 */
var MockChildContext = function () {
    function MockChildContext() {
        _classCallCheck(this, MockChildContext);

        this.Children = [];
        this.System = new _MockSystem2.default();
        this.Dispatcher = new _MockDispatcher2.default();
        this.Self = new _MockReference2.default();
        this.Parent = null;
        this.Mailbox = new _MockMailbox2.default();
        this.Selection = new _MockReference2.default();
    }

    _createClass(MockChildContext, [{
        key: 'isChild',
        value: function isChild(ref) {

            var ret = false;

            this.Children.forEach(function (child) {

                if (ref === child.self()) ret = true;
            });

            return ret;
        }
    }, {
        key: 'children',
        value: function children() {

            return this.Children.slice();
        }
    }, {
        key: 'path',
        value: function path() {

            return this.Self.path();
        }
    }, {
        key: 'self',
        value: function self() {

            return this.Self;
        }
    }, {
        key: 'parent',
        value: function parent() {

            return this.Parent ? this.Parent : new MockChildContext();
        }
    }, {
        key: 'mailbox',
        value: function mailbox() {

            return this.Mailbox;
        }
    }, {
        key: 'dispatcher',
        value: function dispatcher() {

            return this.Dispatcher;
        }
    }, {
        key: 'system',
        value: function system() {

            return this.System;
        }
    }, {
        key: 'concernOf',
        value: function concernOf(name, factory) {

            var ref = new _MockReference2.default();
            this.mock.refs.push(ref);
            return ref;
        }
    }, {
        key: 'select',
        value: function select(path) {

            return this.Selection;
        }
    }]);

    return MockChildContext;
}();

exports.default = MockChildContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tDaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsiTW9ja0NoaWxkQ29udGV4dCIsIkNoaWxkcmVuIiwiU3lzdGVtIiwiRGlzcGF0Y2hlciIsIlNlbGYiLCJQYXJlbnQiLCJNYWlsYm94IiwiU2VsZWN0aW9uIiwicmVmIiwicmV0IiwiZm9yRWFjaCIsImNoaWxkIiwic2VsZiIsInNsaWNlIiwicGF0aCIsIm5hbWUiLCJmYWN0b3J5IiwibW9jayIsInJlZnMiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUNBOzs7SUFHTUEsZ0I7QUFFRixnQ0FBYztBQUFBOztBQUVWLGFBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxhQUFLQyxNQUFMLEdBQWMsMEJBQWQ7QUFDQSxhQUFLQyxVQUFMLEdBQWtCLDhCQUFsQjtBQUNBLGFBQUtDLElBQUwsR0FBWSw2QkFBWjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLDJCQUFmO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQiw2QkFBakI7QUFFSDs7OztnQ0FFT0MsRyxFQUFLOztBQUVULGdCQUFJQyxNQUFNLEtBQVY7O0FBRUEsaUJBQUtSLFFBQUwsQ0FBY1MsT0FBZCxDQUFzQixpQkFBUzs7QUFFM0Isb0JBQUlGLFFBQVFHLE1BQU1DLElBQU4sRUFBWixFQUNJSCxNQUFNLElBQU47QUFFUCxhQUxEOztBQU9BLG1CQUFPQSxHQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLUixRQUFMLENBQWNZLEtBQWQsRUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS1QsSUFBTCxDQUFVVSxJQUFWLEVBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLEtBQUtWLElBQVo7QUFFSDs7O2lDQUVROztBQUVMLG1CQUFPLEtBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFuQixHQUE0QixJQUFJTCxnQkFBSixFQUFuQztBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sS0FBS00sT0FBWjtBQUVIOzs7cUNBRVk7O0FBRVQsbUJBQU8sS0FBS0gsVUFBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0QsTUFBWjtBQUVIOzs7a0NBRVNhLEksRUFBTUMsTyxFQUFTOztBQUVyQixnQkFBSVIsTUFBTSw2QkFBVjtBQUNBLGlCQUFLUyxJQUFMLENBQVVDLElBQVYsQ0FBZUMsSUFBZixDQUFvQlgsR0FBcEI7QUFDQSxtQkFBT0EsR0FBUDtBQUVIOzs7K0JBRU1NLEksRUFBTTs7QUFFVCxtQkFBTyxLQUFLUCxTQUFaO0FBRUg7Ozs7OztrQkFJVVAsZ0IiLCJmaWxlIjoiTW9ja0NoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2NrU3lzdGVtIGZyb20gJy4vTW9ja1N5c3RlbSc7XG5pbXBvcnQgTW9ja0Rpc3BhdGNoZXIgZnJvbSAnLi9Nb2NrRGlzcGF0Y2hlcic7XG5pbXBvcnQgTW9ja01haWxib3ggZnJvbSAnLi9Nb2NrTWFpbGJveCc7XG5pbXBvcnQgTW9ja1JlZmVyZW5jZSBmcm9tICcuL01vY2tSZWZlcmVuY2UnO1xuLyoqXG4gKiBNb2NrQ2hpbGRDb250ZXh0XG4gKi9cbmNsYXNzIE1vY2tDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5DaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLlN5c3RlbSA9IG5ldyBNb2NrU3lzdGVtKCk7XG4gICAgICAgIHRoaXMuRGlzcGF0Y2hlciA9IG5ldyBNb2NrRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLlNlbGYgPSBuZXcgTW9ja1JlZmVyZW5jZSgpO1xuICAgICAgICB0aGlzLlBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuTWFpbGJveCA9IG5ldyBNb2NrTWFpbGJveCgpO1xuICAgICAgICB0aGlzLlNlbGVjdGlvbiA9IG5ldyBNb2NrUmVmZXJlbmNlKCk7XG5cbiAgICB9XG5cbiAgICBpc0NoaWxkKHJlZikge1xuXG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLkNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAocmVmID09PSBjaGlsZC5zZWxmKCkpXG4gICAgICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuXG4gICAgfVxuXG4gICAgY2hpbGRyZW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hpbGRyZW4uc2xpY2UoKTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuU2VsZi5wYXRoKCk7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLlNlbGY7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuUGFyZW50ID8gdGhpcy5QYXJlbnQgOiBuZXcgTW9ja0NoaWxkQ29udGV4dCgpO1xuXG4gICAgfVxuXG4gICAgbWFpbGJveCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5NYWlsYm94O1xuXG4gICAgfVxuXG4gICAgZGlzcGF0Y2hlcigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5EaXNwYXRjaGVyO1xuXG4gICAgfVxuXG4gICAgc3lzdGVtKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLlN5c3RlbTtcblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihuYW1lLCBmYWN0b3J5KSB7XG5cbiAgICAgICAgdmFyIHJlZiA9IG5ldyBNb2NrUmVmZXJlbmNlKCk7XG4gICAgICAgIHRoaXMubW9jay5yZWZzLnB1c2gocmVmKTtcbiAgICAgICAgcmV0dXJuIHJlZjtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuU2VsZWN0aW9uO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vY2tDaGlsZENvbnRleHRcbiJdfQ==