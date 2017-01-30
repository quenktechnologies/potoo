'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SequentialDispatcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _Callable = require('../Callable');

var _Callable2 = _interopRequireDefault(_Callable);

var _Problem = require('./Problem');

var _Problem2 = _interopRequireDefault(_Problem);

var _Message3 = require('./Message');

var _Message4 = _interopRequireDefault(_Message3);

var _Envelope = require('./Envelope');

var _Envelope2 = _interopRequireDefault(_Envelope);

var _funcs = require('../funcs');

var _events = require('./events');

var _Reference = require('../Reference');

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Frame = function (_Message) {
    _inherits(Frame, _Message);

    function Frame() {
        _classCallCheck(this, Frame);

        return _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).apply(this, arguments));
    }

    return Frame;
}(_Message4.default);

var Behaviour = function (_Message2) {
    _inherits(Behaviour, _Message2);

    function Behaviour() {
        _classCallCheck(this, Behaviour);

        return _possibleConstructorReturn(this, (Behaviour.__proto__ || Object.getPrototypeOf(Behaviour)).apply(this, arguments));
    }

    return Behaviour;
}(_Message4.default);

var gt0 = function gt0(messages, frames) {
    return messages.length > 0 && frames.length > 0;
};

var exec = function exec(_ref) {
    var messages = _ref.messages,
        frames = _ref.frames,
        self = _ref.self,
        root = _ref.root;

    var _messages$shift = messages.shift(),
        message = _messages$shift.message;

    var _frames$shift = frames.shift(),
        receive = _frames$shift.receive,
        context = _frames$shift.context,
        resolve = _frames$shift.resolve,
        reject = _frames$shift.reject,
        name = _frames$shift.name;

    self.tell(new Behaviour({ become: busy(messages, frames, self, root) }));

    _bluebird2.default.try(function () {

        var result = receive.call(context, message);

        if (result == null) {

            frames.unshift(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject }));

            root.tell(new _events.MessageUnhandledEvent({ message: message, path: context.path(), name: name }));
        } else {

            //The result is a Promise/Thenable and we don't want
            //to wait until it finished to process the next frame.
            if (typeof result.then === 'function') self.tell(new Behaviour({ become: ready(messages, frames, self, root) }));

            resolve(result);

            root.tell(new _events.MessageHandledEvent({ path: context.path(), message: message, name: name }));
        }
    }).catch(function (error) {

        reject(error);
        context.parent().tell(new _Problem2.default(error, context, message));
    }).finally(function () {

        if (messages.length > 0) if (frames.length > 0) return exec({ messages: messages, frames: frames, self: self, root: root });

        return self.tell(new Behaviour({ become: ready(messages, frames, self, root) }));
    });

    return null;
};

var busy = function busy(messages, frames, self, root) {
    return (0, _funcs.any)((0, _funcs.type)(Frame, function (frame) {
        return frames.push(frame), root.tell(new _events.ReceiveEvent({ name: frame.name, path: frame.context.path() }));
    }), (0, _funcs.type)(_Envelope2.default, function (env) {
        return messages.push(env), root.tell(new _events.MessageEvent(env));
    }));
};

var ready = function ready(messages, frames, self, root) {
    return (0, _funcs.any)((0, _funcs.type)(Frame, function (frame) {
        return frames.push(frame), root.tell(new _events.ReceiveEvent({ name: frame.name, path: frame.context.path() })), gt0(messages, frames) ? setTimeout(exec({ messages: messages, frames: frames, self: self, root: root })) : _funcs.OK;
    }), (0, _funcs.type)(_Envelope2.default, function (env) {
        return messages.push(env), root.tell(new _events.MessageEvent(env)), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self, root: root }) : _funcs.OK;
    }));
};

/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */

var SequentialDispatcher = exports.SequentialDispatcher = function () {
    function SequentialDispatcher(root) {
        _classCallCheck(this, SequentialDispatcher);

        (0, _beof2.default)({ root: root }).interface(_Reference2.default);

        this._stack = [];
        this._order = [];
        this._messages = [];
        this._executor = ready([], [], this, root);
    }

    _createClass(SequentialDispatcher, [{
        key: 'tell',
        value: function tell(message) {

            if (message instanceof Behaviour) return this._executor = message.become;

            this._executor(message);
        }
    }, {
        key: 'ask',
        value: function ask(_ref2) {
            var _this3 = this;

            var receive = _ref2.receive,
                context = _ref2.context,
                _ref2$time = _ref2.time,
                time = _ref2$time === undefined ? 0 : _ref2$time,
                _ref2$name = _ref2.name,
                name = _ref2$name === undefined ? '' : _ref2$name;


            (0, _beof2.default)({ receive: receive }).interface(_Callable2.default);
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var p = new _bluebird2.default(function (resolve, reject) {
                return _this3._executor(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject, name: name }));
            });

            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJGcmFtZSIsIkJlaGF2aW91ciIsImd0MCIsIm1lc3NhZ2VzIiwiZnJhbWVzIiwibGVuZ3RoIiwiZXhlYyIsInNlbGYiLCJyb290Iiwic2hpZnQiLCJtZXNzYWdlIiwicmVjZWl2ZSIsImNvbnRleHQiLCJyZXNvbHZlIiwicmVqZWN0IiwibmFtZSIsInRlbGwiLCJiZWNvbWUiLCJidXN5IiwidHJ5IiwicmVzdWx0IiwiY2FsbCIsInVuc2hpZnQiLCJwYXRoIiwidGhlbiIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsInBhcmVudCIsImZpbmFsbHkiLCJwdXNoIiwiZnJhbWUiLCJlbnYiLCJzZXRUaW1lb3V0IiwiU2VxdWVudGlhbERpc3BhdGNoZXIiLCJpbnRlcmZhY2UiLCJfc3RhY2siLCJfb3JkZXIiLCJfbWVzc2FnZXMiLCJfZXhlY3V0b3IiLCJ0aW1lIiwib3B0aW9uYWwiLCJudW1iZXIiLCJwIiwidGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLEs7Ozs7Ozs7Ozs7OztJQUNBQyxTOzs7Ozs7Ozs7Ozs7QUFFTixJQUFNQyxNQUFNLFNBQU5BLEdBQU0sQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYO0FBQUEsV0FDUEQsU0FBU0UsTUFBVCxHQUFrQixDQUFuQixJQUEwQkQsT0FBT0MsTUFBUCxHQUFnQixDQURsQztBQUFBLENBQVo7O0FBR0EsSUFBTUMsT0FBTyxTQUFQQSxJQUFPLE9BQXNDO0FBQUEsUUFBbkNILFFBQW1DLFFBQW5DQSxRQUFtQztBQUFBLFFBQXpCQyxNQUF5QixRQUF6QkEsTUFBeUI7QUFBQSxRQUFqQkcsSUFBaUIsUUFBakJBLElBQWlCO0FBQUEsUUFBWEMsSUFBVyxRQUFYQSxJ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RUFBTixFQUFVLEVBQVYsRUFBYyxJQUFkLEVBQW9CakIsSUFBcEIsQ0FBakI7QUFFSDs7Ozs2QkFFSUUsTyxFQUFTOztBQUVWLGdCQUFJQSxtQkFBbUJULFNBQXZCLEVBQ0ksT0FBTyxLQUFLc0MsU0FBTCxHQUFpQjdCLFFBQVFPLE1BQWhDOztBQUVKLGlCQUFLc0IsU0FBTCxDQUFlN0IsT0FBZjtBQUVIOzs7bUNBRThDO0FBQUE7O0FBQUEsZ0JBQXpDQyxPQUF5QyxTQUF6Q0EsT0FBeUM7QUFBQSxnQkFBaENDLE9BQWdDLFNBQWhDQSxPQUFnQztBQUFBLG1DQUF2QjRCLElBQXVCO0FBQUEsZ0JBQXZCQSxJQUF1Qiw4QkFBaEIsQ0FBZ0I7QUFBQSxtQ0FBYnpCLElBQWE7QUFBQSxnQkFBYkEsSUFBYSw4QkFBTixFQUFNOzs7QUFFM0MsZ0NBQUssRUFBRUosZ0JBQUYsRUFBTCxFQUFrQndCLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRXZCLGdCQUFGLEVBQUwsRUFBa0J1QixTQUFsQjtBQUNBLGdDQUFLLEVBQUVLLFVBQUYsRUFBTCxFQUFlQyxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxnQkFBSUMsSUFBSSx1QkFBWSxVQUFDOUIsT0FBRCxFQUFVQyxNQUFWO0FBQUEsdUJBQ2hCLE9BQUt5QixTQUFMLENBQWUsSUFBSXZDLEtBQUosQ0FBVSxFQUFFVyxnQkFBRixFQUFXQyxnQkFBWCxFQUFvQkMsZ0JBQXBCLEVBQTZCQyxjQUE3QixFQUFxQ0MsVUFBckMsRUFBVixDQUFmLENBRGdCO0FBQUEsYUFBWixDQUFSOztBQUdBLG1CQUFReUIsT0FBTyxDQUFSLEdBQWFHLEVBQUVDLE9BQUYsQ0FBVUosSUFBVixDQUFiLEdBQStCRyxDQUF0QztBQUVIOzs7Ozs7a0JBSVVULG9CIiwiZmlsZSI6IlNlcXVlbnRpYWxEaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuLi9Db250ZXh0JztcbmltcG9ydCBDYWxsYWJsZSBmcm9tICcuLi9DYWxsYWJsZSc7XG5pbXBvcnQgUHJvYmxlbSBmcm9tICcuL1Byb2JsZW0nO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9NZXNzYWdlJztcbmltcG9ydCBFbnZlbG9wZSBmcm9tICcuL0VudmVsb3BlJztcbmltcG9ydCB7IG9yLCBpbnNvZiwgYW55LCB0eXBlLCByZXF1aXJlZCwgT0sgfSBmcm9tICcuLi9mdW5jcyc7XG5pbXBvcnQgeyBSZWNlaXZlRXZlbnQsIE1lc3NhZ2VFdmVudCwgTWVzc2FnZVVuaGFuZGxlZEV2ZW50LCBNZXNzYWdlSGFuZGxlZEV2ZW50IH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuLi9SZWZlcmVuY2UnO1xuXG5jbGFzcyBGcmFtZSBleHRlbmRzIE1lc3NhZ2Uge31cbmNsYXNzIEJlaGF2aW91ciBleHRlbmRzIE1lc3NhZ2Uge31cblxuY29uc3QgZ3QwID0gKG1lc3NhZ2VzLCBmcmFtZXMpID0+XG4gICAgKG1lc3NhZ2VzLmxlbmd0aCA+IDApICYmIChmcmFtZXMubGVuZ3RoID4gMCk7XG5cbmNvbnN0IGV4ZWMgPSAoeyBtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290IH0pID0+IHtcblxuICAgIGxldCB7IG1lc3NhZ2UgfSA9IG1lc3NhZ2VzLnNoaWZ0KCk7XG4gICAgbGV0IHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0LCBuYW1lIH0gPSBmcmFtZXMuc2hpZnQoKTtcblxuICAgIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiBidXN5KG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QpIH0pKTtcblxuICAgIFByb21pc2UudHJ5KCgpID0+IHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVjZWl2ZS5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBmcmFtZXMudW5zaGlmdChuZXcgRnJhbWUoeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSkpO1xuXG4gICAgICAgICAgICByb290LnRlbGwobmV3IE1lc3NhZ2VVbmhhbmRsZWRFdmVudCh7IG1lc3NhZ2UsIHBhdGg6IGNvbnRleHQucGF0aCgpLCBuYW1lIH0pKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvL1RoZSByZXN1bHQgaXMgYSBQcm9taXNlL1RoZW5hYmxlIGFuZCB3ZSBkb24ndCB3YW50XG4gICAgICAgICAgICAvL3RvIHdhaXQgdW50aWwgaXQgZmluaXNoZWQgdG8gcHJvY2VzcyB0aGUgbmV4dCBmcmFtZS5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LnRoZW4gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgc2VsZi50ZWxsKG5ldyBCZWhhdmlvdXIoeyBiZWNvbWU6IHJlYWR5KG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QpIH0pKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXG4gICAgICAgICAgICByb290LnRlbGwobmV3IE1lc3NhZ2VIYW5kbGVkRXZlbnQoeyBwYXRoOiBjb250ZXh0LnBhdGgoKSwgbWVzc2FnZSwgbmFtZSB9KSk7XG5cbiAgICAgICAgfVxuXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuXG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIGNvbnRleHQucGFyZW50KCkudGVsbChuZXcgUHJvYmxlbShlcnJvciwgY29udGV4dCwgbWVzc2FnZSkpO1xuXG4gICAgfSkuZmluYWxseSgoKSA9PiB7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBpZiAoZnJhbWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWMoeyBtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290IH0pO1xuXG4gICAgICAgIHJldHVybiBzZWxmLnRlbGwobmV3IEJlaGF2aW91cih7IGJlY29tZTogcmVhZHkobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgfSkpXG5cbiAgICB9KTtcblxuICAgIHJldHVybiBudWxsO1xuXG59O1xuXG5jb25zdCBidXN5ID0gKG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QpID0+XG5cbiAgICBhbnkoXG4gICAgICAgIHR5cGUoRnJhbWUsIGZyYW1lID0+XG4gICAgICAgICAgICAoZnJhbWVzLnB1c2goZnJhbWUpLFxuICAgICAgICAgICAgICAgIHJvb3QudGVsbChuZXcgUmVjZWl2ZUV2ZW50KHsgbmFtZTogZnJhbWUubmFtZSwgcGF0aDogZnJhbWUuY29udGV4dC5wYXRoKCkgfSkpKSksXG5cbiAgICAgICAgdHlwZShFbnZlbG9wZSwgZW52ID0+XG4gICAgICAgICAgICAobWVzc2FnZXMucHVzaChlbnYpLCByb290LnRlbGwobmV3IE1lc3NhZ2VFdmVudChlbnYpKSkpKTtcblxuXG5jb25zdCByZWFkeSA9IChtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSA9PlxuICAgIGFueShcbiAgICAgICAgdHlwZShGcmFtZSwgZnJhbWUgPT5cbiAgICAgICAgICAgIChmcmFtZXMucHVzaChmcmFtZSksXG4gICAgICAgICAgICAgICAgcm9vdC50ZWxsKG5ldyBSZWNlaXZlRXZlbnQoeyBuYW1lOiBmcmFtZS5uYW1lLCBwYXRoOiBmcmFtZS5jb250ZXh0LnBhdGgoKSB9KSksXG4gICAgICAgICAgICAgICAgKGd0MChtZXNzYWdlcywgZnJhbWVzKSkgPyBzZXRUaW1lb3V0KGV4ZWMoeyBtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290IH0pKSA6IE9LKSksXG5cbiAgICAgICAgdHlwZShFbnZlbG9wZSwgZW52ID0+XG4gICAgICAgICAgICAobWVzc2FnZXMucHVzaChlbnYpLFxuICAgICAgICAgICAgICAgIHJvb3QudGVsbChuZXcgTWVzc2FnZUV2ZW50KGVudikpLFxuICAgICAgICAgICAgICAgIChndDAobWVzc2FnZXMsIGZyYW1lcykpID9cbiAgICAgICAgICAgICAgICBleGVjKHsgbWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCB9KSA6IE9LKSkpO1xuXG4vKipcbiAqIFNlcXVlbnRpYWxEaXNwYXRjaGVyIGV4ZWN1dGVzIHJlY2VpdmVzIGluIHRoZSBvcmRlciB0aGV5IGFyZSBzY2hlZHVsZWQgaW4gdGhlIHNhbWVcbiAqIHJ1bnRpbWUgYXMgdGhlIGV2ZW50IHNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlcXVlbnRpYWxEaXNwYXRjaGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJvb3QpIHtcblxuICAgICAgICBiZW9mKHsgcm9vdCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9leGVjdXRvciA9IHJlYWR5KFtdLCBbXSwgdGhpcywgcm9vdCk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEJlaGF2aW91cilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGVjdXRvciA9IG1lc3NhZ2UuYmVjb21lO1xuXG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yKG1lc3NhZ2UpO1xuXG4gICAgfVxuXG4gICAgYXNrKHsgcmVjZWl2ZSwgY29udGV4dCwgdGltZSA9IDAsIG5hbWUgPSAnJyB9KSB7XG5cbiAgICAgICAgYmVvZih7IHJlY2VpdmUgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgdGltZSB9KS5vcHRpb25hbCgpLm51bWJlcigpO1xuXG4gICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICAgIHRoaXMuX2V4ZWN1dG9yKG5ldyBGcmFtZSh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCwgbmFtZSB9KSkpO1xuXG4gICAgICAgIHJldHVybiAodGltZSA+IDApID8gcC50aW1lb3V0KHRpbWUpIDogcDtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXF1ZW50aWFsRGlzcGF0Y2hlclxuIl19