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
            var _this2 = this;

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

            _bluebird2.default.try(function () {
                return start.call(context, context);
            }).then(function () {
                return self.tell('started');
            }).catch(function (error) {
                return _this2._strategy(new _dispatch.Problem(error, context), context, _this2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsibm9vcCIsImRlZmF1bHRfZGlzcGF0Y2hlciIsInAiLCJMb2NhbFJlZmVyZW5jZSIsInBhdGgiLCJ0ZWxsRm4iLCJzdHJpbmciLCJmdW5jdGlvbiIsIl90ZWxsRm4iLCJfcGF0aCIsIm0iLCJ0b1N0cmluZyIsIkNoaWxkQ29udGV4dCIsInBhcmVudCIsInJvb3QiLCJzdHJhdGVneSIsImRpc3BhdGNoIiwiaW50ZXJmYWNlIiwiX3N0YWNrIiwiX2NoaWxkcmVuIiwiX2Rpc3BhdGNoIiwiX3BhcmVudCIsIl9zdHJhdGVneSIsIl9yb290IiwiX3NlbGYiLCJFcnJvciIsImVycm9yIiwiY29udGV4dCIsInRlbGwiLCJzZWxmIiwicmVmIiwiU3RyaW5nIiwic3RhcnRzV2l0aCIsInNlbGVjdCIsImNoaWxkcyIsIm1hcCIsImMiLCJuZXh0IiwiY2hpbGQiLCJwb3AiLCJkaXNwYXRjaGVyIiwic3RhcnQiLCJuYW1lIiwic2xhc2giLCJwdXNoIiwidHJ5IiwiY2FsbCIsInRoZW4iLCJjYXRjaCIsInRpbWUiLCJvcHRpb25hbCIsIm51bWJlciIsImFzayIsInJlY2VpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxTQUFQQSxJQUFPLEdBQU0sQ0FBRSxDQUFyQjtBQUNBLElBQU1DLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLENBQUQ7QUFBQSxXQUFPLG1DQUF5QkEsQ0FBekIsQ0FBUDtBQUFBLENBQTNCOztBQUVBOzs7OztJQUlhQyxjLFdBQUFBLGM7QUFFVCw0QkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEI7QUFBQTs7QUFFdEIsNEJBQUssRUFBRUQsVUFBRixFQUFMLEVBQWVFLE1BQWY7QUFDQSw0QkFBSyxFQUFFRCxjQUFGLEVBQUwsRUFBaUJFLFFBQWpCOztBQUVBLGFBQUtDLE9BQUwsR0FBZUgsTUFBZjtBQUNBLGFBQUtJLEtBQUwsR0FBYUwsSUFBYjtBQUVIOzs7OzZCQUVJTSxDLEVBQUc7O0FBRUosaUJBQUtGLE9BQUwsQ0FBYUUsQ0FBYjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0MsUUFBTCxFQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLUCxJQUFaO0FBRUg7Ozs7OztBQUlMOzs7Ozs7Ozs7OztJQVNhUSxZLFdBQUFBLFk7QUFFVCwwQkFBWVIsSUFBWixFQUFrQlMsTUFBbEIsRUFBMEJDLElBQTFCLFFBQXdEO0FBQUE7O0FBQUEsWUFBdEJDLFFBQXNCLFFBQXRCQSxRQUFzQjtBQUFBLFlBQVpDLFFBQVksUUFBWkEsUUFBWTs7QUFBQTs7QUFFcEQsNEJBQUssRUFBRVosVUFBRixFQUFMLEVBQWVFLE1BQWY7QUFDQSw0QkFBSyxFQUFFTyxjQUFGLEVBQUwsRUFBaUJJLFNBQWpCO0FBQ0EsNEJBQUssRUFBRUgsVUFBRixFQUFMLEVBQWVHLFNBQWY7QUFDQSw0QkFBSyxFQUFFRixrQkFBRixFQUFMLEVBQW1CUixRQUFuQjtBQUNBLDRCQUFLLEVBQUVTLGtCQUFGLEVBQUwsRUFBbUJDLFNBQW5COztBQUVBLGFBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUtDLFNBQUwsR0FBaUJKLFFBQWpCO0FBQ0EsYUFBS1AsS0FBTCxHQUFhTCxJQUFiO0FBQ0EsYUFBS2lCLE9BQUwsR0FBZVIsTUFBZjtBQUNBLGFBQUtTLFNBQUwsR0FBaUJQLFFBQWpCO0FBQ0EsYUFBS1EsS0FBTCxHQUFhVCxJQUFiO0FBQ0EsYUFBS1UsS0FBTCxHQUFhLElBQUlyQixjQUFKLENBQW1CLEtBQUtNLEtBQXhCLEVBQStCLGFBQUs7O0FBRTdDLGdCQUFJQyxhQUFhZSxLQUFqQixFQUF3Qjs7QUFFcEIsb0JBQUlmLDhCQUFKLEVBQ0lLLFNBQVNMLEVBQUVnQixLQUFYLEVBQWtCaEIsRUFBRWlCLE9BQXBCLFNBREosS0FHSSxNQUFLZCxNQUFMLEdBQWNlLElBQWQsQ0FBbUJsQixDQUFuQjtBQUVQLGFBUEQsTUFPTzs7QUFFSE0seUJBQVNZLElBQVQsQ0FBY2xCLENBQWQ7QUFFSDtBQUVKLFNBZlksQ0FBYjtBQWlCSDs7OzsrQkFFTTs7QUFFSCxtQkFBTyxLQUFLRCxLQUFaO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyxLQUFLWSxPQUFMLENBQWFRLElBQWIsRUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS04sS0FBWjtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0EsS0FBTCxDQUFXTSxJQUFYLEVBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLEtBQUtMLEtBQVo7QUFFSDs7OzJCQUVFTSxHLEVBQUs7O0FBRUosbUJBQVFDLE9BQU9ELEdBQVAsTUFBZ0IsS0FBS3JCLEtBQTdCO0FBRUg7OzsrQkFFTUwsSSxFQUFNOztBQUVULGdDQUFLLEVBQUVBLFVBQUYsRUFBTCxFQUFlRSxNQUFmOztBQUVBLGdCQUFJRixTQUFTLEtBQUtLLEtBQWxCLEVBQ0ksT0FBTyxLQUFLb0IsSUFBTCxFQUFQOztBQUVKLGdCQUFJLENBQUN6QixLQUFLNEIsVUFBTCxDQUFnQixLQUFLdkIsS0FBckIsQ0FBTCxFQUNJLE9BQU8sS0FBS1ksT0FBTCxDQUFhWSxNQUFiLENBQW9CN0IsSUFBcEIsQ0FBUDs7QUFFSixnQkFBSThCLFNBQVMsS0FBS2YsU0FBTCxDQUFlZ0IsR0FBZixDQUFtQjtBQUFBLHVCQUFLQyxFQUFFVCxPQUFQO0FBQUEsYUFBbkIsQ0FBYjs7QUFFQSxnQkFBSVUsT0FBTyxTQUFQQSxJQUFPLFFBQVM7O0FBRWhCLG9CQUFJLENBQUNDLEtBQUwsRUFBWTs7QUFFUjtBQUNBO0FBQ0EsMkJBQU87QUFBRVYsNEJBQUYsa0JBQVMsQ0FBRTtBQUFYLHFCQUFQO0FBRUgsaUJBTkQsTUFNTyxJQUFJVSxNQUFNbEMsSUFBTixPQUFpQkEsSUFBckIsRUFBMkI7O0FBRTlCLDJCQUFPa0MsTUFBTVQsSUFBTixFQUFQO0FBRUgsaUJBSk0sTUFJQSxJQUFJekIsS0FBSzRCLFVBQUwsQ0FBZ0JNLE1BQU1sQyxJQUFOLEVBQWhCLENBQUosRUFBbUM7O0FBRXRDLDJCQUFPa0MsTUFBTUwsTUFBTixDQUFhN0IsSUFBYixDQUFQO0FBRUg7O0FBRUQsdUJBQU9pQyxLQUFLSCxPQUFPSyxHQUFQLEVBQUwsQ0FBUDtBQUNILGFBbkJEOztBQXFCQSxtQkFBT0YsS0FBS0gsT0FBT0ssR0FBUCxFQUFMLENBQVA7QUFFSDs7O3FDQU9nQjtBQUFBOztBQUFBLHVDQUpUeEIsUUFJUztBQUFBLGdCQUpUQSxRQUlTO0FBQUEseUNBSFR5QixVQUdTO0FBQUEsZ0JBSFRBLFVBR1Msb0NBSEl2QyxrQkFHSjtBQUFBLGdCQUZUd0MsS0FFUyxTQUZUQSxLQUVTO0FBQUEsZ0JBQWJDLElBQWEsdUVBQU4sZUFBTTs7O0FBRWIsZ0NBQUssRUFBRTNCLGtCQUFGLEVBQUwsRUFBbUJSLFFBQW5CO0FBQ0EsZ0NBQUssRUFBRWlDLHNCQUFGLEVBQUwsRUFBcUJqQyxRQUFyQjtBQUNBLGdDQUFLLEVBQUVtQyxVQUFGLEVBQUwsRUFBZXBDLE1BQWY7QUFDQSxnQ0FBSyxFQUFFbUMsWUFBRixFQUFMLEVBQWdCeEIsU0FBaEI7O0FBRUEsZ0JBQUkwQixRQUFTLEtBQUtsQyxLQUFMLEtBQWUsR0FBaEIsR0FBdUIsRUFBdkIsR0FBNEIsR0FBeEM7QUFDQSxnQkFBSUwsWUFBVSxLQUFLSyxLQUFmLEdBQXVCa0MsS0FBdkIsR0FBK0JELElBQW5DO0FBQ0EsZ0JBQUkxQixXQUFXd0IsV0FBVyxLQUFLaEIsS0FBaEIsQ0FBZjtBQUNBLGdCQUFJRyxVQUFVLElBQUlmLFlBQUosQ0FBaUJSLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLEtBQUttQixLQUFsQyxFQUF5QyxFQUFFUCxrQkFBRixFQUFZRCxrQkFBWixFQUF6QyxDQUFkO0FBQ0EsZ0JBQUljLE9BQU9GLFFBQVFFLElBQVIsRUFBWDs7QUFFQSxpQkFBS1YsU0FBTCxDQUFleUIsSUFBZixDQUFvQixFQUFFeEMsVUFBRixFQUFRdUIsZ0JBQVIsRUFBaUJjLFlBQWpCLEVBQXdCMUIsa0JBQXhCLEVBQXBCOztBQUVBLCtCQUFROEIsR0FBUixDQUFZO0FBQUEsdUJBQU1KLE1BQU1LLElBQU4sQ0FBV25CLE9BQVgsRUFBb0JBLE9BQXBCLENBQU47QUFBQSxhQUFaLEVBQ0FvQixJQURBLENBQ0s7QUFBQSx1QkFBTWxCLEtBQUtELElBQUwsQ0FBVSxTQUFWLENBQU47QUFBQSxhQURMLEVBRUFvQixLQUZBLENBRU07QUFBQSx1QkFDRixPQUFLMUIsU0FBTCxDQUFlLHNCQUFZSSxLQUFaLEVBQW1CQyxPQUFuQixDQUFmLEVBQTRDQSxPQUE1QyxTQURFO0FBQUEsYUFGTjs7QUFLQSxtQkFBT0UsSUFBUDtBQUVIOzs7Z0NBRU9RLEksRUFBTVksSSxFQUFNOztBQUVoQixnQ0FBSyxFQUFFWixVQUFGLEVBQUwsRUFBZTlCLFFBQWY7QUFDQSxnQ0FBSyxFQUFFMEMsVUFBRixFQUFMLEVBQWVDLFFBQWYsR0FBMEJDLE1BQTFCOztBQUVBLG1CQUFPLEtBQUsvQixTQUFMLENBQWVnQyxHQUFmLENBQW1CLEVBQUVDLFNBQVNoQixJQUFYLEVBQWlCVixTQUFTLElBQTFCLEVBQWdDc0IsVUFBaEMsRUFBbkIsQ0FBUDtBQUVIOzs7Ozs7a0JBSVVyQyxZIiwiZmlsZSI6IkNoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IENhbGxhYmxlIGZyb20gJy4vQ2FsbGFibGUnO1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IFNlcXVlbnRpYWxEaXNwYXRjaGVyLCBQcm9ibGVtIH0gZnJvbSAnLi9kaXNwYXRjaCc7XG5pbXBvcnQgeyBlc2NhbGF0ZSB9IGZyb20gJy4vZGlzcGF0Y2gvc3RyYXRlZ3knO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5jb25zdCBkZWZhdWx0X2Rpc3BhdGNoZXIgPSAocCkgPT4gbmV3IFNlcXVlbnRpYWxEaXNwYXRjaGVyKHApO1xuXG4vKipcbiAqIExvY2FsUmVmZXJlbmNlIGlzIGEgUmVmZXJlbmNlIHRvIGFuIEFjdG9yIGluIHRoZSBjdXJyZW50IGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmZXJlbmNlfVxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxSZWZlcmVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgdGVsbEZuKSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyB0ZWxsRm4gfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl90ZWxsRm4gPSB0ZWxsRm47XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuXG4gICAgfVxuXG4gICAgdGVsbChtKSB7XG5cbiAgICAgICAgdGhpcy5fdGVsbEZuKG0pO1xuXG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQ2hpbGRDb250ZXh0IGlzIHRoZSBDb250ZXh0IG9mIGVhY2ggc2VsZiBjcmVhdGVkIGluIHRoaXMgYWRkcmVzcyBzcGFjZS5cbiAqIEBpbXBsZW1lbnRzIHtSZWZGYWN0b3J5fVxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtDb250ZXh0fSBbcGFyZW50XVxuICogQHBhcmFtIHtDb25jZXJuRmFjdG9yeX0gZmFjdG9yeVxuICogQHBhcmFtIHtTeXN0ZW19IHN5c3RlbVxuICovXG5leHBvcnQgY2xhc3MgQ2hpbGRDb250ZXh0IHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHBhcmVudCwgcm9vdCwgeyBzdHJhdGVneSwgZGlzcGF0Y2ggfSkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgcGFyZW50IH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IHJvb3QgfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG4gICAgICAgIGJlb2YoeyBzdHJhdGVneSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgZGlzcGF0Y2ggfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICAgIHRoaXMuX3NlbGYgPSBuZXcgTG9jYWxSZWZlcmVuY2UodGhpcy5fcGF0aCwgbSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgRXJyb3IpIHtcblxuICAgICAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgUHJvYmxlbSlcbiAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3kobS5lcnJvciwgbS5jb250ZXh0LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50KCkudGVsbChtKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGRpc3BhdGNoLnRlbGwobSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuXG4gICAgfVxuXG4gICAgbm9uZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxmO1xuXG4gICAgfVxuXG4gICAgaXMocmVmKSB7XG5cbiAgICAgICAgcmV0dXJuIChTdHJpbmcocmVmKSA9PT0gdGhpcy5fcGF0aCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIGlmIChwYXRoID09PSB0aGlzLl9wYXRoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZigpO1xuXG4gICAgICAgIGlmICghcGF0aC5zdGFydHNXaXRoKHRoaXMuX3BhdGgpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuX2NoaWxkcmVuLm1hcChjID0+IGMuY29udGV4dCk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcblxuICAgICAgICAgICAgICAgIC8vQHRvZG9cbiAgICAgICAgICAgICAgICAvL3Nob3VsZCByZXR1cm4gYSBudWxsIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHRlbGwoKSB7fSB9O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLnBhdGgoKSA9PT0gcGF0aCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGYoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXRoLnN0YXJ0c1dpdGgoY2hpbGQucGF0aCgpKSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNlbGVjdChwYXRoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV4dChjaGlsZHMucG9wKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcblxuICAgIH1cblxuICAgIHNwYXduKHtcbiAgICAgICAgICAgIHN0cmF0ZWd5ID0gZXNjYWxhdGUsXG4gICAgICAgICAgICBkaXNwYXRjaGVyID0gZGVmYXVsdF9kaXNwYXRjaGVyLFxuICAgICAgICAgICAgc3RhcnRcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZSA9IHY0KCkpIHtcblxuICAgICAgICBiZW9mKHsgc3RyYXRlZ3kgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IGRpc3BhdGNoZXIgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IG5hbWUgfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBzdGFydCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHZhciBzbGFzaCA9ICh0aGlzLl9wYXRoID09PSAnLycpID8gJycgOiAnLyc7XG4gICAgICAgIHZhciBwYXRoID0gYCR7dGhpcy5fcGF0aH0ke3NsYXNofSR7bmFtZX1gO1xuICAgICAgICB2YXIgZGlzcGF0Y2ggPSBkaXNwYXRjaGVyKHRoaXMuX3NlbGYpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDaGlsZENvbnRleHQocGF0aCwgdGhpcywgdGhpcy5fcm9vdCwgeyBkaXNwYXRjaCwgc3RyYXRlZ3kgfSk7XG4gICAgICAgIHZhciBzZWxmID0gY29udGV4dC5zZWxmKCk7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh7IHBhdGgsIGNvbnRleHQsIHN0YXJ0LCBzdHJhdGVneSB9KTtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBzdGFydC5jYWxsKGNvbnRleHQsIGNvbnRleHQpKS5cbiAgICAgICAgdGhlbigoKSA9PiBzZWxmLnRlbGwoJ3N0YXJ0ZWQnKSkuXG4gICAgICAgIGNhdGNoKGVycm9yID0+XG4gICAgICAgICAgICB0aGlzLl9zdHJhdGVneShuZXcgUHJvYmxlbShlcnJvciwgY29udGV4dCksIGNvbnRleHQsIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcblxuICAgIH1cblxuICAgIHJlY2VpdmUobmV4dCwgdGltZSkge1xuXG4gICAgICAgIGJlb2YoeyBuZXh0IH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyB0aW1lIH0pLm9wdGlvbmFsKCkubnVtYmVyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoLmFzayh7IHJlY2VpdmU6IG5leHQsIGNvbnRleHQ6IHRoaXMsIHRpbWUgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=