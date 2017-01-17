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

var _Frame = require('./Frame');

var _Frame2 = _interopRequireDefault(_Frame);

var _UnhandledMessage = require('./UnhandledMessage');

var _UnhandledMessage2 = _interopRequireDefault(_UnhandledMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Executor = function () {
    function Executor(parent) {
        _classCallCheck(this, Executor);

        this.receive = this.ready([], parent);
    }

    _createClass(Executor, [{
        key: 'busy',
        value: function busy(frames, parent) {

            return function (m) {
                return frames.push(m);
            };
        }
    }, {
        key: 'ready',
        value: function ready(frames, parent) {
            var _this = this;

            var exec = function exec(_ref) {
                var message = _ref.message,
                    receive = _ref.receive,
                    context = _ref.context,
                    resolve = _ref.resolve,
                    reject = _ref.reject;


                _this.receive = _this.busy(frames, parent);

                return _bluebird2.default.try(function () {

                    var result = receive.call(context, message);

                    if (result == null) {

                        context.root().tell(new _UnhandledMessage2.default({
                            message: message,
                            to: context.path()
                        }));
                    } else if (typeof result.then === 'function') {

                        //The result is a promise/Thenable and we don't want
                        //to wait until it finished to process the next frame.
                        _this.receive = _this.ready(frames, parent);
                    }

                    return result;
                }).then(function (result) {
                    return resolve(result);
                }).catch(function (error) {

                    reject(error);
                    parent.tell(new _Problem2.default({ context: context, error: error }));
                }).finally(function () {

                    if (frames.length > 0) return exec(frames.shift());

                    _this.receive = _this.ready(frames, parent);
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
        this._executor = new Executor(parent);
    }

    _createClass(SequentialDispatcher, [{
        key: 'next',
        value: function next(messages, stack, executor) {
            var _this2 = this;

            setTimeout(function () {
                if (messages.length > 0) if (stack.length > 0) {
                    var _stack$shift = stack.shift(),
                        receive = _stack$shift.receive,
                        context = _stack$shift.context,
                        resolve = _stack$shift.resolve,
                        reject = _stack$shift.reject;

                    var message = messages.shift();

                    _this2._executor.tell(new _Frame2.default({ message: message, receive: receive, context: context, resolve: resolve, reject: reject }));
                    return _this2.next(messages, stack, executor);
                }
            }, 0);
        }
    }, {
        key: 'tell',
        value: function tell(m) {

            this._messages.push(m);
            this.next(this._messages, this._stack, this._executor);
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
                _this3._stack.push({ receive: receive, context: context, resolve: resolve, reject: reject });
            });

            this.next(this._messages, this._stack, this._executor);

            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJFeGVjdXRvciIsInBhcmVudCIsInJlY2VpdmUiLCJyZWFkeSIsImZyYW1lcyIsInB1c2giLCJtIiwiZXhlYyIsIm1lc3NhZ2UiLCJjb250ZXh0IiwicmVzb2x2ZSIsInJlamVjdCIsImJ1c3kiLCJ0cnkiLCJyZXN1bHQiLCJjYWxsIiwicm9vdCIsInRlbGwiLCJ0byIsInBhdGgiLCJ0aGVuIiwiY2F0Y2giLCJlcnJvciIsImZpbmFsbHkiLCJsZW5ndGgiLCJzaGlmdCIsIlNlcXVlbnRpYWxEaXNwYXRjaGVyIiwiX3N0YWNrIiwiX29yZGVyIiwiX21lc3NhZ2VzIiwiX2V4ZWN1dG9yIiwibWVzc2FnZXMiLCJzdGFjayIsImV4ZWN1dG9yIiwic2V0VGltZW91dCIsIm5leHQiLCJ0aW1lIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJudW1iZXIiLCJwIiwidGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU1BLFE7QUFFRixzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUVoQixhQUFLQyxPQUFMLEdBQWUsS0FBS0MsS0FBTCxDQUFXLEVBQVgsRUFBZUYsTUFBZixDQUFmO0FBRUg7Ozs7NkJBRUlHLE0sRUFBUUgsTSxFQUFROztBQUVqQixtQkFBTztBQUFBLHVCQUFLRyxPQUFPQyxJQUFQLENBQVlDLENBQVosQ0FBTDtBQUFBLGFBQVA7QUFFSDs7OzhCQUVLRixNLEVBQVFILE0sRUFBUTtBQUFBOztBQUVsQixnQkFBSU0sT0FBTyxTQUFQQSxJQUFPLE9BQW9EO0FBQUEsb0JBQWpEQyxPQUFpRCxRQUFqREEsT0FBaUQ7QUFBQSxvQkFBeENOLE9BQXdDLFFBQXhDQSxPQUF3QztBQUFBLG9CQUEvQk8sT0FBK0IsUUFBL0JBLE9BQStCO0FBQUEsb0JBQXRCQyxPQUFzQixRQUF0QkEsT0FBc0I7QUFBQSxvQkFBYkMsTUFBYSxRQUFiQSxNQUFhOzs7QUFFM0Qsc0JBQUtULE9BQUwsR0FBZSxNQUFLVSxJQUFMLENBQVVSLE1BQVYsRUFBa0JILE1BQWxCLENBQWY7O0FBRUEsdUJBQU8sbUJBQVFZLEdBQVIsQ0FBWSxZQUFNOztBQUVqQix3QkFBSUMsU0FBU1osUUFBUWEsSUFBUixDQUFhTixPQUFiLEVBQXNCRCxPQUF0QixDQUFiOztBQUVBLHdCQUFJTSxVQUFVLElBQWQsRUFBb0I7O0FBRWhCTCxnQ0FBUU8sSUFBUixHQUFlQyxJQUFmLENBQW9CLCtCQUFxQjtBQUNyQ1QsNENBRHFDO0FBRXJDVSxnQ0FBSVQsUUFBUVUsSUFBUjtBQUZpQyx5QkFBckIsQ0FBcEI7QUFLSCxxQkFQRCxNQU9PLElBQUksT0FBT0wsT0FBT00sSUFBZCxLQUF1QixVQUEzQixFQUF1Qzs7QUFFMUM7QUFDQTtBQUNBLDhCQUFLbEIsT0FBTCxHQUFlLE1BQUtDLEtBQUwsQ0FBV0MsTUFBWCxFQUFtQkgsTUFBbkIsQ0FBZjtBQUVIOztBQUdMLDJCQUFPYSxNQUFQO0FBRUgsaUJBdEJNLEVBdUJYTSxJQXZCVyxDQXVCTjtBQUFBLDJCQUFVVixRQUFRSSxNQUFSLENBQVY7QUFBQSxpQkF2Qk0sRUF3QlhPLEtBeEJXLENBd0JMLGlCQUFTOztBQUVYViwyQkFBT1csS0FBUDtBQUNBckIsMkJBQU9nQixJQUFQLENBQVksc0JBQVksRUFBRVIsZ0JBQUYsRUFBV2EsWUFBWCxFQUFaLENBQVo7QUFFSCxpQkE3QlUsRUE2QlJDLE9BN0JRLENBNkJBLFlBQU07O0FBRWIsd0JBQUluQixPQUFPb0IsTUFBUCxHQUFnQixDQUFwQixFQUNJLE9BQU9qQixLQUFLSCxPQUFPcUIsS0FBUCxFQUFMLENBQVA7O0FBRUosMEJBQUt2QixPQUFMLEdBQWUsTUFBS0MsS0FBTCxDQUFXQyxNQUFYLEVBQW1CSCxNQUFuQixDQUFmO0FBRUgsaUJBcENVLENBQVA7QUFzQ1AsYUExQ0c7O0FBNENKLG1CQUFPTSxJQUFQO0FBRUg7Ozs2QkFFSUQsQyxFQUFHOztBQUVKLG1CQUFPLEtBQUtKLE9BQUwsQ0FBYUksQ0FBYixDQUFQO0FBRUg7Ozs7OztBQUlEOzs7Ozs7SUFJYW9CLG9CLFdBQUFBLG9CO0FBRVQsa0NBQVl6QixNQUFaLEVBQW9CUSxPQUFwQixFQUE2QjtBQUFBOztBQUV6QixhQUFLa0IsTUFBTCxHQUFjLEVBQWQ7QUFDQSxhQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLElBQUk5QixRQUFKLENBQWFDLE1BQWIsQ0FBakI7QUFFSDs7Ozs2QkFFSThCLFEsRUFBVUMsSyxFQUFPQyxRLEVBQVU7QUFBQTs7QUFFNUJDLHVCQUFXLFlBQU07QUFDYixvQkFBSUgsU0FBU1AsTUFBVCxHQUFrQixDQUF0QixFQUNJLElBQUlRLE1BQU1SLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUFBLHVDQUUwQlEsTUFBTVAsS0FBTixFQUYxQjtBQUFBLHdCQUVadkIsT0FGWSxnQkFFWkEsT0FGWTtBQUFBLHdCQUVITyxPQUZHLGdCQUVIQSxPQUZHO0FBQUEsd0JBRU1DLE9BRk4sZ0JBRU1BLE9BRk47QUFBQSx3QkFFZUMsTUFGZixnQkFFZUEsTUFGZjs7QUFHbEIsd0JBQUlILFVBQVV1QixTQUFTTixLQUFULEVBQWQ7O0FBRUEsMkJBQUtLLFNBQUwsQ0FBZWIsSUFBZixDQUFvQixvQkFBVSxFQUFFVCxnQkFBRixFQUFXTixnQkFBWCxFQUFvQk8sZ0JBQXBCLEVBQTZCQyxnQkFBN0IsRUFBc0NDLGNBQXRDLEVBQVYsQ0FBcEI7QUFDQSwyQkFBTyxPQUFLd0IsSUFBTCxDQUFVSixRQUFWLEVBQW9CQyxLQUFwQixFQUEyQkMsUUFBM0IsQ0FBUDtBQUVIO0FBQ1IsYUFYRCxFQVdHLENBWEg7QUFhSDs7OzZCQUVJM0IsQyxFQUFHOztBQUVKLGlCQUFLdUIsU0FBTCxDQUFleEIsSUFBZixDQUFvQkMsQ0FBcEI7QUFDQSxpQkFBSzZCLElBQUwsQ0FBVSxLQUFLTixTQUFmLEVBQTBCLEtBQUtGLE1BQS9CLEVBQXVDLEtBQUtHLFNBQTVDO0FBRUg7OzttQ0FFbUM7QUFBQTs7QUFBQSxnQkFBOUI1QixPQUE4QixTQUE5QkEsT0FBOEI7QUFBQSxnQkFBckJPLE9BQXFCLFNBQXJCQSxPQUFxQjtBQUFBLG1DQUFaMkIsSUFBWTtBQUFBLGdCQUFaQSxJQUFZLDhCQUFMLENBQUs7OztBQUVoQyxnQ0FBSyxFQUFFbEMsZ0JBQUYsRUFBTCxFQUFrQm1DLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRTVCLGdCQUFGLEVBQUwsRUFBa0I0QixTQUFsQjtBQUNBLGdDQUFLLEVBQUVELFVBQUYsRUFBTCxFQUFlRSxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxnQkFBSUMsSUFBSSx1QkFBWSxVQUFDOUIsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDLHVCQUFLZ0IsTUFBTCxDQUFZdEIsSUFBWixDQUFpQixFQUFFSCxnQkFBRixFQUFXTyxnQkFBWCxFQUFvQkMsZ0JBQXBCLEVBQTZCQyxjQUE3QixFQUFqQjtBQUNILGFBRk8sQ0FBUjs7QUFJQSxpQkFBS3dCLElBQUwsQ0FBVSxLQUFLTixTQUFmLEVBQTBCLEtBQUtGLE1BQS9CLEVBQXVDLEtBQUtHLFNBQTVDOztBQUVBLG1CQUFRTSxPQUFPLENBQVIsR0FBYUksRUFBRUMsT0FBRixDQUFVTCxJQUFWLENBQWIsR0FBK0JJLENBQXRDO0FBRUg7Ozs7OztrQkFJVWQsb0IiLCJmaWxlIjoiU2VxdWVudGlhbERpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4uL0NhbGxhYmxlJztcbmltcG9ydCBQcm9ibGVtIGZyb20gJy4vUHJvYmxlbSc7XG5pbXBvcnQgRnJhbWUgZnJvbSAnLi9GcmFtZSc7XG5pbXBvcnQgVW5oYW5kbGVkTWVzc2FnZSBmcm9tICcuL1VuaGFuZGxlZE1lc3NhZ2UnO1xuXG5jbGFzcyBFeGVjdXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblxuICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlYWR5KFtdLCBwYXJlbnQpO1xuXG4gICAgfVxuXG4gICAgYnVzeShmcmFtZXMsIHBhcmVudCkge1xuXG4gICAgICAgIHJldHVybiBtID0+IGZyYW1lcy5wdXNoKG0pO1xuXG4gICAgfVxuXG4gICAgcmVhZHkoZnJhbWVzLCBwYXJlbnQpIHtcblxuICAgICAgICB2YXIgZXhlYyA9ICh7IG1lc3NhZ2UsIHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMuYnVzeShmcmFtZXMsIHBhcmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlY2VpdmUuY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yb290KCkudGVsbChuZXcgVW5oYW5kbGVkTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogY29udGV4dC5wYXRoKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSByZXN1bHQgaXMgYSBwcm9taXNlL1RoZW5hYmxlIGFuZCB3ZSBkb24ndCB3YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvIHdhaXQgdW50aWwgaXQgZmluaXNoZWQgdG8gcHJvY2VzcyB0aGUgbmV4dCBmcmFtZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVhZHkoZnJhbWVzLCBwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgICAgICAgfSkuXG4gICAgICAgIHRoZW4ocmVzdWx0ID0+IHJlc29sdmUocmVzdWx0KSkuXG4gICAgICAgIGNhdGNoKGVycm9yID0+IHtcblxuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIHBhcmVudC50ZWxsKG5ldyBQcm9ibGVtKHsgY29udGV4dCwgZXJyb3IgfSkpO1xuXG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoZnJhbWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWMoZnJhbWVzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlYWR5KGZyYW1lcywgcGFyZW50KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHJldHVybiBleGVjO1xuXG59XG5cbnRlbGwobSkge1xuXG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZShtKTtcblxufVxuXG59XG5cbi8qKlxuICogU2VxdWVudGlhbERpc3BhdGNoZXIgZXhlY3V0ZXMgcmVjZWl2ZXMgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHNjaGVkdWxlZCBpbiB0aGUgc2FtZVxuICogcnVudGltZSBhcyB0aGUgZXZlbnQgc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgU2VxdWVudGlhbERpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBjb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXhlY3V0b3IgPSBuZXcgRXhlY3V0b3IocGFyZW50KTtcblxuICAgIH1cblxuICAgIG5leHQobWVzc2FnZXMsIHN0YWNrLCBleGVjdXRvcikge1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSA9IHN0YWNrLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gbWVzc2FnZXMuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9leGVjdXRvci50ZWxsKG5ldyBGcmFtZSh7IG1lc3NhZ2UsIHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHQobWVzc2FnZXMsIHN0YWNrLCBleGVjdXRvcik7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuXG4gICAgfVxuXG4gICAgdGVsbChtKSB7XG5cbiAgICAgICAgdGhpcy5fbWVzc2FnZXMucHVzaChtKTtcbiAgICAgICAgdGhpcy5uZXh0KHRoaXMuX21lc3NhZ2VzLCB0aGlzLl9zdGFjaywgdGhpcy5fZXhlY3V0b3IpO1xuXG4gICAgfVxuXG4gICAgYXNrKHsgcmVjZWl2ZSwgY29udGV4dCwgdGltZSA9IDAgfSkge1xuXG4gICAgICAgIGJlb2YoeyByZWNlaXZlIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3N0YWNrLnB1c2goeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uZXh0KHRoaXMuX21lc3NhZ2VzLCB0aGlzLl9zdGFjaywgdGhpcy5fZXhlY3V0b3IpO1xuXG4gICAgICAgIHJldHVybiAodGltZSA+IDApID8gcC50aW1lb3V0KHRpbWUpIDogcDtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXF1ZW50aWFsRGlzcGF0Y2hlclxuIl19