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
     * inbox returns the mailbox for the context's actor.
     * @returns {Mailbox}
     */

  }, {
    key: "inbox",
    value: function inbox() {}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250ZXh0LmpzIl0sIm5hbWVzIjpbIkNvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBTWFBLE8sV0FBQUEsTzs7Ozs7Ozs7O0FBRVQ7Ozs7MkJBSU8sQ0FFTjs7QUFFRDs7Ozs7OzsyQkFJTyxDQUVOOzs7NkJBRVEsQ0FFUjs7QUFFRDs7Ozs7Ozs7MkJBS08sQ0FFTjs7QUFFRDs7Ozs7Ozs0QkFJUSxDQUVQOztBQUVEOzs7Ozs7Ozs7NkJBTVMsQ0FFUjs7QUFFRDs7Ozs7Ozs7OzRCQU1RLENBRVA7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFlVSxDQUVUOzs7Ozs7a0JBSVVBLE8iLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udGV4dCBhY3RzIGFzIGEgcHJpdmF0ZSBtaW5pLXN5c3RlbSBmb3IgZWFjaCBhY3RvciBhbGxvd2luZyBhZGRpdGlvbmFsXG4gKiBzcGF3bmluZyBhbmQgaW50ZXJhY3Rpb24gd2l0aCB0aGUgcmVzdCBvZiB0aGUgc3lzdGVtLlxuICpcbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRleHQge1xuXG4gICAgLyoqXG4gICAgICogcGF0aCByZXR1cm5zIHRoZSBwYXRoIHRvIHRoaXMgY29udGV4dFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgcGF0aCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNlbGYgcmV0dXJucyBhIFJlZmVyZW5jZSBmb3IgdGhlIGFjdG9yLlxuICAgICAqIEByZXR1cm5zIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgc2VsZigpIHtcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJvb3QgcmV0dXJucyB0aGUgcm9vdCBvZiBhbGwgYWN0b3JzIGluIHRoZSBzeXN0ZW0uXG4gICAgICogVXNlZCBpbnRlcm5hbGx5IG9ubHkgdG8gaGFuZGxlIG1lc3NhZ2VzLCBsb2dnaW5nIGV0Yy5cbiAgICAgKiBAcmV0dXJuIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgcm9vdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluYm94IHJldHVybnMgdGhlIG1haWxib3ggZm9yIHRoZSBjb250ZXh0J3MgYWN0b3IuXG4gICAgICogQHJldHVybnMge01haWxib3h9XG4gICAgICovXG4gICAgaW5ib3goKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZWxlY3QgYW4gYWN0b3IgUmVmZXJlbmNlIGdpdmVuIGEgcGF0aC5cbiAgICAgKlxuICAgICAqIEFuIHVuLXJlZ2lzdGVyZWQgcGF0aCB5aWVsZHMgYW4gYWN0b3IgdGhhdCBkcm9wcyBtZXNzYWdlcyBhdXRvbWF0aWNhbGx5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgICovXG4gICAgc2VsZWN0KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd24gYSBjaGlsZCBhY3Rvci5cbiAgICAgKiBAcGFyYW0ge0NoaWxkU3BlY30gc3BlY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIHNwYXduKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVjZWl2ZSB0aGUgbmV4dCBtZXNzYWdlIGZvciB0aGlzIENvbnRleHQncyBhY3Rvci5cbiAgICAgKlxuICAgICAqIFRoZSBiZWhhdmlvdXIgcGFzc2VkIGNhbiBjYWxsIHJlY2VpdmUgYWdhaW4gdG8gY2hhbmdlXG4gICAgICogaG93IHRoZSBuZXh0IG1lc3NhZ2UgaXMgaGFuZGxlZC4gT25jZSBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVjZWl2ZWQsXG4gICAgICogdGhlIGN1cnJlbnQgYmVoYXZpb3VyIGlzIGRpc2NhcmRlZCBhbmQgbWVzc2FnZXMgd2lsbCBjb250aW51ZSB0byBidWZmZXJcbiAgICAgKiB1bnRpbCB0aGUgbmV4dCByZWNlaXZlIGNhbGwgb3IgYW4gZXJyb3Igb2NjdXJzLlxuICAgICAqXG4gICAgICogSWYgdGltZSBpcyBzcGVjaWZpZWQsIHRoZSBQcm9taXNlIHJldHVybmVkIGZvcm0gcmVjZWl2ZSBpcyByZWplY3RlZCBhbmRcbiAgICAgKiBpcyBOT1QgaW50ZXJjZXB0ZWQgYnkgdGhlIGVycm9yIGhhbmRsaW5nIHN0cmF0Z3kuIFVzZSB0aGUgY2F0Y2goKSBtZXRob2RcbiAgICAgKiBvZiB0aGUgcmV0dXJuZWQgUHJvbWlzZSB0byByZWFjdCB0byB0aW1lb3V0IGVycm9ycy5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBiZWhhdmlvdXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSB0byB3YWl0IGZvciBleGVjdXRpb24uXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Kj59XG4gICAgICovXG4gICAgcmVjZWl2ZSgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250ZXh0XG4iXX0=