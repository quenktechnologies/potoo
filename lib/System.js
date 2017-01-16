"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * System implementations are the system part of the actor model¹.
 *
 * A System is effectively a mesh network where any node can
 * communicate with another provided they have an address for each other
 * (and are allowed to).
 *
 * The methods described here allow us to create actors and
 * retrieve references to them given an address. Once an
 * actor is created the actual actor instance cannot/should not
 * be accessed directly by external code, use the reference instead.
 *
 * ¹ https://en.wikipedia.org/wiki/Actor_model
 *
 * @interface
 */
var System = function () {
  function System() {
    _classCallCheck(this, System);
  }

  _createClass(System, [{
    key: "select",


    /**
     * select an actor's reference from the hierarchy.
     *
     * If the actor is not found you will be given a false
     * reference that effectively drops all its messages.
     * @param {string} path
     * @returns {Reference}
     */
    value: function select() {}

    /**
     * spawn adds an actor to the system.
     * @param {ActorFactory} factory
     * @param {string} name - If not provided, a uuid is used instead.
     */

  }, {
    key: "spawn",
    value: function spawn() {}

    /**
     * subscribe to the System's event stream.
     * @param {Callable} f
     */

  }, {
    key: "subscribe",
    value: function subscribe() {}

    /**
     * unsubscribe a Callable from the event stream.
     * @param {Callable} f
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe() {}

    /**
     * publish a message to the System's stream.
     * @param {Object} evt
     */

  }, {
    key: "publish",
    value: function publish() {}
  }]);

  return System;
}();

exports.default = System;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW0uanMiXSwibmFtZXMiOlsiU3lzdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQk1BLE07Ozs7Ozs7OztBQUVGOzs7Ozs7Ozs2QkFRUyxDQUVSOztBQUVEOzs7Ozs7Ozs0QkFLUSxDQUVQOztBQUVEOzs7Ozs7O2dDQUlZLENBRVg7O0FBRUQ7Ozs7Ozs7a0NBSWMsQ0FFYjs7QUFFRDs7Ozs7Ozs4QkFJVSxDQUVUOzs7Ozs7a0JBSVVBLE0iLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTeXN0ZW0gaW1wbGVtZW50YXRpb25zIGFyZSB0aGUgc3lzdGVtIHBhcnQgb2YgdGhlIGFjdG9yIG1vZGVswrkuXG4gKlxuICogQSBTeXN0ZW0gaXMgZWZmZWN0aXZlbHkgYSBtZXNoIG5ldHdvcmsgd2hlcmUgYW55IG5vZGUgY2FuXG4gKiBjb21tdW5pY2F0ZSB3aXRoIGFub3RoZXIgcHJvdmlkZWQgdGhleSBoYXZlIGFuIGFkZHJlc3MgZm9yIGVhY2ggb3RoZXJcbiAqIChhbmQgYXJlIGFsbG93ZWQgdG8pLlxuICpcbiAqIFRoZSBtZXRob2RzIGRlc2NyaWJlZCBoZXJlIGFsbG93IHVzIHRvIGNyZWF0ZSBhY3RvcnMgYW5kXG4gKiByZXRyaWV2ZSByZWZlcmVuY2VzIHRvIHRoZW0gZ2l2ZW4gYW4gYWRkcmVzcy4gT25jZSBhblxuICogYWN0b3IgaXMgY3JlYXRlZCB0aGUgYWN0dWFsIGFjdG9yIGluc3RhbmNlIGNhbm5vdC9zaG91bGQgbm90XG4gKiBiZSBhY2Nlc3NlZCBkaXJlY3RseSBieSBleHRlcm5hbCBjb2RlLCB1c2UgdGhlIHJlZmVyZW5jZSBpbnN0ZWFkLlxuICpcbiAqIMK5IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FjdG9yX21vZGVsXG4gKlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBTeXN0ZW0ge1xuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGFuIGFjdG9yJ3MgcmVmZXJlbmNlIGZyb20gdGhlIGhpZXJhcmNoeS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBhY3RvciBpcyBub3QgZm91bmQgeW91IHdpbGwgYmUgZ2l2ZW4gYSBmYWxzZVxuICAgICAqIHJlZmVyZW5jZSB0aGF0IGVmZmVjdGl2ZWx5IGRyb3BzIGFsbCBpdHMgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICAgKiBAcmV0dXJucyB7UmVmZXJlbmNlfVxuICAgICAqL1xuICAgIHNlbGVjdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNwYXduIGFkZHMgYW4gYWN0b3IgdG8gdGhlIHN5c3RlbS5cbiAgICAgKiBAcGFyYW0ge0FjdG9yRmFjdG9yeX0gZmFjdG9yeVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gSWYgbm90IHByb3ZpZGVkLCBhIHV1aWQgaXMgdXNlZCBpbnN0ZWFkLlxuICAgICAqL1xuICAgIHNwYXduKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3Vic2NyaWJlIHRvIHRoZSBTeXN0ZW0ncyBldmVudCBzdHJlYW0uXG4gICAgICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICAgICAqL1xuICAgIHN1YnNjcmliZSgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVuc3Vic2NyaWJlIGEgQ2FsbGFibGUgZnJvbSB0aGUgZXZlbnQgc3RyZWFtLlxuICAgICAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1Ymxpc2ggYSBtZXNzYWdlIHRvIHRoZSBTeXN0ZW0ncyBzdHJlYW0uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV2dFxuICAgICAqL1xuICAgIHB1Ymxpc2goKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3lzdGVtXG4iXX0=