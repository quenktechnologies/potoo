"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Context acts as a private mini-system for each actor allowing additional
 * spawning and interaction with the rest of the system.
 *
 * @interface
 */
var Context = exports.Context = function () {
  function Context() {
    _classCallCheck(this, Context);
  }

  _createClass(Context, [{
    key: "path",


    /**
     * path returns the path to this context
     * @returns {string}
     */
    value: function path() {}

    /**
     * self returns a Reference for the actor.
     * @returns {Reference}
     */

  }, {
    key: "self",
    value: function self() {}
  }, {
    key: "parent",
    value: function parent() {}

    /**
     * root returns the root of all actors in the system.
     * Used internally only to handle messages, logging etc.
     * @return {Reference}
     */

  }, {
    key: "root",
    value: function root() {}

    /**
     * none returns an actor reference that is effectively a noop.
     * @returns {Reference}
     */

  }, {
    key: "none",
    value: function none() {}

    /**
     * select an actor Reference given a path.
     *
     * An un-registered path yields an actor that drops messages automatically.
     * @param {string} path
     */

  }, {
    key: "select",
    value: function select() {}

    /**
     * spawn a child actor.
     * @param {ChildSpec} spec
     * @param {string} name
     * @return {Reference}
     */

  }, {
    key: "spawn",
    value: function spawn() {}

    /**
     * receive the next message for this Context's actor.
     *
     * The behaviour passed can call receive again to change
     * how the next message is handled. Once a message has been received,
     * the current behaviour is discarded and messages will continue to buffer
     * until the next receive call or an error occurs.
     *
     * If time is specified, the Promise returned form receive is rejected and
     * is NOT intercepted by the error handling stratgy. Use the catch() method
     * of the returned Promise to react to timeout errors.
     * @param {function} behaviour
     * @param {number} [time] - Time to wait for execution.
     * @returns {Promise<*>}
     */

  }, {
    key: "receive",
    value: function receive() {}
  }]);

  return Context;
}();

exports.default = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250ZXh0LmpzeCJdLCJuYW1lcyI6WyJDb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7OztJQU1hQSxPLFdBQUFBLE87Ozs7Ozs7OztBQUVUOzs7OzJCQUlPLENBRU47O0FBRUQ7Ozs7Ozs7MkJBSU8sQ0FFTjs7OzZCQUVRLENBRVI7O0FBRUQ7Ozs7Ozs7OzJCQUtPLENBRU47O0FBRUQ7Ozs7Ozs7MkJBSU8sQ0FFTjs7QUFFRDs7Ozs7Ozs7OzZCQU1TLENBRVI7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUSxDQUVQOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBZVUsQ0FFVDs7Ozs7O2tCQUlVQSxPIiwiZmlsZSI6IkNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnRleHQgYWN0cyBhcyBhIHByaXZhdGUgbWluaS1zeXN0ZW0gZm9yIGVhY2ggYWN0b3IgYWxsb3dpbmcgYWRkaXRpb25hbFxuICogc3Bhd25pbmcgYW5kIGludGVyYWN0aW9uIHdpdGggdGhlIHJlc3Qgb2YgdGhlIHN5c3RlbS5cbiAqXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBDb250ZXh0IHtcblxuICAgIC8qKlxuICAgICAqIHBhdGggcmV0dXJucyB0aGUgcGF0aCB0byB0aGlzIGNvbnRleHRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHBhdGgoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZWxmIHJldHVybnMgYSBSZWZlcmVuY2UgZm9yIHRoZSBhY3Rvci5cbiAgICAgKiBAcmV0dXJucyB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIHNlbGYoKSB7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByb290IHJldHVybnMgdGhlIHJvb3Qgb2YgYWxsIGFjdG9ycyBpbiB0aGUgc3lzdGVtLlxuICAgICAqIFVzZWQgaW50ZXJuYWxseSBvbmx5IHRvIGhhbmRsZSBtZXNzYWdlcywgbG9nZ2luZyBldGMuXG4gICAgICogQHJldHVybiB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIHJvb3QoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBub25lIHJldHVybnMgYW4gYWN0b3IgcmVmZXJlbmNlIHRoYXQgaXMgZWZmZWN0aXZlbHkgYSBub29wLlxuICAgICAqIEByZXR1cm5zIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgbm9uZSgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNlbGVjdCBhbiBhY3RvciBSZWZlcmVuY2UgZ2l2ZW4gYSBwYXRoLlxuICAgICAqXG4gICAgICogQW4gdW4tcmVnaXN0ZXJlZCBwYXRoIHlpZWxkcyBhbiBhY3RvciB0aGF0IGRyb3BzIG1lc3NhZ2VzIGF1dG9tYXRpY2FsbHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICAgKi9cbiAgICBzZWxlY3QoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzcGF3biBhIGNoaWxkIGFjdG9yLlxuICAgICAqIEBwYXJhbSB7Q2hpbGRTcGVjfSBzcGVjXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJuIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgc3Bhd24oKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZWNlaXZlIHRoZSBuZXh0IG1lc3NhZ2UgZm9yIHRoaXMgQ29udGV4dCdzIGFjdG9yLlxuICAgICAqXG4gICAgICogVGhlIGJlaGF2aW91ciBwYXNzZWQgY2FuIGNhbGwgcmVjZWl2ZSBhZ2FpbiB0byBjaGFuZ2VcbiAgICAgKiBob3cgdGhlIG5leHQgbWVzc2FnZSBpcyBoYW5kbGVkLiBPbmNlIGEgbWVzc2FnZSBoYXMgYmVlbiByZWNlaXZlZCxcbiAgICAgKiB0aGUgY3VycmVudCBiZWhhdmlvdXIgaXMgZGlzY2FyZGVkIGFuZCBtZXNzYWdlcyB3aWxsIGNvbnRpbnVlIHRvIGJ1ZmZlclxuICAgICAqIHVudGlsIHRoZSBuZXh0IHJlY2VpdmUgY2FsbCBvciBhbiBlcnJvciBvY2N1cnMuXG4gICAgICpcbiAgICAgKiBJZiB0aW1lIGlzIHNwZWNpZmllZCwgdGhlIFByb21pc2UgcmV0dXJuZWQgZm9ybSByZWNlaXZlIGlzIHJlamVjdGVkIGFuZFxuICAgICAqIGlzIE5PVCBpbnRlcmNlcHRlZCBieSB0aGUgZXJyb3IgaGFuZGxpbmcgc3RyYXRneS4gVXNlIHRoZSBjYXRjaCgpIG1ldGhvZFxuICAgICAqIG9mIHRoZSByZXR1cm5lZCBQcm9taXNlIHRvIHJlYWN0IHRvIHRpbWVvdXQgZXJyb3JzLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGJlaGF2aW91clxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZV0gLSBUaW1lIHRvIHdhaXQgZm9yIGV4ZWN1dGlvbi5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTwqPn1cbiAgICAgKi9cbiAgICByZWNlaXZlKCkge1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRleHRcbiJdfQ==