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

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

var _UnhandledMessage = require('./UnhandledMessage');

var _UnhandledMessage2 = _interopRequireDefault(_UnhandledMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Retry = function (_Message) {
    _inherits(Retry, _Message);

    function Retry() {
        _classCallCheck(this, Retry);

        return _possibleConstructorReturn(this, (Retry.__proto__ || Object.getPrototypeOf(Retry)).apply(this, arguments));
    }

    return Retry;
}(_Message3.default);

var Executor = function () {
    function Executor(parent, dispatch) {
        _classCallCheck(this, Executor);

        this.receive = this.ready([], [], parent, dispatch);
    }

    _createClass(Executor, [{
        key: 'busy',
        value: function busy(messages, frames, parent, dispatch) {

            return function (_ref) {
                var message = _ref.message,
                    next = _ref.next;


                messages.push(message);
                frames.push(next);
            };
        }
    }, {
        key: 'ready',
        value: function ready(messages, frames, parent, dispatch) {
            var _this2 = this;

            var exec = function exec(_ref2) {
                var message = _ref2.message,
                    _ref2$next = _ref2.next,
                    receive = _ref2$next.receive,
                    context = _ref2$next.context,
                    resolve = _ref2$next.resolve,
                    reject = _ref2$next.reject;


                _this2.receive = _this2.busy(messages, frames, parent, dispatch);

                return _bluebird2.default.try(function () {

                    var result = receive.call(context, message);

                    if (result == null) {

                        context.root().tell(new _UnhandledMessage2.default({
                            message: message,
                            to: context.path()
                        }));

                        frames.unshift({ receive: receive, context: context, resolve: resolve, reject: reject });
                        dispatch.tell(new Retry({ message: messages.pop() }));
                    } else {

                        //The result is a promise/Thenable and we don't want
                        //to wait until it finished to process the next frame.
                        if (typeof result.then === 'function') _this2.receive = _this2.ready(messages, frames, parent, dispatch);

                        resolve(result);
                    }
                }).catch(function (error) {

                    reject(error);
                    parent.tell(new _Problem2.default({ context: context, error: error }));
                }).finally(function () {

                    if (frames.length > 0) return exec({ message: messages.shift(), next: frames.shift() });

                    _this2.receive = _this2.ready(messages, frames, parent, dispatch);
                });
            };

            return exec;
        }
    }, {
        key: 'tell',
        value: function tell(m) {

            return this.receive(m);
        }
    }]);

    return Executor;
}();

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
        this._executor = new Executor(parent, this);
    }

    _createClass(SequentialDispatcher, [{
        key: 'next',
        value: function next(messages, stack, executor) {
            var _this3 = this;

            setTimeout(function () {
                if (messages.length > 0) if (stack.length > 0) {

                    var next = stack.shift();
                    var message = messages.shift();

                    _this3._executor.tell({ message: message, next: next });
                    return _this3.next(messages, stack, executor);
                }
            }, 0);
        }
    }, {
        key: 'tell',
        value: function tell(m) {

            if (m instanceof Retry) this._messages.unshift(m);else this._messages.push(m);

            this.next(this._messages, this._stack, this._executor);
        }
    }, {
        key: 'ask',
        value: function ask(_ref3) {
            var _this4 = this;

            var receive = _ref3.receive,
                context = _ref3.context,
                _ref3$time = _ref3.time,
                time = _ref3$time === undefined ? 0 : _ref3$time;


            (0, _beof2.default)({ receive: receive }).interface(_Callable2.default);
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var p = new _bluebird2.default(function (resolve, reject) {
                _this4._stack.push({ receive: receive, context: context, resolve: resolve, reject: reject });
            });

            this.next(this._messages, this._stack, this._executor);

            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJSZXRyeSIsIkV4ZWN1dG9yIiwicGFyZW50IiwiZGlzcGF0Y2giLCJyZWNlaXZlIiwicmVhZHkiLCJtZXNzYWdlcyIsImZyYW1lcyIsIm1lc3NhZ2UiLCJuZXh0IiwicHVzaCIsImV4ZWMiLCJjb250ZXh0IiwicmVzb2x2ZSIsInJlamVjdCIsImJ1c3kiLCJ0cnkiLCJyZXN1bHQiLCJjYWxsIiwicm9vdCIsInRlbGwiLCJ0byIsInBhdGgiLCJ1bnNoaWZ0IiwicG9wIiwidGhlbiIsImNhdGNoIiwiZXJyb3IiLCJmaW5hbGx5IiwibGVuZ3RoIiwic2hpZnQiLCJtIiwiU2VxdWVudGlhbERpc3BhdGNoZXIiLCJfc3RhY2siLCJfb3JkZXIiLCJfbWVzc2FnZXMiLCJfZXhlY3V0b3IiLCJzdGFjayIsImV4ZWN1dG9yIiwic2V0VGltZW91dCIsInRpbWUiLCJpbnRlcmZhY2UiLCJvcHRpb25hbCIsIm51bWJlciIsInAiLCJ0aW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLEs7Ozs7Ozs7Ozs7OztJQUVBQyxRO0FBRUYsc0JBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCO0FBQUE7O0FBRTFCLGFBQUtDLE9BQUwsR0FBZSxLQUFLQyxLQUFMLENBQVcsRUFBWCxFQUFlLEVBQWYsRUFBbUJILE1BQW5CLEVBQTJCQyxRQUEzQixDQUFmO0FBRUg7Ozs7NkJBRUlHLFEsRUFBVUMsTSxFQUFRTCxNLEVBQVFDLFEsRUFBVTs7QUFFckMsbUJBQU8sZ0JBQXVCO0FBQUEsb0JBQXBCSyxPQUFvQixRQUFwQkEsT0FBb0I7QUFBQSxvQkFBWEMsSUFBVyxRQUFYQSxJQUFXOzs7QUFFMUJILHlCQUFTSSxJQUFULENBQWNGLE9BQWQ7QUFDQUQsdUJBQU9HLElBQVAsQ0FBWUQsSUFBWjtBQUVILGFBTEQ7QUFPSDs7OzhCQUVLSCxRLEVBQVVDLE0sRUFBUUwsTSxFQUFRQyxRLEVBQVU7QUFBQTs7QUFFdEMsZ0JBQUlRLE9BQU8sU0FBUEEsSUFBTyxRQUE4RDtBQUFBLG9CQUEzREgsT0FBMkQsU0FBM0RBLE9BQTJEO0FBQUEsdUNBQWxEQyxJQUFrRDtBQUFBLG9CQUExQ0wsT0FBMEMsY0FBMUNBLE9BQTBDO0FBQUEsb0JBQWpDUSxPQUFpQyxjQUFqQ0EsT0FBaUM7QUFBQSxvQkFBeEJDLE9BQXdCLGNBQXhCQSxPQUF3QjtBQUFBLG9CQUFmQyxNQUFlLGNBQWZBLE1BQWU7OztBQUVyRSx1QkFBS1YsT0FBTCxHQUFlLE9BQUtXLElBQUwsQ0FBVVQsUUFBVixFQUFvQkMsTUFBcEIsRUFBNEJMLE1BQTVCLEVBQW9DQyxRQUFwQyxDQUFmOztBQUVBLHVCQUFPLG1CQUFRYSxHQUFSLENBQVksWUFBTTs7QUFFckIsd0JBQUlDLFNBQVNiLFFBQVFjLElBQVIsQ0FBYU4sT0FBYixFQUFzQkosT0FBdEIsQ0FBYjs7QUFFQSx3QkFBSVMsVUFBVSxJQUFkLEVBQW9COztBQUVoQkwsZ0NBQVFPLElBQVIsR0FBZUMsSUFBZixDQUFvQiwrQkFBcUI7QUFDckNaLDRDQURxQztBQUVyQ2EsZ0NBQUlULFFBQVFVLElBQVI7QUFGaUMseUJBQXJCLENBQXBCOztBQUtBZiwrQkFBT2dCLE9BQVAsQ0FBZSxFQUFFbkIsZ0JBQUYsRUFBV1EsZ0JBQVgsRUFBb0JDLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBZjtBQUNBWCxpQ0FBU2lCLElBQVQsQ0FBYyxJQUFJcEIsS0FBSixDQUFVLEVBQUVRLFNBQVNGLFNBQVNrQixHQUFULEVBQVgsRUFBVixDQUFkO0FBRUgscUJBVkQsTUFVTzs7QUFFSDtBQUNBO0FBQ0EsNEJBQUksT0FBT1AsT0FBT1EsSUFBZCxLQUF1QixVQUEzQixFQUNJLE9BQUtyQixPQUFMLEdBQWUsT0FBS0MsS0FBTCxDQUFXQyxRQUFYLEVBQXFCQyxNQUFyQixFQUE2QkwsTUFBN0IsRUFBcUNDLFFBQXJDLENBQWY7O0FBRUpVLGdDQUFRSSxNQUFSO0FBRUg7QUFFSixpQkF6Qk0sRUEwQlBTLEtBMUJPLENBMEJELGlCQUFTOztBQUVYWiwyQkFBT2EsS0FBUDtBQUNBekIsMkJBQU9rQixJQUFQLENBQVksc0JBQVksRUFBRVIsZ0JBQUYsRUFBV2UsWUFBWCxFQUFaLENBQVo7QUFFSCxpQkEvQk0sRUErQkpDLE9BL0JJLENBK0JJLFlBQU07O0FBRWIsd0JBQUlyQixPQUFPc0IsTUFBUCxHQUFnQixDQUFwQixFQUNJLE9BQU9sQixLQUFLLEVBQUVILFNBQVNGLFNBQVN3QixLQUFULEVBQVgsRUFBNkJyQixNQUFNRixPQUFPdUIsS0FBUCxFQUFuQyxFQUFMLENBQVA7O0FBRUosMkJBQUsxQixPQUFMLEdBQWUsT0FBS0MsS0FBTCxDQUFXQyxRQUFYLEVBQXFCQyxNQUFyQixFQUE2QkwsTUFBN0IsRUFBcUNDLFFBQXJDLENBQWY7QUFFSCxpQkF0Q00sQ0FBUDtBQXdDSCxhQTVDRDs7QUE4Q0EsbUJBQU9RLElBQVA7QUFFSDs7OzZCQUVJb0IsQyxFQUFHOztBQUVKLG1CQUFPLEtBQUszQixPQUFMLENBQWEyQixDQUFiLENBQVA7QUFFSDs7Ozs7O0FBSUw7Ozs7OztJQUlhQyxvQixXQUFBQSxvQjtBQUVULGtDQUFZOUIsTUFBWixFQUFvQlUsT0FBcEIsRUFBNkI7QUFBQTs7QUFFekIsYUFBS3FCLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQixJQUFJbkMsUUFBSixDQUFhQyxNQUFiLEVBQXFCLElBQXJCLENBQWpCO0FBRUg7Ozs7NkJBRUlJLFEsRUFBVStCLEssRUFBT0MsUSxFQUFVO0FBQUE7O0FBRTVCQyx1QkFBVyxZQUFNO0FBQ2Isb0JBQUlqQyxTQUFTdUIsTUFBVCxHQUFrQixDQUF0QixFQUNJLElBQUlRLE1BQU1SLE1BQU4sR0FBZSxDQUFuQixFQUFzQjs7QUFFbEIsd0JBQUlwQixPQUFPNEIsTUFBTVAsS0FBTixFQUFYO0FBQ0Esd0JBQUl0QixVQUFVRixTQUFTd0IsS0FBVCxFQUFkOztBQUVBLDJCQUFLTSxTQUFMLENBQWVoQixJQUFmLENBQW9CLEVBQUVaLGdCQUFGLEVBQVdDLFVBQVgsRUFBcEI7QUFDQSwyQkFBTyxPQUFLQSxJQUFMLENBQVVILFFBQVYsRUFBb0IrQixLQUFwQixFQUEyQkMsUUFBM0IsQ0FBUDtBQUVIO0FBQ1IsYUFYRCxFQVdHLENBWEg7QUFhSDs7OzZCQUVJUCxDLEVBQUc7O0FBRUosZ0JBQUlBLGFBQWEvQixLQUFqQixFQUNJLEtBQUttQyxTQUFMLENBQWVaLE9BQWYsQ0FBdUJRLENBQXZCLEVBREosS0FHSSxLQUFLSSxTQUFMLENBQWV6QixJQUFmLENBQW9CcUIsQ0FBcEI7O0FBRUosaUJBQUt0QixJQUFMLENBQVUsS0FBSzBCLFNBQWYsRUFBMEIsS0FBS0YsTUFBL0IsRUFBdUMsS0FBS0csU0FBNUM7QUFFSDs7O21DQUVtQztBQUFBOztBQUFBLGdCQUE5QmhDLE9BQThCLFNBQTlCQSxPQUE4QjtBQUFBLGdCQUFyQlEsT0FBcUIsU0FBckJBLE9BQXFCO0FBQUEsbUNBQVo0QixJQUFZO0FBQUEsZ0JBQVpBLElBQVksOEJBQUwsQ0FBSzs7O0FBRWhDLGdDQUFLLEVBQUVwQyxnQkFBRixFQUFMLEVBQWtCcUMsU0FBbEI7QUFDQSxnQ0FBSyxFQUFFN0IsZ0JBQUYsRUFBTCxFQUFrQjZCLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRUQsVUFBRixFQUFMLEVBQWVFLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLGdCQUFJQyxJQUFJLHVCQUFZLFVBQUMvQixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckMsdUJBQUttQixNQUFMLENBQVl2QixJQUFaLENBQWlCLEVBQUVOLGdCQUFGLEVBQVdRLGdCQUFYLEVBQW9CQyxnQkFBcEIsRUFBNkJDLGNBQTdCLEVBQWpCO0FBQ0gsYUFGTyxDQUFSOztBQUlBLGlCQUFLTCxJQUFMLENBQVUsS0FBSzBCLFNBQWYsRUFBMEIsS0FBS0YsTUFBL0IsRUFBdUMsS0FBS0csU0FBNUM7O0FBRUEsbUJBQVFJLE9BQU8sQ0FBUixHQUFhSSxFQUFFQyxPQUFGLENBQVVMLElBQVYsQ0FBYixHQUErQkksQ0FBdEM7QUFFSDs7Ozs7O2tCQUlVWixvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuaW1wb3J0IFByb2JsZW0gZnJvbSAnLi9Qcm9ibGVtJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vTWVzc2FnZSc7XG5pbXBvcnQgVW5oYW5kbGVkTWVzc2FnZSBmcm9tICcuL1VuaGFuZGxlZE1lc3NhZ2UnO1xuXG5jbGFzcyBSZXRyeSBleHRlbmRzIE1lc3NhZ2Uge31cblxuY2xhc3MgRXhlY3V0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBkaXNwYXRjaCkge1xuXG4gICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVhZHkoW10sIFtdLCBwYXJlbnQsIGRpc3BhdGNoKTtcblxuICAgIH1cblxuICAgIGJ1c3kobWVzc2FnZXMsIGZyYW1lcywgcGFyZW50LCBkaXNwYXRjaCkge1xuXG4gICAgICAgIHJldHVybiAoeyBtZXNzYWdlLCBuZXh0IH0pID0+IHtcblxuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgICAgIGZyYW1lcy5wdXNoKG5leHQpO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICByZWFkeShtZXNzYWdlcywgZnJhbWVzLCBwYXJlbnQsIGRpc3BhdGNoKSB7XG5cbiAgICAgICAgdmFyIGV4ZWMgPSAoeyBtZXNzYWdlLCBuZXh0OiB7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9IH0pID0+IHtcblxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlID0gdGhpcy5idXN5KG1lc3NhZ2VzLCBmcmFtZXMsIHBhcmVudCwgZGlzcGF0Y2gpO1xuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlY2VpdmUuY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucm9vdCgpLnRlbGwobmV3IFVuaGFuZGxlZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBjb250ZXh0LnBhdGgoKVxuICAgICAgICAgICAgICAgICAgICB9KSlcblxuICAgICAgICAgICAgICAgICAgICBmcmFtZXMudW5zaGlmdCh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gudGVsbChuZXcgUmV0cnkoeyBtZXNzYWdlOiBtZXNzYWdlcy5wb3AoKSB9KSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vVGhlIHJlc3VsdCBpcyBhIHByb21pc2UvVGhlbmFibGUgYW5kIHdlIGRvbid0IHdhbnRcbiAgICAgICAgICAgICAgICAgICAgLy90byB3YWl0IHVudGlsIGl0IGZpbmlzaGVkIHRvIHByb2Nlc3MgdGhlIG5leHQgZnJhbWUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LnRoZW4gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlYWR5KG1lc3NhZ2VzLCBmcmFtZXMsIHBhcmVudCwgZGlzcGF0Y2gpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkuXG4gICAgICAgICAgICBjYXRjaChlcnJvciA9PiB7XG5cbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHBhcmVudC50ZWxsKG5ldyBQcm9ibGVtKHsgY29udGV4dCwgZXJyb3IgfSkpO1xuXG4gICAgICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChmcmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWMoeyBtZXNzYWdlOiBtZXNzYWdlcy5zaGlmdCgpLCBuZXh0OiBmcmFtZXMuc2hpZnQoKSB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVhZHkobWVzc2FnZXMsIGZyYW1lcywgcGFyZW50LCBkaXNwYXRjaCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhlYztcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY2VpdmUobSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTZXF1ZW50aWFsRGlzcGF0Y2hlciBleGVjdXRlcyByZWNlaXZlcyBpbiB0aGUgb3JkZXIgdGhleSBhcmUgc2NoZWR1bGVkIGluIHRoZSBzYW1lXG4gKiBydW50aW1lIGFzIHRoZSBldmVudCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW50aWFsRGlzcGF0Y2hlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIGNvbnRleHQpIHtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9vcmRlciA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9leGVjdXRvciA9IG5ldyBFeGVjdXRvcihwYXJlbnQsIHRoaXMpO1xuXG4gICAgfVxuXG4gICAgbmV4dChtZXNzYWdlcywgc3RhY2ssIGV4ZWN1dG9yKSB7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gc3RhY2suc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBtZXNzYWdlcy5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V4ZWN1dG9yLnRlbGwoeyBtZXNzYWdlLCBuZXh0IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KG1lc3NhZ2VzLCBzdGFjaywgZXhlY3V0b3IpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgUmV0cnkpXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlcy51bnNoaWZ0KG0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXNoKG0pO1xuXG4gICAgICAgIHRoaXMubmV4dCh0aGlzLl9tZXNzYWdlcywgdGhpcy5fc3RhY2ssIHRoaXMuX2V4ZWN1dG9yKTtcblxuICAgIH1cblxuICAgIGFzayh7IHJlY2VpdmUsIGNvbnRleHQsIHRpbWUgPSAwIH0pIHtcblxuICAgICAgICBiZW9mKHsgcmVjZWl2ZSB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zdGFjay5wdXNoKHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubmV4dCh0aGlzLl9tZXNzYWdlcywgdGhpcy5fc3RhY2ssIHRoaXMuX2V4ZWN1dG9yKTtcblxuICAgICAgICByZXR1cm4gKHRpbWUgPiAwKSA/IHAudGltZW91dCh0aW1lKSA6IHA7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VxdWVudGlhbERpc3BhdGNoZXJcbiJdfQ==