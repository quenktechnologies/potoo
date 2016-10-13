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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhbFJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6WyJMb2NhbFJlZmVyZW5jZSIsImNvbnRleHQiLCJfc3RhdGUiLCJfd2F0Y2hlcnMiLCJwYXJlbnQiLCJzZWxmIiwic3RhdGUiLCJpbnN0YW5jZSIsIm5vdGlmeSIsInN5bmMiLCJmb3JFYWNoIiwidyIsInRlbGwiLCJzaWduYWwiLCJwYXRoIiwicmVmIiwiaW50ZXJmYWNlIiwicHVzaCIsImZpbHRlciIsIm8iLCJtZXNzYWdlIiwiZnJvbSIsIm9wdGlvbmFsIiwiUmVzdGFydCIsInNldFN0YXRlIiwicmVzdGFydCIsIlBhdXNlIiwicGF1c2UiLCJTdG9wIiwic3RvcCIsIlJlc3VtZSIsInJlc3VtZSIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7OztJQU9NQSxjO0FBRUYsNEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFFakIsYUFBS0MsTUFBTCxHQUFjLDJCQUFpQkQsT0FBakIsQ0FBZDtBQUNBLGFBQUtFLFNBQUwsR0FBaUIsQ0FBQ0YsUUFBUUcsTUFBUixHQUFpQkMsSUFBakIsRUFBRCxDQUFqQjtBQUVIOztBQUVEOzs7Ozs7Ozs7aUNBS1NDLEssRUFBTztBQUFBOztBQUVaLGdDQUFLLEVBQUVBLFlBQUYsRUFBTCxFQUFnQkMsUUFBaEI7O0FBRUEsZ0JBQUlDLFNBQVNGLFVBQVUsS0FBS0osTUFBNUI7O0FBRUEsaUJBQUtBLE1BQUwsR0FBY0ksS0FBZDtBQUNBLGlCQUFLSixNQUFMLENBQVlPLElBQVo7O0FBRUEsZ0JBQUlELE1BQUosRUFDSSxLQUFLTCxTQUFMLENBQWVPLE9BQWYsQ0FBdUI7QUFBQSx1QkFBS0MsRUFBRUMsSUFBRixDQUFPLE1BQUtWLE1BQUwsQ0FBWVcsTUFBWixFQUFQLFFBQUw7QUFBQSxhQUF2QjtBQUVQOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS1gsTUFBTCxDQUFZWSxJQUFaLEVBQVA7QUFFSDs7OzhCQUVLQyxHLEVBQUs7O0FBRVAsZ0NBQUssRUFBRUEsUUFBRixFQUFMLEVBQWNDLFNBQWQ7O0FBRUEsaUJBQUtiLFNBQUwsQ0FBZWMsSUFBZixDQUFvQkYsR0FBcEI7QUFDQSxtQkFBTyxJQUFQO0FBRUg7OztnQ0FFT0EsRyxFQUFLOztBQUVULGdDQUFLLEVBQUVBLFFBQUYsRUFBTCxFQUFjQyxTQUFkOztBQUVBLGlCQUFLYixTQUFMLEdBQWlCLEtBQUtBLFNBQUwsQ0FBZWUsTUFBZixDQUFzQjtBQUFBLHVCQUFNSCxRQUFRSSxDQUFULEdBQWMsS0FBZCxHQUFzQixJQUEzQjtBQUFBLGFBQXRCLENBQWpCO0FBQ0EsbUJBQU8sSUFBUDtBQUVIOzs7NkJBRUlDLE8sRUFBU0MsSSxFQUFNOztBQUVoQixnQ0FBSyxFQUFFQSxVQUFGLEVBQUwsRUFBZUMsUUFBZixHQUEwQk4sU0FBMUI7O0FBRUEsZ0JBQUlJLFlBQVksaUJBQU9HLE9BQXZCLEVBQ0ksS0FBS0MsUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVl1QixPQUFaLEVBQWQsRUFESixLQUVLLElBQUlMLFlBQVksaUJBQU9NLEtBQXZCLEVBQ0QsS0FBS0YsUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVl5QixLQUFaLEVBQWQsRUFEQyxLQUVBLElBQUlQLFlBQVksaUJBQU9RLElBQXZCLEVBQ0QsS0FBS0osUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVkyQixJQUFaLEVBQWQsRUFEQyxLQUVBLElBQUlULFlBQVksaUJBQU9VLE1BQXZCLEVBQ0QsS0FBS04sUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVk2QixNQUFaLEVBQWQsRUFEQyxLQUdELEtBQUs3QixNQUFMLENBQVlVLElBQVosQ0FBaUJRLE9BQWpCLEVBQTBCQyxJQUExQjtBQUlQOzs7aUNBR1E7O0FBRUwsbUJBQU8sS0FBS1csUUFBTCxFQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLbEIsSUFBTCxFQUFQO0FBRUg7Ozs7OztrQkFJVWQsYyIsImZpbGUiOiJMb2NhbFJlZmVyZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFJlZlN0YXRlIGZyb20gJy4vc3RhdGUvUmVmU3RhdGUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL3N0YXRlL1NpZ25hbCc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBSdW5uaW5nU3RhdGUgZnJvbSAnLi9zdGF0ZS9SdW5uaW5nU3RhdGUnO1xuXG4vKipcbiAqIExvY2FsUmVmZXJlbmNlIGFjdHMgaXMgdGhlIFJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbiBmb3IgQ29uY2VybnMgcmVzaWRpbmdcbiAqIGluIGxvY2FsIGFkZHJlc3Mgc3BhY2UuXG4gKiB2aWEgdGhlIExvY2FsUmVmZXJlbmNlLlxuICogQHBhcmFtIHtDaGlsZENvbnRleHR9IGNvbnRleHRcbiAqIEBpbXBsZW1lbnRzIHtMb2NhbFJlZmVyZW5jZX1cbiAqL1xuY2xhc3MgTG9jYWxSZWZlcmVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuXG4gICAgICAgIHRoaXMuX3N0YXRlID0gbmV3IFJ1bm5pbmdTdGF0ZShjb250ZXh0KTtcbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSBbY29udGV4dC5wYXJlbnQoKS5zZWxmKCldO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0U3RhdGUgY2hhbmdlcyB0aGUgc3RhdGUgb2YgdGhpcyBSZWZlcmVuY2UsIHRoaXNcbiAgICAgKiBtZWFudCB0byBiZSB1c2VkIGludGVybmFsbHkuXG4gICAgICogQHBhcmFtIHtSZWZTdGF0ZX0gc3RhdGVcbiAgICAgKi9cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuXG4gICAgICAgIGJlb2YoeyBzdGF0ZSB9KS5pbnN0YW5jZShSZWZTdGF0ZSk7XG5cbiAgICAgICAgdmFyIG5vdGlmeSA9IHN0YXRlICE9PSB0aGlzLl9zdGF0ZTtcblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLl9zdGF0ZS5zeW5jKCk7XG5cbiAgICAgICAgaWYgKG5vdGlmeSlcbiAgICAgICAgICAgIHRoaXMuX3dhdGNoZXJzLmZvckVhY2godyA9PiB3LnRlbGwodGhpcy5fc3RhdGUuc2lnbmFsKCksIHRoaXMpKTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLnBhdGgoKTtcblxuICAgIH1cblxuICAgIHdhdGNoKHJlZikge1xuXG4gICAgICAgIGJlb2YoeyByZWYgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMucHVzaChyZWYpO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHVud2F0Y2gocmVmKSB7XG5cbiAgICAgICAgYmVvZih7IHJlZiB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl93YXRjaGVycyA9IHRoaXMuX3dhdGNoZXJzLmZpbHRlcihvID0+IChyZWYgPT09IG8pID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICBiZW9mKHsgZnJvbSB9KS5vcHRpb25hbCgpLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIGlmIChtZXNzYWdlID09PSBTaWduYWwuUmVzdGFydClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUucmVzdGFydCgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlBhdXNlKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5wYXVzZSgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlN0b3ApXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnN0b3AoKSk7XG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5SZXN1bWUpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnJlc3VtZSgpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUudGVsbChtZXNzYWdlLCBmcm9tKTtcblxuXG5cbiAgICB9XG5cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aCgpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvY2FsUmVmZXJlbmNlXG4iXX0=