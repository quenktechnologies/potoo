'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log_filter = exports.LOG_LEVEL_DEBUG = exports.LOG_LEVEL_INFO = exports.LOG_LEVEL_WARN = exports.LOG_LEVEL_ERROR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Guardian = require('./Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

var _dispatch = require('./dispatch');

var _events = require('./dispatch/events');

var events = _interopRequireWildcard(_events);

var _funcs = require('./funcs');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG_LEVEL_ERROR = exports.LOG_LEVEL_ERROR = 3;
var LOG_LEVEL_WARN = exports.LOG_LEVEL_WARN = 4;
var LOG_LEVEL_INFO = exports.LOG_LEVEL_INFO = 5;
var LOG_LEVEL_DEBUG = exports.LOG_LEVEL_DEBUG = 7;

var Logger = function () {
    function Logger(logger, level) {
        _classCallCheck(this, Logger);

        this._logger = logger;
        this._level = level;
    }

    _createClass(Logger, [{
        key: 'log',
        value: function log(level, message) {

            if (level <= this._level) switch (level) {

                case LOG_LEVEL_INFO:
                    this._logger.info(message);
                    break;

                case LOG_LEVEL_WARN:
                    this._logger.warn(message);
                    break;

                case LOG_LEVEL_ERROR:
                    this._logger.error(message);
                    break;

                default:
                    this._logger.log(message);

            }
        }
    }, {
        key: 'info',
        value: function info(message) {

            this.log(LOG_LEVEL_INFO, message);
        }
    }, {
        key: 'warn',
        value: function warn(message) {

            this.log(LOG_LEVEL_WARN, message);
        }
    }, {
        key: 'error',
        value: function error(message) {

            this.log(LOG_LEVEL_ERROR, message);
        }
    }]);

    return Logger;
}();

var log_filter = exports.log_filter = function log_filter(log, level) {
    return (0, _funcs.or)((0, _funcs.or)((0, _funcs.insof)(events.SelectFailedEvent, function (e) {
        return log.warn('Actor selection for path \'' + e.path + '\' failed!');
    }), (0, _funcs.or)((0, _funcs.insof)(events.MessageDroppedEvent, function (e) {
        return log.warn('Message sent to actor \'' + e.path + '\' was dropped!', e.message);
    }), (0, _funcs.insof)(events.MessageUnhandledEvent, function (e) {
        return log.warn('Message sent to actor \'' + e.path + '\' was unhandled !', e.message);
    }))), (0, _funcs.ok)(level >= LOG_LEVEL_INFO, (0, _funcs.or)((0, _funcs.insof)(events.ReceiveEvent, function (e) {
        return log.info('Actor \'' + e.path + '\' began receiving');
    }), (0, _funcs.or)((0, _funcs.insof)(events.MessageEvent, function (e) {
        return log.info('Message sent to \'' + e.path + '\' mailbox.', e.message);
    }), (0, _funcs.or)((0, _funcs.insof)(events.SelectHitEvent, function (e) {
        return log.info('\n                        Actor \'' + e.from + '\'\n                        provided a reference to \'' + e.requested + '\'\n                        ');
    }), (0, _funcs.or)((0, _funcs.insof)(events.SelectMissEvent, function (e) {
        return log.info('Actor \'' + e.from + '\' ' + ('did not provide a reference to \'' + e.requested + '\''));
    }), (0, _funcs.insof)(events.MessageHandledEvent, function (e) {
        return log.info('Actor \'' + e.path + '\' consumed message.', e.message);
    })))))));
};

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */

var IsomorphicSystem = function () {
    function IsomorphicSystem() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$log_level = _ref.log_level,
            log_level = _ref$log_level === undefined ? LOG_LEVEL_ERROR : _ref$log_level,
            _ref$logger = _ref.logger,
            logger = _ref$logger === undefined ? console : _ref$logger,
            _ref$subscribers = _ref.subscribers,
            subscribers = _ref$subscribers === undefined ? [] : _ref$subscribers;

        _classCallCheck(this, IsomorphicSystem);

        this._subs = subscribers;
        this._guardian = new _Guardian2.default(this);

        if (log_level > LOG_LEVEL_ERROR) this._subs.push(log_filter(logger, log_level));
    }

    /**
     * create a new IsomorphicSystem
     * @param {object} options
     * @returns {IsomorphicSystem}
     */


    _createClass(IsomorphicSystem, [{
        key: 'select',
        value: function select(path) {

            return this._guardian.tree.select(path);
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this._guardian.spawn(spec, name);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(f) {

            this._subs.unshift(f);
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
                return s.call(_this, evt);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Jc29tb3JwaGljU3lzdGVtLmpzIl0sIm5hbWVzIjpbImV2ZW50cyIsIkxPR19MRVZFTF9FUlJPUiIsIkxPR19MRVZFTF9XQVJOIiwiTE9HX0xFVkVMX0lORk8iLCJMT0dfTEVWRUxfREVCVUciLCJMb2dnZXIiLCJsb2dnZXIiLCJsZXZlbCIsIl9sb2dnZXIiLCJfbGV2ZWwiLCJtZXNzYWdlIiwiaW5mbyIsIndhcm4iLCJlcnJvciIsImxvZyIsImxvZ19maWx0ZXIiLCJTZWxlY3RGYWlsZWRFdmVudCIsImUiLCJwYXRoIiwiTWVzc2FnZURyb3BwZWRFdmVudCIsIk1lc3NhZ2VVbmhhbmRsZWRFdmVudCIsIlJlY2VpdmVFdmVudCIsIk1lc3NhZ2VFdmVudCIsIlNlbGVjdEhpdEV2ZW50IiwiZnJvbSIsInJlcXVlc3RlZCIsIlNlbGVjdE1pc3NFdmVudCIsIk1lc3NhZ2VIYW5kbGVkRXZlbnQiLCJJc29tb3JwaGljU3lzdGVtIiwibG9nX2xldmVsIiwiY29uc29sZSIsInN1YnNjcmliZXJzIiwiX3N1YnMiLCJfZ3VhcmRpYW4iLCJwdXNoIiwidHJlZSIsInNlbGVjdCIsInNwZWMiLCJuYW1lIiwic3Bhd24iLCJmIiwidW5zaGlmdCIsImkiLCJpbmRleE9mIiwic3BsaWNlIiwiZXZ0IiwiZm9yRWFjaCIsInMiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7SUFBWUEsTTs7QUFDWjs7Ozs7Ozs7QUFFTyxJQUFNQyw0Q0FBa0IsQ0FBeEI7QUFDQSxJQUFNQywwQ0FBaUIsQ0FBdkI7QUFDQSxJQUFNQywwQ0FBaUIsQ0FBdkI7QUFDQSxJQUFNQyw0Q0FBa0IsQ0FBeEI7O0lBRURDLE07QUFFRixvQkFBWUMsTUFBWixFQUFvQkMsS0FBcEIsRUFBMkI7QUFBQTs7QUFFdkIsYUFBS0MsT0FBTCxHQUFlRixNQUFmO0FBQ0EsYUFBS0csTUFBTCxHQUFjRixLQUFkO0FBRUg7Ozs7NEJBRUdB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LEdBQWlCLHVCQUFhLElBQWIsQ0FBakI7O0FBRUEsWUFBSUosWUFBWTVCLGVBQWhCLEVBQ0ksS0FBSytCLEtBQUwsQ0FBV0UsSUFBWCxDQUFnQm5CLFdBQVdULE1BQVgsRUFBbUJ1QixTQUFuQixDQUFoQjtBQUVQOztBQUVEOzs7Ozs7Ozs7K0JBV09YLEksRUFBTTs7QUFFVCxtQkFBTyxLQUFLZSxTQUFMLENBQWVFLElBQWYsQ0FBb0JDLE1BQXBCLENBQTJCbEIsSUFBM0IsQ0FBUDtBQUVIOzs7OEJBRUttQixJLEVBQU1DLEksRUFBTTs7QUFFZCxtQkFBTyxLQUFLTCxTQUFMLENBQWVNLEtBQWYsQ0FBcUJGLElBQXJCLEVBQTJCQyxJQUEzQixDQUFQO0FBRUg7OztrQ0FFU0UsQyxFQUFHOztBQUVULGlCQUFLUixLQUFMLENBQVdTLE9BQVgsQ0FBbUJELENBQW5CO0FBQ0EsbUJBQU8sSUFBUDtBQUVIOzs7b0NBRVdBLEMsRUFBRzs7QUFFWCxnQkFBSUUsSUFBSSxLQUFLVixLQUFMLENBQVdXLE9BQVgsQ0FBbUJILENBQW5CLENBQVI7O0FBRUEsZ0JBQUlFLElBQUksQ0FBUixFQUNJLEtBQUtWLEtBQUwsQ0FBV1ksTUFBWCxDQUFrQkYsQ0FBbEIsRUFBcUIsQ0FBckI7O0FBRUosbUJBQU8sSUFBUDtBQUVIOzs7Z0NBRU9HLEcsRUFBSztBQUFBOztBQUVULGlCQUFLYixLQUFMLENBQVdjLE9BQVgsQ0FBbUI7QUFBQSx1QkFBS0MsRUFBRUMsSUFBRixRQUFhSCxHQUFiLENBQUw7QUFBQSxhQUFuQjtBQUVIOzs7aUNBeENlOztBQUVaLG1CQUFPLElBQUlqQixnQkFBSixFQUFQO0FBRUg7Ozs7OztrQkF3Q1VBLGdCIiwiZmlsZSI6Iklzb21vcnBoaWNTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBHdWFyZGlhbiBmcm9tICcuL0d1YXJkaWFuJztcbmltcG9ydCB7IFByb2JsZW0gfSBmcm9tICcuL2Rpc3BhdGNoJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICcuL2Rpc3BhdGNoL2V2ZW50cyc7XG5pbXBvcnQgeyBvciwgaW5zb2YsIG9rIH0gZnJvbSAnLi9mdW5jcyc7XG5cbmV4cG9ydCBjb25zdCBMT0dfTEVWRUxfRVJST1IgPSAzO1xuZXhwb3J0IGNvbnN0IExPR19MRVZFTF9XQVJOID0gNDtcbmV4cG9ydCBjb25zdCBMT0dfTEVWRUxfSU5GTyA9IDU7XG5leHBvcnQgY29uc3QgTE9HX0xFVkVMX0RFQlVHID0gNztcblxuY2xhc3MgTG9nZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlciwgbGV2ZWwpIHtcblxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2xldmVsID0gbGV2ZWw7XG5cbiAgICB9XG5cbiAgICBsb2cobGV2ZWwsIG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAobGV2ZWwgPD0gdGhpcy5fbGV2ZWwpXG4gICAgICAgICAgICBzd2l0Y2ggKGxldmVsKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlIExPR19MRVZFTF9JTkZPOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIExPR19MRVZFTF9XQVJOOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIud2FybihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIExPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2cobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgIH1cblxuICAgIGluZm8obWVzc2FnZSkge1xuXG4gICAgICAgIHRoaXMubG9nKExPR19MRVZFTF9JTkZPLCBtZXNzYWdlKTtcblxuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZSkge1xuXG4gICAgICAgIHRoaXMubG9nKExPR19MRVZFTF9XQVJOLCBtZXNzYWdlKTtcblxuICAgIH1cblxuICAgIGVycm9yKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLmxvZyhMT0dfTEVWRUxfRVJST1IsIG1lc3NhZ2UpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBsb2dfZmlsdGVyID0gKGxvZywgbGV2ZWwpID0+XG5cbiAgICBvcihcbiAgICAgICAgb3IoXG4gICAgICAgICAgICBpbnNvZihldmVudHMuU2VsZWN0RmFpbGVkRXZlbnQsIGUgPT5cbiAgICAgICAgICAgICAgICBsb2cud2FybihgQWN0b3Igc2VsZWN0aW9uIGZvciBwYXRoICcke2UucGF0aH0nIGZhaWxlZCFgKSksXG4gICAgICAgICAgICBvcihcbiAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuTWVzc2FnZURyb3BwZWRFdmVudCwgZSA9PlxuICAgICAgICAgICAgICAgICAgICBsb2cud2FybihgTWVzc2FnZSBzZW50IHRvIGFjdG9yICcke2UucGF0aH0nIHdhcyBkcm9wcGVkIWAsIGUubWVzc2FnZSkpLFxuXG4gICAgICAgICAgICAgICAgaW5zb2YoZXZlbnRzLk1lc3NhZ2VVbmhhbmRsZWRFdmVudCwgZSA9PlxuICAgICAgICAgICAgICAgICAgICBsb2cud2FybihgTWVzc2FnZSBzZW50IHRvIGFjdG9yICcke2UucGF0aH0nIHdhcyB1bmhhbmRsZWQgIWAsIGUubWVzc2FnZSkpKSksXG5cbiAgICAgICAgb2sobGV2ZWwgPj0gTE9HX0xFVkVMX0lORk8sXG4gICAgICAgIG9yKFxuICAgICAgICAgICAgaW5zb2YoZXZlbnRzLlJlY2VpdmVFdmVudCxcbiAgICAgICAgICAgICAgICBlID0+IGxvZy5pbmZvKGBBY3RvciAnJHtlLnBhdGh9JyBiZWdhbiByZWNlaXZpbmdgKSksXG4gICAgICAgICAgICBvcihcbiAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuTWVzc2FnZUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBlID0+IGxvZy5pbmZvKGBNZXNzYWdlIHNlbnQgdG8gJyR7ZS5wYXRofScgbWFpbGJveC5gLCBlLm1lc3NhZ2UpKSxcblxuICAgICAgICAgICAgICAgIG9yKFxuICAgICAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuU2VsZWN0SGl0RXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlID0+IGxvZy5pbmZvKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIEFjdG9yICcke2UuZnJvbX0nXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlZCBhIHJlZmVyZW5jZSB0byAnJHtlLnJlcXVlc3RlZH0nXG4gICAgICAgICAgICAgICAgICAgICAgICBgKSksXG5cbiAgICAgICAgICAgICAgICAgICAgb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuU2VsZWN0TWlzc0V2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4gbG9nLmluZm8oYEFjdG9yICcke2UuZnJvbX0nIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgZGlkIG5vdCBwcm92aWRlIGEgcmVmZXJlbmNlIHRvICcke2UucmVxdWVzdGVkfSdgKSksXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluc29mKGV2ZW50cy5NZXNzYWdlSGFuZGxlZEV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4gbG9nLmluZm8oYEFjdG9yICcke2UucGF0aH0nIGNvbnN1bWVkIG1lc3NhZ2UuYCwgZS5tZXNzYWdlKSkpKSkpKSlcblxuLyoqXG4gKiBJc29tb3JwaGljU3lzdGVtIHJlcHJlc2VudHMgYSBjb2xsZWN0aW9uIG9mIHJlbGF0ZWQgQ29uY2VybnMgdGhhdCBzaGFyZSBhIHBhcmVudCBDb250ZXh0LlxuICogVXNlIHRoZW0gdG8gY3JlYXRlIHRvIHJlcHJlc2VudCB0aGUgZ3VhcmRpYW4gb2YgYSB0cmVlIHlvdXIgYXBwbGljYXRpb24gd2lsbFxuICogYnJhbmNoIGludG8uXG4gKiBAaW1wbGVtZW50cyB7U3lzdGVtfVxuICovXG5jbGFzcyBJc29tb3JwaGljU3lzdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKHsgbG9nX2xldmVsID0gTE9HX0xFVkVMX0VSUk9SLCBsb2dnZXIgPSBjb25zb2xlLCBzdWJzY3JpYmVycyA9IFtdIH0gPSB7fSkge1xuXG4gICAgICAgIHRoaXMuX3N1YnMgPSBzdWJzY3JpYmVycztcbiAgICAgICAgdGhpcy5fZ3VhcmRpYW4gPSBuZXcgR3VhcmRpYW4odGhpcyk7XG5cbiAgICAgICAgaWYgKGxvZ19sZXZlbCA+IExPR19MRVZFTF9FUlJPUilcbiAgICAgICAgICAgIHRoaXMuX3N1YnMucHVzaChsb2dfZmlsdGVyKGxvZ2dlciwgbG9nX2xldmVsKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBuZXcgSXNvbW9ycGhpY1N5c3RlbVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybnMge0lzb21vcnBoaWNTeXN0ZW19XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElzb21vcnBoaWNTeXN0ZW0oKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1YXJkaWFuLnRyZWUuc2VsZWN0KHBhdGgpO1xuXG4gICAgfVxuXG4gICAgc3Bhd24oc3BlYywgbmFtZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9ndWFyZGlhbi5zcGF3bihzcGVjLCBuYW1lKTtcblxuICAgIH1cblxuICAgIHN1YnNjcmliZShmKSB7XG5cbiAgICAgICAgdGhpcy5fc3Vicy51bnNoaWZ0KGYpO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlKGYpIHtcblxuICAgICAgICB2YXIgaSA9IHRoaXMuX3N1YnMuaW5kZXhPZihmKTtcblxuICAgICAgICBpZiAoaSA+IDApXG4gICAgICAgICAgICB0aGlzLl9zdWJzLnNwbGljZShpLCAxKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHB1Ymxpc2goZXZ0KSB7XG5cbiAgICAgICAgdGhpcy5fc3Vicy5mb3JFYWNoKHMgPT4gcy5jYWxsKHRoaXMsIGV2dCkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElzb21vcnBoaWNTeXN0ZW1cbiJdfQ==