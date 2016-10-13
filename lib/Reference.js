"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Reference serves as a handle to a Concern.
 * @interface
 */
var Reference = function () {
  function Reference() {
    _classCallCheck(this, Reference);
  }

  _createClass(Reference, [{
    key: "path",


    /**
     * path returns the full path (inclusive of protocol information) of this Reference.
     * @returns {string}
     */
    value: function path() {}

    /**
     * watch allows the state of this Reference to be monitored
     * by another Reference.
     * @param {Reference} ref
     */

  }, {
    key: "watch",
    value: function watch() {}

    /**
     * unwatch a Reference
     * @param {Reference} ref
     */

  }, {
    key: "unwatch",
    value: function unwatch() {}

    /**
     * tell a message to for this Reference's Concern
     * @param {*} message
     * @param {Reference} from
     */

  }, {
    key: "tell",
    value: function tell() {}
  }]);

  return Reference;
}();

exports.default = Reference;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWZlcmVuY2UuanMiXSwibmFtZXMiOlsiUmVmZXJlbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7SUFJTUEsUzs7Ozs7Ozs7O0FBRUY7Ozs7MkJBSU8sQ0FHTjs7QUFFRDs7Ozs7Ozs7NEJBS1EsQ0FFUDs7QUFFRDs7Ozs7Ozs4QkFJVSxDQUVUOztBQUVEOzs7Ozs7OzsyQkFLTyxDQUVOOzs7Ozs7a0JBSVVBLFMiLCJmaWxlIjoiUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZWZlcmVuY2Ugc2VydmVzIGFzIGEgaGFuZGxlIHRvIGEgQ29uY2Vybi5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgUmVmZXJlbmNlIHtcblxuICAgIC8qKlxuICAgICAqIHBhdGggcmV0dXJucyB0aGUgZnVsbCBwYXRoIChpbmNsdXNpdmUgb2YgcHJvdG9jb2wgaW5mb3JtYXRpb24pIG9mIHRoaXMgUmVmZXJlbmNlLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgcGF0aCgpIHtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogd2F0Y2ggYWxsb3dzIHRoZSBzdGF0ZSBvZiB0aGlzIFJlZmVyZW5jZSB0byBiZSBtb25pdG9yZWRcbiAgICAgKiBieSBhbm90aGVyIFJlZmVyZW5jZS5cbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gcmVmXG4gICAgICovXG4gICAgd2F0Y2goKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1bndhdGNoIGEgUmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICAgICAqL1xuICAgIHVud2F0Y2goKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0ZWxsIGEgbWVzc2FnZSB0byBmb3IgdGhpcyBSZWZlcmVuY2UncyBDb25jZXJuXG4gICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IGZyb21cbiAgICAgKi9cbiAgICB0ZWxsKCkge1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZmVyZW5jZVxuIl19