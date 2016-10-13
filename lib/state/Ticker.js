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
 * Ticker provides an API for enscapulating the decrement of
 * a number based on a condition then finally an action when the number hits
 * 0.
 *
 * @param {number} number - An number that we will decrease on each tick.
 * @param {function} discriminator - A function that tests the arguments passed to tick to
 *                                   determine if we should decrement.
 * @param {function} eliminator - Called if the discriminator returns false.
 * @param {function} action - The action that will take place when the number equals 0.
 */
var Ticker = function () {
    function Ticker(number, discriminator, eliminator, action) {
        _classCallCheck(this, Ticker);

        (0, _beof2.default)({ number: number }).number();
        (0, _beof2.default)({ discriminator: discriminator }).function();
        (0, _beof2.default)({ action: action }).function();

        this._number = number;
        this._discriminator = discriminator;
        this._eliminator = eliminator;
        this._action = action;

        this._alarm();
    }

    _createClass(Ticker, [{
        key: '_alarm',
        value: function _alarm() {

            if (this._number === 0) {
                this._action.apply(null);
                return true;
            }
        }

        /**
         * tick conditionally decrements the number
         * @param {*} ..n
         */

    }, {
        key: 'tick',
        value: function tick() {

            if (this._discriminator.apply(null, arguments)) {
                this._number = this._number - 1;
                return this._alarm();
            } else {
                this._eliminator.apply(null, arguments);
            }
        }
    }], [{
        key: 'create',
        value: function create(number, discriminator, eliminator, action) {

            return new Ticker(number, discriminator, eliminator, action);
        }
    }]);

    return Ticker;
}();

