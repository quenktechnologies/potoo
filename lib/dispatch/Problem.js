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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9Qcm9ibGVtLmpzIl0sIm5hbWVzIjpbIlByb2JsZW0iLCJlcnJvciIsImNvbnRleHQiLCJpbnN0YW5jZSIsIkVycm9yIiwiaW50ZXJmYWNlIiwibWVzc2FnZSIsInBhdGgiLCJzdGFjayIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsImhhc093blByb3BlcnR5IiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiXSwibWFwcGluZ3MiOiI7Ozs7O1FBWWdCQSxPLEdBQUFBLE87O0FBWmhCOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7QUFTTyxTQUFTQSxPQUFULENBQWlCQyxLQUFqQixFQUF3QkMsT0FBeEIsRUFBaUM7O0FBRXBDLHdCQUFLLEVBQUVELFlBQUYsRUFBTCxFQUFnQkUsUUFBaEIsQ0FBeUJDLEtBQXpCO0FBQ0Esd0JBQUssRUFBRUYsZ0JBQUYsRUFBTCxFQUFrQkcsU0FBbEI7O0FBRUEsU0FBS0osS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0ksT0FBTCxHQUFlLGFBQVVKLFFBQVFLLElBQVIsRUFBViwrRUFDcUNOLE1BQU1PLEtBRDNDLFFBQWY7QUFFQSxTQUFLQSxLQUFMLEdBQWMsSUFBSUosS0FBSixFQUFELENBQWNJLEtBQTNCO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLEtBQUtDLFdBQUwsQ0FBaUJELElBQTdCOztBQUVBLFFBQUlMLE1BQU1PLGNBQU4sQ0FBcUIsbUJBQXJCLENBQUosRUFDSVAsTUFBTVEsaUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsS0FBS0YsV0FBbkM7QUFFUDs7QUFFRFYsUUFBUWEsU0FBUixHQUFvQkMsT0FBT0MsTUFBUCxDQUFjWCxNQUFNUyxTQUFwQixDQUFwQjtBQUNBYixRQUFRYSxTQUFSLENBQWtCSCxXQUFsQixHQUFnQ1YsT0FBaEM7O2tCQUVlQSxPIiwiZmlsZSI6IlByb2JsZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuXG4vKipcbiAqIFByb2JsZW0gaXMgcmVjb2duaXplZCBpbnRlcm5hbGx5IHRoYXQgYW4gZXJyb3IgaGFzIG9jY3VyZWQgZHVyaW5nIG1lc3NhZ2VcbiAqIGhhbmRsaW5nLlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAqIEBwYXJhbSB7Q29udGV4dH0gY29udGV4dFxuICogQHByb3BlcnR5IHtFcnJvcn0gZXJyb3JcbiAqIEBwcm9wZXJ0eSB7Q29udGV4dH0gY29udGV4dFxuICogQGV4dGVuZHMge0Vycm9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gUHJvYmxlbShlcnJvciwgY29udGV4dCkge1xuXG4gICAgYmVvZih7IGVycm9yIH0pLmluc3RhbmNlKEVycm9yKTtcbiAgICBiZW9mKHsgY29udGV4dCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG5cbiAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLm1lc3NhZ2UgPSBgQWN0b3IgJyR7Y29udGV4dC5wYXRoKCl9JyB0aHJldyBhbiBlcnJvciFcXG5gICtcbiAgICAgICAgYE5vIG9uZSBoYW5kbGVkIGl0IHNvIFN5c3RlbSB3aWxsIG5vdyBjcmFzaCFcXG4ke2Vycm9yLnN0YWNrfVxcbmA7XG4gICAgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgaWYgKEVycm9yLmhhc093blByb3BlcnR5KCdjYXB0dXJlU3RhY2tUcmFjZScpKVxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcblxufVxuXG5Qcm9ibGVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblByb2JsZW0ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJvYmxlbTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvYmxlbVxuIl19