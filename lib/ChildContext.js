'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChildContext = exports.LocalReference = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

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
 * @implements {RefFactory}wzrd.in
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

            if (m instanceof _dispatch.Problem) {
                strategy(m.error, m.context, _this);
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

            return this._parent;
        }
    }, {
        key: 'root',
        value: function root() {

            return this._root;
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

            (0, _beof2.default)({ path: path }).string();

            if (path === this._path) return this.self();

            if (!path.startsWith(this._path)) return this._parent.select(path);

            var childs = this._children.map(function (c) {
                return c.context;
            });

            var next = function next(child) {

                if (!child) {

                    //@todo
                    //should return a null reference
                    return {
                        tell: function tell() {}
                    };
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
            var _ref2$strategy = _ref2.strategy,
                strategy = _ref2$strategy === undefined ? _strategy.escalate : _ref2$strategy,
                _ref2$dispatcher = _ref2.dispatcher,
                dispatcher = _ref2$dispatcher === undefined ? default_dispatcher : _ref2$dispatcher,
                start = _ref2.start;
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _uuid.v4)();


            (0, _beof2.default)({ strategy: strategy }).function();
            (0, _beof2.default)({ dispatcher: dispatcher }).function();
            (0, _beof2.default)({ name: name }).string();
            (0, _beof2.default)({ start: start }).interface(_Callable2.default);

            var slash = this._path === '/' ? '' : '/';
            var path = '' + this._path + slash + name;
            var dispatch = dispatcher(this._self);
            var context = new ChildContext(path, this, this._root, { dispatch: dispatch, strategy: strategy });
            var self = context.self();

            this._children.push({ path: path, context: context, start: start, strategy: strategy });
            start.call(context);
            self.tell('started');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJlcnJvciIsImNvbnRleHQiLCJ0ZWxsIiwicmVmIiwiU3RyaW5nIiwic2VsZiIsInN0YXJ0c1dpdGgiLCJzZWxlY3QiLCJjaGlsZHMiLCJtYXAiLCJjIiwibmV4dCIsImNoaWxkIiwicG9wIiwiZGlzcGF0Y2hlciIsInN0YXJ0IiwibmFtZSIsInNsYXNoIiwicHVzaCIsImNhbGwiLCJ0aW1lIiwib3B0aW9uYWwiLCJudW1iZXIiLCJhc2siLCJyZWNlaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sR0FBTSxDQUFFLENBQXJCO0FBQ0EsSUFBTUMscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsQ0FBRDtBQUFBLFdBQU8sbUNBQXlCQSxDQUF6QixDQUFQO0FBQUEsQ0FBM0I7O0FBRUE7Ozs7O0lBSWFDLGMsV0FBQUEsYztBQUVULDRCQUFZQyxJQUFaLEVBQWtCQyxNQUFsQixFQUEwQjtBQUFBOztBQUV0Qiw0QkFBSyxFQUFFRCxVQUFGLEVBQUwsRUFBZUUsTUFBZjtBQUNBLDRCQUFLLEVBQUVELGNBQUYsRUFBTCxFQUFpQkUsUUFBakI7O0FBRUEsYUFBS0MsT0FBTCxHQUFlSCxNQUFmO0FBQ0EsYUFB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ZTdCLFFBQWY7QUFDQSxnQ0FBSyxFQUFFc0MsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLG1CQUFPLEtBQUszQixTQUFMLENBQWU0QixHQUFmLENBQW1CLEVBQUVDLFNBQVNiLElBQVgsRUFBaUJWLFNBQVMsSUFBMUIsRUFBZ0NtQixVQUFoQyxFQUFuQixDQUFQO0FBRUg7Ozs7OztrQkFJVWpDLFkiLCJmaWxlIjoiQ2hpbGRDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi9DYWxsYWJsZSc7XG5pbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgU2VxdWVudGlhbERpc3BhdGNoZXIsIFByb2JsZW0gfSBmcm9tICcuL2Rpc3BhdGNoJztcbmltcG9ydCB7IGVzY2FsYXRlIH0gZnJvbSAnLi9kaXNwYXRjaC9zdHJhdGVneSc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IGRlZmF1bHRfZGlzcGF0Y2hlciA9IChwKSA9PiBuZXcgU2VxdWVudGlhbERpc3BhdGNoZXIocCk7XG5cbi8qKlxuICogTG9jYWxSZWZlcmVuY2UgaXMgYSBSZWZlcmVuY2UgdG8gYW4gQWN0b3IgaW4gdGhlIGN1cnJlbnQgYWRkcmVzcyBzcGFjZS5cbiAqIEBpbXBsZW1lbnRzIHtSZWZlcmVuY2V9XG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZWxsRm4pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHRlbGxGbiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbiA9IHRlbGxGbjtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG0pIHtcblxuICAgICAgICB0aGlzLl90ZWxsRm4obSk7XG5cbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGg7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDaGlsZENvbnRleHQgaXMgdGhlIENvbnRleHQgb2YgZWFjaCBzZWxmIGNyZWF0ZWQgaW4gdGhpcyBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZkZhY3Rvcnl9d3pyZC5pblxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtDb250ZXh0fSBbcGFyZW50XVxuICogQHBhcmFtIHtDb25jZXJuRmFjdG9yeX0gZmFjdG9yeVxuICogQHBhcmFtIHtTeXN0ZW19IHN5c3RlbVxuICovXG5leHBvcnQgY2xhc3MgQ2hpbGRDb250ZXh0IHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHBhcmVudCwgcm9vdCwgeyBzdHJhdGVneSwgZGlzcGF0Y2ggfSkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgcGFyZW50IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHJvb3QgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG4gICAgICAgIGJlb2YoeyBzdHJhdGVneSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgZGlzcGF0Y2ggfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICAgIHRoaXMuX3NlbGYgPSBuZXcgTG9jYWxSZWZlcmVuY2UodGhpcy5fcGF0aCwgbSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgUHJvYmxlbSkge1xuICAgICAgICAgICAgICAgIHN0cmF0ZWd5KG0uZXJyb3IsIG0uY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoLnRlbGwobSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZjtcblxuICAgIH1cblxuICAgIGlzKHJlZikge1xuXG4gICAgICAgIHJldHVybiAoU3RyaW5nKHJlZikgPT09IHRoaXMuX3BhdGgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5fcGF0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGYoKTtcblxuICAgICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aCh0aGlzLl9wYXRoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZWN0KHBhdGgpO1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbi5tYXAoYyA9PiBjLmNvbnRleHQpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICAvL0B0b2RvXG4gICAgICAgICAgICAgICAgLy9zaG91bGQgcmV0dXJuIGEgbnVsbCByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICByZXR1cm4geyB0ZWxsKCkge30gfTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5wYXRoKCkgPT09IHBhdGgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5zdGFydHNXaXRoKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbiAgICBzcGF3bih7XG4gICAgICAgICAgICBzdHJhdGVneSA9IGVzY2FsYXRlLFxuICAgICAgICAgICAgZGlzcGF0Y2hlciA9IGRlZmF1bHRfZGlzcGF0Y2hlcixcbiAgICAgICAgICAgIHN0YXJ0XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUgPSB2NCgpKSB7XG5cbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaGVyIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBuYW1lIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgc3RhcnQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB2YXIgc2xhc2ggPSAodGhpcy5fcGF0aCA9PT0gJy8nKSA/ICcnIDogJy8nO1xuICAgICAgICB2YXIgcGF0aCA9IGAke3RoaXMuX3BhdGh9JHtzbGFzaH0ke25hbWV9YDtcbiAgICAgICAgdmFyIGRpc3BhdGNoID0gZGlzcGF0Y2hlcih0aGlzLl9zZWxmKTtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ2hpbGRDb250ZXh0KHBhdGgsIHRoaXMsIHRoaXMuX3Jvb3QsIHsgZGlzcGF0Y2gsIHN0cmF0ZWd5IH0pO1xuICAgICAgICB2YXIgc2VsZiA9IGNvbnRleHQuc2VsZigpO1xuXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goeyBwYXRoLCBjb250ZXh0LCBzdGFydCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHN0YXJ0LmNhbGwoY29udGV4dCk7XG4gICAgICAgIHNlbGYudGVsbCgnc3RhcnRlZCcpO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShuZXh0LCB0aW1lKSB7XG5cbiAgICAgICAgYmVvZih7IG5leHQgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2guYXNrKHsgcmVjZWl2ZTogbmV4dCwgY29udGV4dDogdGhpcywgdGltZSB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlsZENvbnRleHRcbiJdfQ==