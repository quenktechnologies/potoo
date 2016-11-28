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

var _Signal = require('../state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _Reference = require('../Reference');

var _Reference2 = _interopRequireDefault(_Reference);

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
            var concern = this._concern;

            if (this._busy) return;

            this._busy = true;

            next = box.dequeue();

            if (next === null) {

                this._busy = false;
                return;
            }

            _bluebird2.default.try(function () {

                return concern.onReceive(next.message, next.from);
            }).then(function (actions) {

                var action = null;

                if (!actions) return null;else if ((typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) === 'object') action = actions[keyify(next.message)];else if (typeof actions === 'function') action = actions;

                if (typeof action === 'function') return _bluebird2.default.try(function () {

                    return action.call(actions, next.message, next.from);
                });
            }).then(function (value) {
                return next.done ? next.done(value) : value;
            }).catch(function (e) {
                return next.reject ? next.reject(e) : _this.executeChildError(e, next.from || _this._context.select('/'));
            }).finally(function () {

                _this._busy = false;
                _this._next(box);
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
            (0, _beof2.default)({ child: child }).interface(_Reference2.default);

            var strategy = this._factory.errorHandlingStrategy();
            var sig = strategy.decide(e);

            if (!(sig instanceof _Signal2.default)) return this._context.parent().dispatcher().executeChildError(e, child);

            return _bluebird2.default.try(function () {
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

            _bluebird2.default.try(function () {
                return _this4._concern.onStart();
            }).then(function () {
                return _this4._context.self().setState(new _RunningState2.default(_this4._context));
            }).catch(function (e) {
                return _this4._context.parent().dispatcher().executeChildError(e, _this4._context.self());
            });
        }
    }]);

    return SimpleDispatcher;
}();

