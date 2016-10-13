'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockReference
 */
var MockReference = function () {
    function MockReference() {
        _classCallCheck(this, MockReference);

        this.Path = '/';
        this.tells = [];
        this.forwards = [];
        this.watchers = [];
        this.RefState = null;
    }

    _createClass(MockReference, [{
        key: 'setState',
        value: function setState(state) {

            this.RefState = state;
        }
    }, {
        key: 'path',
        value: function path() {

            return this.Path;
        }
    }, {
        key: 'watch',
        value: function watch(ref) {

            this.watchers.push(ref);
        }
    }, {
        key: 'unwatch',
        value: function unwatch(ref) {

            this.watchers = this.watchers.filter(function (r) {
                return r !== ref;
            });
        }
    }, {
        key: 'forward',
        value: function forward(message, from, to) {

            this.forwards.push({ message: message, from: from, to: to });
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this.tells.push({ message: message, from: from });
        }
    }]);

    return MockReference;
}();

exports.default = MockReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tSZWZlcmVuY2UuanMiXSwibmFtZXMiOlsiTW9ja1JlZmVyZW5jZSIsIlBhdGgiLCJ0ZWxscyIsImZvcndhcmRzIiwid2F0Y2hlcnMiLCJSZWZTdGF0ZSIsInN0YXRlIiwicmVmIiwicHVzaCIsImZpbHRlciIsInIiLCJtZXNzYWdlIiwiZnJvbSIsInRvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxhO0FBRUYsNkJBQWM7QUFBQTs7QUFFVixhQUFLQyxJQUFMLEdBQVksR0FBWjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBRUg7Ozs7aUNBRUlDLEssRUFBTzs7QUFFWixpQkFBS0QsUUFBTCxHQUFnQkMsS0FBaEI7QUFFSDs7OytCQUVVOztBQUVILG1CQUFPLEtBQUtMLElBQVo7QUFFSDs7OzhCQUVLTSxHLEVBQUs7O0FBRVAsaUJBQUtILFFBQUwsQ0FBY0ksSUFBZCxDQUFtQkQsR0FBbkI7QUFFSDs7O2dDQUVPQSxHLEVBQUs7O0FBRVQsaUJBQUtILFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjSyxNQUFkLENBQXFCO0FBQUEsdUJBQUtDLE1BQU1ILEdBQVg7QUFBQSxhQUFyQixDQUFoQjtBQUVIOzs7Z0NBRU9JLE8sRUFBU0MsSSxFQUFNQyxFLEVBQUk7O0FBRXZCLGlCQUFLVixRQUFMLENBQWNLLElBQWQsQ0FBbUIsRUFBQ0csZ0JBQUQsRUFBVUMsVUFBVixFQUFnQkMsTUFBaEIsRUFBbkI7QUFFSDs7OzZCQUVJRixPLEVBQVNDLEksRUFBTTs7QUFFaEIsaUJBQUtWLEtBQUwsQ0FBV00sSUFBWCxDQUFnQixFQUFFRyxnQkFBRixFQUFXQyxVQUFYLEVBQWhCO0FBRUg7Ozs7OztrQkFJVVosYSIsImZpbGUiOiJNb2NrUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2NrUmVmZXJlbmNlXG4gKi9cbmNsYXNzIE1vY2tSZWZlcmVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5QYXRoID0gJy8nO1xuICAgICAgICB0aGlzLnRlbGxzID0gW107XG4gICAgICAgIHRoaXMuZm9yd2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICAgICAgICB0aGlzLlJlZlN0YXRlID0gbnVsbDtcblxuICAgIH1cblxuc2V0U3RhdGUoc3RhdGUpIHtcblxuICAgIHRoaXMuUmVmU3RhdGUgPSBzdGF0ZTtcblxufVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5QYXRoO1xuXG4gICAgfVxuXG4gICAgd2F0Y2gocmVmKSB7XG5cbiAgICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHJlZik7XG5cbiAgICB9XG5cbiAgICB1bndhdGNoKHJlZikge1xuXG4gICAgICAgIHRoaXMud2F0Y2hlcnMgPSB0aGlzLndhdGNoZXJzLmZpbHRlcihyID0+IHIgIT09IHJlZik7XG5cbiAgICB9XG5cbiAgICBmb3J3YXJkKG1lc3NhZ2UsIGZyb20sIHRvKSB7XG5cbiAgICAgICAgdGhpcy5mb3J3YXJkcy5wdXNoKHttZXNzYWdlLCBmcm9tLCB0b30pO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy50ZWxscy5wdXNoKHsgbWVzc2FnZSwgZnJvbSB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2NrUmVmZXJlbmNlXG4iXX0=