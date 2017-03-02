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
        return log.warn('Message sent to actor \'' + e.path + '\' was unhandled ' + ('by \'' + e.name + '\'!'), e.message);
    }))), (0, _funcs.ok)(level >= LOG_LEVEL_INFO, (0, _funcs.or)((0, _funcs.insof)(events.ReceiveEvent, function (e) {
        return log.info('Actor \'' + e.path + '\' began receiving with \'' + e.name + '\'');
    }), (0, _funcs.or)((0, _funcs.insof)(events.MessageEvent, function (e) {
        return log.info('Message sent to \'' + e.path + '\' mailbox.', e.message);
    }), (0, _funcs.or)((0, _funcs.insof)(events.SelectHitEvent, function (e) {
        return log.info('\n                        Actor \'' + e.from + '\'\n                        provided a reference to \'' + e.requested + '\'\n                        ');
    }), (0, _funcs.or)((0, _funcs.insof)(events.SelectMissEvent, function (e) {
        return log.info('Actor \'' + e.from + '\' ' + ('did not provide a reference to \'' + e.requested + '\''));
    }), (0, _funcs.insof)(events.MessageHandledEvent, function (e) {
        return log.info('Actor \'' + e.path + '\' consumed message ' + ('with \'' + e.name + '\'.'), e.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvSXNvbW9ycGhpY1N5c3RlbS5qcyJdLCJuYW1lcyI6WyJldmVudHMiLCJMT0dfTEVWRUxfRVJST1IiLCJMT0dfTEVWRUxfV0FSTiIsIkxPR19MRVZFTF9JTkZPIiwiTE9HX0xFVkVMX0RFQlVHIiwiTG9nZ2VyIiwibG9nZ2VyIiwibGV2ZWwiLCJfbG9nZ2VyIiwiX2xldmVsIiwibWVzc2FnZSIsImluZm8iLCJ3YXJuIiwiZXJyb3IiLCJsb2ciLCJsb2dfZmlsdGVyIiwiU2VsZWN0RmFpbGVkRXZlbnQiLCJlIiwicGF0aCIsIk1lc3NhZ2VEcm9wcGVkRXZlbnQiLCJNZXNzYWdlVW5oYW5kbGVkRXZlbnQiLCJuYW1lIiwiUmVjZWl2ZUV2ZW50IiwiTWVzc2FnZUV2ZW50IiwiU2VsZWN0SGl0RXZlbnQiLCJmcm9tIiwicmVxdWVzdGVkIiwiU2VsZWN0TWlzc0V2ZW50IiwiTWVzc2FnZUhhbmRsZWRFdmVudCIsIklzb21vcnBoaWNTeXN0ZW0iLCJsb2dfbGV2ZWwiLCJjb25zb2xlIiwic3Vic2NyaWJlcnMiLCJfc3VicyIsIl9ndWFyZGlhbiIsInB1c2giLCJ0cmVlIiwic2VsZWN0Iiwic3BlYyIsInNwYXduIiwiZiIsInVuc2hpZnQiLCJpIiwiaW5kZXhPZiIsInNwbGljZSIsImV2dCIsImZvckVhY2giLCJzIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0lBQVlBLE07O0FBQ1o7Ozs7Ozs7O0FBRU8sSUFBTUMsNENBQWtCLENBQXhCO0FBQ0EsSUFBTUMsMENBQWlCLENBQXZCO0FBQ0EsSUFBTUMsMENBQWlCLENBQXZCO0FBQ0EsSUFBTUMsNENBQWtCLENBQXhCOztJQUVEQyxNO0FBRUYsb0JBQVlDLE1BQVosRUFBb0JDLEtBQXBCLEVBQTJCO0FBQUE7O0FBRXZCLGFBQUtDLE9BQUwsR0FBZUYsTUFBZjtBQUNBLGFBQUtHLE1BQUwsR0FBY0YsS0FBZDtBQUVIOzs7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QUFBLFlBQXpCQSxXQUF5QixvQ0FBWCxFQUFXOztBQUFBOztBQUVsRixhQUFLQyxLQUFMLEdBQWFELFdBQWI7QUFDQSxhQUFLRSxTQUFMLEdBQWlCLHVCQUFhLElBQWIsQ0FBakI7O0FBRUEsWUFBSUosWUFBWTdCLGVBQWhCLEVBQ0ksS0FBS2dDLEtBQUwsQ0FBV0UsSUFBWCxDQUFnQnBCLFdBQVdULE1BQVgsRUFBbUJ3QixTQUFuQixDQUFoQjtBQUVQOztBQUVEOzs7Ozs7Ozs7K0JBV09aLEksRUFBTTs7QUFFVCxtQkFBTyxLQUFLZ0IsU0FBTCxDQUFlRSxJQUFmLENBQW9CQyxNQUFwQixDQUEyQm5CLElBQTNCLENBQVA7QUFFSDs7OzhCQUVLb0IsSSxFQUFNakIsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUthLFNBQUwsQ0FBZUssS0FBZixDQUFxQkQsSUFBckIsRUFBMkJqQixJQUEzQixDQUFQO0FBRUg7OztrQ0FFU21CLEMsRUFBRzs7QUFFVCxpQkFBS1AsS0FBTCxDQUFXUSxPQUFYLENBQW1CRCxDQUFuQjtBQUNBLG1CQUFPLElBQVA7QUFFSDs7O29DQUVXQSxDLEVBQUc7O0FBRVgsZ0JBQUlFLElBQUksS0FBS1QsS0FBTCxDQUFXVSxPQUFYLENBQW1CSCxDQUFuQixDQUFSOztBQUVBLGdCQUFJRSxJQUFJLENBQVIsRUFDSSxLQUFLVCxLQUFMLENBQVdXLE1BQVgsQ0FBa0JGLENBQWxCLEVBQXFCLENBQXJCOztBQUVKLG1CQUFPLElBQVA7QUFFSDs7O2dDQUVPRyxHLEVBQUs7QUFBQTs7QUFFVCxpQkFBS1osS0FBTCxDQUFXYSxPQUFYLENBQW1CO0FBQUEsdUJBQUtDLEVBQUVDLElBQUYsUUFBYUgsR0FBYixDQUFMO0FBQUEsYUFBbkI7QUFFSDs7O2lDQXhDZTs7QUFFWixtQkFBTyxJQUFJaEIsZ0JBQUosRUFBUDtBQUVIOzs7Ozs7a0JBd0NVQSxnQiIsImZpbGUiOiJJc29tb3JwaGljU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgR3VhcmRpYW4gZnJvbSAnLi9HdWFyZGlhbic7XG5pbXBvcnQgeyBQcm9ibGVtIH0gZnJvbSAnLi9kaXNwYXRjaCc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnLi9kaXNwYXRjaC9ldmVudHMnO1xuaW1wb3J0IHsgb3IsIGluc29mLCBvayB9IGZyb20gJy4vZnVuY3MnO1xuXG5leHBvcnQgY29uc3QgTE9HX0xFVkVMX0VSUk9SID0gMztcbmV4cG9ydCBjb25zdCBMT0dfTEVWRUxfV0FSTiA9IDQ7XG5leHBvcnQgY29uc3QgTE9HX0xFVkVMX0lORk8gPSA1O1xuZXhwb3J0IGNvbnN0IExPR19MRVZFTF9ERUJVRyA9IDc7XG5cbmNsYXNzIExvZ2dlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXIsIGxldmVsKSB7XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9sZXZlbCA9IGxldmVsO1xuXG4gICAgfVxuXG4gICAgbG9nKGxldmVsLCBtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKGxldmVsIDw9IHRoaXMuX2xldmVsKVxuICAgICAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSBMT0dfTEVWRUxfSU5GTzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBMT0dfTEVWRUxfV0FSTjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBMT0dfTEVWRUxfRVJST1I6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpbmZvKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLmxvZyhMT0dfTEVWRUxfSU5GTywgbWVzc2FnZSk7XG5cbiAgICB9XG5cbiAgICB3YXJuKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLmxvZyhMT0dfTEVWRUxfV0FSTiwgbWVzc2FnZSk7XG5cbiAgICB9XG5cbiAgICBlcnJvcihtZXNzYWdlKSB7XG5cbiAgICAgICAgdGhpcy5sb2coTE9HX0xFVkVMX0VSUk9SLCBtZXNzYWdlKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgbG9nX2ZpbHRlciA9IChsb2csIGxldmVsKSA9PlxuXG4gICAgb3IoXG4gICAgICAgIG9yKFxuICAgICAgICAgICAgaW5zb2YoZXZlbnRzLlNlbGVjdEZhaWxlZEV2ZW50LCBlID0+XG4gICAgICAgICAgICAgICAgbG9nLndhcm4oYEFjdG9yIHNlbGVjdGlvbiBmb3IgcGF0aCAnJHtlLnBhdGh9JyBmYWlsZWQhYCkpLFxuICAgICAgICAgICAgb3IoXG4gICAgICAgICAgICAgICAgaW5zb2YoZXZlbnRzLk1lc3NhZ2VEcm9wcGVkRXZlbnQsIGUgPT5cbiAgICAgICAgICAgICAgICAgICAgbG9nLndhcm4oYE1lc3NhZ2Ugc2VudCB0byBhY3RvciAnJHtlLnBhdGh9JyB3YXMgZHJvcHBlZCFgLCBlLm1lc3NhZ2UpKSxcblxuICAgICAgICAgICAgICAgIGluc29mKGV2ZW50cy5NZXNzYWdlVW5oYW5kbGVkRXZlbnQsIGUgPT5cbiAgICAgICAgICAgICAgICAgICAgbG9nLndhcm4oYE1lc3NhZ2Ugc2VudCB0byBhY3RvciAnJHtlLnBhdGh9JyB3YXMgdW5oYW5kbGVkIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGJ5ICcke2UubmFtZX0nIWAsIGUubWVzc2FnZSkpKSksXG5cbiAgICAgICAgb2sobGV2ZWwgPj0gTE9HX0xFVkVMX0lORk8sXG4gICAgICAgICAgICBvcihcbiAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuUmVjZWl2ZUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBlID0+IGxvZy5pbmZvKGBBY3RvciAnJHtlLnBhdGh9JyBiZWdhbiByZWNlaXZpbmcgd2l0aCAnJHtlLm5hbWV9J2ApKSxcbiAgICAgICAgICAgICAgICBvcihcbiAgICAgICAgICAgICAgICAgICAgaW5zb2YoZXZlbnRzLk1lc3NhZ2VFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4gbG9nLmluZm8oYE1lc3NhZ2Ugc2VudCB0byAnJHtlLnBhdGh9JyBtYWlsYm94LmAsIGUubWVzc2FnZSkpLFxuXG4gICAgICAgICAgICAgICAgICAgIG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zb2YoZXZlbnRzLlNlbGVjdEhpdEV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4gbG9nLmluZm8oYFxuICAgICAgICAgICAgICAgICAgICAgICAgQWN0b3IgJyR7ZS5mcm9tfSdcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVkIGEgcmVmZXJlbmNlIHRvICcke2UucmVxdWVzdGVkfSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGApKSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zb2YoZXZlbnRzLlNlbGVjdE1pc3NFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiBsb2cuaW5mbyhgQWN0b3IgJyR7ZS5mcm9tfScgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgZGlkIG5vdCBwcm92aWRlIGEgcmVmZXJlbmNlIHRvICcke2UucmVxdWVzdGVkfSdgKSksXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNvZihldmVudHMuTWVzc2FnZUhhbmRsZWRFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiBsb2cuaW5mbyhgQWN0b3IgJyR7ZS5wYXRofScgY29uc3VtZWQgbWVzc2FnZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB3aXRoICcke2UubmFtZX0nLmAsIGUubWVzc2FnZSkpKSkpKSkpXG5cbi8qKlxuICogSXNvbW9ycGhpY1N5c3RlbSByZXByZXNlbnRzIGEgY29sbGVjdGlvbiBvZiByZWxhdGVkIENvbmNlcm5zIHRoYXQgc2hhcmUgYSBwYXJlbnQgQ29udGV4dC5cbiAqIFVzZSB0aGVtIHRvIGNyZWF0ZSB0byByZXByZXNlbnQgdGhlIGd1YXJkaWFuIG9mIGEgdHJlZSB5b3VyIGFwcGxpY2F0aW9uIHdpbGxcbiAqIGJyYW5jaCBpbnRvLlxuICogQGltcGxlbWVudHMge1N5c3RlbX1cbiAqL1xuY2xhc3MgSXNvbW9ycGhpY1N5c3RlbSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7IGxvZ19sZXZlbCA9IExPR19MRVZFTF9FUlJPUiwgbG9nZ2VyID0gY29uc29sZSwgc3Vic2NyaWJlcnMgPSBbXSB9ID0ge30pIHtcblxuICAgICAgICB0aGlzLl9zdWJzID0gc3Vic2NyaWJlcnM7XG4gICAgICAgIHRoaXMuX2d1YXJkaWFuID0gbmV3IEd1YXJkaWFuKHRoaXMpO1xuXG4gICAgICAgIGlmIChsb2dfbGV2ZWwgPiBMT0dfTEVWRUxfRVJST1IpXG4gICAgICAgICAgICB0aGlzLl9zdWJzLnB1c2gobG9nX2ZpbHRlcihsb2dnZXIsIGxvZ19sZXZlbCkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGEgbmV3IElzb21vcnBoaWNTeXN0ZW1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtJc29tb3JwaGljU3lzdGVtfVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGUoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJc29tb3JwaGljU3lzdGVtKCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9ndWFyZGlhbi50cmVlLnNlbGVjdChwYXRoKTtcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZ3VhcmRpYW4uc3Bhd24oc3BlYywgbmFtZSk7XG5cbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZikge1xuXG4gICAgICAgIHRoaXMuX3N1YnMudW5zaGlmdChmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZShmKSB7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLl9zdWJzLmluZGV4T2YoZik7XG5cbiAgICAgICAgaWYgKGkgPiAwKVxuICAgICAgICAgICAgdGhpcy5fc3Vicy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBwdWJsaXNoKGV2dCkge1xuXG4gICAgICAgIHRoaXMuX3N1YnMuZm9yRWFjaChzID0+IHMuY2FsbCh0aGlzLCBldnQpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBJc29tb3JwaGljU3lzdGVtXG4iXX0=