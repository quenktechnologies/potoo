'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChildContext = exports.LocalReference = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Reference = require('./Reference');

var _Reference2 = _interopRequireDefault(_Reference);

var _Callable = require('./Callable');

var _Callable2 = _interopRequireDefault(_Callable);

var _uuid = require('uuid');

var _dispatch = require('./dispatch');

var _events = require('./dispatch/events');

var _strategy = require('./dispatch/strategy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};
var default_dispatcher = function default_dispatcher(p) {
    return new _dispatch.SequentialDispatcher(p);
};
var NO_NAME = '<anonymous>';

/**
 * LocalReference is a Reference to an Actor in the current address space.
 * @implements {Reference}
 */

var LocalReference = exports.LocalReference = function () {
    function LocalReference(path, tellFn) {
        _classCallCheck(this, LocalReference);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ tellFn: tellFn }).function();

        this._tellFn = tellFn;
        this._path = path;
    }

    _createClass(LocalReference, [{
        key: 'tell',
        value: function tell(m) {

            this._tellFn(m);
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {

            return this.toString();
        }
    }, {
        key: 'toString',
        value: function toString() {

            return this.path;
        }
    }]);

    return LocalReference;
}();

/**
 * ChildContext is the Context of each self created in this address space.
 * @implements {RefFactory}
 * @implements {Context}
 * @param {string} path
 * @param {Context} [parent]
 * @param {ConcernFactory} factory
 * @param {System} system
 */


