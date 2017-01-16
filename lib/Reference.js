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
    key: "tell",


    /**
     * tell a message to for this Reference's Concern
     * @param {*} message
     * @param {Reference} from
     */
    value: function tell() {}
  }]);

  return Reference;
}();

exports.default = Reference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWZlcmVuY2UuanMiXSwibmFtZXMiOlsiUmVmZXJlbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7SUFJTUEsUzs7Ozs7Ozs7O0FBRUY7Ozs7OzJCQUtPLENBRU47Ozs7OztrQkFJVUEsUyIsImZpbGUiOiJSZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlZmVyZW5jZSBzZXJ2ZXMgYXMgYSBoYW5kbGUgdG8gYSBDb25jZXJuLlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBSZWZlcmVuY2Uge1xuXG4gICAgLyoqXG4gICAgICogdGVsbCBhIG1lc3NhZ2UgdG8gZm9yIHRoaXMgUmVmZXJlbmNlJ3MgQ29uY2VyblxuICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7UmVmZXJlbmNlfSBmcm9tXG4gICAgICovXG4gICAgdGVsbCgpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWZlcmVuY2VcbiJdfQ==