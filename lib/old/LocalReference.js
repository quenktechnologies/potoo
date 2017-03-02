'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _RefState = require('./state/RefState');

var _RefState2 = _interopRequireDefault(_RefState);

var _Signal = require('./state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Reference = require('./Reference');

var _Reference2 = _interopRequireDefault(_Reference);

var _RunningState = require('./state/RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * LocalReference acts is the Reference implementation for Concerns residing
 * in local address space.
 * via the LocalReference.
 * @param {ChildContext} context
 * @implements {LocalReference}
 */
var LocalReference = function () {
    function LocalReference(context) {
        _classCallCheck(this, LocalReference);

        this._state = new _RunningState2.default(context);
        this._watchers = [context.parent().self()];
    }

    /**
     * setState changes the state of this Reference, this
     * meant to be used internally.
     * @param {RefState} state
     */


    _createClass(LocalReference, [{
        key: 'setState',
        value: function setState(state) {
            var _this = this;

            (0, _beof2.default)({ state: state }).instance(_RefState2.default);

            var notify = state !== this._state;

            this._state = state;
            this._state.sync();

            if (notify) this._watchers.forEach(function (w) {
                return w.tell(_this._state.signal(), _this);
            });
        }
    }, {
        key: 'path',
        value: function path() {

            return this._state.path();
        }
    }, {
        key: 'watch',
        value: function watch(ref) {

            (0, _beof2.default)({ ref: ref }).interface(_Reference2.default);

            this._watchers.push(ref);
            return this;
        }
    }, {
        key: 'unwatch',
        value: function unwatch(ref) {

            (0, _beof2.default)({ ref: ref }).interface(_Reference2.default);

            this._watchers = this._watchers.filter(function (o) {
                return ref === o ? false : true;
            });
            return this;
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            (0, _beof2.default)({ from: from }).optional().interface(_Reference2.default);

            if (message === _Signal2.default.Restart) this.setState(this._state.restart());else if (message === _Signal2.default.Pause) this.setState(this._state.pause());else if (message === _Signal2.default.Stop) this.setState(this._state.stop());else if (message === _Signal2.default.Resume) this.setState(this._state.resume());else this._state.tell(message, from);
        }
    }, {
        key: 'ask',
        value: function ask(message, from) {

            (0, _beof2.default)({ from: from }).optional().interface(_Reference2.default);

            if (message === _Signal2.default.Restart) this.setState(this._state.restart());else if (message === _Signal2.default.Pause) this.setState(this._state.pause());else if (message === _Signal2.default.Stop) this.setState(this._state.stop());else if (message === _Signal2.default.Resume) this.setState(this._state.resume());else return this._state.ask(message, from);

            return _bluebird2.default.resolve();
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {

            return this.toString();
        }
    }, {
        key: 'toString',
        value: function toString() {

            return this.path();
        }
    }]);

    return LocalReference;
}();

exports.default = LocalReference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvTG9jYWxSZWZlcmVuY2UuanMiXSwibmFtZXMiOlsiTG9jYWxSZWZlcmVuY2UiLCJjb250ZXh0IiwiX3N0YXRlIiwiX3dhdGNoZXJzIiwicGFyZW50Iiwic2VsZiIsInN0YXRlIiwiaW5zdGFuY2UiLCJub3RpZnkiLCJzeW5jIiwiZm9yRWFjaCIsInciLCJ0ZWxsIiwic2lnbmFsIiwicGF0aCIsInJlZiIsImludGVyZmFjZSIsInB1c2giLCJmaWx0ZXIiLCJvIiwibWVzc2FnZSIsImZyb20iLCJvcHRpb25hbCIsIlJlc3RhcnQiLCJzZXRTdGF0ZSIsInJlc3RhcnQiLCJQYXVzZSIsInBhdXNlIiwiU3RvcCIsInN0b3AiLCJSZXN1bWUiLCJyZXN1bWUiLCJhc2siLCJyZXNvbHZlIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7O0lBT01BLGM7QUFFRiw0QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUVqQixhQUFLQyxNQUFMLEdBQWMsMkJBQWlCRCxPQUFqQixDQUFkO0FBQ0EsYUFBS0UsU0FBTCxHQUFpQixDQUFDRixRQUFRRyxNQUFSLEdBQWlCQyxJQUFqQixFQUFELENBQWpCO0FBRUg7O0FBRUQ7Ozs7Ozs7OztpQ0FLU0MsSyxFQUFPO0FBQUE7O0FBRVosZ0NBQUssRUFBRUEsWUFBRixFQUFMLEVBQWdCQyxRQUFoQjs7QUFFQSxnQkFBSUMsU0FBU0YsVUFBVSxLQUFLSixNQUE1Qjs7QUFFQSxpQkFBS0EsTUFBTCxHQUFjSSxLQUFkO0FBQ0EsaUJBQUtKLE1BQUwsQ0FBWU8sSUFBWjs7QUFFQSxnQkFBSUQsTUFBSixFQUNJLEtBQUtMLFNBQUwsQ0FBZU8sT0FBZixDQUF1QjtBQUFBLHVCQUFLQyxFQUFFQyxJQUFGLENBQU8sTUFBS1YsTUFBTCxDQUFZVyxNQUFaLEVBQVAsUUFBTDtBQUFBLGFBQXZCO0FBRVA7OzsrQkFFTTs7QUFFSCxtQkFBTyxLQUFLWCxNQUFMLENBQVlZLElBQVosRUFBUDtBQUVIOzs7OEJBRUtDLEcsRUFBSzs7QUFFUCxnQ0FBSyxFQUFFQSxRQUFGLEVBQUwsRUFBY0MsU0FBZDs7QUFFQSxpQkFBS2IsU0FBTCxDQUFlYyxJQUFmLENBQW9CRixHQUFwQjtBQUNBLG1CQUFPLElBQVA7QUFFSDs7O2dDQUVPQSxHLEVBQUs7O0FBRVQsZ0NBQUssRUFBRUEsUUFBRixFQUFMLEVBQWNDLFNBQWQ7O0FBRUEsaUJBQUtiLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxDQUFlZSxNQUFmLENBQXNCO0FBQUEsdUJBQU1ILFFBQVFJLENBQVQsR0FBYyxLQUFkLEdBQXNCLElBQTNCO0FBQUEsYUFBdEIsQ0FBakI7QUFDQSxtQkFBTyxJQUFQO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGdDQUFLLEVBQUVBLFVBQUYsRUFBTCxFQUFlQyxRQUFmLEdBQTBCTixTQUExQjs7QUFFQSxnQkFBSUksWUFBWSxpQkFBT0csT0FBdkIsRUFDSSxLQUFLQyxRQUFMLENBQWMsS0FBS3RCLE1BQUwsQ0FBWXVCLE9BQVosRUFBZCxFQURKLEtBRUssSUFBSUwsWUFBWSxpQkFBT00sS0FBdkIsRUFDRCxLQUFLRixRQUFMLENBQWMsS0FBS3RCLE1BQUwsQ0FBWXlCLEtBQVosRUFBZCxFQURDLEtBRUEsSUFBSVAsWUFBWSxpQkFBT1EsSUFBdkIsRUFDRCxLQUFLSixRQUFMLENBQWMsS0FBS3RCLE1BQUwsQ0FBWTJCLElBQVosRUFBZCxFQURDLEtBRUEsSUFBSVQsWUFBWSxpQkFBT1UsTUFBdkIsRUFDRCxLQUFLTixRQUFMLENBQWMsS0FBS3RCLE1BQUwsQ0FBWTZCLE1BQVosRUFBZCxFQURDLEtBR0QsS0FBSzdCLE1BQUwsQ0FBWVUsSUFBWixDQUFpQlEsT0FBakIsRUFBMEJDLElBQTFCO0FBRVA7Ozs0QkFFR0QsTyxFQUFTQyxJLEVBQU07O0FBRWYsZ0NBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJOLFNBQTFCOztBQUVBLGdCQUFJSSxZQUFZLGlCQUFPRyxPQUF2QixFQUNJLEtBQUtDLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZdUIsT0FBWixFQUFkLEVBREosS0FFSyxJQUFJTCxZQUFZLGlCQUFPTSxLQUF2QixFQUNELEtBQUtGLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZeUIsS0FBWixFQUFkLEVBREMsS0FFQSxJQUFJUCxZQUFZLGlCQUFPUSxJQUF2QixFQUNELEtBQUtKLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZMkIsSUFBWixFQUFkLEVBREMsS0FFQSxJQUFJVCxZQUFZLGlCQUFPVSxNQUF2QixFQUNELEtBQUtOLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZNkIsTUFBWixFQUFkLEVBREMsS0FHRCxPQUFPLEtBQUs3QixNQUFMLENBQVk4QixHQUFaLENBQWdCWixPQUFoQixFQUF5QkMsSUFBekIsQ0FBUDs7QUFFSixtQkFBTyxtQkFBUVksT0FBUixFQUFQO0FBRUg7OztpQ0FHUTs7QUFFTCxtQkFBTyxLQUFLQyxRQUFMLEVBQVA7QUFFSDs7O21DQUVVOztBQUVQLG1CQUFPLEtBQUtwQixJQUFMLEVBQVA7QUFFSDs7Ozs7O2tCQUlVZCxjIiwiZmlsZSI6IkxvY2FsUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgUmVmU3RhdGUgZnJvbSAnLi9zdGF0ZS9SZWZTdGF0ZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vc3RhdGUvU2lnbmFsJztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL3N0YXRlL1J1bm5pbmdTdGF0ZSc7XG5cbi8qKlxuICogTG9jYWxSZWZlcmVuY2UgYWN0cyBpcyB0aGUgUmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIGZvciBDb25jZXJucyByZXNpZGluZ1xuICogaW4gbG9jYWwgYWRkcmVzcyBzcGFjZS5cbiAqIHZpYSB0aGUgTG9jYWxSZWZlcmVuY2UuXG4gKiBAcGFyYW0ge0NoaWxkQ29udGV4dH0gY29udGV4dFxuICogQGltcGxlbWVudHMge0xvY2FsUmVmZXJlbmNlfVxuICovXG5jbGFzcyBMb2NhbFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy5fc3RhdGUgPSBuZXcgUnVubmluZ1N0YXRlKGNvbnRleHQpO1xuICAgICAgICB0aGlzLl93YXRjaGVycyA9IFtjb250ZXh0LnBhcmVudCgpLnNlbGYoKV07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXRTdGF0ZSBjaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGlzIFJlZmVyZW5jZSwgdGhpc1xuICAgICAqIG1lYW50IHRvIGJlIHVzZWQgaW50ZXJuYWxseS5cbiAgICAgKiBAcGFyYW0ge1JlZlN0YXRlfSBzdGF0ZVxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG5cbiAgICAgICAgYmVvZih7IHN0YXRlIH0pLmluc3RhbmNlKFJlZlN0YXRlKTtcblxuICAgICAgICB2YXIgbm90aWZ5ID0gc3RhdGUgIT09IHRoaXMuX3N0YXRlO1xuXG4gICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuX3N0YXRlLnN5bmMoKTtcblxuICAgICAgICBpZiAobm90aWZ5KVxuICAgICAgICAgICAgdGhpcy5fd2F0Y2hlcnMuZm9yRWFjaCh3ID0+IHcudGVsbCh0aGlzLl9zdGF0ZS5zaWduYWwoKSwgdGhpcykpO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUucGF0aCgpO1xuXG4gICAgfVxuXG4gICAgd2F0Y2gocmVmKSB7XG5cbiAgICAgICAgYmVvZih7IHJlZiB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl93YXRjaGVycy5wdXNoKHJlZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgdW53YXRjaChyZWYpIHtcblxuICAgICAgICBiZW9mKHsgcmVmIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3dhdGNoZXJzID0gdGhpcy5fd2F0Y2hlcnMuZmlsdGVyKG8gPT4gKHJlZiA9PT0gbykgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIGJlb2YoeyBmcm9tIH0pLm9wdGlvbmFsKCkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5SZXN0YXJ0KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5yZXN0YXJ0KCkpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBTaWduYWwuUGF1c2UpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnBhdXNlKCkpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBTaWduYWwuU3RvcClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUuc3RvcCgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlJlc3VtZSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUucmVzdW1lKCkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS50ZWxsKG1lc3NhZ2UsIGZyb20pO1xuXG4gICAgfVxuXG4gICAgYXNrKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICBiZW9mKHsgZnJvbSB9KS5vcHRpb25hbCgpLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIGlmIChtZXNzYWdlID09PSBTaWduYWwuUmVzdGFydClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUucmVzdGFydCgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlBhdXNlKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5wYXVzZSgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlN0b3ApXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnN0b3AoKSk7XG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5SZXN1bWUpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnJlc3VtZSgpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmFzayhtZXNzYWdlLCBmcm9tKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICB9XG5cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aCgpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsUmVmZXJlbmNlXG4iXX0=