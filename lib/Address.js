'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function startsWith(string, searchString, position) {
    position = position || 0;
    return string.substr(position, searchString.length) === searchString;
}

/**
 * Address represents the absolute url to a Concern.
 * @param {object} uri
 */

var Address = function () {
    function Address(uri) {
        _classCallCheck(this, Address);

        (0, _beof2.default)({ uri: uri }).object();
        this.uri = uri;
    }

    _createClass(Address, [{
        key: 'is',


        /**
         * is checks if the passed uri is equal to this address.
         * @param {string} uri
         */
        value: function is() {
            var uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


            (0, _beof2.default)({ uri: uri }).string();
            return _url2.default.parse(uri).href === this.uri.href;
        }

        /**
         * isBelow tells if the Address is below this uri.
         * @param {string} uri
         */

    }, {
        key: 'isBelow',
        value: function isBelow() {
            var uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


            (0, _beof2.default)({ uri: uri }).string();
            return startsWith(this.uri.href, uri);
        }

        /**
         * isAbove tells if the Address is above this uri.
         * @param {string} uri
         */

    }, {
        key: 'isAbove',
        value: function isAbove() {
            var uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


            (0, _beof2.default)({ uri: uri }).string();
            return startsWith(uri, this.uri.href);
        }

        /**
         * isRemote tells if this is indeed a remote address
         * @returns {boolean}
         */

    }, {
        key: 'isRemote',
        value: function isRemote() {

            return this.uri.protocol;
        }
    }, {
        key: 'toString',
        value: function toString() {

            return this.uri.href;
        }
    }], [{
        key: 'fromString',
        value: function fromString() {
            var uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


            uri = (0, _beof2.default)({ uri: uri }).string().value;

            return new this(_url2.default.parse(uri));
        }
    }]);

    return Address;
}();

