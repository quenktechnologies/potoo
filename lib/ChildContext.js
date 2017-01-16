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

var _nodeUuid = require('node-uuid');

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

        var strategy = _ref.strategy;
        var dispatch = _ref.dispatch;

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
            var _ref2$strategy = _ref2.strategy;
            var strategy = _ref2$strategy === undefined ? _strategy.escalate : _ref2$strategy;
            var _ref2$dispatcher = _ref2.dispatcher;
            var dispatcher = _ref2$dispatcher === undefined ? default_dispatcher : _ref2$dispatcher;
            var start = _ref2.start;
            var name = arguments.length <= 1 || arguments[1] === undefined ? (0, _nodeUuid.v4)() : arguments[1];


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJlcnJvciIsImNvbnRleHQiLCJ0ZWxsIiwicmVmIiwiU3RyaW5nIiwic2VsZiIsInN0YXJ0c1dpdGgiLCJzZWxlY3QiLCJjaGlsZHMiLCJtYXAiLCJjIiwibmV4dCIsImNoaWxkIiwicG9wIiwiZGlzcGF0Y2hlciIsInN0YXJ0IiwibmFtZSIsInNsYXNoIiwicHVzaCIsImNhbGwiLCJ0aW1lIiwib3B0aW9uYWwiLCJudW1iZXIiLCJhc2siLCJyZWNlaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sR0FBTSxDQUFFLENBQXJCO0FBQ0EsSUFBTUMscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsQ0FBRDtBQUFBLFdBQU8sbUNBQXlCQSxDQUF6QixDQUFQO0FBQUEsQ0FBM0I7O0FBRUE7Ozs7O0lBSWFDLGMsV0FBQUEsYztBQUVULDRCQUFZQyxJQUFaLEVBQWtCQyxNQUFsQixFQUEwQjtBQUFBOztBQUV0Qiw0QkFBSyxFQUFFRCxVQUFGLEVBQUwsRUFBZUUsTUFBZjtBQUNBLDRCQUFLLEVBQUVELGNBQUYsRUFBTCxFQUFpQkUsUUFBakI7O0FBRUEsYUFBS0MsT0FBTCxHQUFlSCxNQUFmO0FBQ0EsYUFB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QWU3QixRQUFmO0FBQ0EsZ0NBQUssRUFBRXNDLFVBQUYsRUFBTCxFQUFlQyxRQUFmLEdBQTBCQyxNQUExQjs7QUFFQSxtQkFBTyxLQUFLM0IsU0FBTCxDQUFlNEIsR0FBZixDQUFtQixFQUFDQyxTQUFRYixJQUFULEVBQWVWLFNBQVEsSUFBdkIsRUFBNkJtQixVQUE3QixFQUFuQixDQUFQO0FBRUg7Ozs7OztrQkFJVWpDLFkiLCJmaWxlIjoiQ2hpbGRDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi9DYWxsYWJsZSc7XG5pbXBvcnQgeyB2NCB9IGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgeyBTZXF1ZW50aWFsRGlzcGF0Y2hlciwgUHJvYmxlbSB9IGZyb20gJy4vZGlzcGF0Y2gnO1xuaW1wb3J0IHsgZXNjYWxhdGUgfSBmcm9tICcuL2Rpc3BhdGNoL3N0cmF0ZWd5JztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuY29uc3QgZGVmYXVsdF9kaXNwYXRjaGVyID0gKHApID0+IG5ldyBTZXF1ZW50aWFsRGlzcGF0Y2hlcihwKTtcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBpcyBhIFJlZmVyZW5jZSB0byBhbiBBY3RvciBpbiB0aGUgY3VycmVudCBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbGxGbikge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgdGVsbEZuIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuID0gdGVsbEZuO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbihtKTtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX13enJkLmluXG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge0NvbnRleHR9IFtwYXJlbnRdXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5XG4gKiBAcGFyYW0ge1N5c3RlbX0gc3lzdGVtXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgcGFyZW50LCByb290LCB7IHN0cmF0ZWd5LCBkaXNwYXRjaCB9KSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBwYXJlbnQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgcm9vdCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgICAgdGhpcy5fc2VsZiA9IG5ldyBMb2NhbFJlZmVyZW5jZSh0aGlzLl9wYXRoLCBtID0+IHtcblxuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBQcm9ibGVtKSB7XG4gICAgICAgICAgICAgICAgc3RyYXRlZ3kobS5lcnJvciwgbS5jb250ZXh0LCB0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2gudGVsbChtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcblxuICAgIH1cblxuICAgIHJvb3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxmO1xuXG4gICAgfVxuXG4gICAgaXMocmVmKSB7XG5cbiAgICAgICAgcmV0dXJuIChTdHJpbmcocmVmKSA9PT0gdGhpcy5fcGF0aCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIGlmIChwYXRoID09PSB0aGlzLl9wYXRoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZigpO1xuXG4gICAgICAgIGlmICghcGF0aC5zdGFydHNXaXRoKHRoaXMuX3BhdGgpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuX2NoaWxkcmVuLm1hcChjID0+IGMuY29udGV4dCk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcblxuICAgICAgICAgICAgICAgIC8vQHRvZG9cbiAgICAgICAgICAgICAgICAvL3Nob3VsZCByZXR1cm4gYSBudWxsIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHRlbGwoKSB7fSB9O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnBhdGgoKSA9PT0gcGF0aCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGYoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLnN0YXJ0c1dpdGgoY2hpbGQucGF0aCgpKSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGVjdChwYXRoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dChjaGlsZHMucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcblxuICAgIH1cblxuICAgIHNwYXduKHtcbiAgICAgICAgICAgIHN0cmF0ZWd5ID0gZXNjYWxhdGUsXG4gICAgICAgICAgICBkaXNwYXRjaGVyID0gZGVmYXVsdF9kaXNwYXRjaGVyLFxuICAgICAgICAgICAgc3RhcnRcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSA9IHY0KCkpIHtcblxuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoZXIgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IG5hbWUgfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBzdGFydCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHZhciBzbGFzaCA9ICh0aGlzLl9wYXRoID09PSAnLycpID8gJycgOiAnLyc7XG4gICAgICAgIHZhciBwYXRoID0gYCR7dGhpcy5fcGF0aH0ke3NsYXNofSR7bmFtZX1gO1xuICAgICAgICB2YXIgZGlzcGF0Y2ggPSBkaXNwYXRjaGVyKHRoaXMuX3NlbGYpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBkaXNwYXRjaCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHZhciBzZWxmID0gY29udGV4dC5zZWxmKCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh7IHBhdGgsIGNvbnRleHQsIHN0YXJ0LCBzdHJhdGVneSB9KTtcbiAgICAgICAgc3RhcnQuY2FsbChjb250ZXh0KTtcbiAgICAgICAgc2VsZi50ZWxsKCdzdGFydGVkJyk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG5cbiAgICB9XG5cbiAgICByZWNlaXZlKG5leHQsIHRpbWUpIHtcblxuICAgICAgICBiZW9mKHsgbmV4dCB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgdGltZSB9KS5vcHRpb25hbCgpLm51bWJlcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaC5hc2soe3JlY2VpdmU6bmV4dCwgY29udGV4dDp0aGlzLCB0aW1lfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=