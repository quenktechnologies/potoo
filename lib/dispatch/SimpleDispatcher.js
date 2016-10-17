'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _SimpleMailbox = require('./SimpleMailbox');

var _SimpleMailbox2 = _interopRequireDefault(_SimpleMailbox);

var _RunningState = require('../state/RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

var _PausedState = require('../state/PausedState');

var _PausedState2 = _interopRequireDefault(_PausedState);

var _StoppedState = require('../state/StoppedState');

var _StoppedState2 = _interopRequireDefault(_StoppedState);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _ConcernFactory = require('../ConcernFactory');

var _ConcernFactory2 = _interopRequireDefault(_ConcernFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//IE support
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {

        get: function get() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = funcNameRegex.exec(this.toString());
            return results && results.length > 1 ? results[1].trim() : "";
        },
        set: function set(value) {}
    });
}

var keyify = function keyify(msg) {

    switch (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) {

        case 'function':
            return msg.name;

        case 'object':
            return msg.constructor.name;

        default:
            return '' + msg;

    }
};

/**
 * SimpleDispatcher handles the actual delivery of messages to
 * Concerns from their Mailbox.
 * @param {Concern} concern
 * @implements {EnqueueListener}
 */

var SimpleDispatcher = function () {
    function SimpleDispatcher(factory, context) {
        _classCallCheck(this, SimpleDispatcher);

        (0, _beof2.default)({ factory: factory }).interface(_ConcernFactory2.default);
        (0, _beof2.default)({ context: context }).interface(_Context2.default);

        this._mailboxes = {};
        this._factory = factory;
        this._context = context;
        this._concern = factory.create(context);
    }

    _createClass(SimpleDispatcher, [{
        key: '_next',
        value: function _next(box) {
            var _this = this;

            var next;

            if (this._busy) return;

            this._busy = true;

            next = box.dequeue();

            if (next === null) {

                this._busy = false;
                return;
            }

            _bluebird2.default.resolve(this._concern.onReceive(next.message, next.from)).then(function (actions) {

                var action = null;

                if (!actions) return null;else if ((typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) === 'object') action = actions[keyify(msg)];else if (typeof actions === 'function') action = actions;

                if (typeof action === 'function') return _bluebird2.default.resolve(action);
            }).catch(function (e) {
                _this.executeChildError(e, next.from);
            }).then(function () {
                return _this._busy = false;
            }).then(function () {
                return _this._next(box);
            });
        }
    }, {
        key: 'onEnqueue',
        value: function onEnqueue(mailbox) {

            this._next(mailbox);
        }
    }, {
        key: 'executeChildError',
        value: function executeChildError(e, child) {
            var _this2 = this;

            (0, _beof2.default)({ e: e }).instance(Error);
            (0, _beof2.default)({ child: child }).interface(Reference);

            var strategy = this._factory.errorHandlingStrategy();
            var sig = strategy.decide(e);

            if (!(sig instanceof Signal)) return this.parent().dispatcher().executeChildError(e, child);

            return _bluebird2.default.resolve(function () {
                return strategy.apply(sig, child, _this2._context);
            });
        }
    }, {
        key: 'execute',
        value: function execute(action, success) {
            var _this3 = this;

            (0, _beof2.default)({ action: action }).function();
            (0, _beof2.default)({ success: success }).function();

            var concern = this._concern;

            _bluebird2.default.try(function do_execute() {
                action(concern);
            }).then(success).catch(function (e) {
                return _this3.executeChildError(e, _this3._context.self());
            });
        }
    }, {
        key: 'executeOnStart',
        value: function executeOnStart() {
            var _this4 = this;

            _bluebird2.default.resolve(this._concern.onStart()).then(function () {
                return _this4._context.self().setState(new _RunningState2.default(_this4._context));
            }).catch(function (e) {
                return _this4._context.parent().dispatcher().executeChildError(e, _this4._concern);
            });
        }
    }, {
        key: 'executeOnPause',
        value: function executeOnPause(cb) {
            var _this5 = this;

            this._pause = true;
            _bluebird2.default.resolve(this._concern.onPause()).then(function () {
                return _this5._context.self().setState(new _PausedState2.default(_this5._context));
            }).catch(function (e) {
                return _this5._context.parent().dispatcher().executeChildError(e, _this5._concern);
            });
        }
    }, {
        key: 'executeOnResume',
        value: function executeOnResume() {
            var _this6 = this;

            this._pause = false;
            _bluebird2.default.resolve(this._concern.onResume()).then(function () {
                return _this6._context.self().setState(new _RunningState2.default(_this6._context));
            }).catch(function (e) {
                return _this6._context.parent().dispatcher().executeChildError(e, _this6._concern);
            });
        }
    }, {
        key: 'executeOnRestart',
        value: function executeOnRestart() {
            var _this7 = this;

            _bluebird2.default.resolve(this._concern.onRestart()).then(function () {
                return _this7._concern = _this7._factory.create(_this7._context);
            }).then(function () {
                return _this7._context.self().setState(new _RunningState2.default(_this7._context));
            }).catch(function (e) {
                return _this7._context.parent().dispatcher().executeChildError(e, _this7._concern);
            });
        }
    }, {
        key: 'executeOnStop',
        value: function executeOnStop() {
            var _this8 = this;

            _bluebird2.default.resolve(this._concern.onStop()).then(function () {
                return _this8._context.self().setState(new _StoppedState2.default(_this8._context));
            }).catch(function (e) {
                return _this8._context.parent().dispatcher().executeChildError(e, _this8._concern);
            });
        }
    }]);

    return SimpleDispatcher;
}();

