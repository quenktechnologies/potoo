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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvQ2FsbGFibGUuanMiXSwibmFtZXMiOlsiQ2FsbGFibGUiLCJhcmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7SUFRYUEsUSxXQUFBQSxROzs7Ozs7Ozs7QUFFVDs7Ozs7eUJBS0tDLEcsRUFBSyxDQUVUOzs7Ozs7a0JBR1VELFEiLCJmaWxlIjoiQ2FsbGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQ2FsbGFibGUgaXMgYW4gaW50ZXJmYWNlIGZvciBjbGFzc2VzIHRoYXQgaGF2ZSBhIGNhbGwgbWV0aG9kLlxuICpcbiAqIFRoaXMgaW50ZXJmYWNlIGlzIHJlY29nbml6ZWQgaW50ZXJuYWxseSB0byBhbGxvdyBmdW5jdGlvbnMgb3IgY2xhc3Nlc1xuICogdG8gYWN0IGFzIGFjdG9ycy4gVGhleSBhcmUgaW50ZW5kZWQgdG8gbWltaWMgbWF0aCBmdW5jdGlvbnMgYW5kIHNob3VsZFxuICogcmV0dXJuIGEgdmFsdWUgZm9yIHZhbGlkIGlucHV0LlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgY2xhc3MgQ2FsbGFibGUge1xuXG4gICAgLyoqXG4gICAgICogY2FsbCB0aGlzIENhbGxhYmxlIHdpdGggYW4gYXJndW1lbnQuXG4gICAgICogQHBhcmFtIHsqfSBhcmdcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfGJvb2xlYW58c3RyaW5nfGZ1bmN0aW9uLG9iamVjdHxudWxsfVxuICAgICAqL1xuICAgIGNhbGwoYXJnKSB7XG5cbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0IENhbGxhYmxlXG4iXX0=