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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvUmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIlJlZmVyZW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0lBSU1BLFM7Ozs7Ozs7OztBQUVGOzs7OzsyQkFLTyxDQUVOOzs7Ozs7a0JBSVVBLFMiLCJmaWxlIjoiUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZWZlcmVuY2Ugc2VydmVzIGFzIGEgaGFuZGxlIHRvIGEgQ29uY2Vybi5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgUmVmZXJlbmNlIHtcblxuICAgIC8qKlxuICAgICAqIHRlbGwgYSBtZXNzYWdlIHRvIGZvciB0aGlzIFJlZmVyZW5jZSdzIENvbmNlcm5cbiAgICAgKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gZnJvbVxuICAgICAqL1xuICAgIHRlbGwoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVmZXJlbmNlXG4iXX0=