exports.default = SimpleDispatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TaW1wbGVEaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwibmFtZSIsInVuZGVmaW5lZCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiZnVuY05hbWVSZWdleCIsInJlc3VsdHMiLCJleGVjIiwidG9TdHJpbmciLCJsZW5ndGgiLCJ0cmltIiwic2V0IiwidmFsdWUiLCJrZXlpZnkiLCJtc2ciLCJjb25zdHJ1Y3RvciIsIlNpbXBsZURpc3BhdGNoZXIiLCJmYWN0b3J5IiwiY29udGV4dCIsImludGVyZmFjZSIsIl9tYWlsYm94ZXMiLCJfZmFjdG9yeSIsIl9jb250ZXh0IiwiX2NvbmNlcm4iLCJjcmVhdGUiLCJib3giLCJuZXh0IiwiX2J1c3kiLCJkZXF1ZXVlIiwicmVzb2x2ZSIsIm9uUmVjZWl2ZSIsIm1lc3NhZ2UiLCJmcm9tIiwidGhlbiIsImFjdGlvbiIsImFjdGlvbnMiLCJjYXRjaCIsImV4ZWN1dGVDaGlsZEVycm9yIiwiZSIsIl9uZXh0IiwibWFpbGJveCIsImNoaWxkIiwiaW5zdGFuY2UiLCJFcnJvciIsIlJlZmVyZW5jZSIsInN0cmF0ZWd5IiwiZXJyb3JIYW5kbGluZ1N0cmF0ZWd5Iiwic2lnIiwiZGVjaWRlIiwiU2lnbmFsIiwicGFyZW50IiwiZGlzcGF0Y2hlciIsImFwcGx5Iiwic3VjY2VzcyIsImZ1bmN0aW9uIiwiY29uY2VybiIsInRyeSIsImRvX2V4ZWN1dGUiLCJzZWxmIiwib25TdGFydCIsInNldFN0YXRlIiwiY2IiLCJfcGF1c2UiLCJvblBhdXNlIiwib25SZXN1bWUiLCJvblJlc3RhcnQiLCJvblN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBO0FBQ0EsSUFBSUEsU0FBU0MsU0FBVCxDQUFtQkMsSUFBbkIsS0FB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QWhCLEVBQ0FoQyxJQURBLENBQ0s7QUFBQSx1QkFBTSxPQUFLVixRQUFMLEdBQWdCLE9BQUtGLFFBQUwsQ0FBY0csTUFBZCxDQUFxQixPQUFLRixRQUExQixDQUF0QjtBQUFBLGFBREwsRUFFQVcsSUFGQSxDQUVLO0FBQUEsdUJBQU0sT0FBS1gsUUFBTCxDQUFjb0MsSUFBZCxHQUFxQkUsUUFBckIsQ0FBOEIsMkJBQWlCLE9BQUt0QyxRQUF0QixDQUE5QixDQUFOO0FBQUEsYUFGTCxFQUdBYyxLQUhBLENBR007QUFBQSx1QkFBSyxPQUFLZCxRQUFMLENBQWM0QixNQUFkLEdBQXVCQyxVQUF2QixHQUFvQ2QsaUJBQXBDLENBQXNEQyxDQUF0RCxFQUF5RCxPQUFLZixRQUE5RCxDQUFMO0FBQUEsYUFITjtBQUtIOzs7d0NBRWU7QUFBQTs7QUFFWiwrQkFBUU0sT0FBUixDQUFnQixLQUFLTixRQUFMLENBQWMyQyxNQUFkLEVBQWhCLEVBQ0FqQyxJQURBLENBQ0s7QUFBQSx1QkFBSSxPQUFLWCxRQUFMLENBQWNvQyxJQUFkLEdBQXFCRSxRQUFyQixDQUE4QiwyQkFBaUIsT0FBS3RDLFFBQXRCLENBQTlCLENBQUo7QUFBQSxhQURMLEVBRUFjLEtBRkEsQ0FFTTtBQUFBLHVCQUFLLE9BQUtkLFFBQUwsQ0FBYzRCLE1BQWQsR0FBdUJDLFVBQXZCLEdBQW9DZCxpQkFBcEMsQ0FBc0RDLENBQXRELEVBQXlELE9BQUtmLFFBQTlELENBQUw7QUFBQSxhQUZOO0FBSUg7Ozs7OztrQkFJVVAsZ0IiLCJmaWxlIjoiU2ltcGxlRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFNpbXBsZU1haWxib3ggZnJvbSAnLi9TaW1wbGVNYWlsYm94JztcbmltcG9ydCBSdW5uaW5nU3RhdGUgZnJvbSAnLi4vc3RhdGUvUnVubmluZ1N0YXRlJztcbmltcG9ydCBQYXVzZWRTdGF0ZSBmcm9tICcuLi9zdGF0ZS9QYXVzZWRTdGF0ZSc7XG5pbXBvcnQgU3RvcHBlZFN0YXRlIGZyb20gJy4uL3N0YXRlL1N0b3BwZWRTdGF0ZSc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuLi9Db250ZXh0JztcbmltcG9ydCBDb25jZXJuRmFjdG9yeSBmcm9tICcuLi9Db25jZXJuRmFjdG9yeSc7XG5cbi8vSUUgc3VwcG9ydFxuaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5uYW1lID09PSB1bmRlZmluZWQgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnbmFtZScsIHtcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb25cXHMoW14oXXsxLH0pXFwoLztcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoKHRoaXMpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdLnRyaW0oKSA6IFwiXCI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHt9XG4gICAgfSk7XG59XG5cbmNvbnN0IGtleWlmeSA9IGZ1bmN0aW9uKG1zZykge1xuXG4gICAgc3dpdGNoICh0eXBlb2YgbXNnKSB7XG5cbiAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIG1zZy5uYW1lO1xuXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICByZXR1cm4gbXNnLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAnJyArIG1zZztcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFNpbXBsZURpc3BhdGNoZXIgaGFuZGxlcyB0aGUgYWN0dWFsIGRlbGl2ZXJ5IG9mIG1lc3NhZ2VzIHRvXG4gKiBDb25jZXJucyBmcm9tIHRoZWlyIE1haWxib3guXG4gKiBAcGFyYW0ge0NvbmNlcm59IGNvbmNlcm5cbiAqIEBpbXBsZW1lbnRzIHtFbnF1ZXVlTGlzdGVuZXJ9XG4gKi9cbmNsYXNzIFNpbXBsZURpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3IoZmFjdG9yeSwgY29udGV4dCkge1xuXG4gICAgICAgIGJlb2YoeyBmYWN0b3J5IH0pLmludGVyZmFjZShDb25jZXJuRmFjdG9yeSk7XG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcblxuICAgICAgICB0aGlzLl9tYWlsYm94ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fZmFjdG9yeSA9IGZhY3Rvcnk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLl9jb25jZXJuID0gZmFjdG9yeS5jcmVhdGUoY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBfbmV4dChib3gpIHtcblxuICAgICAgICB2YXIgbmV4dDtcblxuICAgICAgICBpZiAodGhpcy5fYnVzeSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLl9idXN5ID0gdHJ1ZTtcblxuICAgICAgICBuZXh0ID0gYm94LmRlcXVldWUoKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICB0aGlzLl9idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jb25jZXJuLm9uUmVjZWl2ZShuZXh0Lm1lc3NhZ2UsIG5leHQuZnJvbSkpLlxuICAgICAgICB0aGVuKGFjdGlvbnMgPT4ge1xuXG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKCFhY3Rpb25zKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYWN0aW9ucyA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9uc1trZXlpZnkobXNnKV07XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhY3Rpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IGFjdGlvbnM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYWN0aW9uKTtcblxuICAgICAgICB9KS5cbiAgICAgICAgY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVDaGlsZEVycm9yKGUsIG5leHQuZnJvbSk7XG4gICAgICAgIH0pLlxuICAgICAgICB0aGVuKCgpID0+IHRoaXMuX2J1c3kgPSBmYWxzZSkuXG4gICAgICAgIHRoZW4oKCkgPT4gdGhpcy5fbmV4dChib3gpKTtcblxuICAgIH1cblxuICAgIG9uRW5xdWV1ZShtYWlsYm94KSB7XG5cbiAgICAgICAgdGhpcy5fbmV4dChtYWlsYm94KTtcblxuICAgIH1cblxuICAgIGV4ZWN1dGVDaGlsZEVycm9yKGUsIGNoaWxkKSB7XG5cbiAgICAgICAgYmVvZih7IGUgfSkuaW5zdGFuY2UoRXJyb3IpO1xuICAgICAgICBiZW9mKHsgY2hpbGQgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdmFyIHN0cmF0ZWd5ID0gdGhpcy5fZmFjdG9yeS5lcnJvckhhbmRsaW5nU3RyYXRlZ3koKTtcbiAgICAgICAgdmFyIHNpZyA9IHN0cmF0ZWd5LmRlY2lkZShlKTtcblxuICAgICAgICBpZiAoIShzaWcgaW5zdGFuY2VvZiBTaWduYWwpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50KCkuZGlzcGF0Y2hlcigpLmV4ZWN1dGVDaGlsZEVycm9yKGUsIGNoaWxkKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCgpID0+IHN0cmF0ZWd5LmFwcGx5KHNpZywgY2hpbGQsIHRoaXMuX2NvbnRleHQpKTtcblxuXG4gICAgfVxuXG4gICAgZXhlY3V0ZShhY3Rpb24sIHN1Y2Nlc3MpIHtcblxuICAgICAgICBiZW9mKHsgYWN0aW9uIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBzdWNjZXNzIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdmFyIGNvbmNlcm4gPSB0aGlzLl9jb25jZXJuO1xuXG4gICAgICAgIFByb21pc2UudHJ5KGZ1bmN0aW9uIGRvX2V4ZWN1dGUoKSB7XG4gICAgICAgICAgICBhY3Rpb24oY29uY2Vybik7XG4gICAgICAgIH0pLlxuICAgICAgICB0aGVuKHN1Y2Nlc3MpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuZXhlY3V0ZUNoaWxkRXJyb3IoZSwgdGhpcy5fY29udGV4dC5zZWxmKCkpKTtcblxuICAgIH1cblxuICAgIGV4ZWN1dGVPblN0YXJ0KCkge1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jb25jZXJuLm9uU3RhcnQoKSkuXG4gICAgICAgIHRoZW4oKCk9PnRoaXMuX2NvbnRleHQuc2VsZigpLnNldFN0YXRlKG5ldyBSdW5uaW5nU3RhdGUodGhpcy5fY29udGV4dCkpKS5cbiAgICAgICAgY2F0Y2goZSA9PiB0aGlzLl9jb250ZXh0LnBhcmVudCgpLmRpc3BhdGNoZXIoKS5leGVjdXRlQ2hpbGRFcnJvcihlLCB0aGlzLl9jb25jZXJuKSk7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlT25QYXVzZShjYikge1xuXG4gICAgICAgIHRoaXMuX3BhdXNlID0gdHJ1ZTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2NvbmNlcm4ub25QYXVzZSgpKS5cbiAgICAgICAgdGhlbigoKT0+dGhpcy5fY29udGV4dC5zZWxmKCkuc2V0U3RhdGUobmV3IFBhdXNlZFN0YXRlKHRoaXMuX2NvbnRleHQpKSkuXG4gICAgICAgIGNhdGNoKGUgPT4gdGhpcy5fY29udGV4dC5wYXJlbnQoKS5kaXNwYXRjaGVyKCkuZXhlY3V0ZUNoaWxkRXJyb3IoZSwgdGhpcy5fY29uY2VybikpO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uUmVzdW1lKCkge1xuXG4gICAgICAgIHRoaXMuX3BhdXNlID0gZmFsc2U7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jb25jZXJuLm9uUmVzdW1lKCkpLlxuICAgICAgICB0aGVuKCgpID0+IHRoaXMuX2NvbnRleHQuc2VsZigpLnNldFN0YXRlKG5ldyBSdW5uaW5nU3RhdGUodGhpcy5fY29udGV4dCkpKS5cbiAgICAgICAgY2F0Y2goZSA9PiB0aGlzLl9jb250ZXh0LnBhcmVudCgpLmRpc3BhdGNoZXIoKS5leGVjdXRlQ2hpbGRFcnJvcihlLCB0aGlzLl9jb25jZXJuKSk7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlT25SZXN0YXJ0KCkge1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jb25jZXJuLm9uUmVzdGFydCgpKS5cbiAgICAgICAgdGhlbigoKSA9PiB0aGlzLl9jb25jZXJuID0gdGhpcy5fZmFjdG9yeS5jcmVhdGUodGhpcy5fY29udGV4dCkpLlxuICAgICAgICB0aGVuKCgpID0+IHRoaXMuX2NvbnRleHQuc2VsZigpLnNldFN0YXRlKG5ldyBSdW5uaW5nU3RhdGUodGhpcy5fY29udGV4dCkpKS5cbiAgICAgICAgY2F0Y2goZSA9PiB0aGlzLl9jb250ZXh0LnBhcmVudCgpLmRpc3BhdGNoZXIoKS5leGVjdXRlQ2hpbGRFcnJvcihlLCB0aGlzLl9jb25jZXJuKSk7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlT25TdG9wKCkge1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jb25jZXJuLm9uU3RvcCgpKS5cbiAgICAgICAgdGhlbigoKT0+dGhpcy5fY29udGV4dC5zZWxmKCkuc2V0U3RhdGUobmV3IFN0b3BwZWRTdGF0ZSh0aGlzLl9jb250ZXh0KSkpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuX2NvbnRleHQucGFyZW50KCkuZGlzcGF0Y2hlcigpLmV4ZWN1dGVDaGlsZEVycm9yKGUsIHRoaXMuX2NvbmNlcm4pKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVEaXNwYXRjaGVyXG4iXX0=