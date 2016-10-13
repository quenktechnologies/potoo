'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AllForOneStrategy applies the decisions to all children of the current context. Game over...
 * @param {function} decider
 * @implements {ErrorHandlingStrategy}
 */
var AllForOneStrategy = function () {
    function AllForOneStrategy(decider) {
        _classCallCheck(this, AllForOneStrategy);

        (0, _beof2.default)({ decider: decider }).function();

        this._decider = decider;
    }

    _createClass(AllForOneStrategy, [{
        key: 'decide',
        value: function decide(e, signals) {

            return this._decider(e);
        }
    }, {
        key: 'apply',
        value: function apply(sig, child, context) {

            context.children().forEach(function (child) {
                return child.self().tell(sig, context.self());
            });
        }
    }]);

    return AllForOneStrategy;
}();

exports.default = AllForOneStrategy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BbGxGb3JPbmVTdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJBbGxGb3JPbmVTdHJhdGVneSIsImRlY2lkZXIiLCJmdW5jdGlvbiIsIl9kZWNpZGVyIiwiZSIsInNpZ25hbHMiLCJzaWciLCJjaGlsZCIsImNvbnRleHQiLCJjaGlsZHJlbiIsImZvckVhY2giLCJzZWxmIiwidGVsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQTs7Ozs7SUFLTUEsaUI7QUFFRiwrQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUVqQiw0QkFBSyxFQUFFQSxnQkFBRixFQUFMLEVBQWtCQyxRQUFsQjs7QUFFQSxhQUFLQyxRQUFMLEdBQWdCRixPQUFoQjtBQUVIOzs7OytCQUVNRyxDLEVBQUdDLE8sRUFBUzs7QUFFZixtQkFBTyxLQUFLRixRQUFMLENBQWNDLENBQWQsQ0FBUDtBQUVIOzs7OEJBRUtFLEcsRUFBS0MsSyxFQUFPQyxPLEVBQVM7O0FBRXZCQSxvQkFBUUMsUUFBUixHQUNJQyxPQURKLENBQ1k7QUFBQSx1QkFBT0gsTUFBTUksSUFBTixHQUFhQyxJQUFiLENBQWtCTixHQUFsQixFQUF1QkUsUUFBUUcsSUFBUixFQUF2QixDQUFQO0FBQUEsYUFEWjtBQUdIOzs7Ozs7a0JBSVVYLGlCIiwiZmlsZSI6IkFsbEZvck9uZVN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5cbi8qKlxuICogQWxsRm9yT25lU3RyYXRlZ3kgYXBwbGllcyB0aGUgZGVjaXNpb25zIHRvIGFsbCBjaGlsZHJlbiBvZiB0aGUgY3VycmVudCBjb250ZXh0LiBHYW1lIG92ZXIuLi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlY2lkZXJcbiAqIEBpbXBsZW1lbnRzIHtFcnJvckhhbmRsaW5nU3RyYXRlZ3l9XG4gKi9cbmNsYXNzIEFsbEZvck9uZVN0cmF0ZWd5IHtcblxuICAgIGNvbnN0cnVjdG9yKGRlY2lkZXIpIHtcblxuICAgICAgICBiZW9mKHsgZGVjaWRlciB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX2RlY2lkZXIgPSBkZWNpZGVyO1xuXG4gICAgfVxuXG4gICAgZGVjaWRlKGUsIHNpZ25hbHMpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVjaWRlcihlKTtcblxuICAgIH1cblxuICAgIGFwcGx5KHNpZywgY2hpbGQsIGNvbnRleHQpIHtcblxuICAgICAgICBjb250ZXh0LmNoaWxkcmVuKCkuXG4gICAgICAgICAgICBmb3JFYWNoKGNoaWxkPT5jaGlsZC5zZWxmKCkudGVsbChzaWcsIGNvbnRleHQuc2VsZigpKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWxsRm9yT25lU3RyYXRlZ3lcbiJdfQ==