exports.default = Address;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BZGRyZXNzLmpzIl0sIm5hbWVzIjpbInN0YXJ0c1dpdGgiLCJzdHJpbmciLCJzZWFyY2hTdHJpbmciLCJwb3NpdGlvbiIsInN1YnN0ciIsImxlbmd0aCIsIkFkZHJlc3MiLCJ1cmkiLCJvYmplY3QiLCJwYXJzZSIsImhyZWYiLCJwcm90b2NvbCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsVUFBVCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLEVBQTBDQyxRQUExQyxFQUFvRDtBQUNoREEsZUFBV0EsWUFBWSxDQUF2QjtBQUNBLFdBQU9GLE9BQU9HLE1BQVAsQ0FBY0QsUUFBZCxFQUF3QkQsYUFBYUcsTUFBckMsTUFBaURILFlBQXhEO0FBQ0g7O0FBRUQ7Ozs7O0lBSU1JLE87QUFFRixxQkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUViLDRCQUFLLEVBQUVBLFFBQUYsRUFBTCxFQUFjQyxNQUFkO0FBQ0EsYUFBS0QsR0FBTCxHQUFXQSxHQUFYO0FBRUg7Ozs7OztBQVVEOzs7OzZCQUlhO0FBQUEsZ0JBQVZBLEdBQVUseURBQUosRUFBSTs7O0FBRVQsZ0NBQUssRUFBRUEsUUFBRixFQUFMLEVBQWNOLE1BQWQ7QUFDQSxtQkFBUSxjQUFJUSxLQUFKLENBQVVGLEdBQVYsRUFBZUcsSUFBZixLQUF3QixLQUFLSCxHQUFMLENBQVNHLElBQXpDO0FBRUg7O0FBRUQ7Ozs7Ozs7a0NBSWtCO0FBQUEsZ0JBQVZILEdBQVUseURBQUosRUFBSTs7O0FBRWQsZ0NBQUssRUFBRUEsUUFBRixFQUFMLEVBQWNOLE1BQWQ7QUFDQSxtQkFBT0QsV0FBVyxLQUFLTyxHQUFMLENBQVNHLElBQXBCLEVBQTBCSCxHQUExQixDQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7a0NBSWtCO0FBQUEsZ0JBQVZBLEdBQVUseURBQUosRUFBSTs7O0FBRWQsZ0NBQUssRUFBRUEsUUFBRixFQUFMLEVBQWNOLE1BQWQ7QUFDQSxtQkFBT0QsV0FBV08sR0FBWCxFQUFnQixLQUFLQSxHQUFMLENBQVNHLElBQXpCLENBQVA7QUFFSDs7QUFFRDs7Ozs7OzttQ0FJVzs7QUFFUCxtQkFBUSxLQUFLSCxHQUFMLENBQVNJLFFBQWpCO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLSixHQUFMLENBQVNHLElBQWhCO0FBRUg7OztxQ0F2RDJCO0FBQUEsZ0JBQVZILEdBQVUseURBQUosRUFBSTs7O0FBRXhCQSxrQkFBTSxvQkFBSyxFQUFFQSxRQUFGLEVBQUwsRUFBY04sTUFBZCxHQUF1QlcsS0FBN0I7O0FBRUEsbUJBQU8sSUFBSSxJQUFKLENBQVMsY0FBSUgsS0FBSixDQUFVRixHQUFWLENBQVQsQ0FBUDtBQUVIOzs7Ozs7a0JBcURVRCxPIiwiZmlsZSI6IkFkZHJlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuZnVuY3Rpb24gc3RhcnRzV2l0aChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHIocG9zaXRpb24sIHNlYXJjaFN0cmluZy5sZW5ndGgpID09PSBzZWFyY2hTdHJpbmc7XG59XG5cbi8qKlxuICogQWRkcmVzcyByZXByZXNlbnRzIHRoZSBhYnNvbHV0ZSB1cmwgdG8gYSBDb25jZXJuLlxuICogQHBhcmFtIHtvYmplY3R9IHVyaVxuICovXG5jbGFzcyBBZGRyZXNzIHtcblxuICAgIGNvbnN0cnVjdG9yKHVyaSkge1xuXG4gICAgICAgIGJlb2YoeyB1cmkgfSkub2JqZWN0KCk7XG4gICAgICAgIHRoaXMudXJpID0gdXJpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGZyb21TdHJpbmcodXJpID0gJycpIHtcblxuICAgICAgICB1cmkgPSBiZW9mKHsgdXJpIH0pLnN0cmluZygpLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcyh1cmwucGFyc2UodXJpKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpcyBjaGVja3MgaWYgdGhlIHBhc3NlZCB1cmkgaXMgZXF1YWwgdG8gdGhpcyBhZGRyZXNzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmlcbiAgICAgKi9cbiAgICBpcyh1cmkgPSAnJykge1xuXG4gICAgICAgIGJlb2YoeyB1cmkgfSkuc3RyaW5nKCk7XG4gICAgICAgIHJldHVybiAodXJsLnBhcnNlKHVyaSkuaHJlZiA9PT0gdGhpcy51cmkuaHJlZik7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0JlbG93IHRlbGxzIGlmIHRoZSBBZGRyZXNzIGlzIGJlbG93IHRoaXMgdXJpLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmlcbiAgICAgKi9cbiAgICBpc0JlbG93KHVyaSA9ICcnKSB7XG5cbiAgICAgICAgYmVvZih7IHVyaSB9KS5zdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHN0YXJ0c1dpdGgodGhpcy51cmkuaHJlZiwgdXJpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlzQWJvdmUgdGVsbHMgaWYgdGhlIEFkZHJlc3MgaXMgYWJvdmUgdGhpcyB1cmkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVyaVxuICAgICAqL1xuICAgIGlzQWJvdmUodXJpID0gJycpIHtcblxuICAgICAgICBiZW9mKHsgdXJpIH0pLnN0cmluZygpO1xuICAgICAgICByZXR1cm4gc3RhcnRzV2l0aCh1cmksIHRoaXMudXJpLmhyZWYpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaXNSZW1vdGUgdGVsbHMgaWYgdGhpcyBpcyBpbmRlZWQgYSByZW1vdGUgYWRkcmVzc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzUmVtb3RlKCkge1xuXG4gICAgICAgIHJldHVybiAodGhpcy51cmkucHJvdG9jb2wpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudXJpLmhyZWY7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWRkcmVzc1xuIl19