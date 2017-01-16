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

                console.log('message ', messages.length, this._stack.length);
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


            (0, _beof2.default)({ receive: receive }).interface(_Callable2.default);
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJFeGVjdXRvciIsInBhcmVudCIsInJlY2VpdmUiLCJyZWFkeSIsImZyYW1lcyIsInB1c2giLCJtIiwiZXhlYyIsIm1lc3NhZ2UiLCJjb250ZXh0IiwicmVzb2x2ZSIsInJlamVjdCIsImJ1c3kiLCJ0cnkiLCJjYWxsIiwidGhlbiIsInJlc3VsdCIsInJvb3QiLCJ0ZWxsIiwidG8iLCJwYXRoIiwiY2F0Y2giLCJlcnJvciIsImZpbmFsbHkiLCJsZW5ndGgiLCJzaGlmdCIsIlNlcXVlbnRpYWxEaXNwYXRjaGVyIiwiX3N0YWNrIiwiX29yZGVyIiwiX21lc3NhZ2VzIiwiX2V4ZWN1dG9yIiwibWVzc2FnZXMiLCJzdGFjayIsImV4ZWN1dG9yIiwiY29uc29sZSIsImxvZyIsIm5leHQiLCJ0aW1lIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJudW1iZXIiLCJwIiwicHJvbWlzZSIsInRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVNQSxRO0FBRUYsc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFFaEIsYUFBS0MsT0FBTCxHQUFlLEtBQUtDLEtBQUwsQ0FBVyxFQUFYLEVBQWVGLE1BQWYsQ0FBZjtBQUVIOzs7OzZCQUVJRyxNLEVBQVFILE0sRUFBUTs7QUFFakIsbUJBQU87QUFBQSx1QkFBS0csT0FBT0MsSUFBUCxDQUFZQyxDQUFaLENBQUw7QUFBQSxhQUFQO0FBRUg7Ozs4QkFFS0YsTSxFQUFRSCxNLEVBQVE7QUFBQTs7QUFFbEIsZ0JBQUlNLE9BQU8sU0FBUEEsSUFBTyxPQUFvRDtBQUFBLG9CQUFqREMsT0FBaUQsUUFBakRBLE9BQWlEO0FBQUEsb0JBQXhDTixPQUF3QyxRQUF4Q0EsT0FBd0M7QUFBQSxvQkFBL0JPLE9BQStCLFFBQS9CQSxP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QUE5QjVCLE9BQThCLFNBQTlCQSxPQUE4QjtBQUFBLGdCQUFyQk8sT0FBcUIsU0FBckJBLE9BQXFCO0FBQUEsbUNBQVo0QixJQUFZO0FBQUEsZ0JBQVpBLElBQVksOEJBQUwsQ0FBSzs7O0FBRWhDLGdDQUFLLEVBQUVuQyxnQkFBRixFQUFMLEVBQWtCb0MsU0FBbEI7QUFDQSxnQ0FBSyxFQUFFN0IsZ0JBQUYsRUFBTCxFQUFrQjZCLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRUQsVUFBRixFQUFMLEVBQWVFLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLGdCQUFJQyxJQUFJLHVCQUFZLFVBQUMvQixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckMsdUJBQUtnQixNQUFMLENBQVl0QixJQUFaLENBQWlCLEVBQUVILGdCQUFGLEVBQVdPLGdCQUFYLEVBQW9CQyxnQkFBcEIsRUFBNkJDLGNBQTdCLEVBQXFDK0IsZUFBckMsRUFBakI7QUFDSCxhQUZPLENBQVI7O0FBSUEsaUJBQUtOLElBQUwsQ0FBVSxLQUFLUCxTQUFmLEVBQTBCLEtBQUtGLE1BQS9CLEVBQXVDLEtBQUtHLFNBQTVDO0FBQ0EsbUJBQVFPLE9BQU8sQ0FBUixHQUFhSSxFQUFFRSxPQUFGLENBQVVOLElBQVYsQ0FBYixHQUErQkksQ0FBdEM7QUFFSDs7Ozs7O2tCQUlVZixvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuaW1wb3J0IFByb2JsZW0gZnJvbSAnLi9Qcm9ibGVtJztcbmltcG9ydCBGcmFtZSBmcm9tICcuL0ZyYW1lJztcbmltcG9ydCBVbmhhbmRsZWRNZXNzYWdlIGZyb20gJy4vVW5oYW5kbGVkTWVzc2FnZSc7XG5cbmNsYXNzIEV4ZWN1dG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuXG4gICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVhZHkoW10sIHBhcmVudCk7XG5cbiAgICB9XG5cbiAgICBidXN5KGZyYW1lcywgcGFyZW50KSB7XG5cbiAgICAgICAgcmV0dXJuIG0gPT4gZnJhbWVzLnB1c2gobSk7XG5cbiAgICB9XG5cbiAgICByZWFkeShmcmFtZXMsIHBhcmVudCkge1xuXG4gICAgICAgIHZhciBleGVjID0gKHsgbWVzc2FnZSwgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMuYnVzeShmcmFtZXMsIHBhcmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiByZWNlaXZlLmNhbGwoY29udGV4dCwgbWVzc2FnZSkpLlxuICAgICAgICAgICAgdGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJvb3QoKS50ZWxsKG5ldyBVbmhhbmRsZWRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogY29udGV4dC5wYXRoKClcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgICAgICAgfSkuXG4gICAgICAgICAgICB0aGVuKHJlc3VsdCA9PiByZXNvbHZlKHJlc3VsdCkpLlxuICAgICAgICAgICAgY2F0Y2goZXJyb3IgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy9SZWplY3QgdGhlIHdhaXRpbmcgcmVjZWl2ZSB0aGVuIHBhc3MgdGhlIGVycm9yIHRvIHBhcmVudC5cbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHBhcmVudC50ZWxsKG5ldyBQcm9ibGVtKHsgY29udGV4dCwgZXJyb3IgfSkpO1xuXG5cbiAgICAgICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhlYyhmcmFtZXMuc2hpZnQoKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlYWR5KGZyYW1lcywgcGFyZW50KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleGVjO1xuXG4gICAgfVxuXG4gICAgdGVsbChtKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjZWl2ZShtKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFNlcXVlbnRpYWxEaXNwYXRjaGVyIGV4ZWN1dGVzIHJlY2VpdmVzIGluIHRoZSBvcmRlciB0aGV5IGFyZSBzY2hlZHVsZWQgaW4gdGhlIHNhbWVcbiAqIHJ1bnRpbWUgYXMgdGhlIGV2ZW50IHNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlcXVlbnRpYWxEaXNwYXRjaGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgY29udGV4dCkge1xuXG4gICAgICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yID0gbmV3IEV4ZWN1dG9yKHBhcmVudCk7XG5cbiAgICB9XG5cbiAgICBuZXh0KG1lc3NhZ2VzLCBzdGFjaywgZXhlY3V0b3IpIHtcblxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSA9IHN0YWNrLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBtZXNzYWdlcy5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21lc3NhZ2UgJyxtZXNzYWdlcy5sZW5ndGgsIHRoaXMuX3N0YWNrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhlY3V0b3IudGVsbChuZXcgRnJhbWUoeyBtZXNzYWdlLCByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHQobWVzc2FnZXMsIHN0YWNrLCBleGVjdXRvcik7XG5cbiAgICAgICAgICAgIH1cblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLnB1c2gobSk7XG5cbiAgICAgICAgdGhpcy5uZXh0KHRoaXMuX21lc3NhZ2VzLCB0aGlzLl9zdGFjaywgdGhpcy5fZXhlY3V0b3IpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIHdoaWxlICh0aGlzLl9zdGFjay5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fbWVzc2FnZXMuc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgIT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0gPSB0aGlzLl9zdGFjay5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4ZWN1dG9yLnRlbGwobmV3IEZyYW1lKHsgbWVzc2FnZSwgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0qL1xuXG4gICAgfVxuXG5cbiAgICBhc2soeyByZWNlaXZlLCBjb250ZXh0LCB0aW1lID0gMCB9KSB7XG5cbiAgICAgICAgYmVvZih7IHJlY2VpdmUgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgdGltZSB9KS5vcHRpb25hbCgpLm51bWJlcigpO1xuXG4gICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc3RhY2sucHVzaCh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCwgcHJvbWlzZTogdGhpcyB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uZXh0KHRoaXMuX21lc3NhZ2VzLCB0aGlzLl9zdGFjaywgdGhpcy5fZXhlY3V0b3IpO1xuICAgICAgICByZXR1cm4gKHRpbWUgPiAwKSA/IHAudGltZW91dCh0aW1lKSA6IHA7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VxdWVudGlhbERpc3BhdGNoZXJcbiJdfQ==