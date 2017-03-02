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
var Message = exports.Message = function Message() {
    var _this = this;

    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Message);

    Object.keys(src).forEach(function (k) {
        return _this[k] = src[k];
    });
};

exports.default = Message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZGlzcGF0Y2gvTWVzc2FnZS5qcyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic3JjIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7SUFNYUEsTyxXQUFBQSxPLEdBRVQsbUJBQXNCO0FBQUE7O0FBQUEsUUFBVkMsR0FBVSx1RUFBSixFQUFJOztBQUFBOztBQUVsQkMsV0FBT0MsSUFBUCxDQUFZRixHQUFaLEVBQWlCRyxPQUFqQixDQUF5QjtBQUFBLGVBQUssTUFBS0MsQ0FBTCxJQUFVSixJQUFJSSxDQUFKLENBQWY7QUFBQSxLQUF6QjtBQUVILEM7O2tCQUlVTCxPIiwiZmlsZSI6Ik1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1lc3NhZ2UgY29waWVzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFuZCBhc3NpZ25zIHRoZW0gdG8gaXRzZWxmLlxuICpcbiAqIFRoaXMgY2xhc3MgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGFkaG9jIHR5cGUgaGllYXJjaGllcyBmb3IgeW91ciBjb2RlIGJhc2VzIG1lc3NhZ2VzLlxuICogQHBhcmFtIHtvYmplY3R9IHNyY1xuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihzcmMgPSB7fSkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrID0+IHRoaXNba10gPSBzcmNba10pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VcbiJdfQ==