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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJOT19OQU1FIiwiTG9jYWxSZWZlcmVuY2UiLCJwYXRoIiwidGVsbEZuIiwic3RyaW5nIiwiZnVuY3Rpb24iLCJfdGVsbEZuIiwiX3BhdGgiLCJtIiwidG9TdHJpbmciLCJDaGlsZENvbnRleHQiLCJwYXJlbnQiLCJyb290Iiwic3RyYXRlZ3kiLCJkaXNwYXRjaCIsImludGVyZmFjZSIsIl9zdGFjayIsIl9jaGlsZHJlbiIsIl9kaXNwYXRjaCIsIl9wYXJlbnQiLCJfc3RyYXRlZ3kiLCJfcm9vdCIsIl9zZWxmIiwibWVzc2FnZSIsIkVycm9yIiwiZXJyb3IiLCJjb250ZXh0IiwidGVsbCIsInNlbGYiLCJyZWYiLCJTdHJpbmciLCJyZXF1ZXN0ZWQiLCJmcm9tIiwic3RhcnRzV2l0aCIsInNlbGVjdCIsImNoaWxkcyIsIm1hcCIsImMiLCJuZXh0IiwiY2hpbGQiLCJwb3AiLCJpZCIsImRpc3BhdGNoZXIiLCJzdGFydCIsInNsYXNoIiwicHVzaCIsInJlY2VpdmUiLCJjYWxsIiwidGltZSIsIm9wdGlvbmFsIiwibnVtYmVyIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiYXNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxTQUFQQSxJQUFPLEdBQU0sQ0FBRSxDQUFyQjtBQUNBLElBQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLENBQUQ7QUFBQSxXQUFPLG1DQUF5QkEsQ0FBekIsQ0FBUDtBQUFBLENBQTNCO0FBQ0EsSUFBTUMsVUFBVSxhQUFoQjs7QUFFQTs7Ozs7SUFJYUMsYyxXQUFBQSxjO0FBRVQsNEJBQVlDLElBQVosRUFBa0JDLE1BQWxCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFL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LEtBQWYsR0FBdUJxQyxLQUF2QixHQUErQkgsRUFBbkM7QUFDQSxnQkFBSTNCLFdBQVc0QixXQUFXLEtBQUtyQixLQUFoQixDQUFmO0FBQ0EsZ0JBQUlLLFVBQVUsSUFBSWhCLFlBQUosQ0FBaUJSLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLEtBQUttQixLQUFsQyxFQUF5QyxFQUFFUCxrQkFBRixFQUFZRCxrQkFBWixFQUF6QyxDQUFkO0FBQ0EsZ0JBQUllLE9BQU9GLFFBQVFFLElBQVIsRUFBWDs7QUFFQSxpQkFBS1gsU0FBTCxDQUFlNEIsSUFBZixDQUFvQixFQUFFM0MsVUFBRixFQUFRd0IsZ0JBQVIsRUFBaUJpQixZQUFqQixFQUF3QjlCLGtCQUF4QixFQUFwQjs7QUFFQWEsb0JBQVFvQixPQUFSLENBQWdCSCxNQUFNSSxJQUFOLENBQVdyQixPQUFYLEVBQW9CQSxPQUFwQixDQUFoQjtBQUNSOzs7Ozs7QUFNUSxtQkFBT0UsSUFBUDtBQUVIOzs7Z0NBRU9VLEksRUFBTVUsSSxFQUFNOztBQUVoQixnQ0FBSyxFQUFFVixVQUFGLEVBQUwsRUFBZXZCLFNBQWY7QUFDQSxnQ0FBSyxFQUFFaUMsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLGdCQUFJQyxPQUFRLFFBQU9iLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBakIsR0FDUEEsS0FBS2MsV0FBTCxDQUFpQkQsSUFEVixHQUNpQmIsS0FBS2EsSUFEakM7O0FBR0FBLG1CQUFPQSxPQUFPQSxJQUFQLEdBQWNuRCxPQUFyQjtBQUNBLG1CQUFPLEtBQUtrQixTQUFMLENBQWVtQyxHQUFmLENBQW1CLEVBQUVQLFNBQVNSLElBQVgsRUFBaUJaLFNBQVMsSUFBMUIsRUFBZ0NzQixVQUFoQyxFQUFzQ0csVUFBdEMsRUFBbkIsQ0FBUDtBQUVIOzs7Ozs7a0JBSVV6QyxZIiwiZmlsZSI6IkNoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4vQ2FsbGFibGUnO1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IFNlcXVlbnRpYWxEaXNwYXRjaGVyLCBQcm9ibGVtLCBFbnZlbG9wZSB9IGZyb20gJy4vZGlzcGF0Y2gnO1xuaW1wb3J0IHsgU2VsZWN0TWlzc0V2ZW50LCBTZWxlY3RIaXRFdmVudCB9IGZyb20gJy4vZGlzcGF0Y2gvZXZlbnRzJztcbmltcG9ydCB7IGVzY2FsYXRlIH0gZnJvbSAnLi9kaXNwYXRjaC9zdHJhdGVneSc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IGRlZmF1bHRfZGlzcGF0Y2hlciA9IChwKSA9PiBuZXcgU2VxdWVudGlhbERpc3BhdGNoZXIocCk7XG5jb25zdCBOT19OQU1FID0gJzxhbm9ueW1vdXM+JztcblxuLyoqXG4gKiBMb2NhbFJlZmVyZW5jZSBpcyBhIFJlZmVyZW5jZSB0byBhbiBBY3RvciBpbiB0aGUgY3VycmVudCBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRlbGxGbikge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgdGVsbEZuIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuID0gdGVsbEZuO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcblxuICAgIH1cblxuICAgIHRlbGwobSkge1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbihtKTtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX1cbiAqIEBpbXBsZW1lbnRzIHtDb250ZXh0fVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7Q29udGV4dH0gW3BhcmVudF1cbiAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAqIEBwYXJhbSB7U3lzdGVtfSBzeXN0ZW1cbiAqL1xuZXhwb3J0IGNsYXNzIENoaWxkQ29udGV4dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBwYXJlbnQsIHJvb3QsIHsgc3RyYXRlZ3ksIGRpc3BhdGNoIH0pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHBhcmVudCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyByb290IH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoIH0pLmludGVyZmFjZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgICB0aGlzLl9zZWxmID0gbmV3IExvY2FsUmVmZXJlbmNlKHBhdGgsIG1lc3NhZ2UgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFByb2JsZW0pXG4gICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5KG1lc3NhZ2UuZXJyb3IsIG1lc3NhZ2UuY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBtZXNzYWdlOyAvL3Nob3VsZCBuZXZlciBoYXBwZW5cbiAgICAgICAgICAgICAgICAvL3RoaXMucGFyZW50KCkudGVsbChtZXNzYWdlKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLnRlbGwobmV3IEVudmVsb3BlKHsgcGF0aCwgbWVzc2FnZSB9KSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgfVxuXG4gICAgbm9uZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxmO1xuXG4gICAgfVxuXG4gICAgaXMocmVmKSB7XG5cbiAgICAgICAgcmV0dXJuIChTdHJpbmcocmVmKSA9PT0gdGhpcy5fcGF0aCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIGlmIChwYXRoID09PSB0aGlzLl9wYXRoKVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290LnRlbGwobmV3IFNlbGVjdEhpdEV2ZW50KHsgcmVxdWVzdGVkOiBwYXRoLCBmcm9tOiB0aGlzLl9wYXRoIH0pKSxcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGYoKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aCh0aGlzLl9wYXRoKSlcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC50ZWxsKG5ldyBTZWxlY3RNaXNzRXZlbnQoeyByZXF1ZXN0ZWQ6IHBhdGgsIGZyb206IHRoaXMuX3BhdGggfSkpLFxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5zZWxlY3QocGF0aClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuX2NoaWxkcmVuLm1hcChjID0+IGMuY29udGV4dCk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnBhdGgoKSA9PT0gcGF0aCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGYoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLnN0YXJ0c1dpdGgoY2hpbGQucGF0aCgpKSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGVjdChwYXRoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dChjaGlsZHMucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcblxuICAgIH1cblxuICAgIHNwYXduKHtcbiAgICAgICAgaWQgPSB2NCgpLFxuICAgICAgICBzdHJhdGVneSA9IGVzY2FsYXRlLFxuICAgICAgICBkaXNwYXRjaGVyID0gZGVmYXVsdF9kaXNwYXRjaGVyLFxuICAgICAgICBzdGFydFxuICAgIH0pIHtcblxuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoZXIgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGlkIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgc3RhcnQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB2YXIgc2xhc2ggPSAodGhpcy5fcGF0aCA9PT0gJy8nKSA/ICcnIDogJy8nO1xuICAgICAgICB2YXIgcGF0aCA9IGAke3RoaXMuX3BhdGh9JHtzbGFzaH0ke2lkfWA7XG4gICAgICAgIHZhciBkaXNwYXRjaCA9IGRpc3BhdGNoZXIodGhpcy5fcm9vdCk7XG4gICAgICAgIHZhciBjb250ZXh0ID0gbmV3IENoaWxkQ29udGV4dChwYXRoLCB0aGlzLCB0aGlzLl9yb290LCB7IGRpc3BhdGNoLCBzdHJhdGVneSB9KTtcbiAgICAgICAgdmFyIHNlbGYgPSBjb250ZXh0LnNlbGYoKTtcblxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKHsgcGF0aCwgY29udGV4dCwgc3RhcnQsIHN0cmF0ZWd5IH0pO1xuXG4gICAgICAgIGNvbnRleHQucmVjZWl2ZShzdGFydC5jYWxsKGNvbnRleHQsIGNvbnRleHQpKTtcbi8qXG4gICAgICAgIFByb21pc2UudHJ5KCgpID0+IHN0YXJ0LmNhbGwoY29udGV4dCwgY29udGV4dCkpLlxuICAgICAgICB0aGVuKCgpID0+IHNlbGYudGVsbCgnc3RhcnRlZCcpKS5cbiAgICAgICAgY2F0Y2goZXJyb3IgPT5cbiAgICAgICAgICAgIHRoaXMuX3N0cmF0ZWd5KG5ldyBQcm9ibGVtKGVycm9yLCBjb250ZXh0KSwgY29udGV4dCwgdGhpcykpO1xuKi9cbiAgICAgICAgcmV0dXJuIHNlbGY7XG5cbiAgICB9XG5cbiAgICByZWNlaXZlKG5leHQsIHRpbWUpIHtcblxuICAgICAgICBiZW9mKHsgbmV4dCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgdGltZSB9KS5vcHRpb25hbCgpLm51bWJlcigpO1xuXG4gICAgICAgIGxldCBuYW1lID0gKHR5cGVvZiBuZXh0ID09PSAnb2JqZWN0JykgP1xuICAgICAgICAgICAgbmV4dC5jb25zdHJ1Y3Rvci5uYW1lIDogbmV4dC5uYW1lO1xuXG4gICAgICAgIG5hbWUgPSBuYW1lID8gbmFtZSA6IE5PX05BTUU7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaC5hc2soeyByZWNlaXZlOiBuZXh0LCBjb250ZXh0OiB0aGlzLCB0aW1lLCBuYW1lIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaWxkQ29udGV4dFxuIl19