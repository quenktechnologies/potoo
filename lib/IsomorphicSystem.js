'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Guardian = require('./Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */
var IsomorphicSystem = function () {
    function IsomorphicSystem() {
        _classCallCheck(this, IsomorphicSystem);

        this._subs = [];
        this._guardian = new _Guardian2.default(this);
    }

    /**
     * create a new IsomorphicSystem
     * @returns {IsomorphicSystem}
     */


    _createClass(IsomorphicSystem, [{
        key: 'select',
        value: function select(path) {

            return this._guardian.select(path);
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this._guardian.spawn(spec, name);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(f) {

            this._subs.push(f);
            return this;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(f) {

            var i = this._subs.indexOf(f);

            if (i > 0) this._subs.splice(i, 1);

            return this;
        }
    }, {
        key: 'publish',
        value: function publish(evt) {
            var _this = this;

            this._subs.forEach(function (s) {
                return s.call(_this, event);
            });
        }
    }], [{
        key: 'create',
        value: function create() {

            return new IsomorphicSystem();
        }
    }]);

    return IsomorphicSystem;
}();

exports.default = IsomorphicSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Jc29tb3JwaGljU3lzdGVtLmpzIl0sIm5hbWVzIjpbIklzb21vcnBoaWNTeXN0ZW0iLCJfc3VicyIsIl9ndWFyZGlhbiIsInBhdGgiLCJzZWxlY3QiLCJzcGVjIiwibmFtZSIsInNwYXduIiwiZiIsInB1c2giLCJpIiwiaW5kZXhPZiIsInNwbGljZSIsImV2dCIsImZvckVhY2giLCJzIiwiY2FsbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7O0lBTU1BLGdCO0FBRUYsZ0NBQWM7QUFBQTs7QUFFVixhQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUtDLFNBQUwsR0FBaUIsdUJBQWEsSUFBYixDQUFqQjtBQUVIOztBQUVEOzs7Ozs7OzsrQkFVT0MsSSxFQUFNOztBQUVULG1CQUFPLEtBQUtELFNBQUwsQ0FBZUUsTUFBZixDQUFzQkQsSUFBdEIsQ0FBUDtBQUVIOzs7OEJBRUtFLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtKLFNBQUwsQ0FBZUssS0FBZixDQUFxQkYsSUFBckIsRUFBMkJDLElBQTNCLENBQVA7QUFFSDs7O2tDQUVTRSxDLEVBQUc7O0FBRVQsaUJBQUtQLEtBQUwsQ0FBV1EsSUFBWCxDQUFnQkQsQ0FBaEI7QUFDQSxtQkFBTyxJQUFQO0FBRUg7OztvQ0FFV0EsQyxFQUFHOztBQUVYLGdCQUFJRSxJQUFJLEtBQUtULEtBQUwsQ0FBV1UsT0FBWCxDQUFtQkgsQ0FBbkIsQ0FBUjs7QUFFQSxnQkFBSUUsSUFBSSxDQUFSLEVBQ0ksS0FBS1QsS0FBTCxDQUFXVyxNQUFYLENBQWtCRixDQUFsQixFQUFxQixDQUFyQjs7QUFFSixtQkFBTyxJQUFQO0FBRUg7OztnQ0FFT0csRyxFQUFLO0FBQUE7O0FBRVQsaUJBQUtaLEtBQUwsQ0FBV2EsT0FBWCxDQUFtQjtBQUFBLHVCQUFLQyxFQUFFQyxJQUFGLFFBQWFDLEtBQWIsQ0FBTDtBQUFBLGFBQW5CO0FBRUg7OztpQ0F4Q2U7O0FBRVosbUJBQU8sSUFBSWpCLGdCQUFKLEVBQVA7QUFFSDs7Ozs7O2tCQXdDVUEsZ0IiLCJmaWxlIjoiSXNvbW9ycGhpY1N5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IEd1YXJkaWFuIGZyb20gJy4vR3VhcmRpYW4nO1xuXG4vKipcbiAqIElzb21vcnBoaWNTeXN0ZW0gcmVwcmVzZW50cyBhIGNvbGxlY3Rpb24gb2YgcmVsYXRlZCBDb25jZXJucyB0aGF0IHNoYXJlIGEgcGFyZW50IENvbnRleHQuXG4gKiBVc2UgdGhlbSB0byBjcmVhdGUgdG8gcmVwcmVzZW50IHRoZSBndWFyZGlhbiBvZiBhIHRyZWUgeW91ciBhcHBsaWNhdGlvbiB3aWxsXG4gKiBicmFuY2ggaW50by5cbiAqIEBpbXBsZW1lbnRzIHtTeXN0ZW19XG4gKi9cbmNsYXNzIElzb21vcnBoaWNTeXN0ZW0ge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5fc3VicyA9IFtdO1xuICAgICAgICB0aGlzLl9ndWFyZGlhbiA9IG5ldyBHdWFyZGlhbih0aGlzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIG5ldyBJc29tb3JwaGljU3lzdGVtXG4gICAgICogQHJldHVybnMge0lzb21vcnBoaWNTeXN0ZW19XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElzb21vcnBoaWNTeXN0ZW0oKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1YXJkaWFuLnNlbGVjdChwYXRoKTtcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZ3VhcmRpYW4uc3Bhd24oc3BlYywgbmFtZSk7XG5cbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZikge1xuXG4gICAgICAgIHRoaXMuX3N1YnMucHVzaChmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZShmKSB7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLl9zdWJzLmluZGV4T2YoZik7XG5cbiAgICAgICAgaWYgKGkgPiAwKVxuICAgICAgICAgICAgdGhpcy5fc3Vicy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBwdWJsaXNoKGV2dCkge1xuXG4gICAgICAgIHRoaXMuX3N1YnMuZm9yRWFjaChzID0+IHMuY2FsbCh0aGlzLCBldmVudCkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElzb21vcnBoaWNTeXN0ZW1cbiJdfQ==