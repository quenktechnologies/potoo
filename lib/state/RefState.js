'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _Reference = require('../Reference');

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RefState is really a Concern's state but because we abstract away the
 * state management to the Reference implementation subclasses of this class
 * refer to the state the Reference is in.
 * @param {Context} context
 * @param {Reference} ref
 * @abstract
 * @implements {LocalReference}
 */
var RefState = function () {
    function RefState(context) {
        _classCallCheck(this, RefState);

        (0, _beof2.default)({ context: context }).interface(_Context2.default);

        this._context = context;
    }

    _createClass(RefState, [{
        key: 'path',
        value: function path() {

            return this._context.path();
        }
    }, {
        key: 'watch',
        value: function watch() {}
    }, {
        key: 'unwatch',
        value: function unwatch() {}
    }, {
        key: 'tell',
        value: function tell(message, from) {

            (0, _beof2.default)({ from: from }).interface(_Reference2.default);

            this._context.system().deadLetters().tell(message, from);
        }
    }, {
        key: 'ask',
        value: function ask(message, from) {

            this.tell(message, from);
            return _bluebird2.default.resolve();
        }

        /**
         * stop
         * @param {Reference} ref
         * @returns {RefState}
         */

    }, {
        key: 'stop',
        value: function stop() {

            return this;
        }

        /**
         * restart
         * @param {Reference} ref
         * @returns {RefState}
         */

    }, {
        key: 'restart',
        value: function restart() {

            return this;
        }

        /**
         * pause
         * @param {Reference} ref
         * @returns {RefState}
         */

    }, {
        key: 'pause',
        value: function pause() {

            return this;
        }

        /**
         * resume
         * @param {Reference} ref
         * @returns {RefState}
         */

    }, {
        key: 'resume',
        value: function resume() {

            return this;
        }

        /**
         * sync is called to synchronize the RefState
         */

    }, {
        key: 'sync',
        value: function sync() {}
    }, {
        key: 'toString',
        value: function toString() {

            return JSON.stringify({
                type: 'state',
                state: this.constructor.name,
                path: this.path()
            });
        }
    }], [{
        key: 'equals',
        value: function equals(o, state) {

            //example
            //{
            // type: 'state',
            // state: 'Active',
            // path: '/lib/tasks/generate_events.js#/main/posts/comments',
            //}
            if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object') if (o.type === 'state') if (typeof o.path === 'string') if (o.state === state.name) return true;
        }
    }]);

    return RefState;
}();

