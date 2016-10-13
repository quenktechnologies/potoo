'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Concern interface represents a unit of work or some aspect of the application.
 * @interface
 */
var Concern = function () {
  function Concern() {
    _classCallCheck(this, Concern);
  }

  _createClass(Concern, [{
    key: 'onStart',


    /**
    * onStart is called when the Concern is started
    * for the first time.
    * @returns {Promise|null}
    */
    value: function onStart() {}

    /**
     * onPause is called when the Concern is to
     * be paused.
     * @returns {Promise|null}
     */

  }, {
    key: 'onPause',
    value: function onPause() {}

    /**
     * onResume is called when the Concern is to resume operations.
     * @returns {Promise|null}
     */

  }, {
    key: 'onResume',
    value: function onResume() {}

    /**
     * onStop is called when the Concern has been stopped.
     * @returns {Promise|null}
     */

  }, {
    key: 'onStop',
    value: function onStop() {}

    /**
     * receive a message from a sender
     * @param {*} message
     * @param {Concern} sender
     */

  }, {
    key: 'receive',
    value: function receive() {}
  }]);

  return Concern;
}();

exports.default = Concern;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25jZXJuLmpzIl0sIm5hbWVzIjpbIkNvbmNlcm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBQ0E7Ozs7SUFJTUEsTzs7Ozs7Ozs7O0FBRUE7Ozs7OzhCQUtRLENBRVQ7O0FBRUQ7Ozs7Ozs7OzhCQUtVLENBRVQ7O0FBRUQ7Ozs7Ozs7K0JBSVcsQ0FFVjs7QUFFRDs7Ozs7Ozs2QkFJUyxDQUVSOztBQUVEOzs7Ozs7Ozs4QkFLVSxDQUVUOzs7Ozs7a0JBSVVBLE8iLCJmaWxlIjoiQ29uY2Vybi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG4vKipcbiAqIENvbmNlcm4gaW50ZXJmYWNlIHJlcHJlc2VudHMgYSB1bml0IG9mIHdvcmsgb3Igc29tZSBhc3BlY3Qgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBDb25jZXJuIHtcblxuICAgICAgLyoqXG4gICAgICogb25TdGFydCBpcyBjYWxsZWQgd2hlbiB0aGUgQ29uY2VybiBpcyBzdGFydGVkXG4gICAgICogZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfG51bGx9XG4gICAgICovXG4gICAgb25TdGFydCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uUGF1c2UgaXMgY2FsbGVkIHdoZW4gdGhlIENvbmNlcm4gaXMgdG9cbiAgICAgKiBiZSBwYXVzZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2V8bnVsbH1cbiAgICAgKi9cbiAgICBvblBhdXNlKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb25SZXN1bWUgaXMgY2FsbGVkIHdoZW4gdGhlIENvbmNlcm4gaXMgdG8gcmVzdW1lIG9wZXJhdGlvbnMuXG4gICAgICogQHJldHVybnMge1Byb21pc2V8bnVsbH1cbiAgICAgKi9cbiAgICBvblJlc3VtZSgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uU3RvcCBpcyBjYWxsZWQgd2hlbiB0aGUgQ29uY2VybiBoYXMgYmVlbiBzdG9wcGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfG51bGx9XG4gICAgICovXG4gICAgb25TdG9wKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVjZWl2ZSBhIG1lc3NhZ2UgZnJvbSBhIHNlbmRlclxuICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7Q29uY2Vybn0gc2VuZGVyXG4gICAgICovXG4gICAgcmVjZWl2ZSgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25jZXJuXG4iXX0=