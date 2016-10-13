"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ConcernFactory is an inteface for classes that provide Concerns.
 * The Context interface depends on these methods to create a Concern instance.
 * Instead of implementing a ConcernFactory, you can use the Defaults class instead.
 */
var ConcernFactory = function () {
  function ConcernFactory() {
    _classCallCheck(this, ConcernFactory);
  }

  _createClass(ConcernFactory, [{
    key: "dispatcher",


    /**
     * dispatcher provides the disptacher for the Concern.
     * @param {Context} context
     * @returns {Dispatcher}
     */
    value: function dispatcher() {}

    /**
     * mailbox provides the Mailbox for the Concern
     * @param {Dispatcher} dispatcher
     * @returns {Mailbox}
     */

  }, {
    key: "mailbox",
    value: function mailbox() {}

    /**
     * errorHandlingStrategy provides the ErrorHandlingStrategy for
     * this Concern
     * @returns {ErrorHandlingStrategy}
     */

  }, {
    key: "errorHandlingStrategy",
    value: function errorHandlingStrategy() {}

    /**
     * reference generates the Reference for the Concern
     * @param {Context} context
     * @returns {Reference}
     */

  }, {
    key: "reference",
    value: function reference() {}

    /**
     * create is called to provide an instance of the Concern itself.
     * @param {Context} context
     * @returns {Concern}
     */

  }, {
    key: "create",
    value: function create() {}
  }]);

  return ConcernFactory;
}();

exports.default = ConcernFactory;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25jZXJuRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJDb25jZXJuRmFjdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7OztJQUtNQSxjOzs7Ozs7Ozs7QUFFRjs7Ozs7aUNBS2EsQ0FFWjs7QUFFRDs7Ozs7Ozs7OEJBS1UsQ0FFVDs7QUFFRDs7Ozs7Ozs7NENBS3dCLENBRXZCOztBQUVEOzs7Ozs7OztnQ0FLWSxDQUVYOztBQUVEOzs7Ozs7Ozs2QkFLUyxDQUVSOzs7Ozs7a0JBSVVBLGMiLCJmaWxlIjoiQ29uY2VybkZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbmNlcm5GYWN0b3J5IGlzIGFuIGludGVmYWNlIGZvciBjbGFzc2VzIHRoYXQgcHJvdmlkZSBDb25jZXJucy5cbiAqIFRoZSBDb250ZXh0IGludGVyZmFjZSBkZXBlbmRzIG9uIHRoZXNlIG1ldGhvZHMgdG8gY3JlYXRlIGEgQ29uY2VybiBpbnN0YW5jZS5cbiAqIEluc3RlYWQgb2YgaW1wbGVtZW50aW5nIGEgQ29uY2VybkZhY3RvcnksIHlvdSBjYW4gdXNlIHRoZSBEZWZhdWx0cyBjbGFzcyBpbnN0ZWFkLlxuICovXG5jbGFzcyBDb25jZXJuRmFjdG9yeSB7XG5cbiAgICAvKipcbiAgICAgKiBkaXNwYXRjaGVyIHByb3ZpZGVzIHRoZSBkaXNwdGFjaGVyIGZvciB0aGUgQ29uY2Vybi5cbiAgICAgKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHRcbiAgICAgKiBAcmV0dXJucyB7RGlzcGF0Y2hlcn1cbiAgICAgKi9cbiAgICBkaXNwYXRjaGVyKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFpbGJveCBwcm92aWRlcyB0aGUgTWFpbGJveCBmb3IgdGhlIENvbmNlcm5cbiAgICAgKiBAcGFyYW0ge0Rpc3BhdGNoZXJ9IGRpc3BhdGNoZXJcbiAgICAgKiBAcmV0dXJucyB7TWFpbGJveH1cbiAgICAgKi9cbiAgICBtYWlsYm94KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXJyb3JIYW5kbGluZ1N0cmF0ZWd5IHByb3ZpZGVzIHRoZSBFcnJvckhhbmRsaW5nU3RyYXRlZ3kgZm9yXG4gICAgICogdGhpcyBDb25jZXJuXG4gICAgICogQHJldHVybnMge0Vycm9ySGFuZGxpbmdTdHJhdGVneX1cbiAgICAgKi9cbiAgICBlcnJvckhhbmRsaW5nU3RyYXRlZ3koKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZWZlcmVuY2UgZ2VuZXJhdGVzIHRoZSBSZWZlcmVuY2UgZm9yIHRoZSBDb25jZXJuXG4gICAgICogQHBhcmFtIHtDb250ZXh0fSBjb250ZXh0XG4gICAgICogQHJldHVybnMge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICByZWZlcmVuY2UoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgaXMgY2FsbGVkIHRvIHByb3ZpZGUgYW4gaW5zdGFuY2Ugb2YgdGhlIENvbmNlcm4gaXRzZWxmLlxuICAgICAqIEBwYXJhbSB7Q29udGV4dH0gY29udGV4dFxuICAgICAqIEByZXR1cm5zIHtDb25jZXJufVxuICAgICAqL1xuICAgIGNyZWF0ZSgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25jZXJuRmFjdG9yeVxuIl19