exports.default = RefState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SZWZTdGF0ZS5qcyJdLCJuYW1lcyI6WyJSZWZTdGF0ZSIsImNvbnRleHQiLCJpbnRlcmZhY2UiLCJfY29udGV4dCIsInBhdGgiLCJtZXNzYWdlIiwiZnJvbSIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwidGVsbCIsInJlc29sdmUiLCJKU09OIiwic3RyaW5naWZ5IiwidHlwZSIsInN0YXRlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwibyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7SUFTTUEsUTtBQUVGLHNCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBRWpCLDRCQUFLLEVBQUVBLGdCQUFGLEVBQUwsRUFBa0JDLFNBQWxCOztBQUVBLGFBQUtDLFFBQUwsR0FBZ0JGLE9BQWhCO0FBRUg7Ozs7K0JBa0JNOztBQUVILG1CQUFPLEtBQUtFLFFBQUwsQ0FBY0MsSUFBZCxFQUFQO0FBRUg7OztnQ0FFTyxDQUVQOzs7a0NBRVMsQ0FHVDs7OzZCQUVJQyxPLEVBQVNDLEksRUFBTTs7QUFFaEIsZ0NBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVKLFNBQWY7O0FBRUEsaUJBQUtDLFFBQUwsQ0FBY0ksTUFBZCxHQUF1QkMsV0FBdkIsR0FBcUNDLElBQXJDLENBQTBDSixPQUExQyxFQUFtREMsSUFBbkQ7QUFFSDs7OzRCQUVHRCxPLEVBQVNDLEksRUFBTTs7QUFFZixpQkFBS0csSUFBTCxDQUFVSixPQUFWLEVBQW1CQyxJQUFuQjtBQUNBLG1CQUFPLG1CQUFRSSxPQUFSLEVBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7K0JBS087O0FBRUgsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7OztrQ0FLVTs7QUFFTixtQkFBTyxJQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7O2dDQUtROztBQUVKLG1CQUFPLElBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7aUNBS1M7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7K0JBR08sQ0FFTjs7O21DQUVVOztBQUVQLG1CQUFPQyxLQUFLQyxTQUFMLENBQWU7QUFDbEJDLHNCQUFNLE9BRFk7QUFFbEJDLHVCQUFPLEtBQUtDLFdBQUwsQ0FBaUJDLElBRk47QUFHbEJaLHNCQUFNLEtBQUtBLElBQUw7QUFIWSxhQUFmLENBQVA7QUFNSDs7OytCQXpHYWEsQyxFQUFHSCxLLEVBQU87O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFJLFFBQU9HLENBQVAseUNBQU9BLENBQVAsT0FBYSxRQUFqQixFQUNJLElBQUlBLEVBQUVKLElBQUYsS0FBVyxPQUFmLEVBQ0ksSUFBSSxPQUFPSSxFQUFFYixJQUFULEtBQWtCLFFBQXRCLEVBQ0ksSUFBSWEsRUFBRUgsS0FBRixLQUFZQSxNQUFNRSxJQUF0QixFQUNJLE9BQU8sSUFBUDtBQUVuQjs7Ozs7O2tCQStGVWhCLFEiLCJmaWxlIjoiUmVmU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuLi9SZWZlcmVuY2UnO1xuXG4vKipcbiAqIFJlZlN0YXRlIGlzIHJlYWxseSBhIENvbmNlcm4ncyBzdGF0ZSBidXQgYmVjYXVzZSB3ZSBhYnN0cmFjdCBhd2F5IHRoZVxuICogc3RhdGUgbWFuYWdlbWVudCB0byB0aGUgUmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIHN1YmNsYXNzZXMgb2YgdGhpcyBjbGFzc1xuICogcmVmZXIgdG8gdGhlIHN0YXRlIHRoZSBSZWZlcmVuY2UgaXMgaW4uXG4gKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHRcbiAqIEBwYXJhbSB7UmVmZXJlbmNlfSByZWZcbiAqIEBhYnN0cmFjdFxuICogQGltcGxlbWVudHMge0xvY2FsUmVmZXJlbmNlfVxuICovXG5jbGFzcyBSZWZTdGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG5cbiAgICAgICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGVxdWFscyhvLCBzdGF0ZSkge1xuXG4gICAgICAgIC8vZXhhbXBsZVxuICAgICAgICAvL3tcbiAgICAgICAgLy8gdHlwZTogJ3N0YXRlJyxcbiAgICAgICAgLy8gc3RhdGU6ICdBY3RpdmUnLFxuICAgICAgICAvLyBwYXRoOiAnL2xpYi90YXNrcy9nZW5lcmF0ZV9ldmVudHMuanMjL21haW4vcG9zdHMvY29tbWVudHMnLFxuICAgICAgICAvL31cbiAgICAgICAgaWYgKHR5cGVvZiBvID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgIGlmIChvLnR5cGUgPT09ICdzdGF0ZScpXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvLnBhdGggPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgICAgICBpZiAoby5zdGF0ZSA9PT0gc3RhdGUubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5wYXRoKCk7XG5cbiAgICB9XG5cbiAgICB3YXRjaCgpIHtcblxuICAgIH1cblxuICAgIHVud2F0Y2goKSB7XG5cblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIGJlb2YoeyBmcm9tIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuc3lzdGVtKCkuZGVhZExldHRlcnMoKS50ZWxsKG1lc3NhZ2UsIGZyb20pO1xuXG4gICAgfVxuXG4gICAgYXNrKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLnRlbGwobWVzc2FnZSwgZnJvbSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN0b3BcbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gcmVmXG4gICAgICogQHJldHVybnMge1JlZlN0YXRlfVxuICAgICAqL1xuICAgIHN0b3AoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXN0YXJ0XG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICAgICAqIEByZXR1cm5zIHtSZWZTdGF0ZX1cbiAgICAgKi9cbiAgICByZXN0YXJ0KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGF1c2VcbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gcmVmXG4gICAgICogQHJldHVybnMge1JlZlN0YXRlfVxuICAgICAqL1xuICAgIHBhdXNlKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVzdW1lXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICAgICAqIEByZXR1cm5zIHtSZWZTdGF0ZX1cbiAgICAgKi9cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzeW5jIGlzIGNhbGxlZCB0byBzeW5jaHJvbml6ZSB0aGUgUmVmU3RhdGVcbiAgICAgKi9cbiAgICBzeW5jKCkge1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdGF0ZScsXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICAgICAgcGF0aDogdGhpcy5wYXRoKClcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVmU3RhdGVcbiJdfQ==