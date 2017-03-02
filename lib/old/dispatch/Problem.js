'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Problem = Problem;

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Problem is recognized internally that an error has occured during message
 * handling.
 * @param {Error} error
 * @param {Context} context
 * @property {Error} error
 * @property {Context} context
 * @extends {Error}
 */
function Problem(error, context) {

    (0, _beof2.default)({ error: error }).instance(Error);
    (0, _beof2.default)({ context: context }).interface(_Context2.default);

    this.error = error;
    this.context = context;
    this.message = 'Actor \'' + context.path() + '\' threw an error!\n' + ('No one handled it so System will now crash!\n' + error.stack + '\n');
    this.stack = new Error().stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

Problem.prototype = Object.create(Error.prototype);
Problem.prototype.constructor = Problem;

exports.default = Problem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZGlzcGF0Y2gvUHJvYmxlbS5qcyJdLCJuYW1lcyI6WyJQcm9ibGVtIiwiZXJyb3IiLCJjb250ZXh0IiwiaW5zdGFuY2UiLCJFcnJvciIsImludGVyZmFjZSIsIm1lc3NhZ2UiLCJwYXRoIiwic3RhY2siLCJuYW1lIiwiY29uc3RydWN0b3IiLCJoYXNPd25Qcm9wZXJ0eSIsImNhcHR1cmVTdGFja1RyYWNlIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIl0sIm1hcHBpbmdzIjoiOzs7OztRQVlnQkEsTyxHQUFBQSxPOztBQVpoQjs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7O0FBU08sU0FBU0EsT0FBVCxDQUFpQkMsS0FBakIsRUFBd0JDLE9BQXhCLEVBQWlDOztBQUVwQyx3QkFBSyxFQUFFRCxZQUFGLEVBQUwsRUFBZ0JFLFFBQWhCLENBQXlCQyxLQUF6QjtBQUNBLHdCQUFLLEVBQUVGLGdCQUFGLEVBQUwsRUFBa0JHLFNBQWxCOztBQUVBLFNBQUtKLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtJLE9BQUwsR0FBZSxhQUFVSixRQUFRSyxJQUFSLEVBQVYsK0VBQ3FDTixNQUFNTyxLQUQzQyxRQUFmO0FBRUEsU0FBS0EsS0FBTCxHQUFjLElBQUlKLEtBQUosRUFBRCxDQUFjSSxLQUEzQjtBQUNBLFNBQUtDLElBQUwsR0FBWSxLQUFLQyxXQUFMLENBQWlCRCxJQUE3Qjs7QUFFQSxRQUFJTCxNQUFNTyxjQUFOLENBQXFCLG1CQUFyQixDQUFKLEVBQ0lQLE1BQU1RLGlCQUFOLENBQXdCLElBQXhCLEVBQThCLEtBQUtGLFdBQW5DO0FBRVA7O0FBRURWLFFBQVFhLFNBQVIsR0FBb0JDLE9BQU9DLE1BQVAsQ0FBY1gsTUFBTVMsU0FBcEIsQ0FBcEI7QUFDQWIsUUFBUWEsU0FBUixDQUFrQkgsV0FBbEIsR0FBZ0NWLE9BQWhDOztrQkFFZUEsTyIsImZpbGUiOiJQcm9ibGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuLi9Db250ZXh0JztcblxuLyoqXG4gKiBQcm9ibGVtIGlzIHJlY29nbml6ZWQgaW50ZXJuYWxseSB0aGF0IGFuIGVycm9yIGhhcyBvY2N1cmVkIGR1cmluZyBtZXNzYWdlXG4gKiBoYW5kbGluZy5cbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHRcbiAqIEBwcm9wZXJ0eSB7RXJyb3J9IGVycm9yXG4gKiBAcHJvcGVydHkge0NvbnRleHR9IGNvbnRleHRcbiAqIEBleHRlbmRzIHtFcnJvcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByb2JsZW0oZXJyb3IsIGNvbnRleHQpIHtcblxuICAgIGJlb2YoeyBlcnJvciB9KS5pbnN0YW5jZShFcnJvcik7XG4gICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuXG4gICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5tZXNzYWdlID0gYEFjdG9yICcke2NvbnRleHQucGF0aCgpfScgdGhyZXcgYW4gZXJyb3IhXFxuYCArXG4gICAgICAgIGBObyBvbmUgaGFuZGxlZCBpdCBzbyBTeXN0ZW0gd2lsbCBub3cgY3Jhc2ghXFxuJHtlcnJvci5zdGFja31cXG5gO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuUHJvYmxlbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5Qcm9ibGVtLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb2JsZW07XG5cbmV4cG9ydCBkZWZhdWx0IFByb2JsZW1cbiJdfQ==