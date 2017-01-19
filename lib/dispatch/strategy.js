'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escalate = undefined;

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@todo add one_for_one, one_for_all, etc. also
//provide way so notices of errors can still be publish
//in the system.

/**
 * escalate passes the error to the parent context.
 * @param {Error} error
 * @param {Conxtext} child
 * @param {Context} parent
 */
var escalate = exports.escalate = function escalate(error, child, parent) {

  (0, _beof2.default)({ error: error }).instance(Error);
  (0, _beof2.default)({ child: child }).interface(_Context2.default);
  (0, _beof2.default)({ parent: parent }).interface(_Context2.default);

  return parent.parent().tell(error);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJlc2NhbGF0ZSIsImVycm9yIiwiY2hpbGQiLCJwYXJlbnQiLCJpbnN0YW5jZSIsIkVycm9yIiwiaW50ZXJmYWNlIiwidGVsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBTU8sSUFBTUEsOEJBQVcsU0FBWEEsUUFBVyxDQUFDQyxLQUFELEVBQVFDLEtBQVIsRUFBZUMsTUFBZixFQUEwQjs7QUFFOUMsc0JBQUssRUFBRUYsWUFBRixFQUFMLEVBQWdCRyxRQUFoQixDQUF5QkMsS0FBekI7QUFDQSxzQkFBSyxFQUFFSCxZQUFGLEVBQUwsRUFBZ0JJLFNBQWhCO0FBQ0Esc0JBQUssRUFBRUgsY0FBRixFQUFMLEVBQWlCRyxTQUFqQjs7QUFFQSxTQUFPSCxPQUFPQSxNQUFQLEdBQWdCSSxJQUFoQixDQUFxQk4sS0FBckIsQ0FBUDtBQUVILENBUk0iLCJmaWxlIjoic3RyYXRlZ3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuXG4vL0B0b2RvIGFkZCBvbmVfZm9yX29uZSwgb25lX2Zvcl9hbGwsIGV0Yy4gYWxzb1xuLy9wcm92aWRlIHdheSBzbyBub3RpY2VzIG9mIGVycm9ycyBjYW4gc3RpbGwgYmUgcHVibGlzaFxuLy9pbiB0aGUgc3lzdGVtLlxuXG4vKipcbiAqIGVzY2FsYXRlIHBhc3NlcyB0aGUgZXJyb3IgdG8gdGhlIHBhcmVudCBjb250ZXh0LlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAqIEBwYXJhbSB7Q29ueHRleHR9IGNoaWxkXG4gKiBAcGFyYW0ge0NvbnRleHR9IHBhcmVudFxuICovXG5leHBvcnQgY29uc3QgZXNjYWxhdGUgPSAoZXJyb3IsIGNoaWxkLCBwYXJlbnQpID0+IHtcblxuICAgIGJlb2YoeyBlcnJvciB9KS5pbnN0YW5jZShFcnJvcik7XG4gICAgYmVvZih7IGNoaWxkIH0pLmludGVyZmFjZShDb250ZXh0KTtcbiAgICBiZW9mKHsgcGFyZW50IH0pLmludGVyZmFjZShDb250ZXh0KTtcblxuICAgIHJldHVybiBwYXJlbnQucGFyZW50KCkudGVsbChlcnJvcik7XG5cbn1cbiJdfQ==