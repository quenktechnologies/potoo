"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escalate = escalate;

//@todo add one_for_one, one_for_all, etc. also
//provide way so notices of errors can still be publish
//in the system.

/**
 * escalate passes the error to the parent context.
 * @param {Error} e
 * @param {Context} child
 * @param {Context} parent
 */
function escalate(e, child, context) {

  return parent.error(e);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJlc2NhbGF0ZSIsImUiLCJjaGlsZCIsImNvbnRleHQiLCJwYXJlbnQiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFXZ0JBLFEsR0FBQUEsUTs7QUFWaEI7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNTyxTQUFTQSxRQUFULENBQWtCQyxDQUFsQixFQUFxQkMsS0FBckIsRUFBNEJDLE9BQTVCLEVBQXFDOztBQUV4QyxTQUFPQyxPQUFPQyxLQUFQLENBQWFKLENBQWIsQ0FBUDtBQUVIIiwiZmlsZSI6InN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vL0B0b2RvIGFkZCBvbmVfZm9yX29uZSwgb25lX2Zvcl9hbGwsIGV0Yy4gYWxzb1xuLy9wcm92aWRlIHdheSBzbyBub3RpY2VzIG9mIGVycm9ycyBjYW4gc3RpbGwgYmUgcHVibGlzaFxuLy9pbiB0aGUgc3lzdGVtLlxuXG4vKipcbiAqIGVzY2FsYXRlIHBhc3NlcyB0aGUgZXJyb3IgdG8gdGhlIHBhcmVudCBjb250ZXh0LlxuICogQHBhcmFtIHtFcnJvcn0gZVxuICogQHBhcmFtIHtDb250ZXh0fSBjaGlsZFxuICogQHBhcmFtIHtDb250ZXh0fSBwYXJlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FsYXRlKGUsIGNoaWxkLCBjb250ZXh0KSB7XG5cbiAgICByZXR1cm4gcGFyZW50LmVycm9yKGUpO1xuXG59XG4iXX0=