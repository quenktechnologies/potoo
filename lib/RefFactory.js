"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RefFactory  represents the context a Concern is created in.
 * With a Context you can:
 * * Create Concerns
 * * Listen to events via subscribe()
 * * more
 * @interface
 */
var RefFactory = function () {
  function RefFactory() {
    _classCallCheck(this, RefFactory);
  }

  _createClass(RefFactory, [{
    key: "select",


    /**
     * select a Concern based on it's path
     * @param {string} path
     */
    value: function select(path) {}

    /**
     * concernOf considers a Concern part of this system when it activates.
     * @param {ConcernFactory} factory
     * @param {string} name
     * @returns {Reference}
     */

  }, {
    key: "concernOf",
    value: function concernOf(factory, name) {}
  }]);

  return RefFactory;
}();

exports.default = RefFactory;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWZGYWN0b3J5LmpzIl0sIm5hbWVzIjpbIlJlZkZhY3RvcnkiLCJwYXRoIiwiZmFjdG9yeSIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7SUFRTUEsVTs7Ozs7Ozs7O0FBRUY7Ozs7MkJBSU9DLEksRUFBTSxDQUVaOztBQUVEOzs7Ozs7Ozs7OEJBTVVDLE8sRUFBU0MsSSxFQUFNLENBRXhCOzs7Ozs7a0JBSVVILFUiLCJmaWxlIjoiUmVmRmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmVmRmFjdG9yeSAgcmVwcmVzZW50cyB0aGUgY29udGV4dCBhIENvbmNlcm4gaXMgY3JlYXRlZCBpbi5cbiAqIFdpdGggYSBDb250ZXh0IHlvdSBjYW46XG4gKiAqIENyZWF0ZSBDb25jZXJuc1xuICogKiBMaXN0ZW4gdG8gZXZlbnRzIHZpYSBzdWJzY3JpYmUoKVxuICogKiBtb3JlXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIFJlZkZhY3Rvcnkge1xuXG4gICAgLyoqXG4gICAgICogc2VsZWN0IGEgQ29uY2VybiBiYXNlZCBvbiBpdCdzIHBhdGhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqL1xuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25jZXJuT2YgY29uc2lkZXJzIGEgQ29uY2VybiBwYXJ0IG9mIHRoaXMgc3lzdGVtIHdoZW4gaXQgYWN0aXZhdGVzLlxuICAgICAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm5zIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgY29uY2Vybk9mKGZhY3RvcnksIG5hbWUpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWZGYWN0b3J5O1xuIl19