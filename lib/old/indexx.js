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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvaW5kZXh4LmpzIl0sIm5hbWVzIjpbImRpc3BhdGNoIiwiQ29udGV4dCIsIklzb21vcnBoaWNTeXN0ZW0iLCJSZWZlcmVuY2UiLCJVbml0Iiwibm9vcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVPQSxRLHVCQUZQOztRQUdPQyxPO1FBQ0FDLGdCO1FBQ0FDLFM7O0FBRVA7O0FBRU8sSUFBTUMsc0JBQU8sSUFBYjtBQUNBLElBQU1DLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFLRCxJQUFMO0FBQUEsQ0FBYiIsImZpbGUiOiJpbmRleHguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbmV4cG9ydCBkaXNwYXRjaCBmcm9tICcuL2Rpc3BhdGNoJztcbmV4cG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG5leHBvcnQgSXNvbW9ycGhpY1N5c3RlbSBmcm9tICcuL0lzb21vcnBoaWNTeXN0ZW0nO1xuZXhwb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5cbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cbmV4cG9ydCBjb25zdCBVbml0ID0gbnVsbDtcbmV4cG9ydCBjb25zdCBub29wID0gXyA9PiBVbml0O1xuIl19