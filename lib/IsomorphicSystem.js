'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log_filter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Guardian = require('./Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

var _dispatch = require('./dispatch');

var _funcs = require('./funcs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log_filter = exports.log_filter = function log_filter(log) {
    return (0, _funcs.or)((0, _funcs.insof)(_dispatch.DroppedMessage, (0, _funcs.ok)(log.level <= 4, function (m) {
        return console.warn('DroppedMessage: to ' + m.to + ' message: ' + m.message + '.');
    })), (0, _funcs.insof)(_dispatch.UnhandledMessage, (0, _funcs.ok)(log.level <= 4, function (m) {
        return console.warn('UnhandledMessage: to ' + m.to + ' message: ' + m.message + '.');
    })));
};

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */

var IsomorphicSystem = function () {
    function IsomorphicSystem() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { log: { level: 4 } };

        _classCallCheck(this, IsomorphicSystem);

        var log = options.log;


        this._subs = [log_filter(log)];
        this._guardian = new _Guardian2.default(this);
    }

    /**
     * create a new IsomorphicSystem
     * @param {object} options
     * @returns {IsomorphicSystem}
     */


    _createClass(IsomorphicSystem, [{
        key: 'select',
        value: function select(path) {

            return this._guardian.tree.select(path);
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this._guardian.spawn(spec, name);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(f) {

            this._subs.push(f);
            return this;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(f) {

            var i = this._subs.indexOf(f);

            if (i > 0) this._subs.splice(i, 1);

            return this;
        }
    }, {
        key: 'publish',
        value: function publish(evt) {
            var _this = this;

            this._subs.forEach(function (s) {
                return s.call(_this, evt);
            });
        }
    }], [{
        key: 'create',
        value: function create() {

            return new IsomorphicSystem();
        }
    }]);

    return IsomorphicSystem;
}();

exports.default = IsomorphicSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Jc29tb3JwaGljU3lzdGVtLmpzIl0sIm5hbWVzIjpbImxvZ19maWx0ZXIiLCJsb2ciLCJsZXZlbCIsImNvbnNvbGUiLCJ3YXJuIiwibSIsInRvIiwibWVzc2FnZSIsIklzb21vcnBoaWNTeXN0ZW0iLCJvcHRpb25zIiwiX3N1YnMiLCJfZ3VhcmRpYW4iLCJwYXRoIiwidHJlZSIsInNlbGVjdCIsInNwZWMiLCJuYW1lIiwic3Bhd24iLCJmIiwicHVzaCIsImkiLCJpbmRleE9mIiwic3BsaWNlIiwiZXZ0IiwiZm9yRWFjaCIsInMiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsa0NBQWEsU0FBYkEsVUFBYTtBQUFBLFdBRXRCLGVBQUcsNENBQXNCLGVBQUlDLElBQUlDLEtBQUosSUFBYSxDQUFqQixFQUFxQjtBQUFBLGVBQ3RDQyxRQUFRQyxJQUFSLHlCQUFtQ0MsRUFBRUMsRUFBckMsa0JBQW9ERCxFQUFFRSxPQUF0RCxPQURzQztBQUFBLEtBQXJCLENBQXRCLENBQUgsRUFHSSw4Q0FBd0IsZUFBSU4sSUFBSUMsS0FBSixJQUFhLENBQWpCLEVBQXFCO0FBQUEsZUFDekNDLFFBQVFDLElBQVIsMkJBQXFDQyxFQUFFQyxFQUF2QyxrQkFBc0RELEVBQUVFLE9BQXhELE9BRHlDO0FBQUEsS0FBckIsQ0FBeEIsQ0FISixDQUZzQjtBQUFBLENBQW5COztBQVFQOzs7Ozs7O0lBTU1DLGdCO0FBRUYsZ0NBQTZDO0FBQUEsWUFBakNDLE9BQWlDLHVFQUF2QixFQUFFUixLQUFLLEVBQUVDLE9BQU8sQ0FBVCxFQUFQLEVBQXVCOztBQUFBOztBQUFBLFlBRW5DRCxHQUZtQyxHQUUzQlEsT0FGMkIsQ0FFbkNSLEdBRm1DOzs7QUFJekMsYUFBS1MsS0FBTCxHQUFhLENBQUNWLFdBQVdDLEdBQVgsQ0FBRCxDQUFiO0FBQ0EsYUFBS1UsU0FBTCxHQUFpQix1QkFBYSxJQUFiLENBQWpCO0FBRUg7O0FBRUQ7Ozs7Ozs7OzsrQkFXT0MsSSxFQUFNOztBQUVULG1CQUFPLEtBQUtELFNBQUwsQ0FBZUUsSUFBZixDQUFvQkMsTUFBcEIsQ0FBMkJGLElBQTNCLENBQVA7QUFFSDs7OzhCQUVLRyxJLEVBQU1DLEksRUFBTTs7QUFFZCxtQkFBTyxLQUFLTCxTQUFMLENBQWVNLEtBQWYsQ0FBcUJGLElBQXJCLEVBQTJCQyxJQUEzQixDQUFQO0FBRUg7OztrQ0FFU0UsQyxFQUFHOztBQUVULGlCQUFLUixLQUFMLENBQVdTLElBQVgsQ0FBZ0JELENBQWhCO0FBQ0EsbUJBQU8sSUFBUDtBQUVIOzs7b0NBRVdBLEMsRUFBRzs7QUFFWCxnQkFBSUUsSUFBSSxLQUFLVixLQUFMLENBQVdXLE9BQVgsQ0FBbUJILENBQW5CLENBQVI7O0FBRUEsZ0JBQUlFLElBQUksQ0FBUixFQUNJLEtBQUtWLEtBQUwsQ0FBV1ksTUFBWCxDQUFrQkYsQ0FBbEIsRUFBcUIsQ0FBckI7O0FBRUosbUJBQU8sSUFBUDtBQUVIOzs7Z0NBRU9HLEcsRUFBSztBQUFBOztBQUVULGlCQUFLYixLQUFMLENBQVdjLE9BQVgsQ0FBbUI7QUFBQSx1QkFBS0MsRUFBRUMsSUFBRixRQUFhSCxHQUFiLENBQUw7QUFBQSxhQUFuQjtBQUVIOzs7aUNBeENlOztBQUVaLG1CQUFPLElBQUlmLGdCQUFKLEVBQVA7QUFFSDs7Ozs7O2tCQXdDVUEsZ0IiLCJmaWxlIjoiSXNvbW9ycGhpY1N5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IEd1YXJkaWFuIGZyb20gJy4vR3VhcmRpYW4nO1xuaW1wb3J0IHsgRHJvcHBlZE1lc3NhZ2UsIFVuaGFuZGxlZE1lc3NhZ2UsIFByb2JsZW0gfSBmcm9tICcuL2Rpc3BhdGNoJztcbmltcG9ydCB7IG9yLCBpbnNvZiwgb2sgfSBmcm9tICcuL2Z1bmNzJztcblxuZXhwb3J0IGNvbnN0IGxvZ19maWx0ZXIgPSBsb2cgPT5cblxuICAgIG9yKGluc29mKERyb3BwZWRNZXNzYWdlLCBvaygobG9nLmxldmVsIDw9IDQpLCBtID0+XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYERyb3BwZWRNZXNzYWdlOiB0byAke20udG99IG1lc3NhZ2U6ICR7bS5tZXNzYWdlfS5gKSkpLFxuXG4gICAgICAgIGluc29mKFVuaGFuZGxlZE1lc3NhZ2UsIG9rKChsb2cubGV2ZWwgPD0gNCksIG0gPT5cbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5oYW5kbGVkTWVzc2FnZTogdG8gJHttLnRvfSBtZXNzYWdlOiAke20ubWVzc2FnZX0uYCkpKSlcblxuLyoqXG4gKiBJc29tb3JwaGljU3lzdGVtIHJlcHJlc2VudHMgYSBjb2xsZWN0aW9uIG9mIHJlbGF0ZWQgQ29uY2VybnMgdGhhdCBzaGFyZSBhIHBhcmVudCBDb250ZXh0LlxuICogVXNlIHRoZW0gdG8gY3JlYXRlIHRvIHJlcHJlc2VudCB0aGUgZ3VhcmRpYW4gb2YgYSB0cmVlIHlvdXIgYXBwbGljYXRpb24gd2lsbFxuICogYnJhbmNoIGludG8uXG4gKiBAaW1wbGVtZW50cyB7U3lzdGVtfVxuICovXG5jbGFzcyBJc29tb3JwaGljU3lzdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7IGxvZzogeyBsZXZlbDogNCB9IH0pIHtcblxuICAgICAgICB2YXIgeyBsb2cgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5fc3VicyA9IFtsb2dfZmlsdGVyKGxvZyldO1xuICAgICAgICB0aGlzLl9ndWFyZGlhbiA9IG5ldyBHdWFyZGlhbih0aGlzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIG5ldyBJc29tb3JwaGljU3lzdGVtXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7SXNvbW9ycGhpY1N5c3RlbX1cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgSXNvbW9ycGhpY1N5c3RlbSgpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZ3VhcmRpYW4udHJlZS5zZWxlY3QocGF0aCk7XG5cbiAgICB9XG5cbiAgICBzcGF3bihzcGVjLCBuYW1lKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1YXJkaWFuLnNwYXduKHNwZWMsIG5hbWUpO1xuXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGYpIHtcblxuICAgICAgICB0aGlzLl9zdWJzLnB1c2goZik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUoZikge1xuXG4gICAgICAgIHZhciBpID0gdGhpcy5fc3Vicy5pbmRleE9mKGYpO1xuXG4gICAgICAgIGlmIChpID4gMClcbiAgICAgICAgICAgIHRoaXMuX3N1YnMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcHVibGlzaChldnQpIHtcblxuICAgICAgICB0aGlzLl9zdWJzLmZvckVhY2gocyA9PiBzLmNhbGwodGhpcywgZXZ0KSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSXNvbW9ycGhpY1N5c3RlbVxuIl19