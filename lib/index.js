'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.output = exports.input = exports.stream = exports.future = exports.receive = exports.tell = exports.spawn = exports.system = undefined;

var _Ops = require('./Ops');

var Ops = _interopRequireWildcard(_Ops);

var _Actor = require('./Actor');

var Actor = _interopRequireWildcard(_Actor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var system = exports.system = function system() {
  return new Actor.System();
};
var spawn = exports.spawn = Ops.spawn;
var tell = exports.tell = Ops.tell;
var receive = exports.receive = Ops.receive;
var future = exports.future = Ops.future;
var stream = exports.stream = Ops.stream;
var input = exports.input = Ops.input;
var output = exports.output = Ops.output;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJPcHMiLCJBY3RvciIsInN5c3RlbSIsIlN5c3RlbSIsInNwYXduIiwidGVsbCIsInJlY2VpdmUiLCJmdXR1cmUiLCJzdHJlYW0iLCJpbnB1dCIsIm91dHB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztJQUFZQSxHOztBQUNaOztJQUFZQyxLOzs7O0FBRUwsSUFBTUMsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQU0sSUFBSUQsTUFBTUUsTUFBVixFQUFOO0FBQUEsQ0FBZjtBQUNBLElBQU1DLHdCQUFRSixJQUFJSSxLQUFsQjtBQUNBLElBQU1DLHNCQUFPTCxJQUFJSyxJQUFqQjtBQUNBLElBQU1DLDRCQUFVTixJQUFJTSxPQUFwQjtBQUNBLElBQU1DLDBCQUFTUCxJQUFJTyxNQUFuQjtBQUNBLElBQU1DLDBCQUFTUixJQUFJUSxNQUFuQjtBQUNBLElBQU1DLHdCQUFRVCxJQUFJUyxLQUFsQjtBQUNBLElBQU1DLDBCQUFTVixJQUFJVSxNQUFuQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIE9wcyBmcm9tICcuL09wcyc7XG5pbXBvcnQgKiBhcyBBY3RvciBmcm9tICcuL0FjdG9yJztcblxuZXhwb3J0IGNvbnN0IHN5c3RlbSA9ICgpID0+IG5ldyBBY3Rvci5TeXN0ZW0oKTtcbmV4cG9ydCBjb25zdCBzcGF3biA9IE9wcy5zcGF3bjtcbmV4cG9ydCBjb25zdCB0ZWxsID0gT3BzLnRlbGw7XG5leHBvcnQgY29uc3QgcmVjZWl2ZSA9IE9wcy5yZWNlaXZlO1xuZXhwb3J0IGNvbnN0IGZ1dHVyZSA9IE9wcy5mdXR1cmU7XG5leHBvcnQgY29uc3Qgc3RyZWFtID0gT3BzLnN0cmVhbTtcbmV4cG9ydCBjb25zdCBpbnB1dCA9IE9wcy5pbnB1dDtcbmV4cG9ydCBjb25zdCBvdXRwdXQgPSBPcHMub3V0cHV0O1xuIl19