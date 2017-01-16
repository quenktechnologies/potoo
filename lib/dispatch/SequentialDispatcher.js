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

var _UnhandledMessage = require('./UnhandledMessage');

var _UnhandledMessage2 = _interopRequireDefault(_UnhandledMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */
var SequentialDispatcher = exports.SequentialDispatcher = function () {
    function SequentialDispatcher(parent) {
        _classCallCheck(this, SequentialDispatcher);

        this._stack = [];
        this._pending = 0;
        this._parent = parent;
    }

    _createClass(SequentialDispatcher, [{
        key: 'schedule',
        value: function schedule(receive, context) {
            var time = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];


            (0, _beof2.default)({ receive: receive }).function();
            (0, _beof2.default)({ context: context }).interface(_Context2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var stack = this._stack;

            var p = time > 0 ? new _bluebird2.default(function (resolve, reject) {
                return stack.push({ receive: receive, context: context, resolve: resolve, reject: reject });
            }).timeout(time) : new _bluebird2.default(function (resolve, reject) {
                return stack.push({ receive: receive, context: context, resolve: resolve, reject: reject });
            });

            this.dispatch();

            return p;
        }
    }, {
        key: 'dispatch',
        value: function dispatch() {
            var _this = this;

            ++this._pending;

            if (this._busy) return null; //already dispatching

            if (this._stack.length === 0) return null; //no receives yet

            this._busy = true;

            var _stack$shift = this._stack.shift();

            var receive = _stack$shift.receive;
            var context = _stack$shift.context;
            var resolve = _stack$shift.resolve;
            var reject = _stack$shift.reject;

            var parent = this._parent;

            _bluebird2.default.try(function () {
                return context.inbox().dequeue();
            }).then(function (next) {

                if (next == null) return _this._stack.push({ receive: receive, context: context, resolve: resolve, reject: reject });

                return _bluebird2.default.try(function () {
                    return receive.call(context, next);
                }).then(function (result) {

                    if (result == null) context.root().tell(new _UnhandledMessage2.default({
                        message: next,
                        to: context.path()
                    }));

                    return result;
                }).then(function (result) {
                    return resolve(result);
                });
            }).catch(function (error) {

                //Reject the waiting receive then pass the error to parent.
                reject(error);
                parent.tell(new _Problem2.default({ context: context, error: error }));
            }).finally(function () {

                --_this._pending;
                _this._busy = false;

                if (_this._pending > 0) return _this.dispatch();
            });
        }
    }]);

    return SequentialDispatcher;
}();

exports.default = SequentialDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJTZXF1ZW50aWFsRGlzcGF0Y2hlciIsInBhcmVudCIsIl9zdGFjayIsIl9wZW5kaW5nIiwiX3BhcmVudCIsInJlY2VpdmUiLCJjb250ZXh0IiwidGltZSIsImZ1bmN0aW9uIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJudW1iZXIiLCJzdGFjayIsInAiLCJyZXNvbHZlIiwicmVqZWN0IiwicHVzaCIsInRpbWVvdXQiLCJkaXNwYXRjaCIsIl9idXN5IiwibGVuZ3RoIiwic2hpZnQiLCJ0cnkiLCJpbmJveCIsImRlcXVldWUiLCJ0aGVuIiwibmV4dCIsImNhbGwiLCJyZXN1bHQiLCJyb290IiwidGVsbCIsIm1lc3NhZ2UiLCJ0byIsInBhdGgiLCJjYXRjaCIsImVycm9yIiwiZmluYWxseSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7OztJQUlhQSxvQixXQUFBQSxvQjtBQUVULGtDQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLGFBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLGFBQUtDLE9BQUwsR0FBZUgsTUFBZjtBQUVIOzs7O2lDQUVRSSxPLEVBQVNDLE8sRUFBbUI7QUFBQSxnQkFBVkMsSUFBVSx5REFBSCxDQUFHOzs7QUFFakMsZ0NBQUssRUFBRUYsZ0JBQUYsRUFBTCxFQUFrQkcsUUFBbEI7QUFDQSxnQ0FBSyxFQUFFRixnQkFBRixFQUFMLEVBQWtCRyxTQUFsQjtBQUNBLGdDQUFLLEVBQUVGLFVBQUYsRUFBTCxFQUFlRyxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxnQkFBSUMsUUFBUSxLQUFLVixNQUFqQjs7QUFFQSxnQkFBSVcsSUFBS04sT0FBTyxDQUFSLEdBQWEsdUJBQVksVUFBQ08sT0FBRCxFQUFVQyxNQUFWO0FBQUEsdUJBQ3pCSCxNQUFNSSxJQUFOLENBQVcsRUFBRVgsZ0JBQUYsRUFBV0MsZ0JBQVgsRUFBb0JRLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBWCxDQUR5QjtBQUFBLGFBQVosRUFDc0NFLE9BRHRDLENBQzhDVixJQUQ5QyxDQUFiLEdBRUosdUJBQVksVUFBQ08sT0FBRCxFQUFVQyxNQUFWO0FBQUEsdUJBQ1JILE1BQU1JLElBQU4sQ0FBVyxFQUFFWCxnQkFBRixFQUFXQyxnQkFBWCxFQUFvQlEsZ0JBQXBCLEVBQTZCQyxjQUE3QixFQUFYLENBRFE7QUFBQSxhQUFaLENBRko7O0FBS0EsaUJBQUtHLFFBQUw7O0FBRUEsbUJBQU9MLENBQVA7QUFFSDs7O21DQUVVO0FBQUE7O0FBRVAsY0FBRSxLQUFLVixRQUFQOztBQUVBLGdCQUFJLEtBQUtnQixLQUFULEVBQ0ksT0FBTyxJQUFQLENBTEcsQ0FLVTs7QUFFakIsZ0JBQUksS0FBS2pCLE1BQUwsQ0FBWWtCLE1BQVosS0FBdUIsQ0FBM0IsRUFDSSxPQUFPLElBQVAsQ0FSRyxDQVFVOztBQUVqQixpQkFBS0QsS0FBTCxHQUFhLElBQWI7O0FBVk8sK0JBWXFDLEtBQUtqQixNQUFMLENBQVltQixLQUFaLEVBWnJDOztBQUFBLGdCQVlEaEIsT0FaQyxnQkFZREEsT0FaQztBQUFBLGdCQVlRQyxPQVpSLGdCQVlRQSxPQVpSO0FBQUEsZ0JBWWlCUSxPQVpqQixnQkFZaUJBLE9BWmpCO0FBQUEsZ0JBWTBCQyxNQVoxQixnQkFZMEJBLE1BWjFCOztBQWFQLGdCQUFJZCxTQUFTLEtBQUtHLE9BQWxCOztBQUVBLCtCQUFRa0IsR0FBUixDQUFZO0FBQUEsdUJBQU1oQixRQUFRaUIsS0FBUixHQUFnQkMsT0FBaEIsRUFBTjtBQUFBLGFBQVosRUFDQUMsSUFEQSxDQUNLLGdCQUFROztBQUVMLG9CQUFJQyxRQUFRLElBQVosRUFDSSxPQUFPLE1BQUt4QixNQUFMLENBQVljLElBQVosQ0FBaUIsRUFBRVgsZ0JBQUYsRUFBV0MsZ0JBQVgsRUFBb0JRLGdCQUFwQixFQUE2QkMsY0FBN0IsRUFBakIsQ0FBUDs7QUFFSix1QkFBTyxtQkFBUU8sR0FBUixDQUFZO0FBQUEsMkJBQU1qQixRQUFRc0IsSUFBUixDQUFhckIsT0FBYixFQUFzQm9CLElBQXRCLENBQU47QUFBQSxpQkFBWixFQUNQRCxJQURPLENBQ0Ysa0JBQVU7O0FBRVAsd0JBQUlHLFVBQVUsSUFBZCxFQUNJdEIsUUFBUXVCLElBQVIsR0FBZUMsSUFBZixDQUFvQiwrQkFBcUI7QUFDakNDLGlDQUFTTCxJQUR3QjtBQUVqQ00sNEJBQUkxQixRQUFRMkIsSUFBUjtBQUY2QixxQkFBckIsQ0FBcEI7O0FBS0ksMkJBQU9MLE1BQVA7QUFFSCxpQkFYTixFQVdRSCxJQVhSLENBV2E7QUFBQSwyQkFBVVgsUUFBUWMsTUFBUixDQUFWO0FBQUEsaUJBWGIsQ0FBUDtBQVlDLGFBbEJULEVBa0JXTSxLQWxCWCxDQWtCaUIsaUJBQVM7O0FBRWxCO0FBQ0FuQix1QkFBT29CLEtBQVA7QUFDQWxDLHVCQUFPNkIsSUFBUCxDQUFZLHNCQUFZLEVBQUV4QixnQkFBRixFQUFXNkIsWUFBWCxFQUFaLENBQVo7QUFFSCxhQXhCTCxFQXdCT0MsT0F4QlAsQ0F3QmUsWUFBTTs7QUFFYixrQkFBRSxNQUFLakMsUUFBUDtBQUNBLHNCQUFLZ0IsS0FBTCxHQUFhLEtBQWI7O0FBRUEsb0JBQUksTUFBS2hCLFFBQUwsR0FBZ0IsQ0FBcEIsRUFDSSxPQUFPLE1BQUtlLFFBQUwsRUFBUDtBQUVQLGFBaENMO0FBa0NDOzs7Ozs7a0JBS1VsQixvQiIsImZpbGUiOiJTZXF1ZW50aWFsRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgUHJvYmxlbSBmcm9tICcuL1Byb2JsZW0nO1xuaW1wb3J0IFVuaGFuZGxlZE1lc3NhZ2UgZnJvbSAnLi9VbmhhbmRsZWRNZXNzYWdlJztcblxuLyoqXG4gKiBTZXF1ZW50aWFsRGlzcGF0Y2hlciBleGVjdXRlcyByZWNlaXZlcyBpbiB0aGUgb3JkZXIgdGhleSBhcmUgc2NoZWR1bGVkIGluIHRoZSBzYW1lXG4gKiBydW50aW1lIGFzIHRoZSBldmVudCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW50aWFsRGlzcGF0Y2hlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9wZW5kaW5nID0gMDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuXG4gICAgfVxuXG4gICAgc2NoZWR1bGUocmVjZWl2ZSwgY29udGV4dCwgdGltZSA9IDApIHtcblxuICAgICAgICBiZW9mKHsgcmVjZWl2ZSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5fc3RhY2s7XG5cbiAgICAgICAgdmFyIHAgPSAodGltZSA+IDApID8gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHsgcmVjZWl2ZSwgY29udGV4dCwgcmVzb2x2ZSwgcmVqZWN0IH0pKS50aW1lb3V0KHRpbWUpIDpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KSk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaCgpO1xuXG4gICAgICAgIHJldHVybiBwO1xuXG4gICAgfVxuXG4gICAgZGlzcGF0Y2goKSB7XG5cbiAgICAgICAgKyt0aGlzLl9wZW5kaW5nO1xuXG4gICAgICAgIGlmICh0aGlzLl9idXN5KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vYWxyZWFkeSBkaXNwYXRjaGluZ1xuXG4gICAgICAgIGlmICh0aGlzLl9zdGFjay5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy9ubyByZWNlaXZlcyB5ZXRcblxuICAgICAgICB0aGlzLl9idXN5ID0gdHJ1ZTtcblxuICAgICAgICB2YXIgeyByZWNlaXZlLCBjb250ZXh0LCByZXNvbHZlLCByZWplY3QgfSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XG5cbiAgICAgICAgUHJvbWlzZS50cnkoKCkgPT4gY29udGV4dC5pbmJveCgpLmRlcXVldWUoKSkuXG4gICAgICAgIHRoZW4obmV4dCA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhY2sucHVzaCh7IHJlY2VpdmUsIGNvbnRleHQsIHJlc29sdmUsIHJlamVjdCB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiByZWNlaXZlLmNhbGwoY29udGV4dCwgbmV4dCkpLlxuICAgICAgICAgICAgICAgIHRoZW4ocmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQucm9vdCgpLnRlbGwobmV3IFVuaGFuZGxlZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbmV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBjb250ZXh0LnBhdGgoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ocmVzdWx0ID0+IHJlc29sdmUocmVzdWx0KSlcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG5cbiAgICAgICAgICAgICAgICAvL1JlamVjdCB0aGUgd2FpdGluZyByZWNlaXZlIHRoZW4gcGFzcyB0aGUgZXJyb3IgdG8gcGFyZW50LlxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgcGFyZW50LnRlbGwobmV3IFByb2JsZW0oeyBjb250ZXh0LCBlcnJvciB9KSk7XG5cbiAgICAgICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLS10aGlzLl9wZW5kaW5nO1xuICAgICAgICAgICAgICAgIHRoaXMuX2J1c3kgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wZW5kaW5nID4gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBleHBvcnQgZGVmYXVsdCBTZXF1ZW50aWFsRGlzcGF0Y2hlclxuIl19