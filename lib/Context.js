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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250ZXh0LmpzIl0sIm5hbWVzIjpbIkNvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBTWFBLE8sV0FBQUEsTzs7Ozs7Ozs7O0FBRVQ7Ozs7MkJBSU8sQ0FFTjs7QUFFRDs7Ozs7OzsyQkFJTyxDQUVOOzs7NkJBRVEsQ0FFUjs7QUFFRDs7Ozs7Ozs7MkJBS08sQ0FFTjs7QUFFRDs7Ozs7OzsyQkFJTyxDQUVOOztBQUVEOzs7Ozs7Ozs7NkJBTVMsQ0FFUjs7QUFFRDs7Ozs7Ozs7OzRCQU1RLENBRVA7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFlVSxDQUVUOzs7Ozs7a0JBSVVBLE8iLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udGV4dCBhY3RzIGFzIGEgcHJpdmF0ZSBtaW5pLXN5c3RlbSBmb3IgZWFjaCBhY3RvciBhbGxvd2luZyBhZGRpdGlvbmFsXG4gKiBzcGF3bmluZyBhbmQgaW50ZXJhY3Rpb24gd2l0aCB0aGUgcmVzdCBvZiB0aGUgc3lzdGVtLlxuICpcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRleHQge1xuXG4gICAgLyoqXG4gICAgICogcGF0aCByZXR1cm5zIHRoZSBwYXRoIHRvIHRoaXMgY29udGV4dFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgcGF0aCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNlbGYgcmV0dXJucyBhIFJlZmVyZW5jZSBmb3IgdGhlIGFjdG9yLlxuICAgICAqIEByZXR1cm5zIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgc2VsZigpIHtcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJvb3QgcmV0dXJucyB0aGUgcm9vdCBvZiBhbGwgYWN0b3JzIGluIHRoZSBzeXN0ZW0uXG4gICAgICogVXNlZCBpbnRlcm5hbGx5IG9ubHkgdG8gaGFuZGxlIG1lc3NhZ2VzLCBsb2dnaW5nIGV0Yy5cbiAgICAgKiBAcmV0dXJuIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgcm9vdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG5vbmUgcmV0dXJucyBhbiBhY3RvciByZWZlcmVuY2UgdGhhdCBpcyBlZmZlY3RpdmVseSBhIG5vb3AuXG4gICAgICogQHJldHVybnMge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICBub25lKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGFuIGFjdG9yIFJlZmVyZW5jZSBnaXZlbiBhIHBhdGguXG4gICAgICpcbiAgICAgKiBBbiB1bi1yZWdpc3RlcmVkIHBhdGggeWllbGRzIGFuIGFjdG9yIHRoYXQgZHJvcHMgbWVzc2FnZXMgYXV0b21hdGljYWxseS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqL1xuICAgIHNlbGVjdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNwYXduIGEgY2hpbGQgYWN0b3IuXG4gICAgICogQHBhcmFtIHtDaGlsZFNwZWN9IHNwZWNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm4ge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICBzcGF3bigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlY2VpdmUgdGhlIG5leHQgbWVzc2FnZSBmb3IgdGhpcyBDb250ZXh0J3MgYWN0b3IuXG4gICAgICpcbiAgICAgKiBUaGUgYmVoYXZpb3VyIHBhc3NlZCBjYW4gY2FsbCByZWNlaXZlIGFnYWluIHRvIGNoYW5nZVxuICAgICAqIGhvdyB0aGUgbmV4dCBtZXNzYWdlIGlzIGhhbmRsZWQuIE9uY2UgYSBtZXNzYWdlIGhhcyBiZWVuIHJlY2VpdmVkLFxuICAgICAqIHRoZSBjdXJyZW50IGJlaGF2aW91ciBpcyBkaXNjYXJkZWQgYW5kIG1lc3NhZ2VzIHdpbGwgY29udGludWUgdG8gYnVmZmVyXG4gICAgICogdW50aWwgdGhlIG5leHQgcmVjZWl2ZSBjYWxsIG9yIGFuIGVycm9yIG9jY3Vycy5cbiAgICAgKlxuICAgICAqIElmIHRpbWUgaXMgc3BlY2lmaWVkLCB0aGUgUHJvbWlzZSByZXR1cm5lZCBmb3JtIHJlY2VpdmUgaXMgcmVqZWN0ZWQgYW5kXG4gICAgICogaXMgTk9UIGludGVyY2VwdGVkIGJ5IHRoZSBlcnJvciBoYW5kbGluZyBzdHJhdGd5LiBVc2UgdGhlIGNhdGNoKCkgbWV0aG9kXG4gICAgICogb2YgdGhlIHJldHVybmVkIFByb21pc2UgdG8gcmVhY3QgdG8gdGltZW91dCBlcnJvcnMuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gYmVoYXZpb3VyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgdG8gd2FpdCBmb3IgZXhlY3V0aW9uLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPCo+fVxuICAgICAqL1xuICAgIHJlY2VpdmUoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udGV4dFxuIl19