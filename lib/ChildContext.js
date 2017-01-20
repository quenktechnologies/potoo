'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChildContext = exports.LocalReference = undefined;

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

var _strategy = require('./dispatch/strategy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};
var default_dispatcher = function default_dispatcher(p) {
    return new _dispatch.SequentialDispatcher(p);
};

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
        (0, _beof2.default)({ strategy: strategy }).function();
        (0, _beof2.default)({ dispatch: dispatch }).interface(_Reference2.default);

        this._stack = [];
        this._children = [];
        this._dispatch = dispatch;
        this._path = path;
        this._parent = parent;
        this._strategy = strategy;
        this._root = root;
        this._self = new LocalReference(this._path, function (m) {

            if (m instanceof Error) {

                if (m instanceof _dispatch.Problem) strategy(m.error, m.context, _this);else _this.parent().tell(m);
            } else {

                dispatch.tell(m);
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

            if (path === this._path) return this.self();

            if (!path.startsWith(this._path)) return this._parent.select(path);

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
            var _this3 = this;

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
            var dispatch = dispatcher(this._self);
            var context = new ChildContext(path, this, this._root, { dispatch: dispatch, strategy: strategy });
            var self = context.self();

            this._children.push({ path: path, context: context, start: start, strategy: strategy });

            _bluebird2.default.try(function () {
                return start.call(context, context);
            }).then(function () {
                return self.tell('started');
            }).catch(function (error) {
                return _this3._strategy(new _dispatch.Problem(error, context), context, _this3);
            });

            return self;
        }
    }, {
        key: 'receive',
        value: function receive(next, time) {

            (0, _beof2.default)({ next: next }).function();
            (0, _beof2.default)({ time: time }).optional().number();

            return this._dispatch.ask({ receive: next, context: this, time: time });
        }
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJFcnJvciIsImVycm9yIiwiY29udGV4dCIsInRlbGwiLCJzZWxmIiwicmVmIiwiU3RyaW5nIiwic3RhcnRzV2l0aCIsInNlbGVjdCIsImNoaWxkcyIsIm1hcCIsImMiLCJuZXh0IiwiY2hpbGQiLCJwb3AiLCJpZCIsImRpc3BhdGNoZXIiLCJzdGFydCIsInNsYXNoIiwicHVzaCIsInRyeSIsImNhbGwiLCJ0aGVuIiwiY2F0Y2giLCJ0aW1lIiwib3B0aW9uYWwiLCJudW1iZXIiLCJhc2siLCJyZWNlaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7QUFDQSxJQUFNQyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDQyxDQUFEO0FBQUEsV0FBTyxtQ0FBeUJBLENBQXpCLENBQVA7QUFBQSxDQUEzQjs7QUFFQTs7Ozs7SUFJYUMsYyxXQUFBQSxjO0FBRVQsNEJBQVlDLElBQVosRUFBa0JDLE1BQWxCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELFVBQUYsRUFBTCxFQUFlRSxNQUFmO0FBQ0EsNEJBQUssRUFBRUQsY0FBRixFQUFMLEVBQWlCRSxRQUFqQjs7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LEVBQWlCZSxZQUFqQixFQUF3QjNCLGtCQUF4QixFQUFwQjs7QUFFQSwrQkFBUThCLEdBQVIsQ0FBWTtBQUFBLHVCQUFNSCxNQUFNSSxJQUFOLENBQVduQixPQUFYLEVBQW9CQSxPQUFwQixDQUFOO0FBQUEsYUFBWixFQUNBb0IsSUFEQSxDQUNLO0FBQUEsdUJBQU1sQixLQUFLRCxJQUFMLENBQVUsU0FBVixDQUFOO0FBQUEsYUFETCxFQUVBb0IsS0FGQSxDQUVNO0FBQUEsdUJBQ0YsT0FBSzFCLFNBQUwsQ0FBZSxzQkFBWUksS0FBWixFQUFtQkMsT0FBbkIsQ0FBZixFQUE0Q0EsT0FBNUMsU0FERTtBQUFBLGFBRk47O0FBS0EsbUJBQU9FLElBQVA7QUFFSDs7O2dDQUVPUSxJLEVBQU1ZLEksRUFBTTs7QUFFaEIsZ0NBQUssRUFBRVosVUFBRixFQUFMLEVBQWU5QixRQUFmO0FBQ0EsZ0NBQUssRUFBRTBDLFVBQUYsRUFBTCxFQUFlQyxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxtQkFBTyxLQUFLL0IsU0FBTCxDQUFlZ0MsR0FBZixDQUFtQixFQUFFQyxTQUFTaEIsSUFBWCxFQUFpQlYsU0FBUyxJQUExQixFQUFnQ3NCLFVBQWhDLEVBQW5CLENBQVA7QUFFSDs7Ozs7O2tCQUlVckMsWSIsImZpbGUiOiJDaGlsZENvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBDYWxsYWJsZSBmcm9tICcuL0NhbGxhYmxlJztcbmltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBTZXF1ZW50aWFsRGlzcGF0Y2hlciwgUHJvYmxlbSB9IGZyb20gJy4vZGlzcGF0Y2gnO1xuaW1wb3J0IHsgZXNjYWxhdGUgfSBmcm9tICcuL2Rpc3BhdGNoL3N0cmF0ZWd5JztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuY29uc3QgZGVmYXVsdF9kaXNwYXRjaGVyID0gKHApID0+IG5ldyBTZXF1ZW50aWFsRGlzcGF0Y2hlcihwKTtcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBpcyBhIFJlZmVyZW5jZSB0byBhbiBBY3RvciBpbiB0aGUgY3VycmVudCBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbGxGbikge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgdGVsbEZuIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuID0gdGVsbEZuO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbihtKTtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX1cbiAqIEBpbXBsZW1lbnRzIHtDb250ZXh0fVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7Q29udGV4dH0gW3BhcmVudF1cbiAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAqIEBwYXJhbSB7U3lzdGVtfSBzeXN0ZW1cbiAqL1xuZXhwb3J0IGNsYXNzIENoaWxkQ29udGV4dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBwYXJlbnQsIHJvb3QsIHsgc3RyYXRlZ3ksIGRpc3BhdGNoIH0pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHBhcmVudCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyByb290IH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB0aGlzLl9zZWxmID0gbmV3IExvY2FsUmVmZXJlbmNlKHRoaXMuX3BhdGgsIG0gPT4ge1xuXG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIFByb2JsZW0pXG4gICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5KG0uZXJyb3IsIG0uY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudCgpLnRlbGwobSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBkaXNwYXRjaC50ZWxsKG0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZigpO1xuXG4gICAgfVxuXG4gICAgcm9vdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgIH1cblxuICAgIG5vbmUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Quc2VsZigpO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZjtcblxuICAgIH1cblxuICAgIGlzKHJlZikge1xuXG4gICAgICAgIHJldHVybiAoU3RyaW5nKHJlZikgPT09IHRoaXMuX3BhdGgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5fcGF0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGYoKTtcblxuICAgICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aCh0aGlzLl9wYXRoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZWN0KHBhdGgpO1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbi5tYXAoYyA9PiBjLmNvbnRleHQpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5wYXRoKCkgPT09IHBhdGgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5zdGFydHNXaXRoKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbiAgICBzcGF3bih7XG4gICAgICAgIGlkID0gdjQoKSxcbiAgICAgICAgc3RyYXRlZ3kgPSBlc2NhbGF0ZSxcbiAgICAgICAgZGlzcGF0Y2hlciA9IGRlZmF1bHRfZGlzcGF0Y2hlcixcbiAgICAgICAgc3RhcnRcbiAgICB9KSB7XG5cbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaGVyIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBpZCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHN0YXJ0IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdmFyIHNsYXNoID0gKHRoaXMuX3BhdGggPT09ICcvJykgPyAnJyA6ICcvJztcbiAgICAgICAgdmFyIHBhdGggPSBgJHt0aGlzLl9wYXRofSR7c2xhc2h9JHtpZH1gO1xuICAgICAgICB2YXIgZGlzcGF0Y2ggPSBkaXNwYXRjaGVyKHRoaXMuX3NlbGYpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBkaXNwYXRjaCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHZhciBzZWxmID0gY29udGV4dC5zZWxmKCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh7IHBhdGgsIGNvbnRleHQsIHN0YXJ0LCBzdHJhdGVneSB9KTtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBzdGFydC5jYWxsKGNvbnRleHQsIGNvbnRleHQpKS5cbiAgICAgICAgdGhlbigoKSA9PiBzZWxmLnRlbGwoJ3N0YXJ0ZWQnKSkuXG4gICAgICAgIGNhdGNoKGVycm9yID0+XG4gICAgICAgICAgICB0aGlzLl9zdHJhdGVneShuZXcgUHJvYmxlbShlcnJvciwgY29udGV4dCksIGNvbnRleHQsIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcblxuICAgIH1cblxuICAgIHJlY2VpdmUobmV4dCwgdGltZSkge1xuXG4gICAgICAgIGJlb2YoeyBuZXh0IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoLmFzayh7IHJlY2VpdmU6IG5leHQsIGNvbnRleHQ6IHRoaXMsIHRpbWUgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=