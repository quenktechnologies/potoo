"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * StateProvider is an interface for providing the 'state' a Reference should be in.
 * @interface
 */
var StateProvider = function () {
  function StateProvider() {
    _classCallCheck(this, StateProvider);
  }

  _createClass(StateProvider, [{
    key: "provide",


    /**
     * provide the state
     * @param {string} state 
     * @param {string} path - Path to the Concern
     * @param {Concern} concern 
     * @param {Context} context 
     */
    value: function provide() {}
  }]);

  return StateProvider;
}();

exports.default = StateProvider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGF0ZVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbIlN0YXRlUHJvdmlkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7OztJQUlNQSxhOzs7Ozs7Ozs7QUFFSjs7Ozs7Ozs4QkFPVSxDQUVUOzs7Ozs7a0JBSVlBLGEiLCJmaWxlIjoiU3RhdGVQcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBTdGF0ZVByb3ZpZGVyIGlzIGFuIGludGVyZmFjZSBmb3IgcHJvdmlkaW5nIHRoZSAnc3RhdGUnIGEgUmVmZXJlbmNlIHNob3VsZCBiZSBpbi5cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgU3RhdGVQcm92aWRlciB7XG5cbiAgLyoqXG4gICAqIHByb3ZpZGUgdGhlIHN0YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZSBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBQYXRoIHRvIHRoZSBDb25jZXJuXG4gICAqIEBwYXJhbSB7Q29uY2Vybn0gY29uY2VybiBcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjb250ZXh0IFxuICAgKi9cbiAgcHJvdmlkZSgpIHtcbiAgICBcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRlUHJvdmlkZXJcblxuIl19