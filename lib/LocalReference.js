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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhbFJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6WyJMb2NhbFJlZmVyZW5jZSIsImNvbnRleHQiLCJfc3RhdGUiLCJfd2F0Y2hlcnMiLCJwYXJlbnQiLCJzZWxmIiwic3RhdGUiLCJpbnN0YW5jZSIsIm5vdGlmeSIsInN5bmMiLCJmb3JFYWNoIiwidyIsInRlbGwiLCJzaWduYWwiLCJwYXRoIiwicmVmIiwiaW50ZXJmYWNlIiwicHVzaCIsImZpbHRlciIsIm8iLCJtZXNzYWdlIiwiZnJvbSIsIm9wdGlvbmFsIiwiUmVzdGFydCIsInNldFN0YXRlIiwicmVzdGFydCIsIlBhdXNlIiwicGF1c2UiLCJTdG9wIiwic3RvcCIsIlJlc3VtZSIsInJlc3VtZSIsImFzayIsInJlc29sdmUiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPTUEsYztBQUVGLDRCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBRWpCLGFBQUtDLE1BQUwsR0FBYywyQkFBaUJELE9BQWpCLENBQWQ7QUFDQSxhQUFLRSxTQUFMLEdBQWlCLENBQUNGLFFBQVFHLE1BQVIsR0FBaUJDLElBQWpCLEVBQUQsQ0FBakI7QUFFSDs7QUFFRDs7Ozs7Ozs7O2lDQUtTQyxLLEVBQU87QUFBQTs7QUFFWixnQ0FBSyxFQUFFQSxZQUFGLEVBQUwsRUFBZ0JDLFFBQWhCOztBQUVBLGdCQUFJQyxTQUFTRixVQUFVLEtBQUtKLE1BQTVCOztBQUVBLGlCQUFLQSxNQUFMLEdBQWNJLEtBQWQ7QUFDQSxpQkFBS0osTUFBTCxDQUFZTyxJQUFaOztBQUVBLGdCQUFJRCxNQUFKLEVBQ0ksS0FBS0wsU0FBTCxDQUFlTyxPQUFmLENBQXVCO0FBQUEsdUJBQUtDLEVBQUVDLElBQUYsQ0FBTyxNQUFLVixNQUFMLENBQVlXLE1BQVosRUFBUCxRQUFMO0FBQUEsYUFBdkI7QUFFUDs7OytCQUVNOztBQUVILG1CQUFPLEtBQUtYLE1BQUwsQ0FBWVksSUFBWixFQUFQO0FBRUg7Ozs4QkFFS0MsRyxFQUFLOztBQUVQLGdDQUFLLEVBQUVBLFFBQUYsRUFBTCxFQUFjQyxTQUFkOztBQUVBLGlCQUFLYixTQUFMLENBQWVjLElBQWYsQ0FBb0JGLEdBQXBCO0FBQ0EsbUJBQU8sSUFBUDtBQUVIOzs7Z0NBRU9BLEcsRUFBSzs7QUFFVCxnQ0FBSyxFQUFFQSxRQUFGLEVBQUwsRUFBY0MsU0FBZDs7QUFFQSxpQkFBS2IsU0FBTCxHQUFpQixLQUFLQSxTQUFMLENBQWVlLE1BQWYsQ0FBc0I7QUFBQSx1QkFBTUgsUUFBUUksQ0FBVCxHQUFjLEtBQWQsR0FBc0IsSUFBM0I7QUFBQSxhQUF0QixDQUFqQjtBQUNBLG1CQUFPLElBQVA7QUFFSDs7OzZCQUVJQyxPLEVBQVNDLEksRUFBTTs7QUFFaEIsZ0NBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJOLFNBQTFCOztBQUVBLGdCQUFJSSxZQUFZLGlCQUFPRyxPQUF2QixFQUNJLEtBQUtDLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZdUIsT0FBWixFQUFkLEVBREosS0FFSyxJQUFJTCxZQUFZLGlCQUFPTSxLQUF2QixFQUNELEtBQUtGLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZeUIsS0FBWixFQUFkLEVBREMsS0FFQSxJQUFJUCxZQUFZLGlCQUFPUSxJQUF2QixFQUNELEtBQUtKLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZMkIsSUFBWixFQUFkLEVBREMsS0FFQSxJQUFJVCxZQUFZLGlCQUFPVSxNQUF2QixFQUNELEtBQUtOLFFBQUwsQ0FBYyxLQUFLdEIsTUFBTCxDQUFZNkIsTUFBWixFQUFkLEVBREMsS0FHRCxLQUFLN0IsTUFBTCxDQUFZVSxJQUFaLENBQWlCUSxPQUFqQixFQUEwQkMsSUFBMUI7QUFFUDs7OzRCQUVHRCxPLEVBQVNDLEksRUFBTTs7QUFFZixnQ0FBSyxFQUFFQSxVQUFGLEVBQUwsRUFBZUMsUUFBZixHQUEwQk4sU0FBMUI7O0FBRUEsZ0JBQUlJLFlBQVksaUJBQU9HLE9BQXZCLEVBQ0ksS0FBS0MsUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVl1QixPQUFaLEVBQWQsRUFESixLQUVLLElBQUlMLFlBQVksaUJBQU9NLEtBQXZCLEVBQ0QsS0FBS0YsUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVl5QixLQUFaLEVBQWQsRUFEQyxLQUVBLElBQUlQLFlBQVksaUJBQU9RLElBQXZCLEVBQ0QsS0FBS0osUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVkyQixJQUFaLEVBQWQsRUFEQyxLQUVBLElBQUlULFlBQVksaUJBQU9VLE1BQXZCLEVBQ0QsS0FBS04sUUFBTCxDQUFjLEtBQUt0QixNQUFMLENBQVk2QixNQUFaLEVBQWQsRUFEQyxLQUdELE9BQU8sS0FBSzdCLE1BQUwsQ0FBWThCLEdBQVosQ0FBZ0JaLE9BQWhCLEVBQXlCQyxJQUF6QixDQUFQOztBQUVKLG1CQUFPLG1CQUFRWSxPQUFSLEVBQVA7QUFFSDs7O2lDQUdROztBQUVMLG1CQUFPLEtBQUtDLFFBQUwsRUFBUDtBQUVIOzs7bUNBRVU7O0FBRVAsbUJBQU8sS0FBS3BCLElBQUwsRUFBUDtBQUVIOzs7Ozs7a0JBSVVkLGMiLCJmaWxlIjoiTG9jYWxSZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBSZWZTdGF0ZSBmcm9tICcuL3N0YXRlL1JlZlN0YXRlJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgUnVubmluZ1N0YXRlIGZyb20gJy4vc3RhdGUvUnVubmluZ1N0YXRlJztcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBhY3RzIGlzIHRoZSBSZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gZm9yIENvbmNlcm5zIHJlc2lkaW5nXG4gKiBpbiBsb2NhbCBhZGRyZXNzIHNwYWNlLlxuICogdmlhIHRoZSBMb2NhbFJlZmVyZW5jZS5cbiAqIEBwYXJhbSB7Q2hpbGRDb250ZXh0fSBjb250ZXh0XG4gKiBAaW1wbGVtZW50cyB7TG9jYWxSZWZlcmVuY2V9XG4gKi9cbmNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IG5ldyBSdW5uaW5nU3RhdGUoY29udGV4dCk7XG4gICAgICAgIHRoaXMuX3dhdGNoZXJzID0gW2NvbnRleHQucGFyZW50KCkuc2VsZigpXTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldFN0YXRlIGNoYW5nZXMgdGhlIHN0YXRlIG9mIHRoaXMgUmVmZXJlbmNlLCB0aGlzXG4gICAgICogbWVhbnQgdG8gYmUgdXNlZCBpbnRlcm5hbGx5LlxuICAgICAqIEBwYXJhbSB7UmVmU3RhdGV9IHN0YXRlXG4gICAgICovXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcblxuICAgICAgICBiZW9mKHsgc3RhdGUgfSkuaW5zdGFuY2UoUmVmU3RhdGUpO1xuXG4gICAgICAgIHZhciBub3RpZnkgPSBzdGF0ZSAhPT0gdGhpcy5fc3RhdGU7XG5cbiAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5fc3RhdGUuc3luYygpO1xuXG4gICAgICAgIGlmIChub3RpZnkpXG4gICAgICAgICAgICB0aGlzLl93YXRjaGVycy5mb3JFYWNoKHcgPT4gdy50ZWxsKHRoaXMuX3N0YXRlLnNpZ25hbCgpLCB0aGlzKSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5wYXRoKCk7XG5cbiAgICB9XG5cbiAgICB3YXRjaChyZWYpIHtcblxuICAgICAgICBiZW9mKHsgcmVmIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3dhdGNoZXJzLnB1c2gocmVmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB1bndhdGNoKHJlZikge1xuXG4gICAgICAgIGJlb2YoeyByZWYgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSB0aGlzLl93YXRjaGVycy5maWx0ZXIobyA9PiAocmVmID09PSBvKSA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgYmVvZih7IGZyb20gfSkub3B0aW9uYWwoKS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlJlc3RhcnQpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnJlc3RhcnQoKSk7XG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5QYXVzZSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUucGF1c2UoKSk7XG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5TdG9wKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5zdG9wKCkpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBTaWduYWwuUmVzdW1lKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5yZXN1bWUoKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlLnRlbGwobWVzc2FnZSwgZnJvbSk7XG5cbiAgICB9XG5cbiAgICBhc2sobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIGJlb2YoeyBmcm9tIH0pLm9wdGlvbmFsKCkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09IFNpZ25hbC5SZXN0YXJ0KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLl9zdGF0ZS5yZXN0YXJ0KCkpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBTaWduYWwuUGF1c2UpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuX3N0YXRlLnBhdXNlKCkpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBTaWduYWwuU3RvcClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUuc3RvcCgpKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gU2lnbmFsLlJlc3VtZSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5fc3RhdGUucmVzdW1lKCkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUuYXNrKG1lc3NhZ2UsIGZyb20pO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxuXG4gICAgdG9KU09OKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoKCk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9jYWxSZWZlcmVuY2VcbiJdfQ==