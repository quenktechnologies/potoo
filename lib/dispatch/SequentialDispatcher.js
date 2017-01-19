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

var _Message4 = require('./Message');

var _Message5 = _interopRequireDefault(_Message4);

var _UnhandledMessage = require('./UnhandledMessage');

var _UnhandledMessage2 = _interopRequireDefault(_UnhandledMessage);

var _funcs = require('../funcs');

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
}(_Message5.default);

var Envelope = function (_Message2) {
    _inherits(Envelope, _Message2);

    function Envelope() {
        _classCallCheck(this, Envelope);

        return _possibleConstructorReturn(this, (Envelope.__proto__ || Object.getPrototypeOf(Envelope)).apply(this, arguments));
    }

    return Envelope;
}(_Message5.default);

var Behaviour = function (_Message3) {
    _inherits(Behaviour, _Message3);

    function Behaviour() {
        _classCallCheck(this, Behaviour);

        return _possibleConstructorReturn(this, (Behaviour.__proto__ || Object.getPrototypeOf(Behaviour)).apply(this, arguments));
    }

    return Behaviour;
}(_Message5.default);

var gt0 = function gt0(messages, frames) {
    return messages.length > 0 && frames.length > 0;
};

var exec = function exec(_ref) {
    var messages = _ref.messages,
        frames = _ref.frames,
        self = _ref.self;


    var message = messages.shift();

    var _frames$shift = frames.shift(),
        receive = _frames$shift.receive,
        context = _frames$shift.context,
        resolve = _frames$shift.resolve,
        reject = _frames$shift.reject;

    self.tell(new Behaviour({ become: busy(messages, frames, self) }));

    _bluebird2.default.try(function () {

        var result = receive.call(context, message);

        if (result == null) {

            context.root().tell(new _UnhandledMessage2.default({
                message: message,
                to: context.path()
            }));

            frames.unshift(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject }));
        } else {

            //The result is a promise/Thenable and we don't want
            //to wait until it finished to process the next frame.
            if (typeof result.then === 'function') self.tell(new Behaviour({ become: ready(messages, frames, self) }));

            resolve(result);
        }
    }).catch(function (error) {

        reject(error);
        context.parent().tell(new _Problem2.default(error, context, message));
    }).finally(function () {

        if (messages.length > 0) if (frames.length > 0) return exec({ messages: messages, frames: frames, self: self });

        return self.tell(new Behaviour({ become: ready(messages, frames, self) }));
    });

    return null;
};

var busy = function busy(messages, frames, self) {
    return (0, _funcs.or)((0, _funcs.insof)(Frame, function (f) {
        return frames.push(f);
    }), (0, _funcs.insof)(Envelope, function (env) {
        return messages.push(env.message);
    }));
};

var ready = function ready(messages, frames, self) {
    return (0, _funcs.or)((0, _funcs.insof)(Frame, function (frame) {
        return frames.push(frame), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self }) : _funcs.OK;
    }), (0, _funcs.insof)(Envelope, function (env) {
        return messages.push(env.message), gt0(messages, frames) ? exec({ messages: messages, frames: frames, self: self }) : _funcs.OK;
    }));
};

/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */

