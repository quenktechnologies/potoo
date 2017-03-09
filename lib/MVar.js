'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeMVar = exports.MVar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monad = require('./monad');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MVar
 */
var MVar = exports.MVar = function () {
    function MVar() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, MVar);

        this.value = value;
    }

    _createClass(MVar, [{
        key: 'put',
        value: function put(v) {

            this.value = v;
        }
    }, {
        key: 'take',
        value: function take() {

            return _monad.IO.of(this.value);
        }
    }]);

    return MVar;
}();

/**
 * makeEmptyMVar
 */


var makeMVar = exports.makeMVar = function makeMVar(v) {
    return new _monad.IO.of(new MVar(v));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NVmFyLmpzIl0sIm5hbWVzIjpbIk1WYXIiLCJ2YWx1ZSIsInYiLCJvZiIsIm1ha2VNVmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7SUFHYUEsSSxXQUFBQSxJO0FBRVQsb0JBQTBCO0FBQUEsWUFBZEMsS0FBYyx1RUFBTixJQUFNOztBQUFBOztBQUV0QixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7Ozs0QkFFR0MsQyxFQUFHOztBQUVILGlCQUFLRCxLQUFMLEdBQWFDLENBQWI7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLFVBQUdDLEVBQUgsQ0FBTSxLQUFLRixLQUFYLENBQVA7QUFFSDs7Ozs7O0FBS0w7Ozs7O0FBR08sSUFBTUcsOEJBQVcsU0FBWEEsUUFBVztBQUFBLFdBQUssSUFBSSxVQUFHRCxFQUFQLENBQVUsSUFBSUgsSUFBSixDQUFTRSxDQUFULENBQVYsQ0FBTDtBQUFBLENBQWpCIiwiZmlsZSI6Ik1WYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTyB9IGZyb20gJy4vbW9uYWQnO1xuXG4vKipcbiAqIE1WYXJcbiAqL1xuZXhwb3J0IGNsYXNzIE1WYXIge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUgPSBudWxsKSB7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gICAgcHV0KHYpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdjtcblxuICAgIH1cblxuICAgIHRha2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIElPLm9mKHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG59XG5cblxuLyoqXG4gKiBtYWtlRW1wdHlNVmFyXG4gKi9cbmV4cG9ydCBjb25zdCBtYWtlTVZhciA9IHYgPT4gbmV3IElPLm9mKG5ldyBNVmFyKHYpKTtcblxuXG4iXX0=