"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ErrorHandlingStrategy is an interface for handling errors.
 * @interface
 */
var ErrorHandlingStrategy = function () {
  function ErrorHandlingStrategy() {
    _classCallCheck(this, ErrorHandlingStrategy);
  }

  _createClass(ErrorHandlingStrategy, [{
    key: "decide",


    /**
     * decide what Signal to use on the misbehaving Concern.
     * @param {Error} e
     * @param {Signal} signals
     */
    value: function decide(e, signals) {}

    /**
     * apply the strategy
     * @param {Signal} sig
     * @param {Reference} child
     * @param {Context} context
     */

  }, {
    key: "apply",
    value: function apply() {}
  }]);

  return ErrorHandlingStrategy;
}();

exports.default = ErrorHandlingStrategy;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FcnJvckhhbmRsaW5nU3RyYXRlZ3kuanMiXSwibmFtZXMiOlsiRXJyb3JIYW5kbGluZ1N0cmF0ZWd5IiwiZSIsInNpZ25hbHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztJQUlNQSxxQjs7Ozs7Ozs7O0FBRUY7Ozs7OzJCQUtPQyxDLEVBQUdDLE8sRUFBUyxDQUdsQjs7QUFFRDs7Ozs7Ozs7OzRCQU1RLENBRVA7Ozs7OztrQkFJVUYscUIiLCJmaWxlIjoiRXJyb3JIYW5kbGluZ1N0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFcnJvckhhbmRsaW5nU3RyYXRlZ3kgaXMgYW4gaW50ZXJmYWNlIGZvciBoYW5kbGluZyBlcnJvcnMuXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIEVycm9ySGFuZGxpbmdTdHJhdGVneSB7XG5cbiAgICAvKipcbiAgICAgKiBkZWNpZGUgd2hhdCBTaWduYWwgdG8gdXNlIG9uIHRoZSBtaXNiZWhhdmluZyBDb25jZXJuLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVcbiAgICAgKiBAcGFyYW0ge1NpZ25hbH0gc2lnbmFsc1xuICAgICAqL1xuICAgIGRlY2lkZShlLCBzaWduYWxzKSB7XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoZSBzdHJhdGVneVxuICAgICAqIEBwYXJhbSB7U2lnbmFsfSBzaWdcbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gY2hpbGRcbiAgICAgKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHRcbiAgICAgKi9cbiAgICBhcHBseSgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFcnJvckhhbmRsaW5nU3RyYXRlZ3lcbiJdfQ==