var SequentialDispatcher = exports.SequentialDispatcher = function () {
    function SequentialDispatcher(parent, context) {
        _classCallCheck(this, SequentialDispatcher);

        this._stack = [];
        this._order = [];
        this._messages = [];
        this._executor = ready([], [], this);
    }

    _createClass(SequentialDispatcher, [{
        key: 'tell',
        value: function tell(message) {

            if (message instanceof Behaviour) return this._executor = message.become;

            this._executor(new Envelope({ message: message }));
        }
    }, {
        key: 'ask',
        value: function ask(_ref2) {
            var _this4 = this;

            var receive = _ref2.receive,
                context = _ref2.context,
                _ref2$time = _ref2.time,
                time = _ref2$time === undefined ? 0 : _ref2$time;


            (0, _beof2.default)({ receive: receive }).interface(_Callable2.default);
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var p = new _bluebird2.default(function (resolve, reject) {
                return _this4._executor(new Frame({ receive: receive, context: context, resolve: resolve, reject: reject }));
            });

            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJGcmFtZSIsIkVudmVsb3BlIiwiQmVoYXZpb3VyIiwiZ3QwIiwibWVzc2FnZXMiLCJmcmFtZXMiLCJsZW5ndGgiLCJleGVjIiwic2VsZiIsIm1lc3NhZ2UiLCJzaGlmdCIsInJlY2VpdmUiLCJjb250ZXh0IiwicmVzb2x2ZSIsInJlamVjdCIsInRlbGwiLCJiZWNvbWUiLCJidXN5IiwidHJ5IiwicmVzdWx0IiwiY2FsbCIsInJvb3QiLCJ0byIsInBhdGgiLCJ1bnNoaWZ0IiwidGhlbiIsInJlYWR5IiwiY2F0Y2giLCJlcnJvciIsInBhcmVudCIsImZpbmFsbHkiLCJwdXNoIiwiZiIsImVudiIsImZyYW1lIiwiU2VxdWVudGlhbERpc3BhdGNoZXIiLCJfc3RhY2siLCJfb3JkZXIiLCJfbWVzc2FnZXMiLCJfZXhlY3V0b3IiLCJ0aW1lIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJudW1iZXIiLCJwIiwidGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVNQSxLOzs7Ozs7Ozs7Ozs7SUFDQUMsUTs7Ozs7Ozs7Ozs7O0lBQ0FDLFM7Ozs7Ozs7Ozs7OztBQUVOLElBQU1DLE1BQU0sU0FBTkEsR0FBTSxDQUFDQyxRQUFELEVBQVdDLE1BQVg7QUFBQSxXQUNQRCxTQUFTRSxNQUFULEdBQWtCLENBQW5CLElBQTBCRCxPQUFPQyxNQUFQLEdBQWdCLENBRGxDO0FBQUEsQ0FBWjs7QUFHQSxJQUFNQyxPQUFPLFNBQVBBLElBQU8sT0FBZ0M7QUFBQSxRQUE3QkgsUUFBNkIsUUFBN0JBLFFBQTZCO0FBQUEsUUFBbkJDLE1BQW1CLFFBQW5CQSxNQUFtQjtBQUFBLFFBQVhHLElBQVcsUUFBWEEsSUFBVzs7O0FBRXpDLFFBQUlDLFVBQVVMLFNBQVNNLEtBQVQsRUFBZDs7QUFGeUMsd0JBR0dMLE9BQU9LLEtBQVAsRUFISDtBQUFBLFFBR25DQyxPQUhtQyxpQkFHbkNBLE9BSG1DO0FBQUEsUUFHMUJDLE9BSDBCLGlCQUcxQkEsT0FIMEI7QUFBQSxRQUdqQkMsT0FIaUIsaUJBR2pCQSxPQUhpQjtBQUFBLFFBR1JDLE1BSFEsaUJBR1JBLE1BSFE7O0FBS3pDTixTQUFLTyxJQUFMLENBQVUsSUFBSWIsU0FBSixDQUFjLEVBQUVjLFFBQVFDLEtBQUtiLFFBQUwsRUFBZUMsTUFBZixFQUF1QkcsSUFBdkIsQ0FBVixFQUFkLENBQVY7O0FBRUQsdUJBQVFVLEdBQVIsQ0FBWSxZQUFNOztBQUViLFlBQUlDLFNBQVNSLFFBQVFTLElBQVIsQ0FBYVIsT0FBYixFQUFzQkgsT0FBdEIsQ0FBYjs7QUFFQSxZQUFJVSxVQUFVLElBQWQsRUFBb0I7O0FBRWhCUCxvQkFBUVMsSUFBUixHQUFlTixJQUFmLENBQW9CLCtCQUFxQjtBQUNyQ04sZ0NBRHFDO0FBRXJDYSxvQkFBSVYsUUFBUVcsSUFBUjtBQUZpQyxhQUFyQixDQUFwQjs7QUFLQWxCLG1CQUFPbUIsT0FBUCxDQUFlLElBQUl4QixLQUFKLENBQVUsRUFBRVcsZ0JBQUYsRUFBV0MsZ0JBQVgsRUFBb0JDLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBVixDQUFmO0FBRUgsU0FURCxNQVNPOztBQUVIO0FBQ0E7QUFDQSxnQkFBSSxPQUFPSyxPQUFPTSxJQUFkLEtBQXVCLFVBQTNCLEVBQ0lqQixLQUFLTyxJQUFMLENBQVUsSUFBSWIsU0FBSixDQUFjLEVBQUVjLFFBQVFVLE1BQU10QixRQUFOLEVBQWdCQyxNQUFoQixFQUF3QkcsSUFBeEIsQ0FBVixFQUFkLENBQVY7O0FBRUpLLG9CQUFRTSxNQUFSO0FBRUg7QUFFSixLQXhCRixFQXdCSVEsS0F4QkosQ0F3QlUsaUJBQVM7O0FBRWRiLGVBQU9jLEtBQVA7QUFDQWhCLGdCQUFRaUIsTUFBUixHQUFpQmQsSUFBakIsQ0FBc0Isc0JBQVlhLEtBQVosRUFBbUJoQixPQUFuQixFQUE0QkgsT0FBNUIsQ0FBdEI7QUFFSCxLQTdCRixFQTZCSXFCLE9BN0JKLENBNkJZLFlBQU07O0FBRWIsWUFBSTFCLFNBQVNFLE1BQVQsR0FBa0IsQ0FBdEIsRUFDSSxJQUFJRCxPQUFPQyxNQUFQLEdBQWdCLENBQXBCLEVBQ0ksT0FBT0MsS0FBSyxFQUFFSCxrQkFBRixFQUFZQyxjQUFaLEVBQW9CRyxVQUFwQixFQUFMLENBQVA7O0FBRVIsZUFBT0EsS0FBS08sSUFBTCxDQUFVLElBQUliLFNBQUosQ0FBYyxFQUFFYyxRQUFRVSxNQUFNdEIsUUFBTixFQUFnQkMsTUFBaEIsRUFBd0JHLElBQXhCLENBQVYsRUFBZCxDQUFWLENBQVA7QUFFSCxLQXJDRjs7QUF1Q0MsV0FBTyxJQUFQO0FBRUgsQ0FoREQ7O0FBa0RBLElBQU1TLE9BQU8sU0FBUEEsSUFBTyxDQUFDYixRQUFELEVBQVdDLE1BQVgsRUFBbUJHLElBQW5CO0FBQUEsV0FDVCxlQUFHLGtCQUFNUixLQUFOLEVBQWE7QUFBQSxlQUFLSyxPQUFPMEIsSUFBUCxDQUFZQyxDQUFaLENBQUw7QUFBQSxLQUFiLENBQUgsRUFDSSxrQkFBTS9CLFFBQU4sRUFBZ0I7QUFBQSxlQUFPRyxTQUFTMkIsSUFBVCxDQUFjRSxJQUFJeEIsT0FBbEIsQ0FBUDtBQUFBLEtBQWhCLENBREosQ0FEUztBQUFBLENBQWI7O0FBSUEsSUFBTWlCLFFBQVEsU0FBUkEsS0FBUSxDQUFDdEIsUUFBRCxFQUFXQyxNQUFYLEVBQW1CRyxJQUFuQjtBQUFBLFdBQ1YsZUFDSSxrQkFBTVIsS0FBTixFQUFhO0FBQUEsZUFDUkssT0FBTzBCLElBQVAsQ0FBWUcsS0FBWixHQUFxQi9CLElBQUlDLFFBQUosRUFBY0MsTUFBZCxDQUFELEdBQ2pCRSxLQUFLLEVBQUVILGtCQUFGLEVBQVlDLGNBQVosRUFBb0JHLFVBQXBCLEVBQUwsQ0FEaUIsWUFEWjtBQUFBLEtBQWIsQ0FESixFQUtJLGtCQUNJUCxRQURKLEVBQ2M7QUFBQSxlQUNURyxTQUFTMkIsSUFBVCxDQUFjRSxJQUFJeEIsT0FBbEIsR0FBNkJOLElBQUlDLFFBQUosRUFBY0MsTUFBZCxDQUFELEdBQ3pCRSxLQUFLLEVBQUVILGtCQUFGLEVBQVlDLGNBQVosRUFBb0JHLFVBQXBCLEVBQUwsQ0FEeUIsWUFEbkI7QUFBQSxLQURkLENBTEosQ0FEVTtBQUFBLENBQWQ7O0FBWUE7Ozs7O0lBSWEyQixvQixXQUFBQSxvQjtBQUVULGtDQUFZTixNQUFaLEVBQW9CakIsT0FBcEIsRUFBNkI7QUFBQTs7QUFFekIsYUFBS3dCLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQmIsTUFBTSxFQUFOLEVBQVUsRUFBVixFQUFjLElBQWQsQ0FBakI7QUFFSDs7Ozs2QkFFSWpCLE8sRUFBUzs7QUFFVixnQkFBSUEsbUJBQW1CUCxTQUF2QixFQUNJLE9BQU8sS0FBS3FDLFNBQUwsR0FBaUI5QixRQUFRTyxNQUFoQzs7QUFFSixpQkFBS3VCLFNBQUwsQ0FBZSxJQUFJdEMsUUFBSixDQUFhLEVBQUVRLGdCQUFGLEVBQWIsQ0FBZjtBQUVIOzs7bUNBRW1DO0FBQUE7O0FBQUEsZ0JBQTlCRSxPQUE4QixTQUE5QkEsT0FBOEI7QUFBQSxnQkFBckJDLE9BQXFCLFNBQXJCQSxPQUFxQjtBQUFBLG1DQUFaNEIsSUFBWTtBQUFBLGdCQUFaQSxJQUFZLDhCQUFMLENBQUs7OztBQUVoQyxnQ0FBSyxFQUFFN0IsZ0JBQUYsRUFBTCxFQUFrQjhCLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRTdCLGdCQUFGLEVBQUwsRUFBa0I2QixTQUFsQjtBQUNBLGdDQUFLLEVBQUVELFVBQUYsRUFBTCxFQUFlRSxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxnQkFBSUMsSUFBSSx1QkFBWSxVQUFDL0IsT0FBRCxFQUFVQyxNQUFWO0FBQUEsdUJBQ2hCLE9BQUt5QixTQUFMLENBQWUsSUFBSXZDLEtBQUosQ0FBVSxFQUFFVyxnQkFBRixFQUFXQyxnQkFBWCxFQUFvQkMsZ0JBQXBCLEVBQTZCQyxjQUE3QixFQUFWLENBQWYsQ0FEZ0I7QUFBQSxhQUFaLENBQVI7O0FBR0EsbUJBQVEwQixPQUFPLENBQVIsR0FBYUksRUFBRUMsT0FBRixDQUFVTCxJQUFWLENBQWIsR0FBK0JJLENBQXRDO0FBRUg7Ozs7OztrQkFJVVQsb0IiLCJmaWxlIjoiU2VxdWVudGlhbERpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4uL0NhbGxhYmxlJztcbmltcG9ydCBQcm9ibGVtIGZyb20gJy4vUHJvYmxlbSc7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL01lc3NhZ2UnO1xuaW1wb3J0IFVuaGFuZGxlZE1lc3NhZ2UgZnJvbSAnLi9VbmhhbmRsZWRNZXNzYWdlJztcbmltcG9ydCB7IG9yLCBpbnNvZiwgcmVxdWlyZWQsIE9LIH0gZnJvbSAnLi4vZnVuY3MnO1xuXG5jbGFzcyBGcmFtZSBleHRlbmRzIE1lc3NhZ2Uge31cbmNsYXNzIEVudmVsb3BlIGV4dGVuZHMgTWVzc2FnZSB7fVxuY2xhc3MgQmVoYXZpb3VyIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG5jb25zdCBndDAgPSAobWVzc2FnZXMsIGZyYW1lcykgPT5cbiAgICAobWVzc2FnZXMubGVuZ3RoID4gMCkgJiYgKGZyYW1lcy5sZW5ndGggPiAwKTtcblxuY29uc3QgZXhlYyA9ICh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYgfSkgPT4ge1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBtZXNzYWdlcy5zaGlmdCgpO1xuICAgIGxldCB7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9ID0gZnJhbWVzLnNoaWZ0KCk7XG5cbiAgICBzZWxmLnRlbGwobmV3IEJlaGF2aW91cih7IGJlY29tZTogYnVzeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmKSB9KSk7XG5cbiAgIFByb21pc2UudHJ5KCgpID0+IHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVjZWl2ZS5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBjb250ZXh0LnJvb3QoKS50ZWxsKG5ldyBVbmhhbmRsZWRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHRvOiBjb250ZXh0LnBhdGgoKVxuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgICAgIGZyYW1lcy51bnNoaWZ0KG5ldyBGcmFtZSh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9UaGUgcmVzdWx0IGlzIGEgcHJvbWlzZS9UaGVuYWJsZSBhbmQgd2UgZG9uJ3Qgd2FudFxuICAgICAgICAgICAgLy90byB3YWl0IHVudGlsIGl0IGZpbmlzaGVkIHRvIHByb2Nlc3MgdGhlIG5leHQgZnJhbWUuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmKSB9KSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgICB9XG5cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG5cbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgY29udGV4dC5wYXJlbnQoKS50ZWxsKG5ldyBQcm9ibGVtKGVycm9yLCBjb250ZXh0LCBtZXNzYWdlKSk7XG5cbiAgICB9KS5maW5hbGx5KCgpID0+IHtcblxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGlmIChmcmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGYudGVsbChuZXcgQmVoYXZpb3VyKHsgYmVjb21lOiByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBzZWxmKSB9KSlcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG51bGw7XG5cbn07XG5cbmNvbnN0IGJ1c3kgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZikgPT5cbiAgICBvcihpbnNvZihGcmFtZSwgZiA9PiBmcmFtZXMucHVzaChmKSksXG4gICAgICAgIGluc29mKEVudmVsb3BlLCBlbnYgPT4gbWVzc2FnZXMucHVzaChlbnYubWVzc2FnZSkpKTtcblxuY29uc3QgcmVhZHkgPSAobWVzc2FnZXMsIGZyYW1lcywgc2VsZikgPT5cbiAgICBvcihcbiAgICAgICAgaW5zb2YoRnJhbWUsIGZyYW1lID0+XG4gICAgICAgICAgICAoZnJhbWVzLnB1c2goZnJhbWUpLCAoZ3QwKG1lc3NhZ2VzLCBmcmFtZXMpKSA/XG4gICAgICAgICAgICAgICAgZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYgfSkgOiBPSykpLFxuXG4gICAgICAgIGluc29mKFxuICAgICAgICAgICAgRW52ZWxvcGUsIGVudiA9PlxuICAgICAgICAgICAgKG1lc3NhZ2VzLnB1c2goZW52Lm1lc3NhZ2UpLCAoZ3QwKG1lc3NhZ2VzLCBmcmFtZXMpKSA/XG4gICAgICAgICAgICAgICAgZXhlYyh7IG1lc3NhZ2VzLCBmcmFtZXMsIHNlbGYgfSkgOiBPSykpKVxuXG5cbi8qKlxuICogU2VxdWVudGlhbERpc3BhdGNoZXIgZXhlY3V0ZXMgcmVjZWl2ZXMgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHNjaGVkdWxlZCBpbiB0aGUgc2FtZVxuICogcnVudGltZSBhcyB0aGUgZXZlbnQgc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgU2VxdWVudGlhbERpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBjb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXhlY3V0b3IgPSByZWFkeShbXSwgW10sIHRoaXMpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBCZWhhdmlvdXIpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IgPSBtZXNzYWdlLmJlY29tZTtcblxuICAgICAgICB0aGlzLl9leGVjdXRvcihuZXcgRW52ZWxvcGUoeyBtZXNzYWdlIH0pKTtcblxuICAgIH1cblxuICAgIGFzayh7IHJlY2VpdmUsIGNvbnRleHQsIHRpbWUgPSAwIH0pIHtcblxuICAgICAgICBiZW9mKHsgcmVjZWl2ZSB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0b3IobmV3IEZyYW1lKHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pKSk7XG5cbiAgICAgICAgcmV0dXJuICh0aW1lID4gMCkgPyBwLnRpbWVvdXQodGltZSkgOiBwO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcXVlbnRpYWxEaXNwYXRjaGVyXG4iXX0=