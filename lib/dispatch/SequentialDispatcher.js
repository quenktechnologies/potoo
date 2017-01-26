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
        return frames.push(frame), root.tell(new _events.ReceiveEvent({ name: frame.name, path: frame.context.path() })), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self, root: root }) : _funcs.OK;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJGcmFtZSIsIkJlaGF2aW91ciIsImd0MCIsIm1lc3NhZ2VzIiwiZnJhbWVzIiwibGVuZ3RoIiwiZXhlYyIsInNlbGYiLCJyb290Iiwic2hpZnQiLCJtZXNzYWdlIiwicmVjZWl2ZSIsImNvbnRleHQiLCJyZXNvbHZlIiwicmVqZWN0IiwibmFtZSIsInRlbGwiLCJiZWNvbWUiLCJidXN5IiwidHJ5IiwicmVzdWx0IiwiY2FsbCIsInVuc2hpZnQiLCJwYXRoIiwidGhlbiIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsInBhcmVudCIsImZpbmFsbHkiLCJwdXNoIiwiZnJhbWUiLCJlbnYiLCJTZXF1ZW50aWFsRGlzcGF0Y2hlciIsImludGVyZmFjZSIsIl9zdGFjayIsIl9vcmRlciIsIl9tZXNzYWdlcyIsIl9leGVjdXRvciIsInRpbWUiLCJvcHRpb25hbCIsIm51bWJlciIsInAiLCJ0aW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsSzs7Ozs7Ozs7Ozs7O0lBQ0FDLFM7Ozs7Ozs7Ozs7OztBQUVOLElBQU1DLE1BQU0sU0FBTkEsR0FBTSxDQUFDQyxRQUFELEVBQVdDLE1BQVg7QUFBQSxXQUNQRCxTQUFTRSxNQUFULEdBQWtCLENBQW5CLElBQTBCRCxPQUFPQyxNQUFQLEdBQWdCLENBRGxDO0FBQUEsQ0FBWjs7QUFHQSxJQUFNQyxPQUFPLFNBQVBBLElBQU8sT0FBc0M7QUFBQSxRQUFuQ0gsUUFBbUMsUUFBbkNBLFFBQW1DO0FBQUEsUUFBekJDLE1BQXlCLFFBQXpCQSxNQUF5QjtBQUFBLFFBQWpCRyxJQUFpQixRQUFqQkEsSUFBaUI7QUFBQSxRQUFYQyxJQUFXLFFBQVhBLElBQVc7O0FBQUEsMEJB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QUFvQmpCLElBQXBCLENBQWpCO0FBRUg7Ozs7NkJBRUlFLE8sRUFBUzs7QUFFVixnQkFBSUEsbUJBQW1CVCxTQUF2QixFQUNJLE9BQU8sS0FBS3FDLFNBQUwsR0FBaUI1QixRQUFRTyxNQUFoQzs7QUFFSixpQkFBS3FCLFNBQUwsQ0FBZTVCLE9BQWY7QUFFSDs7O21DQUU4QztBQUFBOztBQUFBLGdCQUF6Q0MsT0FBeUMsU0FBekNBLE9BQXlDO0FBQUEsZ0JBQWhDQyxPQUFnQyxTQUFoQ0EsT0FBZ0M7QUFBQSxtQ0FBdkIyQixJQUF1QjtBQUFBLGdCQUF2QkEsSUFBdUIsOEJBQWhCLENBQWdCO0FBQUEsbUNBQWJ4QixJQUFhO0FBQUEsZ0JBQWJBLElBQWEsOEJBQU4sRUFBTTs7O0FBRTNDLGdDQUFLLEVBQUVKLGdCQUFGLEVBQUwsRUFBa0J1QixTQUFsQjtBQUNBLGdDQUFLLEVBQUV0QixnQkFBRixFQUFMLEVBQWtCc0IsU0FBbEI7QUFDQSxnQ0FBSyxFQUFFSyxVQUFGLEVBQUwsRUFBZUMsUUFBZixHQUEwQkMsTUFBMUI7O0FBRUEsZ0JBQUlDLElBQUksdUJBQVksVUFBQzdCLE9BQUQsRUFBVUMsTUFBVjtBQUFBLHVCQUNoQixPQUFLd0IsU0FBTCxDQUFlLElBQUl0QyxLQUFKLENBQVUsRUFBRVcsZ0JBQUYsRUFBV0MsZ0JBQVgsRUFBb0JDLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBcUNDLFVBQXJDLEVBQVYsQ0FBZixDQURnQjtBQUFBLGFBQVosQ0FBUjs7QUFHQSxtQkFBUXdCLE9BQU8sQ0FBUixHQUFhRyxFQUFFQyxPQUFGLENBQVVKLElBQVYsQ0FBYixHQUErQkcsQ0FBdEM7QUFFSDs7Ozs7O2tCQUlVVCxvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuaW1wb3J0IFByb2JsZW0gZnJvbSAnLi9Qcm9ibGVtJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgRW52ZWxvcGUgZnJvbSAnLi9FbnZlbG9wZSc7XG5pbXBvcnQgeyBvciwgaW5zb2YsIGFueSwgdHlwZSwgcmVxdWlyZWQsIE9LIH0gZnJvbSAnLi4vZnVuY3MnO1xuaW1wb3J0IHsgUmVjZWl2ZUV2ZW50LCBNZXNzYWdlRXZlbnQsIE1lc3NhZ2VVbmhhbmRsZWRFdmVudCwgTWVzc2FnZUhhbmRsZWRFdmVudCB9IGZyb20gJy4vZXZlbnRzJztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi4vUmVmZXJlbmNlJztcblxuY2xhc3MgRnJhbWUgZXh0ZW5kcyBNZXNzYWdlIHt9XG5jbGFzcyBCZWhhdmlvdXIgZXh0ZW5kcyBNZXNzYWdlIHt9XG5cbmNvbnN0IGd0MCA9IChtZXNzYWdlcywgZnJhbWVzKSA9PlxuICAgIChtZXNzYWdlcy5sZW5ndGggPiAwKSAmJiAoZnJhbWVzLmxlbmd0aCA+IDApO1xuXG5jb25zdCBleGVjID0gKHsgbWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCB9KSA9PiB7XG5cbiAgICBsZXQgeyBtZXNzYWdlIH0gPSBtZXNzYWdlcy5zaGlmdCgpO1xuICAgIGxldCB7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCwgbmFtZSB9ID0gZnJhbWVzLnNoaWZ0KCk7XG5cbiAgICBzZWxmLnRlbGwobmV3IEJlaGF2aW91cih7IGJlY29tZTogYnVzeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSB9KSk7XG5cbiAgICBQcm9taXNlLnRyeSgoKSA9PiB7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IHJlY2VpdmUuY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcblxuICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcblxuICAgICAgICAgICAgZnJhbWVzLnVuc2hpZnQobmV3IEZyYW1lKHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pKTtcblxuICAgICAgICAgICAgcm9vdC50ZWxsKG5ldyBNZXNzYWdlVW5oYW5kbGVkRXZlbnQoeyBtZXNzYWdlLCBwYXRoOiBjb250ZXh0LnBhdGgoKSwgbmFtZSB9KSk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9UaGUgcmVzdWx0IGlzIGEgUHJvbWlzZS9UaGVuYWJsZSBhbmQgd2UgZG9uJ3Qgd2FudFxuICAgICAgICAgICAgLy90byB3YWl0IHVudGlsIGl0IGZpbmlzaGVkIHRvIHByb2Nlc3MgdGhlIG5leHQgZnJhbWUuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSB9KSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgICAgICAgcm9vdC50ZWxsKG5ldyBNZXNzYWdlSGFuZGxlZEV2ZW50KHsgcGF0aDogY29udGV4dC5wYXRoKCksIG1lc3NhZ2UsIG5hbWUgfSkpO1xuXG4gICAgICAgIH1cblxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcblxuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICBjb250ZXh0LnBhcmVudCgpLnRlbGwobmV3IFByb2JsZW0oZXJyb3IsIGNvbnRleHQsIG1lc3NhZ2UpKTtcblxuICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuXG4gICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgaWYgKGZyYW1lcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBleGVjKHsgbWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZi50ZWxsKG5ldyBCZWhhdmlvdXIoeyBiZWNvbWU6IHJlYWR5KG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QpIH0pKVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbnVsbDtcblxufTtcblxuY29uc3QgYnVzeSA9IChtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSA9PlxuXG4gICAgYW55KFxuICAgICAgICB0eXBlKEZyYW1lLCBmcmFtZSA9PlxuICAgICAgICAgICAgKGZyYW1lcy5wdXNoKGZyYW1lKSxcbiAgICAgICAgICAgICAgICByb290LnRlbGwobmV3IFJlY2VpdmVFdmVudCh7IG5hbWU6IGZyYW1lLm5hbWUsIHBhdGg6IGZyYW1lLmNvbnRleHQucGF0aCgpIH0pKSkpLFxuXG4gICAgICAgIHR5cGUoRW52ZWxvcGUsIGVudiA9PlxuICAgICAgICAgICAgKG1lc3NhZ2VzLnB1c2goZW52KSwgcm9vdC50ZWxsKG5ldyBNZXNzYWdlRXZlbnQoZW52KSkpKSk7XG5cblxuY29uc3QgcmVhZHkgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgPT5cbiAgICBhbnkoXG4gICAgICAgIHR5cGUoRnJhbWUsIGZyYW1lID0+XG4gICAgICAgICAgICAoZnJhbWVzLnB1c2goZnJhbWUpLFxuICAgICAgICAgICAgICAgIHJvb3QudGVsbChuZXcgUmVjZWl2ZUV2ZW50KHsgbmFtZTogZnJhbWUubmFtZSwgcGF0aDogZnJhbWUuY29udGV4dC5wYXRoKCkgfSkpLFxuICAgICAgICAgICAgICAgIChndDAobWVzc2FnZXMsIGZyYW1lcykpID8gZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgOiBPSykpLFxuXG4gICAgICAgIHR5cGUoRW52ZWxvcGUsIGVudiA9PlxuICAgICAgICAgICAgKG1lc3NhZ2VzLnB1c2goZW52KSxcbiAgICAgICAgICAgICAgICByb290LnRlbGwobmV3IE1lc3NhZ2VFdmVudChlbnYpKSxcbiAgICAgICAgICAgICAgICAoZ3QwKG1lc3NhZ2VzLCBmcmFtZXMpKSA/XG4gICAgICAgICAgICAgICAgZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgOiBPSykpKTtcblxuLyoqXG4gKiBTZXF1ZW50aWFsRGlzcGF0Y2hlciBleGVjdXRlcyByZWNlaXZlcyBpbiB0aGUgb3JkZXIgdGhleSBhcmUgc2NoZWR1bGVkIGluIHRoZSBzYW1lXG4gKiBydW50aW1lIGFzIHRoZSBldmVudCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW50aWFsRGlzcGF0Y2hlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihyb290KSB7XG5cbiAgICAgICAgYmVvZih7IHJvb3QgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXhlY3V0b3IgPSByZWFkeShbXSwgW10sIHRoaXMsIHJvb3QpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBCZWhhdmlvdXIpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IgPSBtZXNzYWdlLmJlY29tZTtcblxuICAgICAgICB0aGlzLl9leGVjdXRvcihtZXNzYWdlKTtcblxuICAgIH1cblxuICAgIGFzayh7IHJlY2VpdmUsIGNvbnRleHQsIHRpbWUgPSAwLCBuYW1lID0gJycgfSkge1xuXG4gICAgICAgIGJlb2YoeyByZWNlaXZlIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgICB0aGlzLl9leGVjdXRvcihuZXcgRnJhbWUoeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QsIG5hbWUgfSkpKTtcblxuICAgICAgICByZXR1cm4gKHRpbWUgPiAwKSA/IHAudGltZW91dCh0aW1lKSA6IHA7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VxdWVudGlhbERpc3BhdGNoZXJcbiJdfQ==