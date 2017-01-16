"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dispatcher is the interface ChildContext expects to handle receive execution.
 *
 * Dispatchers are notified when a message or receive is added to the respective queue.
 * @interface
 */
var Dispatcher = function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);
  }

  _createClass(Dispatcher, [{
    key: "schedule",


    /**
     * schedule a receive for future execution
     * @param {Callable} receive
     * @param {Context} context
     */
    value: function schedule() {}

    /**
     * dispatch this dispatcher.
     */

  }, {
    key: "dispatch",
    value: function dispatch() {}
  }]);

  return Dispatcher;
}();

exports.default = Dispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9EaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbIkRpc3BhdGNoZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBTU1BLFU7Ozs7Ozs7OztBQUVGOzs7OzsrQkFLVyxDQUVWOztBQUVEOzs7Ozs7K0JBR1csQ0FFVjs7Ozs7O2tCQUlVQSxVIiwiZmlsZSI6IkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BhdGNoZXIgaXMgdGhlIGludGVyZmFjZSBDaGlsZENvbnRleHQgZXhwZWN0cyB0byBoYW5kbGUgcmVjZWl2ZSBleGVjdXRpb24uXG4gKlxuICogRGlzcGF0Y2hlcnMgYXJlIG5vdGlmaWVkIHdoZW4gYSBtZXNzYWdlIG9yIHJlY2VpdmUgaXMgYWRkZWQgdG8gdGhlIHJlc3BlY3RpdmUgcXVldWUuXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIERpc3BhdGNoZXIgIHtcblxuICAgIC8qKlxuICAgICAqIHNjaGVkdWxlIGEgcmVjZWl2ZSBmb3IgZnV0dXJlIGV4ZWN1dGlvblxuICAgICAqIEBwYXJhbSB7Q2FsbGFibGV9IHJlY2VpdmVcbiAgICAgKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHRcbiAgICAgKi9cbiAgICBzY2hlZHVsZSgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRpc3BhdGNoIHRoaXMgZGlzcGF0Y2hlci5cbiAgICAgKi9cbiAgICBkaXNwYXRjaCgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEaXNwYXRjaGVyXG4iXX0=