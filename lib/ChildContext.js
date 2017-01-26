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
            var dispatch = dispatcher(this._root);
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
        value: function receive(next, name, time) {

            (0, _beof2.default)({ next: next }).interface(_Callable2.default);
            (0, _beof2.default)({ time: time }).optional().number();

            name = name ? name : (typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object' ? next.constructor.name : next.name;

            return this._dispatch.ask({ receive: next, context: this, time: time, name: name });
        }
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJtZXNzYWdlIiwiRXJyb3IiLCJlcnJvciIsImNvbnRleHQiLCJ0ZWxsIiwic2VsZiIsInJlZiIsIlN0cmluZyIsInJlcXVlc3RlZCIsImZyb20iLCJzdGFydHNXaXRoIiwic2VsZWN0IiwiY2hpbGRzIiwibWFwIiwiYyIsIm5leHQiLCJjaGlsZCIsInBvcCIsImlkIiwiZGlzcGF0Y2hlciIsInN0YXJ0Iiwic2xhc2giLCJwdXNoIiwidHJ5IiwiY2FsbCIsInRoZW4iLCJjYXRjaCIsIm5hbWUiLCJ0aW1lIiwib3B0aW9uYWwiLCJudW1iZXIiLCJjb25zdHJ1Y3RvciIsImFzayIsInJlY2VpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sR0FBTSxDQUFFLENBQXJCO0FBQ0EsSUFBTUMscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsQ0FBRDtBQUFBLFdBQU8sbUNBQXlCQSxDQUF6QixDQUFQO0FBQUEsQ0FBM0I7O0FBRUE7Ozs7O0lBSWFDLGMsV0FBQUEsYztBQUVULDRCQUFZQyxJQUFaLEVBQWtCQyxNQUFsQixFQUEwQjtBQUFBOztBQUV0Qiw0QkFBSyxFQUFFRCxVQUFG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U0FBUyxJQUExQixFQUFnQ3lCLFVBQWhDLEVBQXNDRCxVQUF0QyxFQUFuQixDQUFQO0FBRUg7Ozs7OztrQkFJVXhDLFkiLCJmaWxlIjoiQ2hpbGRDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi9DYWxsYWJsZSc7XG5pbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgU2VxdWVudGlhbERpc3BhdGNoZXIsIFByb2JsZW0sIEVudmVsb3BlIH0gZnJvbSAnLi9kaXNwYXRjaCc7XG5pbXBvcnQgeyBTZWxlY3RNaXNzRXZlbnQsIFNlbGVjdEhpdEV2ZW50IH0gZnJvbSAnLi9kaXNwYXRjaC9ldmVudHMnO1xuaW1wb3J0IHsgZXNjYWxhdGUgfSBmcm9tICcuL2Rpc3BhdGNoL3N0cmF0ZWd5JztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuY29uc3QgZGVmYXVsdF9kaXNwYXRjaGVyID0gKHApID0+IG5ldyBTZXF1ZW50aWFsRGlzcGF0Y2hlcihwKTtcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBpcyBhIFJlZmVyZW5jZSB0byBhbiBBY3RvciBpbiB0aGUgY3VycmVudCBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbGxGbikge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgdGVsbEZuIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuID0gdGVsbEZuO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbihtKTtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX1cbiAqIEBpbXBsZW1lbnRzIHtDb250ZXh0fVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7Q29udGV4dH0gW3BhcmVudF1cbiAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAqIEBwYXJhbSB7U3lzdGVtfSBzeXN0ZW1cbiAqL1xuZXhwb3J0IGNsYXNzIENoaWxkQ29udGV4dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBwYXJlbnQsIHJvb3QsIHsgc3RyYXRlZ3ksIGRpc3BhdGNoIH0pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHBhcmVudCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyByb290IH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB0aGlzLl9zZWxmID0gbmV3IExvY2FsUmVmZXJlbmNlKHBhdGgsIG1lc3NhZ2UgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFByb2JsZW0pXG4gICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5KG1lc3NhZ2UuZXJyb3IsIG1lc3NhZ2UuY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBtZXNzYWdlOyAvL3Nob3VsZCBuZXZlciBoYXBwZW5cbiAgICAgICAgICAgICAgICAvL3RoaXMucGFyZW50KCkudGVsbChtZXNzYWdlKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLnRlbGwobmV3IEVudmVsb3BlKHsgcGF0aCwgbWVzc2FnZSB9KSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgfVxuXG4gICAgbm9uZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxmO1xuXG4gICAgfVxuXG4gICAgaXMocmVmKSB7XG5cbiAgICAgICAgcmV0dXJuIChTdHJpbmcocmVmKSA9PT0gdGhpcy5fcGF0aCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIGlmIChwYXRoID09PSB0aGlzLl9wYXRoKVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnRlbGwobmV3IFNlbGVjdEhpdEV2ZW50KHsgcmVxdWVzdGVkOiBwYXRoLCBmcm9tOiB0aGlzLl9wYXRoIH0pKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGYoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aCh0aGlzLl9wYXRoKSlcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC50ZWxsKG5ldyBTZWxlY3RNaXNzRXZlbnQoeyByZXF1ZXN0ZWQ6IHBhdGgsIGZyb206IHRoaXMuX3BhdGggfSkpLFxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5zZWxlY3QocGF0aClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuX2NoaWxkcmVuLm1hcChjID0+IGMuY29udGV4dCk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnBhdGgoKSA9PT0gcGF0aCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGYoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLnN0YXJ0c1dpdGgoY2hpbGQucGF0aCgpKSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGVjdChwYXRoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dChjaGlsZHMucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcblxuICAgIH1cblxuICAgIHNwYXduKHtcbiAgICAgICAgaWQgPSB2NCgpLFxuICAgICAgICBzdHJhdGVneSA9IGVzY2FsYXRlLFxuICAgICAgICBkaXNwYXRjaGVyID0gZGVmYXVsdF9kaXNwYXRjaGVyLFxuICAgICAgICBzdGFydFxuICAgIH0pIHtcblxuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoZXIgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGlkIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgc3RhcnQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB2YXIgc2xhc2ggPSAodGhpcy5fcGF0aCA9PT0gJy8nKSA/ICcnIDogJy8nO1xuICAgICAgICB2YXIgcGF0aCA9IGAke3RoaXMuX3BhdGh9JHtzbGFzaH0ke2lkfWA7XG4gICAgICAgIHZhciBkaXNwYXRjaCA9IGRpc3BhdGNoZXIodGhpcy5fcm9vdCk7XG4gICAgICAgIHZhciBjb250ZXh0ID0gbmV3IENoaWxkQ29udGV4dChwYXRoLCB0aGlzLCB0aGlzLl9yb290LCB7IGRpc3BhdGNoLCBzdHJhdGVneSB9KTtcbiAgICAgICAgdmFyIHNlbGYgPSBjb250ZXh0LnNlbGYoKTtcblxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHsgcGF0aCwgY29udGV4dCwgc3RhcnQsIHN0cmF0ZWd5IH0pO1xuXG4gICAgICAgIFByb21pc2UudHJ5KCgpID0+IHN0YXJ0LmNhbGwoY29udGV4dCwgY29udGV4dCkpLlxuICAgICAgICB0aGVuKCgpID0+IHNlbGYudGVsbCgnc3RhcnRlZCcpKS5cbiAgICAgICAgY2F0Y2goZXJyb3IgPT5cbiAgICAgICAgICAgIHRoaXMuX3N0cmF0ZWd5KG5ldyBQcm9ibGVtKGVycm9yLCBjb250ZXh0KSwgY29udGV4dCwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShuZXh0LCBuYW1lLCB0aW1lKSB7XG5cbiAgICAgICAgYmVvZih7IG5leHQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IHRpbWUgfSkub3B0aW9uYWwoKS5udW1iZXIoKTtcblxuICAgICAgICBuYW1lID0gbmFtZSA/IG5hbWUgOiAodHlwZW9mIG5leHQgPT09ICdvYmplY3QnKSA/XG4gICAgICAgICAgICBuZXh0LmNvbnN0cnVjdG9yLm5hbWUgOiBuZXh0Lm5hbWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoLmFzayh7IHJlY2VpdmU6IG5leHQsIGNvbnRleHQ6IHRoaXMsIHRpbWUsIG5hbWUgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=