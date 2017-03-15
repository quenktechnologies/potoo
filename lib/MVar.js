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
    return new _monad.IO.of(function () {
        return new MVar(v);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NVmFyLmpzIl0sIm5hbWVzIjpbIk1WYXIiLCJ2YWx1ZSIsInYiLCJvZiIsIm1ha2VNVmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7SUFHYUEsSSxXQUFBQSxJO0FBRVQsb0JBQTBCO0FBQUEsWUFBZEMsS0FBYyx1RUFBTixJQUFNOztBQUFBOztBQUV0QixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7Ozs0QkFFR0MsQyxFQUFHOztBQUVILGlCQUFLRCxLQUFMLEdBQWFDLENBQWI7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLFVBQUdDLEVBQUgsQ0FBTSxLQUFLRixLQUFYLENBQVA7QUFFSDs7Ozs7O0FBSUw7Ozs7O0FBR08sSUFBTUcsOEJBQVcsU0FBWEEsUUFBVztBQUFBLFdBQUssSUFBSSxVQUFHRCxFQUFQLENBQVU7QUFBQSxlQUFJLElBQUlILElBQUosQ0FBU0UsQ0FBVCxDQUFKO0FBQUEsS0FBVixDQUFMO0FBQUEsQ0FBakIiLCJmaWxlIjoiTVZhci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElPIH0gZnJvbSAnLi9tb25hZCc7XG5cbi8qKlxuICogTVZhclxuICovXG5leHBvcnQgY2xhc3MgTVZhciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IG51bGwpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICBwdXQodikge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgdGFrZSgpIHtcblxuICAgICAgICByZXR1cm4gSU8ub2YodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBtYWtlRW1wdHlNVmFyXG4gKi9cbmV4cG9ydCBjb25zdCBtYWtlTVZhciA9IHYgPT4gbmV3IElPLm9mKCgpPT5uZXcgTVZhcih2KSk7XG4iXX0=