var ChildContext = exports.ChildContext = function () {
    function ChildContext(path, parent, root, _ref) {
        var _this = this;

        var strategy = _ref.strategy,
            dispatch = _ref.dispatch;

        _classCallCheck(this, ChildContext);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ parent: parent }).interface(_Context2.default);
        (0, _beof2.default)({ root: root }).interface(_Reference2.default);
        (0, _beof2.default)({ strategy: strategy }).interface(_Callable2.default);
        (0, _beof2.default)({ dispatch: dispatch }).interface(_Reference2.default);

        this._stack = [];
        this._children = [];
        this._dispatch = dispatch;
        this._path = path;
        this._parent = parent;
        this._strategy = strategy;
        this._root = root;
        this._self = new LocalReference(path, function (message) {

            if (message instanceof Error) {

                if (message instanceof _dispatch.Problem) strategy(message.error, message.context, _this);else throw message; //should never happen
                //this.parent().tell(message);
            } else {

                dispatch.tell(new _dispatch.Envelope({ path: path, message: message }));
            }
        });
    }

    _createClass(ChildContext, [{
        key: 'path',
        value: function path() {

            return this._path;
        }
    }, {
        key: 'parent',
        value: function parent() {

            return this._parent.self();
        }
    }, {
        key: 'root',
        value: function root() {

            return this._root;
        }
    }, {
        key: 'none',
        value: function none() {

            return this._root.self();
        }
    }, {
        key: 'self',
        value: function self() {

            return this._self;
        }
    }, {
        key: 'is',
        value: function is(ref) {

            return String(ref) === this._path;
        }
    }, {
        key: 'select',
        value: function select(path) {
            var _this2 = this;

            (0, _beof2.default)({ path: path }).string();

            if (path === this._path) return this._root.tell(new _events.SelectHitEvent({ requested: path, from: this._path })), this.self();

            if (!path.startsWith(this._path)) return this._root.tell(new _events.SelectMissEvent({ requested: path, from: this._path })), this._parent.select(path);

            var childs = this._children.map(function (c) {
                return c.context;
            });

            var next = function next(child) {

                if (!child) {

                    return _this2._root;
                } else if (child.path() === path) {

                    return child.self();
                } else if (path.startsWith(child.path())) {

                    return child.select(path);
                }

                return next(childs.pop());
            };

            return next(childs.pop());
        }
    }, {
        key: 'spawn',
        value: function spawn(_ref2) {
            var _ref2$id = _ref2.id,
                id = _ref2$id === undefined ? (0, _uuid.v4)() : _ref2$id,
                _ref2$strategy = _ref2.strategy,
                strategy = _ref2$strategy === undefined ? _strategy.escalate : _ref2$strategy,
                _ref2$dispatcher = _ref2.dispatcher,
                dispatcher = _ref2$dispatcher === undefined ? default_dispatcher : _ref2$dispatcher,
                start = _ref2.start;


            (0, _beof2.default)({ strategy: strategy }).function();
            (0, _beof2.default)({ dispatcher: dispatcher }).function();
            (0, _beof2.default)({ id: id }).string();
            (0, _beof2.default)({ start: start }).interface(_Callable2.default);

            var slash = this._path === '/' ? '' : '/';
            var path = '' + this._path + slash + id;
            var dispatch = dispatcher(this._root);
            var context = new ChildContext(path, this, this._root, { dispatch: dispatch, strategy: strategy });
            var self = context.self();

            this._children.push({ path: path, context: context, start: start, strategy: strategy });

            context.receive(start.call(context, context));
            /*
                    Promise.try(() => start.call(context, context)).
                    then(() => self.tell('started')).
                    catch(error =>
                        this._strategy(new Problem(error, context), context, this));
            */
            return self;
        }
    }, {
        key: 'receive',
        value: function receive(next, time) {

            (0, _beof2.default)({ next: next }).interface(_Callable2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            var name = (typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object' ? next.constructor.name : next.name;

            name = name ? name : NO_NAME;
            return this._dispatch.ask({ receive: next, context: this, time: time, name: name });
        }
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvQ2hpbGRDb250ZXh0LmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJkZWZhdWx0X2Rpc3BhdGNoZXIiLCJwIiwiTk9fTkFNRSIsIkxvY2FsUmVmZXJlbmNlIiwicGF0aCIsInRlbGxGbiIsInN0cmluZyIsImZ1bmN0aW9uIiwiX3RlbGxGbiIsIl9wYXRoIiwibSIsInRvU3RyaW5nIiwiQ2hpbGRDb250ZXh0IiwicGFyZW50Iiwicm9vdCIsInN0cmF0ZWd5IiwiZGlzcGF0Y2giLCJpbnRlcmZhY2UiLCJfc3RhY2siLCJfY2hpbGRyZW4iLCJfZGlzcGF0Y2giLCJfcGFyZW50IiwiX3N0cmF0ZWd5IiwiX3Jvb3QiLCJfc2VsZiIsIm1lc3NhZ2UiLCJFcnJvciIsImVycm9yIiwiY29udGV4dCIsInRlbGwiLCJzZWxmIiwicmVmIiwiU3RyaW5nIiwicmVxdWVzdGVkIiwiZnJvbSIsInN0YXJ0c1dpdGgiLCJzZWxlY3QiLCJjaGlsZHMiLCJtYXAiLCJjIiwibmV4dCIsImNoaWxkIiwicG9wIiwiaWQiLCJkaXNwYXRjaGVyIiwic3RhcnQiLCJzbGFzaCIsInB1c2giLCJyZWNlaXZlIiwiY2FsbCIsInRpbWUiLCJvcHRpb25hbCIsIm51bWJlciIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsImFzayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7QUFDQSxJQUFNQyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDQyxDQUFEO0FBQUEsV0FBTyxtQ0FBeUJBLENBQXpCLENBQVA7QUFBQSxDQUEzQjtBQUNBLElBQU1DLFVBQVUsYUFBaEI7O0FBRUE7Ozs7O0lBSWFDLGMsV0FBQUEsYztBQUVULDRCQUFZQyxJQUFaLEVBQWtCQyxNQUFsQixFQUEwQjtBQUFBOztBQUV0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VSxLQUFLSyxLQUFmLEdBQXVCcUMsS0FBdkIsR0FBK0JILEVBQW5DO0FBQ0EsZ0JBQUkzQixXQUFXNEIsV0FBVyxLQUFLckIsS0FBaEIsQ0FBZjtBQUNBLGdCQUFJSyxVQUFVLElBQUloQixZQUFKLENBQWlCUixJQUFqQixFQUF1QixJQUF2QixFQUE2QixLQUFLbUIsS0FBbEMsRUFBeUMsRUFBRVAsa0JBQUYsRUFBWUQsa0JBQVosRUFBekMsQ0FBZDtBQUNBLGdCQUFJZSxPQUFPRixRQUFRRSxJQUFSLEVBQVg7O0FBRUEsaUJBQUtYLFNBQUwsQ0FBZTRCLElBQWYsQ0FBb0IsRUFBRTNDLFVBQUYsRUFBUXdCLGdCQUFSLEVBQWlCaUIsWUFBakIsRUFBd0I5QixrQkFBeEIsRUFBcEI7O0FBRUFhLG9CQUFRb0IsT0FBUixDQUFnQkgsTUFBTUksSUFBTixDQUFXckIsT0FBWCxFQUFvQkEsT0FBcEIsQ0FBaEI7QUFDUjs7Ozs7O0FBTVEsbUJBQU9FLElBQVA7QUFFSDs7O2dDQUVPVSxJLEVBQU1VLEksRUFBTTs7QUFFaEIsZ0NBQUssRUFBRVYsVUFBRixFQUFMLEVBQWV2QixTQUFmO0FBQ0EsZ0NBQUssRUFBRWlDLFVBQUYsRUFBTCxFQUFlQyxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxnQkFBSUMsT0FBUSxRQUFPYixJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWpCLEdBQ1BBLEtBQUtjLFdBQUwsQ0FBaUJELElBRFYsR0FDaUJiLEtBQUthLElBRGpDOztBQUdBQSxtQkFBT0EsT0FBT0EsSUFBUCxHQUFjbkQsT0FBckI7QUFDQSxtQkFBTyxLQUFLa0IsU0FBTCxDQUFlbUMsR0FBZixDQUFtQixFQUFFUCxTQUFTUixJQUFYLEVBQWlCWixTQUFTLElBQTFCLEVBQWdDc0IsVUFBaEMsRUFBc0NHLFVBQXRDLEVBQW5CLENBQVA7QUFFSDs7Ozs7O2tCQUlVekMsWSIsImZpbGUiOiJDaGlsZENvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBDYWxsYWJsZSBmcm9tICcuL0NhbGxhYmxlJztcbmltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBTZXF1ZW50aWFsRGlzcGF0Y2hlciwgUHJvYmxlbSwgRW52ZWxvcGUgfSBmcm9tICcuL2Rpc3BhdGNoJztcbmltcG9ydCB7IFNlbGVjdE1pc3NFdmVudCwgU2VsZWN0SGl0RXZlbnQgfSBmcm9tICcuL2Rpc3BhdGNoL2V2ZW50cyc7XG5pbXBvcnQgeyBlc2NhbGF0ZSB9IGZyb20gJy4vZGlzcGF0Y2gvc3RyYXRlZ3knO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5jb25zdCBkZWZhdWx0X2Rpc3BhdGNoZXIgPSAocCkgPT4gbmV3IFNlcXVlbnRpYWxEaXNwYXRjaGVyKHApO1xuY29uc3QgTk9fTkFNRSA9ICc8YW5vbnltb3VzPic7XG5cbi8qKlxuICogTG9jYWxSZWZlcmVuY2UgaXMgYSBSZWZlcmVuY2UgdG8gYW4gQWN0b3IgaW4gdGhlIGN1cnJlbnQgYWRkcmVzcyBzcGFjZS5cbiAqIEBpbXBsZW1lbnRzIHtSZWZlcmVuY2V9XG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZWxsRm4pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHRlbGxGbiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbiA9IHRlbGxGbjtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG0pIHtcblxuICAgICAgICB0aGlzLl90ZWxsRm4obSk7XG5cbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGg7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDaGlsZENvbnRleHQgaXMgdGhlIENvbnRleHQgb2YgZWFjaCBzZWxmIGNyZWF0ZWQgaW4gdGhpcyBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZkZhY3Rvcnl9XG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge0NvbnRleHR9IFtwYXJlbnRdXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5XG4gKiBAcGFyYW0ge1N5c3RlbX0gc3lzdGVtXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgcGFyZW50LCByb290LCB7IHN0cmF0ZWd5LCBkaXNwYXRjaCB9KSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBwYXJlbnQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgcm9vdCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgICAgdGhpcy5fc2VsZiA9IG5ldyBMb2NhbFJlZmVyZW5jZShwYXRoLCBtZXNzYWdlID0+IHtcblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvcikge1xuXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBQcm9ibGVtKVxuICAgICAgICAgICAgICAgICAgICBzdHJhdGVneShtZXNzYWdlLmVycm9yLCBtZXNzYWdlLmNvbnRleHQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTsgLy9zaG91bGQgbmV2ZXIgaGFwcGVuXG4gICAgICAgICAgICAgICAgLy90aGlzLnBhcmVudCgpLnRlbGwobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBkaXNwYXRjaC50ZWxsKG5ldyBFbnZlbG9wZSh7IHBhdGgsIG1lc3NhZ2UgfSkpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZigpO1xuXG4gICAgfVxuXG4gICAgcm9vdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgIH1cblxuICAgIG5vbmUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Quc2VsZigpO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZjtcblxuICAgIH1cblxuICAgIGlzKHJlZikge1xuXG4gICAgICAgIHJldHVybiAoU3RyaW5nKHJlZikgPT09IHRoaXMuX3BhdGgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5fcGF0aClcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC50ZWxsKG5ldyBTZWxlY3RIaXRFdmVudCh7IHJlcXVlc3RlZDogcGF0aCwgZnJvbTogdGhpcy5fcGF0aCB9KSksXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxmKClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFwYXRoLnN0YXJ0c1dpdGgodGhpcy5fcGF0aCkpXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QudGVsbChuZXcgU2VsZWN0TWlzc0V2ZW50KHsgcmVxdWVzdGVkOiBwYXRoLCBmcm9tOiB0aGlzLl9wYXRoIH0pKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQuc2VsZWN0KHBhdGgpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbi5tYXAoYyA9PiBjLmNvbnRleHQpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5wYXRoKCkgPT09IHBhdGgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5zdGFydHNXaXRoKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbiAgICBzcGF3bih7XG4gICAgICAgIGlkID0gdjQoKSxcbiAgICAgICAgc3RyYXRlZ3kgPSBlc2NhbGF0ZSxcbiAgICAgICAgZGlzcGF0Y2hlciA9IGRlZmF1bHRfZGlzcGF0Y2hlcixcbiAgICAgICAgc3RhcnRcbiAgICB9KSB7XG5cbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaGVyIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBpZCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHN0YXJ0IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdmFyIHNsYXNoID0gKHRoaXMuX3BhdGggPT09ICcvJykgPyAnJyA6ICcvJztcbiAgICAgICAgdmFyIHBhdGggPSBgJHt0aGlzLl9wYXRofSR7c2xhc2h9JHtpZH1gO1xuICAgICAgICB2YXIgZGlzcGF0Y2ggPSBkaXNwYXRjaGVyKHRoaXMuX3Jvb3QpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBkaXNwYXRjaCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHZhciBzZWxmID0gY29udGV4dC5zZWxmKCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh7IHBhdGgsIGNvbnRleHQsIHN0YXJ0LCBzdHJhdGVneSB9KTtcblxuICAgICAgICBjb250ZXh0LnJlY2VpdmUoc3RhcnQuY2FsbChjb250ZXh0LCBjb250ZXh0KSk7XG4vKlxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBzdGFydC5jYWxsKGNvbnRleHQsIGNvbnRleHQpKS5cbiAgICAgICAgdGhlbigoKSA9PiBzZWxmLnRlbGwoJ3N0YXJ0ZWQnKSkuXG4gICAgICAgIGNhdGNoKGVycm9yID0+XG4gICAgICAgICAgICB0aGlzLl9zdHJhdGVneShuZXcgUHJvYmxlbShlcnJvciwgY29udGV4dCksIGNvbnRleHQsIHRoaXMpKTtcbiovXG4gICAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShuZXh0LCB0aW1lKSB7XG5cbiAgICAgICAgYmVvZih7IG5leHQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICBsZXQgbmFtZSA9ICh0eXBlb2YgbmV4dCA9PT0gJ29iamVjdCcpID9cbiAgICAgICAgICAgIG5leHQuY29uc3RydWN0b3IubmFtZSA6IG5leHQubmFtZTtcblxuICAgICAgICBuYW1lID0gbmFtZSA/IG5hbWUgOiBOT19OQU1FO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2guYXNrKHsgcmVjZWl2ZTogbmV4dCwgY29udGV4dDogdGhpcywgdGltZSwgbmFtZSB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlsZENvbnRleHRcbiJdfQ==