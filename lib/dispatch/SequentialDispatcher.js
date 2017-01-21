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
        reject = _frames$shift.reject;

    self.tell(new Behaviour({ become: busy(messages, frames, self, root) }));

    _bluebird2.default.try(function () {

        var result = receive.call(context, message);

        if (result == null) {

            frames.unshift(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject }));

            root.tell(new _events.MessageUnhandledEvent({ message: message, path: context.path() }));
        } else {

            //The result is a Promise/Thenable and we don't want
            //to wait until it finished to process the next frame.
            if (typeof result.then === 'function') self.tell(new Behaviour({ become: ready(messages, frames, self, root) }));

            resolve(result);

            root.tell(new _events.MessageHandledEvent({ path: context.path(), message: message }));
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
    return (0, _funcs.or)((0, _funcs.insof)(Frame, function (frame) {
        return frames.push(frame), root.tell(new _events.ReceiveEvent({ path: frame.context.path() }));
    }), (0, _funcs.insof)(_Envelope2.default, function (env) {
        return messages.push(env), root.tell(new _events.MessageEvent(env));
    }));
};

var ready = function ready(messages, frames, self, root) {
    return (0, _funcs.or)((0, _funcs.insof)(Frame, function (frame) {
        return frames.push(frame), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self, root: root }) : _funcs.OK, root.tell(new _events.ReceiveEvent({ path: frame.context.path() }));
    }), (0, _funcs.insof)(_Envelope2.default, function (env) {
        return messages.push(env), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self, root: root }) : _funcs.OK, root.tell(new _events.MessageEvent(env));
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
                time = _ref2$time === undefined ? 0 : _ref2$time;


            (0, _beof2.default)({ receive: receive }).interface(_Callable2.default);
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var p = new _bluebird2.default(function (resolve, reject) {
                return _this3._executor(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject }));
            });

            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJGcmFtZSIsIkJlaGF2aW91ciIsImd0MCIsIm1lc3NhZ2VzIiwiZnJhbWVzIiwibGVuZ3RoIiwiZXhlYyIsInNlbGYiLCJyb290Iiwic2hpZnQiLCJtZXNzYWdlIiwicmVjZWl2ZSIsImNvbnRleHQiLCJyZXNvbHZlIiwicmVqZWN0IiwidGVsbCIsImJlY29tZSIsImJ1c3kiLCJ0cnkiLCJyZXN1bHQiLCJjYWxsIiwidW5zaGlmdCIsInBhdGgiLCJ0aGVuIiwicmVhZHkiLCJjYXRjaCIsImVycm9yIiwicGFyZW50IiwiZmluYWxseSIsInB1c2giLCJmcmFtZSIsImVudiIsIlNlcXVlbnRpYWxEaXNwYXRjaGVyIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX29yZGVyIiwiX21lc3NhZ2VzIiwiX2V4ZWN1dG9yIiwidGltZSIsIm9wdGlvbmFsIiwibnVtYmVyIiwicCIsInRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxLOzs7Ozs7Ozs7Ozs7SUFDQUMsUzs7Ozs7Ozs7Ozs7O0FBRU4sSUFBTUMsTUFBTSxTQUFOQSxHQUFNLENBQUNDLFFBQUQsRUFBV0MsTUFBWDtBQUFBLFdBQ1BELFNBQVNFLE1BQVQsR0FBa0IsQ0FBbkIsSUFBMEJELE9BQU9DLE1BQVAsR0FBZ0IsQ0FEbEM7QUFBQSxDQUFaOztBQUdBLElBQU1DLE9BQU8sU0FBUEEsSUFBTyxPQUFzQztBQUFBLFFBQW5DSCxRQUFtQyxRQUFuQ0EsUUFBbUM7QUFBQSxRQUF6QkMsTUFBeUIsUUFBekJBLE1BQXlCO0FBQUEsUUFBakJHLElBQWlCLFFBQWpCQSxJQUFpQjtBQUFBLFFBQVhDLElBQVcsUUFBWEEsSUFBVzs7QUFBQSwwQkFFN0JMLFNB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O0FBRUosaUJBQUtxQixTQUFMLENBQWUzQixPQUFmO0FBRUg7OzttQ0FFbUM7QUFBQTs7QUFBQSxnQkFBOUJDLE9BQThCLFNBQTlCQSxPQUE4QjtBQUFBLGdCQUFyQkMsT0FBcUIsU0FBckJBLE9BQXFCO0FBQUEsbUNBQVowQixJQUFZO0FBQUEsZ0JBQVpBLElBQVksOEJBQUwsQ0FBSzs7O0FBRWhDLGdDQUFLLEVBQUUzQixnQkFBRixFQUFMLEVBQWtCc0IsU0FBbEI7QUFDQSxnQ0FBSyxFQUFFckIsZ0JBQUYsRUFBTCxFQUFrQnFCLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRUssVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLGdCQUFJQyxJQUFJLHVCQUFZLFVBQUM1QixPQUFELEVBQVVDLE1BQVY7QUFBQSx1QkFDaEIsT0FBS3VCLFNBQUwsQ0FBZSxJQUFJckMsS0FBSixDQUFVLEVBQUVXLGdCQUFGLEVBQVdDLGdCQUFYLEVBQW9CQyxnQkFBcEIsRUFBNkJDLGNBQTdCLEVBQVYsQ0FBZixDQURnQjtBQUFBLGFBQVosQ0FBUjs7QUFHQSxtQkFBUXdCLE9BQU8sQ0FBUixHQUFhRyxFQUFFQyxPQUFGLENBQVVKLElBQVYsQ0FBYixHQUErQkcsQ0FBdEM7QUFFSDs7Ozs7O2tCQUlVVCxvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuaW1wb3J0IFByb2JsZW0gZnJvbSAnLi9Qcm9ibGVtJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgRW52ZWxvcGUgZnJvbSAnLi9FbnZlbG9wZSc7XG5pbXBvcnQgeyBvciwgaW5zb2YsIHJlcXVpcmVkLCBPSyB9IGZyb20gJy4uL2Z1bmNzJztcbmltcG9ydCB7IFJlY2VpdmVFdmVudCwgTWVzc2FnZUV2ZW50LCBNZXNzYWdlVW5oYW5kbGVkRXZlbnQsIE1lc3NhZ2VIYW5kbGVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5cbmNsYXNzIEZyYW1lIGV4dGVuZHMgTWVzc2FnZSB7fVxuY2xhc3MgQmVoYXZpb3VyIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG5jb25zdCBndDAgPSAobWVzc2FnZXMsIGZyYW1lcykgPT5cbiAgICAobWVzc2FnZXMubGVuZ3RoID4gMCkgJiYgKGZyYW1lcy5sZW5ndGggPiAwKTtcblxuY29uc3QgZXhlYyA9ICh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgPT4ge1xuXG4gICAgbGV0IHsgbWVzc2FnZSB9ID0gbWVzc2FnZXMuc2hpZnQoKTtcbiAgICBsZXQgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSA9IGZyYW1lcy5zaGlmdCgpO1xuXG4gICAgc2VsZi50ZWxsKG5ldyBCZWhhdmlvdXIoeyBiZWNvbWU6IGJ1c3kobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgfSkpO1xuXG4gICAgUHJvbWlzZS50cnkoKCkgPT4ge1xuXG4gICAgICAgIGxldCByZXN1bHQgPSByZWNlaXZlLmNhbGwoY29udGV4dCwgbWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG5cbiAgICAgICAgICAgIGZyYW1lcy51bnNoaWZ0KG5ldyBGcmFtZSh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG5cbiAgICAgICAgICAgIHJvb3QudGVsbChuZXcgTWVzc2FnZVVuaGFuZGxlZEV2ZW50KHsgbWVzc2FnZSwgcGF0aDogY29udGV4dC5wYXRoKCkgfSkpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vVGhlIHJlc3VsdCBpcyBhIFByb21pc2UvVGhlbmFibGUgYW5kIHdlIGRvbid0IHdhbnRcbiAgICAgICAgICAgIC8vdG8gd2FpdCB1bnRpbCBpdCBmaW5pc2hlZCB0byBwcm9jZXNzIHRoZSBuZXh0IGZyYW1lLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBzZWxmLnRlbGwobmV3IEJlaGF2aW91cih7IGJlY29tZTogcmVhZHkobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgfSkpO1xuXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIHJvb3QudGVsbChuZXcgTWVzc2FnZUhhbmRsZWRFdmVudCh7IHBhdGg6IGNvbnRleHQucGF0aCgpLCBtZXNzYWdlIH0pKTtcblxuICAgICAgICB9XG5cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG5cbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgY29udGV4dC5wYXJlbnQoKS50ZWxsKG5ldyBQcm9ibGVtKGVycm9yLCBjb250ZXh0LCBtZXNzYWdlKSk7XG5cbiAgICB9KS5maW5hbGx5KCgpID0+IHtcblxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGlmIChmcmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSB9KSlcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG51bGw7XG5cbn07XG5cbmNvbnN0IGJ1c3kgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgPT5cbiAgICBvcihpbnNvZihGcmFtZSwgZnJhbWUgPT5cbiAgICAgICAgICAgIChmcmFtZXMucHVzaChmcmFtZSksIHJvb3QudGVsbChuZXcgUmVjZWl2ZUV2ZW50KHsgcGF0aDogZnJhbWUuY29udGV4dC5wYXRoKCkgfSkpKSksXG4gICAgICAgIGluc29mKEVudmVsb3BlLCBlbnYgPT4gKG1lc3NhZ2VzLnB1c2goZW52KSwgcm9vdC50ZWxsKG5ldyBNZXNzYWdlRXZlbnQoZW52KSkpKSk7XG5cbmNvbnN0IHJlYWR5ID0gKG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QpID0+XG4gICAgb3IoXG4gICAgICAgIGluc29mKEZyYW1lLCBmcmFtZSA9PlxuICAgICAgICAgICAgKGZyYW1lcy5wdXNoKGZyYW1lKSwgKGd0MChtZXNzYWdlcywgZnJhbWVzKSkgP1xuICAgICAgICAgICAgICAgIGV4ZWMoeyBtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290IH0pIDogT0ssXG4gICAgICAgICAgICAgICAgcm9vdC50ZWxsKG5ldyBSZWNlaXZlRXZlbnQoeyBwYXRoOiBmcmFtZS5jb250ZXh0LnBhdGgoKSB9KSkpKSxcblxuICAgICAgICBpbnNvZihFbnZlbG9wZSwgZW52ID0+XG4gICAgICAgICAgICAobWVzc2FnZXMucHVzaChlbnYpLCAoZ3QwKG1lc3NhZ2VzLCBmcmFtZXMpKSA/XG4gICAgICAgICAgICAgICAgZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgOiBPSywgcm9vdC50ZWxsKG5ldyBNZXNzYWdlRXZlbnQoZW52KSkpKSlcblxuXG4vKipcbiAqIFNlcXVlbnRpYWxEaXNwYXRjaGVyIGV4ZWN1dGVzIHJlY2VpdmVzIGluIHRoZSBvcmRlciB0aGV5IGFyZSBzY2hlZHVsZWQgaW4gdGhlIHNhbWVcbiAqIHJ1bnRpbWUgYXMgdGhlIGV2ZW50IHNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlcXVlbnRpYWxEaXNwYXRjaGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJvb3QpIHtcblxuICAgICAgICBiZW9mKHsgcm9vdCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9leGVjdXRvciA9IHJlYWR5KFtdLCBbXSwgdGhpcywgcm9vdCk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEJlaGF2aW91cilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGVjdXRvciA9IG1lc3NhZ2UuYmVjb21lO1xuXG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yKG1lc3NhZ2UpO1xuXG4gICAgfVxuXG4gICAgYXNrKHsgcmVjZWl2ZSwgY29udGV4dCwgdGltZSA9IDAgfSkge1xuXG4gICAgICAgIGJlb2YoeyByZWNlaXZlIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgICB0aGlzLl9leGVjdXRvcihuZXcgRnJhbWUoeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSkpKTtcblxuICAgICAgICByZXR1cm4gKHRpbWUgPiAwKSA/IHAudGltZW91dCh0aW1lKSA6IHA7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VxdWVudGlhbERpc3BhdGNoZXJcbiJdfQ==