exports.default = Ticker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9UaWNrZXIuanMiXSwibmFtZXMiOlsiVGlja2VyIiwibnVtYmVyIiwiZGlzY3JpbWluYXRvciIsImVsaW1pbmF0b3IiLCJhY3Rpb24iLCJmdW5jdGlvbiIsIl9udW1iZXIiLCJfZGlzY3JpbWluYXRvciIsIl9lbGltaW5hdG9yIiwiX2FjdGlvbiIsIl9hbGFybSIsImFwcGx5IiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7OztJQVdNQSxNO0FBRUYsb0JBQVlDLE1BQVosRUFBb0JDLGFBQXBCLEVBQW1DQyxVQUFuQyxFQUErQ0MsTUFBL0MsRUFBdUQ7QUFBQTs7QUFFbkQsNEJBQUssRUFBRUgsY0FBRixFQUFMLEVBQWlCQSxNQUFqQjtBQUNBLDRCQUFLLEVBQUVDLDRCQUFGLEVBQUwsRUFBd0JHLFFBQXhCO0FBQ0EsNEJBQUssRUFBRUQsY0FBRixFQUFMLEVBQWlCQyxRQUFqQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWVMLE1BQWY7QUFDQSxhQUFLTSxjQUFMLEdBQXNCTCxhQUF0QjtBQUNBLGFBQUtNLFdBQUwsR0FBbUJMLFVBQW5CO0FBQ0EsYUFBS00sT0FBTCxHQUFlTCxNQUFmOztBQUVBLGFBQUtNLE1BQUw7QUFFSDs7OztpQ0FRUTs7QUFFTCxnQkFBSSxLQUFLSixPQUFMLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLHFCQUFLRyxPQUFMLENBQWFFLEtBQWIsQ0FBbUIsSUFBbkI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFFSjs7QUFFRDs7Ozs7OzsrQkFJTzs7QUFFSCxnQkFBSSxLQUFLSixjQUFMLENBQW9CSSxLQUFwQixDQUEwQixJQUExQixFQUFnQ0MsU0FBaEMsQ0FBSixFQUFnRDtBQUM1QyxxQkFBS04sT0FBTCxHQUFlLEtBQUtBLE9BQUwsR0FBZSxDQUE5QjtBQUNBLHVCQUFPLEtBQUtJLE1BQUwsRUFBUDtBQUNILGFBSEQsTUFHTztBQUNILHFCQUFLRixXQUFMLENBQWlCRyxLQUFqQixDQUF1QixJQUF2QixFQUE2QkMsU0FBN0I7QUFDSDtBQUVKOzs7K0JBNUJhWCxNLEVBQVFDLGEsRUFBZUMsVSxFQUFZQyxNLEVBQVE7O0FBRXJELG1CQUFPLElBQUlKLE1BQUosQ0FBV0MsTUFBWCxFQUFtQkMsYUFBbkIsRUFBa0NDLFVBQWxDLEVBQThDQyxNQUE5QyxDQUFQO0FBRUg7Ozs7OztrQkE0QlVKLE0iLCJmaWxlIjoiVGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5cbi8qKlxuICogVGlja2VyIHByb3ZpZGVzIGFuIEFQSSBmb3IgZW5zY2FwdWxhdGluZyB0aGUgZGVjcmVtZW50IG9mXG4gKiBhIG51bWJlciBiYXNlZCBvbiBhIGNvbmRpdGlvbiB0aGVuIGZpbmFsbHkgYW4gYWN0aW9uIHdoZW4gdGhlIG51bWJlciBoaXRzXG4gKiAwLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBBbiBudW1iZXIgdGhhdCB3ZSB3aWxsIGRlY3JlYXNlIG9uIGVhY2ggdGljay5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc2NyaW1pbmF0b3IgLSBBIGZ1bmN0aW9uIHRoYXQgdGVzdHMgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGljayB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZSBpZiB3ZSBzaG91bGQgZGVjcmVtZW50LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZWxpbWluYXRvciAtIENhbGxlZCBpZiB0aGUgZGlzY3JpbWluYXRvciByZXR1cm5zIGZhbHNlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0aGF0IHdpbGwgdGFrZSBwbGFjZSB3aGVuIHRoZSBudW1iZXIgZXF1YWxzIDAuXG4gKi9cbmNsYXNzIFRpY2tlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihudW1iZXIsIGRpc2NyaW1pbmF0b3IsIGVsaW1pbmF0b3IsIGFjdGlvbikge1xuXG4gICAgICAgIGJlb2YoeyBudW1iZXIgfSkubnVtYmVyKCk7XG4gICAgICAgIGJlb2YoeyBkaXNjcmltaW5hdG9yIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBhY3Rpb24gfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9udW1iZXIgPSBudW1iZXI7XG4gICAgICAgIHRoaXMuX2Rpc2NyaW1pbmF0b3IgPSBkaXNjcmltaW5hdG9yO1xuICAgICAgICB0aGlzLl9lbGltaW5hdG9yID0gZWxpbWluYXRvcjtcbiAgICAgICAgdGhpcy5fYWN0aW9uID0gYWN0aW9uO1xuXG4gICAgICAgIHRoaXMuX2FsYXJtKCk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKG51bWJlciwgZGlzY3JpbWluYXRvciwgZWxpbWluYXRvciwgYWN0aW9uKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUaWNrZXIobnVtYmVyLCBkaXNjcmltaW5hdG9yLCBlbGltaW5hdG9yLCBhY3Rpb24pO1xuXG4gICAgfVxuXG4gICAgX2FsYXJtKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9udW1iZXIgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbi5hcHBseShudWxsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aWNrIGNvbmRpdGlvbmFsbHkgZGVjcmVtZW50cyB0aGUgbnVtYmVyXG4gICAgICogQHBhcmFtIHsqfSAuLm5cbiAgICAgKi9cbiAgICB0aWNrKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9kaXNjcmltaW5hdG9yLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHRoaXMuX251bWJlciA9IHRoaXMuX251bWJlciAtIDE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWxhcm0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2VsaW1pbmF0b3IuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpY2tlclxuIl19