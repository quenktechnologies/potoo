"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Callable is an interface for classes that have a call method.
 *
 * This interface is recognized internally to allow functions or classes
 * to act as actors. They are intended to mimic math functions and should
 * return a value for valid input.
 * @interface
 */
var Callable = exports.Callable = function () {
  function Callable() {
    _classCallCheck(this, Callable);
  }

  _createClass(Callable, [{
    key: "call",


    /**
     * call this Callable with an argument.
     * @param {*} arg
     * @returns {number|boolean|string|function,object|null}
     */
    value: function call(arg) {}
  }]);

  return Callable;
}();

exports.default = Callable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DYWxsYWJsZS5qcyJdLCJuYW1lcyI6WyJDYWxsYWJsZSIsImFyZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOzs7Ozs7OztJQVFhQSxRLFdBQUFBLFE7Ozs7Ozs7OztBQUVUOzs7Ozt5QkFLS0MsRyxFQUFLLENBRVQ7Ozs7OztrQkFHVUQsUSIsImZpbGUiOiJDYWxsYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDYWxsYWJsZSBpcyBhbiBpbnRlcmZhY2UgZm9yIGNsYXNzZXMgdGhhdCBoYXZlIGEgY2FsbCBtZXRob2QuXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgaXMgcmVjb2duaXplZCBpbnRlcm5hbGx5IHRvIGFsbG93IGZ1bmN0aW9ucyBvciBjbGFzc2VzXG4gKiB0byBhY3QgYXMgYWN0b3JzLiBUaGV5IGFyZSBpbnRlbmRlZCB0byBtaW1pYyBtYXRoIGZ1bmN0aW9ucyBhbmQgc2hvdWxkXG4gKiByZXR1cm4gYSB2YWx1ZSBmb3IgdmFsaWQgaW5wdXQuXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWxsYWJsZSB7XG5cbiAgICAvKipcbiAgICAgKiBjYWxsIHRoaXMgQ2FsbGFibGUgd2l0aCBhbiBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0geyp9IGFyZ1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ8Ym9vbGVhbnxzdHJpbmd8ZnVuY3Rpb24sb2JqZWN0fG51bGx9XG4gICAgICovXG4gICAgY2FsbChhcmcpIHtcblxuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgQ2FsbGFibGVcbiJdfQ==