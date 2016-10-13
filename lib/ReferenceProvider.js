"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ReferenceProvider is an interface for providing Reference instance.
 * @interface
 */
var ReferenceProvider = function () {
  function ReferenceProvider() {
    _classCallCheck(this, ReferenceProvider);
  }

  _createClass(ReferenceProvider, [{
    key: "select",


    /**
     * select a Reference to provide.
     * @param {string} path
     * @param {Context} context
     */
    value: function select() {}

    /**
     * reselect a Reference that may have gone away.
     * @param {string} path
     * @param {Context} context
     */

  }, {
    key: "reselect",
    value: function reselect() {}
  }]);

  return ReferenceProvider;
}();

exports.default = ReferenceProvider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWZlcmVuY2VQcm92aWRlci5qcyJdLCJuYW1lcyI6WyJSZWZlcmVuY2VQcm92aWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0lBSU1BLGlCOzs7Ozs7Ozs7QUFFRjs7Ozs7NkJBS1MsQ0FFUjs7QUFFRDs7Ozs7Ozs7K0JBS1csQ0FFVjs7Ozs7O2tCQUlVQSxpQiIsImZpbGUiOiJSZWZlcmVuY2VQcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmVmZXJlbmNlUHJvdmlkZXIgaXMgYW4gaW50ZXJmYWNlIGZvciBwcm92aWRpbmcgUmVmZXJlbmNlIGluc3RhbmNlLlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBSZWZlcmVuY2VQcm92aWRlciB7XG5cbiAgICAvKipcbiAgICAgKiBzZWxlY3QgYSBSZWZlcmVuY2UgdG8gcHJvdmlkZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7Q29udGV4dH0gY29udGV4dFxuICAgICAqL1xuICAgIHNlbGVjdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2VsZWN0IGEgUmVmZXJlbmNlIHRoYXQgbWF5IGhhdmUgZ29uZSBhd2F5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtDb250ZXh0fSBjb250ZXh0XG4gICAgICovXG4gICAgcmVzZWxlY3QoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVmZXJlbmNlUHJvdmlkZXJcbiJdfQ==