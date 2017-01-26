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
    return (0, _funcs.or)((0, _funcs.insof)(Frame, function (frame) {
        return frames.push(frame), root.tell(new _events.ReceiveEvent({ name: frame.name, path: frame.context.path() }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJGcmFtZSIsIkJlaGF2aW91ciIsImd0MCIsIm1lc3NhZ2VzIiwiZnJhbWVzIiwibGVuZ3RoIiwiZXhlYyIsInNlbGYiLCJyb290Iiwic2hpZnQiLCJtZXNzYWdlIiwicmVjZWl2ZSIsImNvbnRleHQiLCJyZXNvbHZlIiwicmVqZWN0IiwibmFtZSIsInRlbGwiLCJiZWNvbWUiLCJidXN5IiwidHJ5IiwicmVzdWx0IiwiY2FsbCIsInVuc2hpZnQiLCJwYXRoIiwidGhlbiIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsInBhcmVudCIsImZpbmFsbHkiLCJwdXNoIiwiZnJhbWUiLCJlbnYiLCJTZXF1ZW50aWFsRGlzcGF0Y2hlciIsImludGVyZmFjZSIsIl9zdGFjayIsIl9vcmRlciIsIl9tZXNzYWdlcyIsIl9leGVjdXRvciIsInRpbWUiLCJvcHRpb25hbCIsIm51bWJlciIsInAiLCJ0aW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsSzs7Ozs7Ozs7Ozs7O0lBQ0FDLFM7Ozs7Ozs7Ozs7OztBQUVOLElBQU1DLE1BQU0sU0FBTkEsR0FBTSxDQUFDQyxRQUFELEVBQVdDLE1BQVg7QUFBQSxXQUNQRCxTQUFTRSxNQUFULEdBQWtCLENBQW5CLElBQTBCRCxPQUFPQyxNQUFQLEdBQWdCLENBRGxDO0FBQUEsQ0FBWjs7QUFHQSxJQUFNQyxPQUFPLFNBQVBBLElBQU8sT0FBc0M7QUFBQSxRQUFuQ0gsUUFBbUMsUUFBbkNBLFFBQW1DO0FBQUEsUUFBekJDLE1BQXlCLFFBQXpCQSxNQUF5QjtBQUFBLFFBQWpCRyxJQUFpQixRQUFqQkEsSUFBaUI7QUFBQSxRQUFYQyxJQUFXLFFBQVhBLElBQVc7O0FBQUEsMEJB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O0FBRUg7Ozs7NkJBRUlFLE8sRUFBUzs7QUFFVixnQkFBSUEsbUJBQW1CVCxTQUF2QixFQUNJLE9BQU8sS0FBS3FDLFNBQUwsR0FBaUI1QixRQUFRTyxNQUFoQzs7QUFFSixpQkFBS3FCLFNBQUwsQ0FBZTVCLE9BQWY7QUFFSDs7O21DQUU4QztBQUFBOztBQUFBLGdCQUF6Q0MsT0FBeUMsU0FBekNBLE9BQXlDO0FBQUEsZ0JBQWhDQyxPQUFnQyxTQUFoQ0EsT0FBZ0M7QUFBQSxtQ0FBdkIyQixJQUF1QjtBQUFBLGdCQUF2QkEsSUFBdUIsOEJBQWhCLENBQWdCO0FBQUEsbUNBQWJ4QixJQUFhO0FBQUEsZ0JBQWJBLElBQWEsOEJBQU4sRUFBTTs7O0FBRTNDLGdDQUFLLEVBQUVKLGdCQUFGLEVBQUwsRUFBa0J1QixTQUFsQjtBQUNBLGdDQUFLLEVBQUV0QixnQkFBRixFQUFMLEVBQWtCc0IsU0FBbEI7QUFDQSxnQ0FBSyxFQUFFSyxVQUFGLEVBQUwsRUFBZUMsUUFBZixHQUEwQkMsTUFBMUI7O0FBRUEsZ0JBQUlDLElBQUksdUJBQVksVUFBQzdCLE9BQUQsRUFBVUMsTUFBVjtBQUFBLHVCQUNoQixPQUFLd0IsU0FBTCxDQUFlLElBQUl0QyxLQUFKLENBQVUsRUFBRVcsZ0JBQUYsRUFBV0MsZ0JBQVgsRUFBb0JDLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBcUNDLFVBQXJDLEVBQVYsQ0FBZixDQURnQjtBQUFBLGFBQVosQ0FBUjs7QUFHQSxtQkFBUXdCLE9BQU8sQ0FBUixHQUFhRyxFQUFFQyxPQUFGLENBQVVKLElBQVYsQ0FBYixHQUErQkcsQ0FBdEM7QUFFSDs7Ozs7O2tCQUlVVCxvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuaW1wb3J0IFByb2JsZW0gZnJvbSAnLi9Qcm9ibGVtJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgRW52ZWxvcGUgZnJvbSAnLi9FbnZlbG9wZSc7XG5pbXBvcnQgeyBvciwgaW5zb2YsIHJlcXVpcmVkLCBPSyB9IGZyb20gJy4uL2Z1bmNzJztcbmltcG9ydCB7IFJlY2VpdmVFdmVudCwgTWVzc2FnZUV2ZW50LCBNZXNzYWdlVW5oYW5kbGVkRXZlbnQsIE1lc3NhZ2VIYW5kbGVkRXZlbnQgfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5cbmNsYXNzIEZyYW1lIGV4dGVuZHMgTWVzc2FnZSB7fVxuY2xhc3MgQmVoYXZpb3VyIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG5jb25zdCBndDAgPSAobWVzc2FnZXMsIGZyYW1lcykgPT5cbiAgICAobWVzc2FnZXMubGVuZ3RoID4gMCkgJiYgKGZyYW1lcy5sZW5ndGggPiAwKTtcblxuY29uc3QgZXhlYyA9ICh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgPT4ge1xuXG4gICAgbGV0IHsgbWVzc2FnZSB9ID0gbWVzc2FnZXMuc2hpZnQoKTtcbiAgICBsZXQgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QsIG5hbWUgfSA9IGZyYW1lcy5zaGlmdCgpO1xuXG4gICAgc2VsZi50ZWxsKG5ldyBCZWhhdmlvdXIoeyBiZWNvbWU6IGJ1c3kobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgfSkpO1xuXG4gICAgUHJvbWlzZS50cnkoKCkgPT4ge1xuXG4gICAgICAgIGxldCByZXN1bHQgPSByZWNlaXZlLmNhbGwoY29udGV4dCwgbWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG5cbiAgICAgICAgICAgIGZyYW1lcy51bnNoaWZ0KG5ldyBGcmFtZSh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG5cbiAgICAgICAgICAgIHJvb3QudGVsbChuZXcgTWVzc2FnZVVuaGFuZGxlZEV2ZW50KHsgbWVzc2FnZSwgcGF0aDogY29udGV4dC5wYXRoKCksIG5hbWUgfSkpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vVGhlIHJlc3VsdCBpcyBhIFByb21pc2UvVGhlbmFibGUgYW5kIHdlIGRvbid0IHdhbnRcbiAgICAgICAgICAgIC8vdG8gd2FpdCB1bnRpbCBpdCBmaW5pc2hlZCB0byBwcm9jZXNzIHRoZSBuZXh0IGZyYW1lLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBzZWxmLnRlbGwobmV3IEJlaGF2aW91cih7IGJlY29tZTogcmVhZHkobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgfSkpO1xuXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIHJvb3QudGVsbChuZXcgTWVzc2FnZUhhbmRsZWRFdmVudCh7IHBhdGg6IGNvbnRleHQucGF0aCgpLCBtZXNzYWdlLCBuYW1lIH0pKTtcblxuICAgICAgICB9XG5cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG5cbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgY29udGV4dC5wYXJlbnQoKS50ZWxsKG5ldyBQcm9ibGVtKGVycm9yLCBjb250ZXh0LCBtZXNzYWdlKSk7XG5cbiAgICB9KS5maW5hbGx5KCgpID0+IHtcblxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGlmIChmcmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmLCByb290KSB9KSlcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG51bGw7XG5cbn07XG5cbmNvbnN0IGJ1c3kgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgPT5cbiAgICBvcihpbnNvZihGcmFtZSwgZnJhbWUgPT5cbiAgICAgICAgICAgIChmcmFtZXMucHVzaChmcmFtZSksXG4gICAgICAgICAgICAgICAgcm9vdC50ZWxsKG5ldyBSZWNlaXZlRXZlbnQoeyBuYW1lOmZyYW1lLm5hbWUsIHBhdGg6IGZyYW1lLmNvbnRleHQucGF0aCgpLCB9KSkpKSxcbiAgICAgICAgaW5zb2YoRW52ZWxvcGUsIGVudiA9PiAobWVzc2FnZXMucHVzaChlbnYpLCByb290LnRlbGwobmV3IE1lc3NhZ2VFdmVudChlbnYpKSkpKTtcblxuY29uc3QgcmVhZHkgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCkgPT5cbiAgICBvcihcbiAgICAgICAgaW5zb2YoRnJhbWUsIGZyYW1lID0+XG4gICAgICAgICAgICAoZnJhbWVzLnB1c2goZnJhbWUpLCAoZ3QwKG1lc3NhZ2VzLCBmcmFtZXMpKSA/XG4gICAgICAgICAgICAgICAgZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYsIHJvb3QgfSkgOiBPSyxcbiAgICAgICAgICAgICAgICByb290LnRlbGwobmV3IFJlY2VpdmVFdmVudCh7IHBhdGg6IGZyYW1lLmNvbnRleHQucGF0aCgpIH0pKSkpLFxuXG4gICAgICAgIGluc29mKEVudmVsb3BlLCBlbnYgPT5cbiAgICAgICAgICAgIChtZXNzYWdlcy5wdXNoKGVudiksIChndDAobWVzc2FnZXMsIGZyYW1lcykpID9cbiAgICAgICAgICAgICAgICBleGVjKHsgbWVzc2FnZXMsIGZyYW1lcywgc2VsZiwgcm9vdCB9KSA6IE9LLCByb290LnRlbGwobmV3IE1lc3NhZ2VFdmVudChlbnYpKSkpKVxuXG5cbi8qKlxuICogU2VxdWVudGlhbERpc3BhdGNoZXIgZXhlY3V0ZXMgcmVjZWl2ZXMgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHNjaGVkdWxlZCBpbiB0aGUgc2FtZVxuICogcnVudGltZSBhcyB0aGUgZXZlbnQgc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgU2VxdWVudGlhbERpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3Iocm9vdCkge1xuXG4gICAgICAgIGJlb2YoeyByb290IH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yID0gcmVhZHkoW10sIFtdLCB0aGlzLCByb290KTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSkge1xuXG4gICAgICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgQmVoYXZpb3VyKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4ZWN1dG9yID0gbWVzc2FnZS5iZWNvbWU7XG5cbiAgICAgICAgdGhpcy5fZXhlY3V0b3IobWVzc2FnZSk7XG5cbiAgICB9XG5cbiAgICBhc2soeyByZWNlaXZlLCBjb250ZXh0LCB0aW1lID0gMCwgbmFtZSA9ICcnIH0pIHtcblxuICAgICAgICBiZW9mKHsgcmVjZWl2ZSB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0b3IobmV3IEZyYW1lKHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0LCBuYW1lIH0pKSk7XG5cbiAgICAgICAgcmV0dXJuICh0aW1lID4gMCkgPyBwLnRpbWVvdXQodGltZSkgOiBwO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcXVlbnRpYWxEaXNwYXRjaGVyXG4iXX0=