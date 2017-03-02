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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZGlzcGF0Y2gvc3RyYXRlZ3kuanMiXSwibmFtZXMiOlsiZXNjYWxhdGUiLCJlcnJvciIsImNoaWxkIiwicGFyZW50IiwiaW5zdGFuY2UiLCJFcnJvciIsImludGVyZmFjZSIsInRlbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1PLElBQU1BLDhCQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWVDLE1BQWYsRUFBMEI7O0FBRTlDLHNCQUFLLEVBQUVGLFlBQUYsRUFBTCxFQUFnQkcsUUFBaEIsQ0FBeUJDLEtBQXpCO0FBQ0Esc0JBQUssRUFBRUgsWUFBRixFQUFMLEVBQWdCSSxTQUFoQjtBQUNBLHNCQUFLLEVBQUVILGNBQUYsRUFBTCxFQUFpQkcsU0FBakI7O0FBRUEsU0FBT0gsT0FBT0EsTUFBUCxHQUFnQkksSUFBaEIsQ0FBcUJOLEtBQXJCLENBQVA7QUFFSCxDQVJNIiwiZmlsZSI6InN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuLi9Db250ZXh0JztcblxuLy9AdG9kbyBhZGQgb25lX2Zvcl9vbmUsIG9uZV9mb3JfYWxsLCBldGMuIGFsc29cbi8vcHJvdmlkZSB3YXkgc28gbm90aWNlcyBvZiBlcnJvcnMgY2FuIHN0aWxsIGJlIHB1Ymxpc2hcbi8vaW4gdGhlIHN5c3RlbS5cblxuLyoqXG4gKiBlc2NhbGF0ZSBwYXNzZXMgdGhlIGVycm9yIHRvIHRoZSBwYXJlbnQgY29udGV4dC5cbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gKiBAcGFyYW0ge0Nvbnh0ZXh0fSBjaGlsZFxuICogQHBhcmFtIHtDb250ZXh0fSBwYXJlbnRcbiAqL1xuZXhwb3J0IGNvbnN0IGVzY2FsYXRlID0gKGVycm9yLCBjaGlsZCwgcGFyZW50KSA9PiB7XG5cbiAgICBiZW9mKHsgZXJyb3IgfSkuaW5zdGFuY2UoRXJyb3IpO1xuICAgIGJlb2YoeyBjaGlsZCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgYmVvZih7IHBhcmVudCB9KS5pbnRlcmZhY2UoQ29udGV4dCk7XG5cbiAgICByZXR1cm4gcGFyZW50LnBhcmVudCgpLnRlbGwoZXJyb3IpO1xuXG59XG4iXX0=