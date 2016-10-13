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
 * OneForOneStrategy applies the decisions to the failing child only.
 * @param {object} options - A map of Error constructors you want an action taken for.
 * @implements {ErrorHandlingStrategy}
 */
var OneForOneStrategy = function () {
    function OneForOneStrategy(decider) {
        _classCallCheck(this, OneForOneStrategy);

        (0, _beof2.default)({ decider: decider }).function();

        this._decider = decider;
    }

    _createClass(OneForOneStrategy, [{
        key: 'decide',
        value: function decide(e, signals) {

            return this._decider(e);
        }
    }, {
        key: 'apply',
        value: function apply(sig, child, context) {

            child.tell(sig, context.self());
        }
    }]);

    return OneForOneStrategy;
}();

exports.default = OneForOneStrategy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PbmVGb3JPbmVTdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJPbmVGb3JPbmVTdHJhdGVneSIsImRlY2lkZXIiLCJmdW5jdGlvbiIsIl9kZWNpZGVyIiwiZSIsInNpZ25hbHMiLCJzaWciLCJjaGlsZCIsImNvbnRleHQiLCJ0ZWxsIiwic2VsZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQTs7Ozs7SUFLTUEsaUI7QUFFRiwrQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUVqQiw0QkFBSyxFQUFFQSxnQkFBRixFQUFMLEVBQWtCQyxRQUFsQjs7QUFFQSxhQUFLQyxRQUFMLEdBQWdCRixPQUFoQjtBQUVIOzs7OytCQUVNRyxDLEVBQUdDLE8sRUFBUzs7QUFFZixtQkFBTyxLQUFLRixRQUFMLENBQWNDLENBQWQsQ0FBUDtBQUVIOzs7OEJBRUtFLEcsRUFBS0MsSyxFQUFPQyxPLEVBQVM7O0FBRS9CRCxrQkFBTUUsSUFBTixDQUFXSCxHQUFYLEVBQWdCRSxRQUFRRSxJQUFSLEVBQWhCO0FBRUs7Ozs7OztrQkFJVVYsaUIiLCJmaWxlIjoiT25lRm9yT25lU3RyYXRlZ3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcblxuLyoqXG4gKiBPbmVGb3JPbmVTdHJhdGVneSBhcHBsaWVzIHRoZSBkZWNpc2lvbnMgdG8gdGhlIGZhaWxpbmcgY2hpbGQgb25seS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gQSBtYXAgb2YgRXJyb3IgY29uc3RydWN0b3JzIHlvdSB3YW50IGFuIGFjdGlvbiB0YWtlbiBmb3IuXG4gKiBAaW1wbGVtZW50cyB7RXJyb3JIYW5kbGluZ1N0cmF0ZWd5fVxuICovXG5jbGFzcyBPbmVGb3JPbmVTdHJhdGVneSB7XG5cbiAgICBjb25zdHJ1Y3RvcihkZWNpZGVyKSB7XG5cbiAgICAgICAgYmVvZih7IGRlY2lkZXIgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9kZWNpZGVyID0gZGVjaWRlcjtcblxuICAgIH1cblxuICAgIGRlY2lkZShlLCBzaWduYWxzKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlY2lkZXIoZSk7XG5cbiAgICB9XG5cbiAgICBhcHBseShzaWcsIGNoaWxkLCBjb250ZXh0KSB7XG5cbmNoaWxkLnRlbGwoc2lnLCBjb250ZXh0LnNlbGYoKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgT25lRm9yT25lU3RyYXRlZ3lcbiJdfQ==