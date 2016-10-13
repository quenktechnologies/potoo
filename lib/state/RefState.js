'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SZWZTdGF0ZS5qcyJdLCJuYW1lcyI6WyJSZWZTdGF0ZSIsImNvbnRleHQiLCJpbnRlcmZhY2UiLCJfY29udGV4dCIsInBhdGgiLCJtZXNzYWdlIiwiZnJvbSIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwidGVsbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0eXBlIiwic3RhdGUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7SUFTTUEsUTtBQUVGLHNCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBRWpCLDRCQUFLLEVBQUVBLGdCQUFGLEVBQUwsRUFBa0JDLFNBQWxCOztBQUVBLGFBQUtDLFFBQUwsR0FBZ0JGLE9BQWhCO0FBRUg7Ozs7K0JBa0JNOztBQUVILG1CQUFPLEtBQUtFLFFBQUwsQ0FBY0MsSUFBZCxFQUFQO0FBRUg7OztnQ0FFTyxDQUVQOzs7a0NBRVMsQ0FHVDs7OzZCQUVJQyxPLEVBQVNDLEksRUFBTTs7QUFFaEIsZ0NBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVKLFNBQWY7O0FBRUEsaUJBQUtDLFFBQUwsQ0FBY0ksTUFBZCxHQUF1QkMsV0FBdkIsR0FBcUNDLElBQXJDLENBQTBDSixPQUExQyxFQUFtREMsSUFBbkQ7QUFFSDs7QUFFRDs7Ozs7Ozs7K0JBS087O0FBRUgsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7OztrQ0FLVTs7QUFFTixtQkFBTyxJQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7O2dDQUtROztBQUVKLG1CQUFPLElBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7aUNBS1M7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7K0JBR08sQ0FFTjs7O21DQUVVOztBQUVQLG1CQUFPSSxLQUFLQyxTQUFMLENBQWU7QUFDbEJDLHNCQUFNLE9BRFk7QUFFbEJDLHVCQUFPLEtBQUtDLFdBQUwsQ0FBaUJDLElBRk47QUFHbEJYLHNCQUFNLEtBQUtBLElBQUw7QUFIWSxhQUFmLENBQVA7QUFNSDs7OytCQWxHYVksQyxFQUFHSCxLLEVBQU87O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFJLFFBQU9HLENBQVAseUNBQU9BLENBQVAsT0FBYSxRQUFqQixFQUNJLElBQUlBLEVBQUVKLElBQUYsS0FBVyxPQUFmLEVBQ0ksSUFBSSxPQUFPSSxFQUFFWixJQUFULEtBQWtCLFFBQXRCLEVBQ0ksSUFBSVksRUFBRUgsS0FBRixLQUFZQSxNQUFNRSxJQUF0QixFQUNJLE9BQU8sSUFBUDtBQUVuQjs7Ozs7O2tCQXdGVWYsUSIsImZpbGUiOiJSZWZTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi4vQ29udGV4dCc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5cbi8qKlxuICogUmVmU3RhdGUgaXMgcmVhbGx5IGEgQ29uY2VybidzIHN0YXRlIGJ1dCBiZWNhdXNlIHdlIGFic3RyYWN0IGF3YXkgdGhlXG4gKiBzdGF0ZSBtYW5hZ2VtZW50IHRvIHRoZSBSZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gc3ViY2xhc3NlcyBvZiB0aGlzIGNsYXNzXG4gKiByZWZlciB0byB0aGUgc3RhdGUgdGhlIFJlZmVyZW5jZSBpcyBpbi5cbiAqIEBwYXJhbSB7Q29udGV4dH0gY29udGV4dFxuICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICogQGFic3RyYWN0XG4gKiBAaW1wbGVtZW50cyB7TG9jYWxSZWZlcmVuY2V9XG4gKi9cbmNsYXNzIFJlZlN0YXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcblxuICAgICAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZXF1YWxzKG8sIHN0YXRlKSB7XG5cbiAgICAgICAgLy9leGFtcGxlXG4gICAgICAgIC8ve1xuICAgICAgICAvLyB0eXBlOiAnc3RhdGUnLFxuICAgICAgICAvLyBzdGF0ZTogJ0FjdGl2ZScsXG4gICAgICAgIC8vIHBhdGg6ICcvbGliL3Rhc2tzL2dlbmVyYXRlX2V2ZW50cy5qcyMvbWFpbi9wb3N0cy9jb21tZW50cycsXG4gICAgICAgIC8vfVxuICAgICAgICBpZiAodHlwZW9mIG8gPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgaWYgKG8udHlwZSA9PT0gJ3N0YXRlJylcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG8ucGF0aCA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgIGlmIChvLnN0YXRlID09PSBzdGF0ZS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LnBhdGgoKTtcblxuICAgIH1cblxuICAgIHdhdGNoKCkge1xuXG4gICAgfVxuXG4gICAgdW53YXRjaCgpIHtcblxuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgYmVvZih7IGZyb20gfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5zeXN0ZW0oKS5kZWFkTGV0dGVycygpLnRlbGwobWVzc2FnZSwgZnJvbSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzdG9wXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICAgICAqIEByZXR1cm5zIHtSZWZTdGF0ZX1cbiAgICAgKi9cbiAgICBzdG9wKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVzdGFydFxuICAgICAqIEBwYXJhbSB7UmVmZXJlbmNlfSByZWZcbiAgICAgKiBAcmV0dXJucyB7UmVmU3RhdGV9XG4gICAgICovXG4gICAgcmVzdGFydCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBhdXNlXG4gICAgICogQHBhcmFtIHtSZWZlcmVuY2V9IHJlZlxuICAgICAqIEByZXR1cm5zIHtSZWZTdGF0ZX1cbiAgICAgKi9cbiAgICBwYXVzZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc3VtZVxuICAgICAqIEBwYXJhbSB7UmVmZXJlbmNlfSByZWZcbiAgICAgKiBAcmV0dXJucyB7UmVmU3RhdGV9XG4gICAgICovXG4gICAgcmVzdW1lKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3luYyBpcyBjYWxsZWQgdG8gc3luY2hyb25pemUgdGhlIFJlZlN0YXRlXG4gICAgICovXG4gICAgc3luYygpIHtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0eXBlOiAnc3RhdGUnLFxuICAgICAgICAgICAgc3RhdGU6IHRoaXMuY29uc3RydWN0b3IubmFtZSxcbiAgICAgICAgICAgIHBhdGg6IHRoaXMucGF0aCgpXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZlN0YXRlXG4iXX0=