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
        (0, _beof2.default)({ strategy: strategy }).function();
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
        value: function receive(next, time) {

            (0, _beof2.default)({ next: next }).function();
            (0, _beof2.default)({ time: time }).optional().number();

            return this._dispatch.ask({ receive: next, context: this, time: time });
        }
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJtZXNzYWdlIiwiRXJyb3IiLCJlcnJvciIsImNvbnRleHQiLCJ0ZWxsIiwic2VsZiIsInJlZiIsIlN0cmluZyIsInJlcXVlc3RlZCIsImZyb20iLCJzdGFydHNXaXRoIiwic2VsZWN0IiwiY2hpbGRzIiwibWFwIiwiYyIsIm5leHQiLCJjaGlsZCIsInBvcCIsImlkIiwiZGlzcGF0Y2hlciIsInN0YXJ0Iiwic2xhc2giLCJwdXNoIiwidHJ5IiwiY2FsbCIsInRoZW4iLCJjYXRjaCIsInRpbWUiLCJvcHRpb25hbCIsIm51bWJlciIsImFzayIsInJlY2VpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxTQUFQQSxJQUFPLEdBQU0sQ0FBRSxDQUFyQjtBQUNBLElBQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLENBQUQ7QUFBQSxXQUFPLG1DQUF5QkEsQ0FBekIsQ0FBUDtBQUFBLENBQTNCOztBQUVBOzs7OztJQUlhQyxjLFdBQUFBLGM7QUFFVCw0QkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEI7QUFBQTs7QUFFdEIsNEJBQUssRUFBRUQsVUFBRixFQUFMLEVBQWVFLE1BQWY7QUFDQSw0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QUFuQztBQUNBLGdCQUFJM0IsV0FBVzRCLFdBQVcsS0FBS3JCLEtBQWhCLENBQWY7QUFDQSxnQkFBSUssVUFBVSxJQUFJaEIsWUFBSixDQUFpQlIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsS0FBS21CLEtBQWxDLEVBQXlDLEVBQUVQLGtCQUFGLEVBQVlELGtCQUFaLEVBQXpDLENBQWQ7QUFDQSxnQkFBSWUsT0FBT0YsUUFBUUUsSUFBUixFQUFYOztBQUVBLGlCQUFLWCxTQUFMLENBQWU0QixJQUFmLENBQW9CLEVBQUUzQyxVQUFGLEVBQVF3QixnQkFBUixFQUFpQmlCLFlBQWpCLEVBQXdCOUIsa0JBQXhCLEVBQXBCOztBQUVBLCtCQUFRaUMsR0FBUixDQUFZO0FBQUEsdUJBQU1ILE1BQU1JLElBQU4sQ0FBV3JCLE9BQVgsRUFBb0JBLE9BQXBCLENBQU47QUFBQSxhQUFaLEVBQ0FzQixJQURBLENBQ0s7QUFBQSx1QkFBTXBCLEtBQUtELElBQUwsQ0FBVSxTQUFWLENBQU47QUFBQSxhQURMLEVBRUFzQixLQUZBLENBRU07QUFBQSx1QkFDRixPQUFLN0IsU0FBTCxDQUFlLHNCQUFZSyxLQUFaLEVBQW1CQyxPQUFuQixDQUFmLEVBQTRDQSxPQUE1QyxTQURFO0FBQUEsYUFGTjs7QUFLQSxtQkFBT0UsSUFBUDtBQUVIOzs7Z0NBRU9VLEksRUFBTVksSSxFQUFNOztBQUVoQixnQ0FBSyxFQUFFWixVQUFGLEVBQUwsRUFBZWpDLFFBQWY7QUFDQSxnQ0FBSyxFQUFFNkMsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLG1CQUFPLEtBQUtsQyxTQUFMLENBQWVtQyxHQUFmLENBQW1CLEVBQUVDLFNBQVNoQixJQUFYLEVBQWlCWixTQUFTLElBQTFCLEVBQWdDd0IsVUFBaEMsRUFBbkIsQ0FBUDtBQUVIOzs7Ozs7a0JBSVV4QyxZIiwiZmlsZSI6IkNoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4vQ2FsbGFibGUnO1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IFNlcXVlbnRpYWxEaXNwYXRjaGVyLCBQcm9ibGVtLCBFbnZlbG9wZSB9IGZyb20gJy4vZGlzcGF0Y2gnO1xuaW1wb3J0IHsgU2VsZWN0TWlzc0V2ZW50LCBTZWxlY3RIaXRFdmVudCB9IGZyb20gJy4vZGlzcGF0Y2gvZXZlbnRzJztcbmltcG9ydCB7IGVzY2FsYXRlIH0gZnJvbSAnLi9kaXNwYXRjaC9zdHJhdGVneSc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbmNvbnN0IGRlZmF1bHRfZGlzcGF0Y2hlciA9IChwKSA9PiBuZXcgU2VxdWVudGlhbERpc3BhdGNoZXIocCk7XG5cbi8qKlxuICogTG9jYWxSZWZlcmVuY2UgaXMgYSBSZWZlcmVuY2UgdG8gYW4gQWN0b3IgaW4gdGhlIGN1cnJlbnQgYWRkcmVzcyBzcGFjZS5cbiAqIEBpbXBsZW1lbnRzIHtSZWZlcmVuY2V9XG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCB0ZWxsRm4pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHRlbGxGbiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3RlbGxGbiA9IHRlbGxGbjtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG0pIHtcblxuICAgICAgICB0aGlzLl90ZWxsRm4obSk7XG5cbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGg7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDaGlsZENvbnRleHQgaXMgdGhlIENvbnRleHQgb2YgZWFjaCBzZWxmIGNyZWF0ZWQgaW4gdGhpcyBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZkZhY3Rvcnl9XG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge0NvbnRleHR9IFtwYXJlbnRdXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5XG4gKiBAcGFyYW0ge1N5c3RlbX0gc3lzdGVtXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgcGFyZW50LCByb290LCB7IHN0cmF0ZWd5LCBkaXNwYXRjaCB9KSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBwYXJlbnQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgcm9vdCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaCB9KS5pbnRlcmZhY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgICAgdGhpcy5fc2VsZiA9IG5ldyBMb2NhbFJlZmVyZW5jZShwYXRoLCBtZXNzYWdlID0+IHtcblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvcikge1xuXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBQcm9ibGVtKVxuICAgICAgICAgICAgICAgICAgICBzdHJhdGVneShtZXNzYWdlLmVycm9yLCBtZXNzYWdlLmNvbnRleHQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTsgLy9zaG91bGQgbmV2ZXIgaGFwcGVuXG4gICAgICAgICAgICAgICAgLy90aGlzLnBhcmVudCgpLnRlbGwobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBkaXNwYXRjaC50ZWxsKG5ldyBFbnZlbG9wZSh7IHBhdGgsIG1lc3NhZ2UgfSkpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuc2VsZigpO1xuXG4gICAgfVxuXG4gICAgcm9vdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgIH1cblxuICAgIG5vbmUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Quc2VsZigpO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZjtcblxuICAgIH1cblxuICAgIGlzKHJlZikge1xuXG4gICAgICAgIHJldHVybiAoU3RyaW5nKHJlZikgPT09IHRoaXMuX3BhdGgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5fcGF0aClcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdC50ZWxsKG5ldyBTZWxlY3RIaXRFdmVudCh7IHJlcXVlc3RlZDogcGF0aCwgZnJvbTogdGhpcy5fcGF0aCB9KSksXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxmKClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFwYXRoLnN0YXJ0c1dpdGgodGhpcy5fcGF0aCkpXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QudGVsbChuZXcgU2VsZWN0TWlzc0V2ZW50KHsgcmVxdWVzdGVkOiBwYXRoLCBmcm9tOiB0aGlzLl9wYXRoIH0pKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQuc2VsZWN0KHBhdGgpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbi5tYXAoYyA9PiBjLmNvbnRleHQpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gY2hpbGQgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5wYXRoKCkgPT09IHBhdGgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGF0aC5zdGFydHNXaXRoKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbiAgICBzcGF3bih7XG4gICAgICAgIGlkID0gdjQoKSxcbiAgICAgICAgc3RyYXRlZ3kgPSBlc2NhbGF0ZSxcbiAgICAgICAgZGlzcGF0Y2hlciA9IGRlZmF1bHRfZGlzcGF0Y2hlcixcbiAgICAgICAgc3RhcnRcbiAgICB9KSB7XG5cbiAgICAgICAgYmVvZih7IHN0cmF0ZWd5IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaGVyIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBpZCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHN0YXJ0IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdmFyIHNsYXNoID0gKHRoaXMuX3BhdGggPT09ICcvJykgPyAnJyA6ICcvJztcbiAgICAgICAgdmFyIHBhdGggPSBgJHt0aGlzLl9wYXRofSR7c2xhc2h9JHtpZH1gO1xuICAgICAgICB2YXIgZGlzcGF0Y2ggPSBkaXNwYXRjaGVyKHRoaXMuX3Jvb3QpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBkaXNwYXRjaCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHZhciBzZWxmID0gY29udGV4dC5zZWxmKCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh7IHBhdGgsIGNvbnRleHQsIHN0YXJ0LCBzdHJhdGVneSB9KTtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBzdGFydC5jYWxsKGNvbnRleHQsIGNvbnRleHQpKS5cbiAgICAgICAgdGhlbigoKSA9PiBzZWxmLnRlbGwoJ3N0YXJ0ZWQnKSkuXG4gICAgICAgIGNhdGNoKGVycm9yID0+XG4gICAgICAgICAgICB0aGlzLl9zdHJhdGVneShuZXcgUHJvYmxlbShlcnJvciwgY29udGV4dCksIGNvbnRleHQsIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcblxuICAgIH1cblxuICAgIHJlY2VpdmUobmV4dCwgdGltZSkge1xuXG4gICAgICAgIGJlb2YoeyBuZXh0IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoLmFzayh7IHJlY2VpdmU6IG5leHQsIGNvbnRleHQ6IHRoaXMsIHRpbWUgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=