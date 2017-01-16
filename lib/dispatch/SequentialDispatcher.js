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
                var message = _ref.message;
                var receive = _ref.receive;
                var context = _ref.context;
                var resolve = _ref.resolve;
                var reject = _ref.reject;

                _this.receive = _this.busy(frames, parent);

                return _bluebird2.default.try(function () {
                    return receive.call(context, message);
                }).then(function (result) {

                    if (result == null) context.root().tell(new _UnhandledMessage2.default({
                        message: message,
                        to: context.path()
                    }));

                    return result;
                }).then(function (result) {
                    return resolve(result);
                }).catch(function (error) {

                    //Reject the waiting receive then pass the error to parent.
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

            if (messages.length > 0) if (stack.length > 0) {
                var _stack$shift = stack.shift();

                var receive = _stack$shift.receive;
                var context = _stack$shift.context;
                var resolve = _stack$shift.resolve;
                var reject = _stack$shift.reject;

                var message = messages.shift();

                this._executor.tell(new _Frame2.default({ message: message, receive: receive, context: context, resolve: resolve, reject: reject }));
                return this.next(messages, stack, executor);
            }
        }
    }, {
        key: 'tell',
        value: function tell(m) {

            this._messages.push(m);

            this.next(this._messages, this._stack, this._executor);

            /*
            while (this._stack.length > 0) {
                 var message = this._messages.shift();
                 if (message != null) {
                     var { receive, context, resolve, reject } = this._stack.shift();
                    this._executor.tell(new Frame({ message, receive, context, resolve, reject }));
                 }
             }*/
        }
    }, {
        key: 'ask',
        value: function ask(_ref2) {
            var _this2 = this;

            var receive = _ref2.receive;
            var context = _ref2.context;
            var _ref2$time = _ref2.time;
            var time = _ref2$time === undefined ? 0 : _ref2$time;


            var p = new _bluebird2.default(function (resolve, reject) {
                _this2._stack.push({ receive: receive, context: context, resolve: resolve, reject: reject, promise: _this2 });
            });

            this.next(this._messages, this._stack, this._executor);
            return time > 0 ? p.timeout(time) : p;
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJFeGVjdXRvciIsInBhcmVudCIsInJlY2VpdmUiLCJyZWFkeSIsImZyYW1lcyIsInB1c2giLCJtIiwiZXhlYyIsIm1lc3NhZ2UiLCJjb250ZXh0IiwicmVzb2x2ZSIsInJlamVjdCIsImJ1c3kiLCJ0cnkiLCJjYWxsIiwidGhlbiIsInJlc3VsdCIsInJvb3QiLCJ0ZWxsIiwidG8iLCJwYXRoIiwiY2F0Y2giLCJlcnJvciIsImZpbmFsbHkiLCJsZW5ndGgiLCJzaGlmdCIsIlNlcXVlbnRpYWxEaXNwYXRjaGVyIiwiX3N0YWNrIiwiX29yZGVyIiwiX21lc3NhZ2VzIiwiX2V4ZWN1dG9yIiwibWVzc2FnZXMiLCJzdGFjayIsImV4ZWN1dG9yIiwibmV4dCIsInRpbWUiLCJwIiwicHJvbWlzZSIsInRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFTUEsUTtBQUVGLHNCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLGFBQUtDLE9BQUwsR0FBZSxLQUFLQyxLQUFMLENBQVcsRUFBWCxFQUFlRixNQUFmLENBQWY7QUFFSDs7Ozs2QkFFSUcsTSxFQUFRSCxNLEVBQVE7O0FBRWpCLG1CQUFPO0FBQUEsdUJBQUtHLE9BQU9DLElBQVAsQ0FBWUMsQ0FBWixDQUFMO0FBQUEsYUFBUDtBQUVIOzs7OEJBRUtGLE0sRUFBUUgsTSxFQUFRO0FBQUE7O0FBRWxCLGdCQUFJTSxPQUFPLFNBQVBBLElBQU8sT0FBb0Q7QUFBQSxvQkFBakRDLE9BQWlELFFBQWpEQSxPQUFpRDtBQUFBLG9CQUF4Q04sT0FBd0MsUUFBeENBLE9BQXdDO0FBQUEsb0JBQS9CTyxPQUErQixRQUEvQkEsT0FBK0I7QUFBQSxvQkFBdEJDLE9BQXNCLFFBQXRCQSxPQUFzQjtBQUFBLG9CQUFiQyxNQUFhLFFB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QzFCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNyQyx1QkFBS2dCLE1BQUwsQ0FBWXRCLElBQVosQ0FBaUIsRUFBRUgsZ0JBQUYsRUFBV08sZ0JBQVgsRUFBb0JDLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBcUMwQixlQUFyQyxFQUFqQjtBQUNILGFBRk8sQ0FBUjs7QUFJQSxpQkFBS0gsSUFBTCxDQUFVLEtBQUtMLFNBQWYsRUFBMEIsS0FBS0YsTUFBL0IsRUFBdUMsS0FBS0csU0FBNUM7QUFDQSxtQkFBUUssT0FBTyxDQUFSLEdBQWFDLEVBQUVFLE9BQUYsQ0FBVUgsSUFBVixDQUFiLEdBQStCQyxDQUF0QztBQUVIOzs7Ozs7a0JBSVVWLG9CIiwiZmlsZSI6IlNlcXVlbnRpYWxEaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuLi9Db250ZXh0JztcbmltcG9ydCBQcm9ibGVtIGZyb20gJy4vUHJvYmxlbSc7XG5pbXBvcnQgRnJhbWUgZnJvbSAnLi9GcmFtZSc7XG5pbXBvcnQgVW5oYW5kbGVkTWVzc2FnZSBmcm9tICcuL1VuaGFuZGxlZE1lc3NhZ2UnO1xuXG5jbGFzcyBFeGVjdXRvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblxuICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlYWR5KFtdLCBwYXJlbnQpO1xuXG4gICAgfVxuXG4gICAgYnVzeShmcmFtZXMsIHBhcmVudCkge1xuXG4gICAgICAgIHJldHVybiBtID0+IGZyYW1lcy5wdXNoKG0pO1xuXG4gICAgfVxuXG4gICAgcmVhZHkoZnJhbWVzLCBwYXJlbnQpIHtcblxuICAgICAgICB2YXIgZXhlYyA9ICh7IG1lc3NhZ2UsIHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLmJ1c3koZnJhbWVzLCBwYXJlbnQpO1xuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4gcmVjZWl2ZS5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpKS5cbiAgICAgICAgICAgIHRoZW4ocmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yb290KCkudGVsbChuZXcgVW5oYW5kbGVkTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IGNvbnRleHQucGF0aCgpXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgICAgIH0pLlxuICAgICAgICAgICAgdGhlbihyZXN1bHQgPT4gcmVzb2x2ZShyZXN1bHQpKS5cbiAgICAgICAgICAgIGNhdGNoKGVycm9yID0+IHtcblxuICAgICAgICAgICAgICAgIC8vUmVqZWN0IHRoZSB3YWl0aW5nIHJlY2VpdmUgdGhlbiBwYXNzIHRoZSBlcnJvciB0byBwYXJlbnQuXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQudGVsbChuZXcgUHJvYmxlbSh7IGNvbnRleHQsIGVycm9yIH0pKTtcblxuXG4gICAgICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChmcmFtZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWMoZnJhbWVzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWFkeShmcmFtZXMsIHBhcmVudCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhlYztcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNlaXZlKG0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU2VxdWVudGlhbERpc3BhdGNoZXIgZXhlY3V0ZXMgcmVjZWl2ZXMgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHNjaGVkdWxlZCBpbiB0aGUgc2FtZVxuICogcnVudGltZSBhcyB0aGUgZXZlbnQgc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgU2VxdWVudGlhbERpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50LCBjb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fb3JkZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXhlY3V0b3IgPSBuZXcgRXhlY3V0b3IocGFyZW50KTtcblxuICAgIH1cblxuICAgIG5leHQobWVzc2FnZXMsIHN0YWNrLCBleGVjdXRvcikge1xuXG4gICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgIHZhciB7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9ID0gc3RhY2suc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG1lc3NhZ2VzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9leGVjdXRvci50ZWxsKG5ldyBGcmFtZSh7IG1lc3NhZ2UsIHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dChtZXNzYWdlcywgc3RhY2ssIGV4ZWN1dG9yKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdGVsbChtKSB7XG5cbiAgICAgICAgdGhpcy5fbWVzc2FnZXMucHVzaChtKTtcblxuICAgICAgICB0aGlzLm5leHQodGhpcy5fbWVzc2FnZXMsIHRoaXMuX3N0YWNrLCB0aGlzLl9leGVjdXRvcik7XG5cbiAgICAgICAgLypcbiAgICAgICAgd2hpbGUgKHRoaXMuX3N0YWNrLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9tZXNzYWdlcy5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlY3V0b3IudGVsbChuZXcgRnJhbWUoeyBtZXNzYWdlLCByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSkpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSovXG5cbiAgICB9XG5cblxuICAgIGFzayh7IHJlY2VpdmUsIGNvbnRleHQsIHRpbWUgPSAwIH0pIHtcblxuICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3N0YWNrLnB1c2goeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QsIHByb21pc2U6IHRoaXMgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubmV4dCh0aGlzLl9tZXNzYWdlcywgdGhpcy5fc3RhY2ssIHRoaXMuX2V4ZWN1dG9yKTtcbiAgICAgICAgcmV0dXJuICh0aW1lID4gMCkgPyBwLnRpbWVvdXQodGltZSkgOiBwO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcXVlbnRpYWxEaXNwYXRjaGVyXG4iXX0=