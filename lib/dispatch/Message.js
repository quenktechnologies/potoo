"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
var Message = exports.Message = function Message(src) {
    var _this = this;

    _classCallCheck(this, Message);

    Object.keys(src).forEach(function (k) {
        return _this[k] = src[k];
    });
};

exports.default = Message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9NZXNzYWdlLmpzIl0sIm5hbWVzIjpbIk1lc3NhZ2UiLCJzcmMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztJQU1hQSxPLFdBQUFBLE8sR0FFVCxpQkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUViQyxXQUFPQyxJQUFQLENBQVlGLEdBQVosRUFBaUJHLE9BQWpCLENBQXlCO0FBQUEsZUFBSyxNQUFLQyxDQUFMLElBQVVKLElBQUlJLENBQUosQ0FBZjtBQUFBLEtBQXpCO0FBRUgsQzs7a0JBSVVMLE8iLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWVzc2FnZSBjb3BpZXMgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QgYW5kIGFzc2lnbnMgdGhlbSB0byBpdHNlbGYuXG4gKlxuICogVGhpcyBjbGFzcyBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYWRob2MgdHlwZSBoaWVhcmNoaWVzIGZvciB5b3VyIGNvZGUgYmFzZXMgbWVzc2FnZXMuXG4gKiBAcGFyYW0ge29iamVjdH0gc3JjXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcblxuICAgIGNvbnN0cnVjdG9yKHNyYykge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrID0+IHRoaXNba10gPSBzcmNba10pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VcbiJdfQ==