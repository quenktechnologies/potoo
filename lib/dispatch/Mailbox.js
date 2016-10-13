"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Mailbox interface representing a queue where messages
 * are stored for Concerns before they are processed.
 * @interface
 */
var Mailbox = function () {
  function Mailbox() {
    _classCallCheck(this, Mailbox);
  }

  _createClass(Mailbox, [{
    key: "enqueue",


    /**
     * enqueue puts a message into the queue and alerts the
     * listener of the change. Messages may be stringified for
     * remote storage.
     * @param {Concern} to
     * @param {Reference} from
     * @param {*} message
     */
    value: function enqueue(to, from, message) {}

    /**
     * dequeue furnishes the next message to be processed.
     * @returns {Envelope}
     */

  }, {
    key: "dequeue",
    value: function dequeue() {}
  }]);

  return Mailbox;
}();

/**
 * MailboxListener is the interface of classes interested in reacting to
 * enqueue events on the Mailbox.
 * @interface
 */


var EnqueueListener = function () {
  function EnqueueListener() {
    _classCallCheck(this, EnqueueListener);
  }

  _createClass(EnqueueListener, [{
    key: "onEnqueue",


    /**
     * onEnqueue is called when a new item has been enqueued by
     * the Mailbox.
     * @param {Mailbox} mailbox
     */
    value: function onEnqueue() {}
  }]);

  return EnqueueListener;
}();

Mailbox.EnqueueListener = EnqueueListener;
exports.default = Mailbox;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9NYWlsYm94LmpzIl0sIm5hbWVzIjpbIk1haWxib3giLCJ0byIsImZyb20iLCJtZXNzYWdlIiwiRW5xdWV1ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7O0lBS01BLE87Ozs7Ozs7OztBQUVGOzs7Ozs7Ozs0QkFRUUMsRSxFQUFJQyxJLEVBQU1DLE8sRUFBUyxDQUcxQjs7QUFFRDs7Ozs7Ozs4QkFJVSxDQUVUOzs7Ozs7QUFJTDs7Ozs7OztJQUtNQyxlOzs7Ozs7Ozs7QUFFRjs7Ozs7Z0NBS1ksQ0FFWDs7Ozs7O0FBSUxKLFFBQVFJLGVBQVIsR0FBMEJBLGVBQTFCO2tCQUNlSixPIiwiZmlsZSI6Ik1haWxib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1haWxib3ggaW50ZXJmYWNlIHJlcHJlc2VudGluZyBhIHF1ZXVlIHdoZXJlIG1lc3NhZ2VzXG4gKiBhcmUgc3RvcmVkIGZvciBDb25jZXJucyBiZWZvcmUgdGhleSBhcmUgcHJvY2Vzc2VkLlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBNYWlsYm94IHtcblxuICAgIC8qKlxuICAgICAqIGVucXVldWUgcHV0cyBhIG1lc3NhZ2UgaW50byB0aGUgcXVldWUgYW5kIGFsZXJ0cyB0aGVcbiAgICAgKiBsaXN0ZW5lciBvZiB0aGUgY2hhbmdlLiBNZXNzYWdlcyBtYXkgYmUgc3RyaW5naWZpZWQgZm9yXG4gICAgICogcmVtb3RlIHN0b3JhZ2UuXG4gICAgICogQHBhcmFtIHtDb25jZXJufSB0b1xuICAgICAqIEBwYXJhbSB7UmVmZXJlbmNlfSBmcm9tXG4gICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICovXG4gICAgZW5xdWV1ZSh0bywgZnJvbSwgbWVzc2FnZSkge1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkZXF1ZXVlIGZ1cm5pc2hlcyB0aGUgbmV4dCBtZXNzYWdlIHRvIGJlIHByb2Nlc3NlZC5cbiAgICAgKiBAcmV0dXJucyB7RW52ZWxvcGV9XG4gICAgICovXG4gICAgZGVxdWV1ZSgpIHtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE1haWxib3hMaXN0ZW5lciBpcyB0aGUgaW50ZXJmYWNlIG9mIGNsYXNzZXMgaW50ZXJlc3RlZCBpbiByZWFjdGluZyB0b1xuICogZW5xdWV1ZSBldmVudHMgb24gdGhlIE1haWxib3guXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIEVucXVldWVMaXN0ZW5lciB7XG5cbiAgICAvKipcbiAgICAgKiBvbkVucXVldWUgaXMgY2FsbGVkIHdoZW4gYSBuZXcgaXRlbSBoYXMgYmVlbiBlbnF1ZXVlZCBieVxuICAgICAqIHRoZSBNYWlsYm94LlxuICAgICAqIEBwYXJhbSB7TWFpbGJveH0gbWFpbGJveFxuICAgICAqL1xuICAgIG9uRW5xdWV1ZSgpIHtcblxuICAgIH1cblxufVxuXG5NYWlsYm94LkVucXVldWVMaXN0ZW5lciA9IEVucXVldWVMaXN0ZW5lcjtcbmV4cG9ydCBkZWZhdWx0IE1haWxib3hcbiJdfQ==