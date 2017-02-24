'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.Unit = exports.Reference = exports.IsomorphicSystem = exports.Context = exports.dispatch = undefined;

var _dispatch2 = require('./dispatch');

var _dispatch3 = _interopRequireDefault(_dispatch2);

var _Context2 = require('./Context');

var _Context3 = _interopRequireDefault(_Context2);

var _IsomorphicSystem2 = require('./IsomorphicSystem');

var _IsomorphicSystem3 = _interopRequireDefault(_IsomorphicSystem2);

var _Reference2 = require('./Reference');

var _Reference3 = _interopRequireDefault(_Reference2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dispatch = _dispatch3.default; /* jshint ignore:start */

exports.Context = _Context3.default;
exports.IsomorphicSystem = _IsomorphicSystem3.default;
exports.Reference = _Reference3.default;

/* jshint ignore:end */

var Unit = exports.Unit = null;
var noop = exports.noop = function noop(_) {
  return Unit;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleHguanMiXSwibmFtZXMiOlsiZGlzcGF0Y2giLCJDb250ZXh0IiwiSXNvbW9ycGhpY1N5c3RlbSIsIlJlZmVyZW5jZSIsIlVuaXQiLCJub29wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRU9BLFEsdUJBRlA7O1FBR09DLE87UUFDQUMsZ0I7UUFDQUMsUzs7QUFFUDs7QUFFTyxJQUFNQyxzQkFBTyxJQUFiO0FBQ0EsSUFBTUMsc0JBQU8sU0FBUEEsSUFBTztBQUFBLFNBQUtELElBQUw7QUFBQSxDQUFiIiwiZmlsZSI6ImluZGV4eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuZXhwb3J0IGRpc3BhdGNoIGZyb20gJy4vZGlzcGF0Y2gnO1xuZXhwb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmV4cG9ydCBJc29tb3JwaGljU3lzdGVtIGZyb20gJy4vSXNvbW9ycGhpY1N5c3RlbSc7XG5leHBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcblxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuZXhwb3J0IGNvbnN0IFVuaXQgPSBudWxsO1xuZXhwb3J0IGNvbnN0IG5vb3AgPSBfID0+IFVuaXQ7XG4iXX0=