exports.default = SimpleDispatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TaW1wbGVEaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwibmFtZSIsInVuZGVmaW5lZCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiZnVuY05hbWVSZWdleCIsInJlc3VsdHMiLCJleGVjIiwidG9TdHJpbmciLCJsZW5ndGgiLCJ0cmltIiwic2V0IiwidmFsdWUiLCJrZXlpZnkiLCJtc2ciLCJjb25zdHJ1Y3RvciIsIlNpbXBsZURpc3BhdGNoZXIiLCJmYWN0b3J5IiwiY29udGV4dCIsImludGVyZmFjZSIsIl9tYWlsYm94ZXMiLCJfZmFjdG9yeSIsIl9jb250ZXh0IiwiX2NvbmNlcm4iLCJjcmVhdGUiLCJib3giLCJuZXh0IiwiY29uY2VybiIsIl9idXN5IiwiZGVxdWV1ZSIsInRyeSIsIm9uUmVjZWl2ZSIsIm1lc3NhZ2UiLCJmcm9tIiwidGhlbiIsImFjdGlvbiIsImFjdGlvbnMiLCJjYWxsIiwiZG9uZSIsImNhdGNoIiwicmVqZWN0IiwiZSIsImV4ZWN1dGVDaGlsZEVycm9yIiwic2VsZWN0IiwiZmluYWxseSIsIl9uZXh0IiwibWFpbGJveCIsImNoaWxkIiwiaW5zdGFuY2UiLCJFcnJvciIsInN0cmF0ZWd5IiwiZXJyb3JIYW5kbGluZ1N0cmF0ZWd5Iiwic2lnIiwiZGVjaWRlIiwicGFyZW50IiwiZGlzcGF0Y2hlciIsImFwcGx5Iiwic3VjY2VzcyIsImZ1bmN0aW9uIiwiZG9fZXhlY3V0ZSIsInNlbGYiLCJvblN0YXJ0Iiwic2V0U3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTtBQUNBLElBQUlBLFNBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEtBQTRCQyxTQUE1QixJQUF5Q0MsT0FBT0MsY0FBUCxL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R0t1QixPQUhMLEVBSUFsQixLQUpBLENBSU07QUFBQSx1QkFBSyxPQUFLRyxpQkFBTCxDQUF1QkQsQ0FBdkIsRUFBMEIsT0FBS25CLFFBQUwsQ0FBY3NDLElBQWQsRUFBMUIsQ0FBTDtBQUFBLGFBSk47QUFNSDs7O3lDQUVnQjtBQUFBOztBQUViLCtCQUFROUIsR0FBUixDQUFZO0FBQUEsdUJBQU0sT0FBS1AsUUFBTCxDQUFjc0MsT0FBZCxFQUFOO0FBQUEsYUFBWixFQUNBM0IsSUFEQSxDQUNLO0FBQUEsdUJBQU0sT0FBS1osUUFBTCxDQUFjc0MsSUFBZCxHQUFxQkUsUUFBckIsQ0FBOEIsMkJBQWlCLE9BQUt4QyxRQUF0QixDQUE5QixDQUFOO0FBQUEsYUFETCxFQUVBaUIsS0FGQSxDQUVNO0FBQUEsdUJBQUssT0FBS2pCLFFBQUwsQ0FBY2dDLE1BQWQsR0FBdUJDLFVBQXZCLEdBQW9DYixpQkFBcEMsQ0FBc0RELENBQXRELEVBQXlELE9BQUtuQixRQUFMLENBQWNzQyxJQUFkLEVBQXpELENBQUw7QUFBQSxhQUZOO0FBSUg7Ozs7OztrQkFJVTVDLGdCIiwiZmlsZSI6IlNpbXBsZURpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBTaW1wbGVNYWlsYm94IGZyb20gJy4vU2ltcGxlTWFpbGJveCc7XG5pbXBvcnQgUnVubmluZ1N0YXRlIGZyb20gJy4uL3N0YXRlL1J1bm5pbmdTdGF0ZSc7XG5pbXBvcnQgUGF1c2VkU3RhdGUgZnJvbSAnLi4vc3RhdGUvUGF1c2VkU3RhdGUnO1xuaW1wb3J0IFN0b3BwZWRTdGF0ZSBmcm9tICcuLi9zdGF0ZS9TdG9wcGVkU3RhdGUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5pbXBvcnQgQ29uY2VybkZhY3RvcnkgZnJvbSAnLi4vQ29uY2VybkZhY3RvcnknO1xuXG4vL0lFIHN1cHBvcnRcbmlmIChGdW5jdGlvbi5wcm90b3R5cGUubmFtZSA9PT0gdW5kZWZpbmVkICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ25hbWUnLCB7XG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uXFxzKFteKF17MSx9KVxcKC87XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKCh0aGlzKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHJldHVybiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpID8gcmVzdWx0c1sxXS50cmltKCkgOiBcIlwiO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7fVxuICAgIH0pO1xufVxuXG5jb25zdCBrZXlpZnkgPSBmdW5jdGlvbihtc2cpIHtcblxuICAgIHN3aXRjaCAodHlwZW9mIG1zZykge1xuXG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiBtc2cubmFtZTtcblxuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgcmV0dXJuIG1zZy5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJycgKyBtc2c7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTaW1wbGVEaXNwYXRjaGVyIGhhbmRsZXMgdGhlIGFjdHVhbCBkZWxpdmVyeSBvZiBtZXNzYWdlcyB0b1xuICogQ29uY2VybnMgZnJvbSB0aGVpciBNYWlsYm94LlxuICogQHBhcmFtIHtDb25jZXJufSBjb25jZXJuXG4gKiBAaW1wbGVtZW50cyB7RW5xdWV1ZUxpc3RlbmVyfVxuICovXG5jbGFzcyBTaW1wbGVEaXNwYXRjaGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGZhY3RvcnksIGNvbnRleHQpIHtcblxuICAgICAgICBiZW9mKHsgZmFjdG9yeSB9KS5pbnRlcmZhY2UoQ29uY2VybkZhY3RvcnkpO1xuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5fbWFpbGJveGVzID0ge307XG4gICAgICAgIHRoaXMuX2ZhY3RvcnkgPSBmYWN0b3J5O1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5fY29uY2VybiA9IGZhY3RvcnkuY3JlYXRlKGNvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgX25leHQoYm94KSB7XG5cbiAgICAgICAgdmFyIG5leHQ7XG4gICAgICAgIHZhciBjb25jZXJuID0gdGhpcy5fY29uY2VybjtcblxuICAgICAgICBpZiAodGhpcy5fYnVzeSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLl9idXN5ID0gdHJ1ZTtcblxuICAgICAgICBuZXh0ID0gYm94LmRlcXVldWUoKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICB0aGlzLl9idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFByb21pc2UudHJ5KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gY29uY2Vybi5vblJlY2VpdmUobmV4dC5tZXNzYWdlLCBuZXh0LmZyb20pO1xuXG4gICAgICAgIH0pLnRoZW4oYWN0aW9ucyA9PiB7XG5cbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoIWFjdGlvbnMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhY3Rpb25zID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zW2tleWlmeShuZXh0Lm1lc3NhZ2UpXTtcblxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFjdGlvbnMgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9ucztcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UudHJ5KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb24uY2FsbChhY3Rpb25zLCBuZXh0Lm1lc3NhZ2UsIG5leHQuZnJvbSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9KS5cbiAgICAgICAgdGhlbih2YWx1ZSA9PiAobmV4dC5kb25lKSA/IG5leHQuZG9uZSh2YWx1ZSkgOiB2YWx1ZSkuXG4gICAgICAgIGNhdGNoKGUgPT4gKG5leHQucmVqZWN0KSA/XG4gICAgICAgICAgICBuZXh0LnJlamVjdChlKSA6XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVDaGlsZEVycm9yKGUsIG5leHQuZnJvbSB8fCB0aGlzLl9jb250ZXh0LnNlbGVjdCgnLycpKSkuXG4gICAgICAgIGZpbmFsbHkoKCkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLl9idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KGJveCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBvbkVucXVldWUobWFpbGJveCkge1xuXG4gICAgICAgIHRoaXMuX25leHQobWFpbGJveCk7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlQ2hpbGRFcnJvcihlLCBjaGlsZCkge1xuXG4gICAgICAgIGJlb2YoeyBlIH0pLmluc3RhbmNlKEVycm9yKTtcbiAgICAgICAgYmVvZih7IGNoaWxkIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHZhciBzdHJhdGVneSA9IHRoaXMuX2ZhY3RvcnkuZXJyb3JIYW5kbGluZ1N0cmF0ZWd5KCk7XG4gICAgICAgIHZhciBzaWcgPSBzdHJhdGVneS5kZWNpZGUoZSk7XG5cbiAgICAgICAgaWYgKCEoc2lnIGluc3RhbmNlb2YgU2lnbmFsKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LnBhcmVudCgpLmRpc3BhdGNoZXIoKS5leGVjdXRlQ2hpbGRFcnJvcihlLCBjaGlsZCk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IHN0cmF0ZWd5LmFwcGx5KHNpZywgY2hpbGQsIHRoaXMuX2NvbnRleHQpKTtcblxuXG4gICAgfVxuXG4gICAgZXhlY3V0ZShhY3Rpb24sIHN1Y2Nlc3MpIHtcblxuICAgICAgICBiZW9mKHsgYWN0aW9uIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBzdWNjZXNzIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdmFyIGNvbmNlcm4gPSB0aGlzLl9jb25jZXJuO1xuXG4gICAgICAgIFByb21pc2UudHJ5KGZ1bmN0aW9uIGRvX2V4ZWN1dGUoKSB7XG4gICAgICAgICAgICBhY3Rpb24oY29uY2Vybik7XG4gICAgICAgIH0pLlxuICAgICAgICB0aGVuKHN1Y2Nlc3MpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuZXhlY3V0ZUNoaWxkRXJyb3IoZSwgdGhpcy5fY29udGV4dC5zZWxmKCkpKTtcblxuICAgIH1cblxuICAgIGV4ZWN1dGVPblN0YXJ0KCkge1xuXG4gICAgICAgIFByb21pc2UudHJ5KCgpID0+IHRoaXMuX2NvbmNlcm4ub25TdGFydCgpKS5cbiAgICAgICAgdGhlbigoKSA9PiB0aGlzLl9jb250ZXh0LnNlbGYoKS5zZXRTdGF0ZShuZXcgUnVubmluZ1N0YXRlKHRoaXMuX2NvbnRleHQpKSkuXG4gICAgICAgIGNhdGNoKGUgPT4gdGhpcy5fY29udGV4dC5wYXJlbnQoKS5kaXNwYXRjaGVyKCkuZXhlY3V0ZUNoaWxkRXJyb3IoZSwgdGhpcy5fY29udGV4dC5zZWxmKCkpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVEaXNwYXRjaGVyXG4iXX0=