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
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, MVar);

        this.value = value;
    }

    _createClass(MVar, [{
        key: 'put',
        value: function put(v) {

            this.value.push(v);
        }
    }, {
        key: 'take',
        value: function take() {
            var _this = this;

            return _monad.IO.of(function () {
                return _this.value.shift();
            });
        }
    }]);

    return MVar;
}();

/**
 * makeMVar
 */


var makeMVar = exports.makeMVar = function makeMVar(v) {
    return new _monad.IO.of(new MVar(v));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NVmFyLmpzIl0sIm5hbWVzIjpbIk1WYXIiLCJ2YWx1ZSIsInYiLCJwdXNoIiwib2YiLCJzaGlmdCIsIm1ha2VNVmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7SUFHYUEsSSxXQUFBQSxJO0FBRVQsb0JBQXdCO0FBQUEsWUFBWkMsS0FBWSx1RUFBSixFQUFJOztBQUFBOztBQUVwQixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7Ozs0QkFFR0MsQyxFQUFHOztBQUVILGlCQUFLRCxLQUFMLENBQVdFLElBQVgsQ0FBZ0JELENBQWhCO0FBRUg7OzsrQkFFTTtBQUFBOztBQUVILG1CQUFPLFVBQUdFLEVBQUgsQ0FBTTtBQUFBLHVCQUFNLE1BQUtILEtBQUwsQ0FBV0ksS0FBWCxFQUFOO0FBQUEsYUFBTixDQUFQO0FBRUg7Ozs7OztBQUlMOzs7OztBQUdPLElBQU1DLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxXQUFLLElBQUksVUFBR0YsRUFBUCxDQUFVLElBQUlKLElBQUosQ0FBU0UsQ0FBVCxDQUFWLENBQUw7QUFBQSxDQUFqQiIsImZpbGUiOiJNVmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU8gfSBmcm9tICcuL21vbmFkJztcblxuLyoqXG4gKiBNVmFyXG4gKi9cbmV4cG9ydCBjbGFzcyBNVmFyIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICBwdXQodikge1xuXG4gICAgICAgIHRoaXMudmFsdWUucHVzaCh2KTtcblxuICAgIH1cblxuICAgIHRha2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIElPLm9mKCgpID0+IHRoaXMudmFsdWUuc2hpZnQoKSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBtYWtlTVZhclxuICovXG5leHBvcnQgY29uc3QgbWFrZU1WYXIgPSB2ID0+IG5ldyBJTy5vZihuZXcgTVZhcih2KSk7XG4iXX0=