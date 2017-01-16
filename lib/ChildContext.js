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
var default_mailbox = function default_mailbox(d) {
    return new _dispatch.UnboundedMailbox(d);
};
var default_dispatcher = function default_dispatcher() {
    return new _dispatch.SequentialDispatcher();
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

        var inbox = _ref.inbox;
        var strategy = _ref.strategy;
        var dispatch = _ref.dispatch;

        _classCallCheck(this, ChildContext);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ parent: parent }).interface(_Context2.default);
        (0, _beof2.default)({ root: root }).interface(_Reference2.default);
        (0, _beof2.default)({ inbox: inbox }).object();
        (0, _beof2.default)({ strategy: strategy }).function();
        (0, _beof2.default)({ dispatch: dispatch }).interface(_dispatch.Dispatcher);

        this._stack = [];
        this._children = [];
        this._dispatch = dispatch;
        this._path = path;
        this._parent = parent;
        this._strategy = strategy;
        this._root = root;
        this._inbox = inbox;
        this._self = new LocalReference(this._path, function (m) {

            if (m instanceof _dispatch.Problem) {
                strategy(m.error, m.context, _this);
            } else {
                inbox.enqueue(m);
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
        key: 'inbox',
        value: function inbox() {

            return this._inbox;
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
            var _ref2$mailbox = _ref2.mailbox;
            var mailbox = _ref2$mailbox === undefined ? default_mailbox : _ref2$mailbox;
            var _ref2$strategy = _ref2.strategy;
            var strategy = _ref2$strategy === undefined ? _strategy.escalate : _ref2$strategy;
            var _ref2$dispatcher = _ref2.dispatcher;
            var dispatcher = _ref2$dispatcher === undefined ? default_dispatcher : _ref2$dispatcher;
            var start = _ref2.start;
            var name = arguments.length <= 1 || arguments[1] === undefined ? (0, _nodeUuid.v4)() : arguments[1];


            (0, _beof2.default)({ mailbox: mailbox }).function();
            (0, _beof2.default)({ strategy: strategy }).function();
            (0, _beof2.default)({ dispatcher: dispatcher }).function();
            (0, _beof2.default)({ name: name }).string();
            (0, _beof2.default)({ start: start }).interface(_Callable2.default);

            var slash = this._path === '/' ? '' : '/';
            var path = '' + this._path + slash + name;
            var dispatch = dispatcher(this._self);
            var inbox = mailbox(dispatch);
            var context = new ChildContext(path, this, this._root, { inbox: inbox, dispatch: dispatch, strategy: strategy });
            var self = context.self();

            this._children.push({ path: path, inbox: inbox, context: context, start: start, strategy: strategy });
            start.call(context);
            self.tell('started');

            return self;
        }
    }, {
        key: 'receive',
        value: function receive(behaviour, time) {

            (0, _beof2.default)({ behaviour: behaviour }).function();
            (0, _beof2.default)({ time: time }).optional().number();

            return this._dispatch.schedule(behaviour, this, time);
        }
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfbWFpbGJveCIsImQiLCJkZWZhdWx0X2Rpc3BhdGNoZXIiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJpbmJveCIsInN0cmF0ZWd5IiwiZGlzcGF0Y2giLCJpbnRlcmZhY2UiLCJvYmplY3QiLCJfc3RhY2siLCJfY2hpbGRyZW4iLCJfZGlzcGF0Y2giLCJfcGFyZW50IiwiX3N0cmF0ZWd5IiwiX3Jvb3QiLCJfaW5ib3giLCJfc2VsZiIsImVycm9yIiwiY29udGV4dCIsImVucXVldWUiLCJyZWYiLCJTdHJpbmciLCJzZWxmIiwic3RhcnRzV2l0aCIsInNlbGVjdCIsImNoaWxkcyIsIm1hcCIsImMiLCJuZXh0IiwiY2hpbGQiLCJ0ZWxsIiwicG9wIiwibWFpbGJveCIsImRpc3BhdGNoZXIiLCJzdGFydCIsIm5hbWUiLCJzbGFzaCIsInB1c2giLCJjYWxsIiwiYmVoYXZpb3VyIiwidGltZSIsIm9wdGlvbmFsIiwibnVtYmVyIiwic2NoZWR1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7QUFDQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsV0FBSywrQkFBcUJDLENBQXJCLENBQUw7QUFBQSxDQUF4QjtBQUNBLElBQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCO0FBQUEsV0FBTSxvQ0FBTjtBQUFBLENBQTNCOztBQUVBOzs7OztJQUlhQyxjLFdBQUFBLGM7QUFFVCw0QkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEI7QUFB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O0FBQ0EsZ0JBQUlZLFVBQVUsSUFBSWpCLFlBQUosQ0FBaUJSLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLEtBQUtxQixLQUFsQyxFQUF5QyxFQUFFVixZQUFGLEVBQVNFLGtCQUFULEVBQW1CRCxrQkFBbkIsRUFBekMsQ0FBZDtBQUNBLGdCQUFJaUIsT0FBT0osUUFBUUksSUFBUixFQUFYOztBQUVBLGlCQUFLWixTQUFMLENBQWUyQixJQUFmLENBQW9CLEVBQUU1QyxVQUFGLEVBQVFXLFlBQVIsRUFBZWMsZ0JBQWYsRUFBd0JnQixZQUF4QixFQUErQjdCLGtCQUEvQixFQUFwQjtBQUNBNkIsa0JBQU1JLElBQU4sQ0FBV3BCLE9BQVg7QUFDQUksaUJBQUtRLElBQUwsQ0FBVSxTQUFWOztBQUVBLG1CQUFPUixJQUFQO0FBRUg7OztnQ0FFT2lCLFMsRUFBV0MsSSxFQUFNOztBQUVyQixnQ0FBSyxFQUFFRCxvQkFBRixFQUFMLEVBQW9CM0MsUUFBcEI7QUFDQSxnQ0FBSyxFQUFFNEMsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLG1CQUFPLEtBQUsvQixTQUFMLENBQWVnQyxRQUFmLENBQXdCSixTQUF4QixFQUFtQyxJQUFuQyxFQUF5Q0MsSUFBekMsQ0FBUDtBQUVIOzs7Ozs7a0JBSVV2QyxZIiwiZmlsZSI6IkNoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4vQ2FsbGFibGUnO1xuaW1wb3J0IHsgdjQgfSBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IHsgRGlzcGF0Y2hlciwgVW5ib3VuZGVkTWFpbGJveCwgU2VxdWVudGlhbERpc3BhdGNoZXIsIFByb2JsZW0gfSBmcm9tICcuL2Rpc3BhdGNoJztcbmltcG9ydCB7IGVzY2FsYXRlIH0gZnJvbSAnLi9kaXNwYXRjaC9zdHJhdGVneSc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IGRlZmF1bHRfbWFpbGJveCA9IGQgPT4gbmV3IFVuYm91bmRlZE1haWxib3goZCk7XG5jb25zdCBkZWZhdWx0X2Rpc3BhdGNoZXIgPSAoKSA9PiBuZXcgU2VxdWVudGlhbERpc3BhdGNoZXIoKTtcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBpcyBhIFJlZmVyZW5jZSB0byBhbiBBY3RvciBpbiB0aGUgY3VycmVudCBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbGxGbikge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgdGVsbEZuIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuID0gdGVsbEZuO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbihtKTtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX13enJkLmluXG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge0NvbnRleHR9IFtwYXJlbnRdXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5XG4gKiBAcGFyYW0ge1N5c3RlbX0gc3lzdGVtXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgcGFyZW50LCByb290LCB7IGluYm94LCBzdHJhdGVneSwgZGlzcGF0Y2ggfSkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgcGFyZW50IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHJvb3QgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG4gICAgICAgIGJlb2YoeyBpbmJveCB9KS5vYmplY3QoKTtcbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaCB9KS5pbnRlcmZhY2UoRGlzcGF0Y2hlcik7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICAgIHRoaXMuX2luYm94ID0gaW5ib3g7XG4gICAgICAgIHRoaXMuX3NlbGYgPSBuZXcgTG9jYWxSZWZlcmVuY2UodGhpcy5fcGF0aCwgbSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgUHJvYmxlbSkge1xuICAgICAgICAgICAgICAgIHN0cmF0ZWd5KG0uZXJyb3IsIG0uY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluYm94LmVucXVldWUobSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgfVxuXG4gICAgaW5ib3goKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2luYm94O1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZjtcblxuICAgIH1cblxuICAgIGlzKHJlZikge1xuXG4gICAgICAgIHJldHVybiAoU3RyaW5nKHJlZikgPT09IHRoaXMuX3BhdGgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5fcGF0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGYoKTtcblxuICAgICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aCh0aGlzLl9wYXRoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZWN0KHBhdGgpO1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbi5tYXAoYyA9PiBjLmNvbnRleHQpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICAvL0B0b2RvXG4gICAgICAgICAgICAgICAgLy9zaG91bGQgcmV0dXJuIGEgbnVsbCByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICByZXR1cm4geyB0ZWxsKCkge30gfTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5wYXRoKCkgPT09IHBhdGgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5zdGFydHNXaXRoKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbiAgICBzcGF3bih7XG4gICAgICAgICAgICBtYWlsYm94ID0gZGVmYXVsdF9tYWlsYm94LFxuICAgICAgICAgICAgc3RyYXRlZ3kgPSBlc2NhbGF0ZSxcbiAgICAgICAgICAgIGRpc3BhdGNoZXIgPSBkZWZhdWx0X2Rpc3BhdGNoZXIsXG4gICAgICAgICAgICBzdGFydFxuICAgICAgICB9LFxuICAgICAgICBuYW1lID0gdjQoKSkge1xuXG4gICAgICAgIGJlb2YoeyBtYWlsYm94IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBzdHJhdGVneSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgZGlzcGF0Y2hlciB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgbmFtZSB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHN0YXJ0IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdmFyIHNsYXNoID0gKHRoaXMuX3BhdGggPT09ICcvJykgPyAnJyA6ICcvJztcbiAgICAgICAgdmFyIHBhdGggPSBgJHt0aGlzLl9wYXRofSR7c2xhc2h9JHtuYW1lfWA7XG4gICAgICAgIHZhciBkaXNwYXRjaCA9IGRpc3BhdGNoZXIodGhpcy5fc2VsZik7XG4gICAgICAgIHZhciBpbmJveCA9IG1haWxib3goZGlzcGF0Y2gpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBpbmJveCwgZGlzcGF0Y2gsIHN0cmF0ZWd5IH0pO1xuICAgICAgICB2YXIgc2VsZiA9IGNvbnRleHQuc2VsZigpO1xuXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goeyBwYXRoLCBpbmJveCwgY29udGV4dCwgc3RhcnQsIHN0cmF0ZWd5IH0pO1xuICAgICAgICBzdGFydC5jYWxsKGNvbnRleHQpO1xuICAgICAgICBzZWxmLnRlbGwoJ3N0YXJ0ZWQnKTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcblxuICAgIH1cblxuICAgIHJlY2VpdmUoYmVoYXZpb3VyLCB0aW1lKSB7XG5cbiAgICAgICAgYmVvZih7IGJlaGF2aW91ciB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgdGltZSB9KS5vcHRpb25hbCgpLm51bWJlcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaC5zY2hlZHVsZShiZWhhdmlvdXIsIHRoaXMsIHRpbWUpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaWxkQ29udGV4dFxuIl19