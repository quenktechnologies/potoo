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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvQ29udGV4dC5qc3giXSwibmFtZXMiOlsiQ29udGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFNYUEsTyxXQUFBQSxPOzs7Ozs7Ozs7QUFFVDs7OzsyQkFJTyxDQUVOOztBQUVEOzs7Ozs7OzJCQUlPLENBRU47Ozs2QkFFUSxDQUVSOztBQUVEOzs7Ozs7OzsyQkFLTyxDQUVOOztBQUVEOzs7Ozs7OzJCQUlPLENBRU47O0FBRUQ7Ozs7Ozs7Ozs2QkFNUyxDQUVSOztBQUVEOzs7Ozs7Ozs7NEJBTVEsQ0FFUDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQWVVLENBRVQ7Ozs7OztrQkFJVUEsTyIsImZpbGUiOiJDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb250ZXh0IGFjdHMgYXMgYSBwcml2YXRlIG1pbmktc3lzdGVtIGZvciBlYWNoIGFjdG9yIGFsbG93aW5nIGFkZGl0aW9uYWxcbiAqIHNwYXduaW5nIGFuZCBpbnRlcmFjdGlvbiB3aXRoIHRoZSByZXN0IG9mIHRoZSBzeXN0ZW0uXG4gKlxuICogQGludGVyZmFjZVxuICovXG5leHBvcnQgY2xhc3MgQ29udGV4dCB7XG5cbiAgICAvKipcbiAgICAgKiBwYXRoIHJldHVybnMgdGhlIHBhdGggdG8gdGhpcyBjb250ZXh0XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBwYXRoKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VsZiByZXR1cm5zIGEgUmVmZXJlbmNlIGZvciB0aGUgYWN0b3IuXG4gICAgICogQHJldHVybnMge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICBzZWxmKCkge1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcm9vdCByZXR1cm5zIHRoZSByb290IG9mIGFsbCBhY3RvcnMgaW4gdGhlIHN5c3RlbS5cbiAgICAgKiBVc2VkIGludGVybmFsbHkgb25seSB0byBoYW5kbGUgbWVzc2FnZXMsIGxvZ2dpbmcgZXRjLlxuICAgICAqIEByZXR1cm4ge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICByb290KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbm9uZSByZXR1cm5zIGFuIGFjdG9yIHJlZmVyZW5jZSB0aGF0IGlzIGVmZmVjdGl2ZWx5IGEgbm9vcC5cbiAgICAgKiBAcmV0dXJucyB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIG5vbmUoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZWxlY3QgYW4gYWN0b3IgUmVmZXJlbmNlIGdpdmVuIGEgcGF0aC5cbiAgICAgKlxuICAgICAqIEFuIHVuLXJlZ2lzdGVyZWQgcGF0aCB5aWVsZHMgYW4gYWN0b3IgdGhhdCBkcm9wcyBtZXNzYWdlcyBhdXRvbWF0aWNhbGx5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgICovXG4gICAgc2VsZWN0KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Bhd24gYSBjaGlsZCBhY3Rvci5cbiAgICAgKiBAcGFyYW0ge0NoaWxkU3BlY30gc3BlY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIHNwYXduKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVjZWl2ZSB0aGUgbmV4dCBtZXNzYWdlIGZvciB0aGlzIENvbnRleHQncyBhY3Rvci5cbiAgICAgKlxuICAgICAqIFRoZSBiZWhhdmlvdXIgcGFzc2VkIGNhbiBjYWxsIHJlY2VpdmUgYWdhaW4gdG8gY2hhbmdlXG4gICAgICogaG93IHRoZSBuZXh0IG1lc3NhZ2UgaXMgaGFuZGxlZC4gT25jZSBhIG1lc3NhZ2UgaGFzIGJlZW4gcmVjZWl2ZWQsXG4gICAgICogdGhlIGN1cnJlbnQgYmVoYXZpb3VyIGlzIGRpc2NhcmRlZCBhbmQgbWVzc2FnZXMgd2lsbCBjb250aW51ZSB0byBidWZmZXJcbiAgICAgKiB1bnRpbCB0aGUgbmV4dCByZWNlaXZlIGNhbGwgb3IgYW4gZXJyb3Igb2NjdXJzLlxuICAgICAqXG4gICAgICogSWYgdGltZSBpcyBzcGVjaWZpZWQsIHRoZSBQcm9taXNlIHJldHVybmVkIGZvcm0gcmVjZWl2ZSBpcyByZWplY3RlZCBhbmRcbiAgICAgKiBpcyBOT1QgaW50ZXJjZXB0ZWQgYnkgdGhlIGVycm9yIGhhbmRsaW5nIHN0cmF0Z3kuIFVzZSB0aGUgY2F0Y2goKSBtZXRob2RcbiAgICAgKiBvZiB0aGUgcmV0dXJuZWQgUHJvbWlzZSB0byByZWFjdCB0byB0aW1lb3V0IGVycm9ycy5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBiZWhhdmlvdXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSB0byB3YWl0IGZvciBleGVjdXRpb24uXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Kj59XG4gICAgICovXG4gICAgcmVjZWl2ZSgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250ZXh0XG4iXX0=