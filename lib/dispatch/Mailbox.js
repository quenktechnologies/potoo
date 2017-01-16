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
var Mailbox = exports.Mailbox = function () {
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

exports.default = Mailbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9NYWlsYm94LmpzIl0sIm5hbWVzIjpbIk1haWxib3giLCJ0byIsImZyb20iLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7O0lBS2FBLE8sV0FBQUEsTzs7Ozs7Ozs7O0FBRVQ7Ozs7Ozs7OzRCQVFRQyxFLEVBQUlDLEksRUFBTUMsTyxFQUFTLENBRzFCOztBQUVEOzs7Ozs7OzhCQUlVLENBRVQ7Ozs7OztrQkFJVUgsTyIsImZpbGUiOiJNYWlsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWlsYm94IGludGVyZmFjZSByZXByZXNlbnRpbmcgYSBxdWV1ZSB3aGVyZSBtZXNzYWdlc1xuICogYXJlIHN0b3JlZCBmb3IgQ29uY2VybnMgYmVmb3JlIHRoZXkgYXJlIHByb2Nlc3NlZC5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIE1haWxib3gge1xuXG4gICAgLyoqXG4gICAgICogZW5xdWV1ZSBwdXRzIGEgbWVzc2FnZSBpbnRvIHRoZSBxdWV1ZSBhbmQgYWxlcnRzIHRoZVxuICAgICAqIGxpc3RlbmVyIG9mIHRoZSBjaGFuZ2UuIE1lc3NhZ2VzIG1heSBiZSBzdHJpbmdpZmllZCBmb3JcbiAgICAgKiByZW1vdGUgc3RvcmFnZS5cbiAgICAgKiBAcGFyYW0ge0NvbmNlcm59IHRvXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IGZyb21cbiAgICAgKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAgICAgKi9cbiAgICBlbnF1ZXVlKHRvLCBmcm9tLCBtZXNzYWdlKSB7XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRlcXVldWUgZnVybmlzaGVzIHRoZSBuZXh0IG1lc3NhZ2UgdG8gYmUgcHJvY2Vzc2VkLlxuICAgICAqIEByZXR1cm5zIHtFbnZlbG9wZX1cbiAgICAgKi9cbiAgICBkZXF1ZXVlKCkge1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haWxib3hcbiJdfQ==