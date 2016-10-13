'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Reference = require('./Reference');

var _Reference2 = _interopRequireDefault(_Reference);

var _NullReference = require('./NullReference');

var _NullReference2 = _interopRequireDefault(_NullReference);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _RunningState = require('./state/RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

var _ConcernFactory = require('./ConcernFactory');

var _ConcernFactory2 = _interopRequireDefault(_ConcernFactory);

var _Address = require('./Address');

var _Address2 = _interopRequireDefault(_Address);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EmbeddedRefFactory
 * @implements {RefFactory}
 */
var EmbeddedRefFactory = function () {
    function EmbeddedRefFactory(path, parent, children, system, Constructor) {
        _classCallCheck(this, EmbeddedRefFactory);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ parent: parent }).optional().interface(_Context2.default);
        (0, _beof2.default)({ children: children }).instance(Array);
        (0, _beof2.default)({ system: system }).interface(_System2.default);
        (0, _beof2.default)({ Constructor: Constructor }).function();

        this._path = path;
        this._parent = parent;
        this._children = children;
        this._system = system;
        this._Constructor = Constructor;
    }

    _createClass(EmbeddedRefFactory, [{
        key: 'concernOf',
        value: function concernOf(factory, name) {

            (0, _beof2.default)({ factory: factory }).interface(_ConcernFactory2.default);
            (0, _beof2.default)({ name: name }).string();

            var context = new this._Constructor(this._path + '/' + name, this, factory, this._system);
            this._children.push(context);
            return context.self();
        }
    }, {
        key: 'select',
        value: function select(path) {
            var _this = this;

            (0, _beof2.default)({ path: path }).string();

            var address = _Address2.default.fromString(path);
            var childs = this._children;
            var parent = this._parent;

            var next = function next(child) {

                var ref;

                if (!child) {

                    if (parent) return parent.select(address);

                    return new _NullReference2.default(path, _this._system);
                } else if (address.is(child.path())) {

                    return child.self();
                } else if (address.isBelow(child.path())) {

                    return child.select(path);
                }

                return next(childs.pop());
            };

            return next(childs.pop());
        }
    }]);

    return EmbeddedRefFactory;
}();

exports.default = EmbeddedRefFactory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FbWJlZGRlZFJlZkZhY3RvcnkuanMiXSwibmFtZXMiOlsiRW1iZWRkZWRSZWZGYWN0b3J5IiwicGF0aCIsInBhcmVudCIsImNoaWxkcmVuIiwic3lzdGVtIiwiQ29uc3RydWN0b3IiLCJzdHJpbmciLCJvcHRpb25hbCIsImludGVyZmFjZSIsImluc3RhbmNlIiwiQXJyYXkiLCJmdW5jdGlvbiIsIl9wYXRoIiwiX3BhcmVudCIsIl9jaGlsZHJlbiIsIl9zeXN0ZW0iLCJfQ29uc3RydWN0b3IiLCJmYWN0b3J5IiwibmFtZSIsImNvbnRleHQiLCJwdXNoIiwic2VsZiIsImFkZHJlc3MiLCJmcm9tU3RyaW5nIiwiY2hpbGRzIiwibmV4dCIsInJlZiIsImNoaWxkIiwic2VsZWN0IiwiaXMiLCJpc0JlbG93IiwicG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7SUFJTUEsa0I7QUFFRixnQ0FBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEJDLFFBQTFCLEVBQW9DQyxNQUFwQyxFQUE0Q0MsV0FBNUMsRUFBeUQ7QUFBQTs7QUFFckQsNEJBQUssRUFBRUosVUFBRixFQUFMLEVBQWVLLE1BQWY7QUFDQSw0QkFBSyxFQUFFSixjQUFGLEVBQUwsRUFBaUJLLFFBQWpCLEdBQTRCQyxTQUE1QjtBQUNBLDRCQUFLLEVBQUVMLGtCQUFGLEVBQUwsRUFBbUJNLFFBQW5CLENBQTRCQyxLQUE1QjtBQUNBLDRCQUFLLEVBQUVOLGNBQUYsRUFBTCxFQUFpQkksU0FBakI7QUFDQSw0QkFBSyxFQUFDSCx3QkFBRCxFQUFMLEVBQW9CTSxRQUFwQjs7QUFFQSxhQUFLQyxLQUFMLEdBQWFYLElBQWI7QUFDQSxhQUFLWSxPQUFMLEdBQWVYLE1BQWY7QUFDQSxhQUFLWSxTQUFMLEdBQWlCWCxRQUFqQjtBQUNBLGFBQUtZLE9BQUwsR0FBZVgsTUFBZjtBQUNBLGFBQUtZLFlBQUwsR0FBb0JYLFdBQXBCO0FBRUg7Ozs7a0NBRVNZLE8sRUFBU0MsSSxFQUFNOztBQUVyQixnQ0FBSyxFQUFFRCxnQkFBRixFQUFMLEVBQWtCVCxTQUFsQjtBQUNBLGdDQUFLLEVBQUVVLFVBQUYsRUFBTCxFQUFlWixNQUFmOztBQUVBLGdCQUFJYSxVQUFVLElBQUksS0FBS0gsWUFBVCxDQUF5QixLQUFLSixLQUE5QixTQUF1Q00sSUFBdkMsRUFBK0MsSUFBL0MsRUFBcURELE9BQXJELEVBQThELEtBQUtGLE9BQW5FLENBQWQ7QUFDQSxpQkFBS0QsU0FBTCxDQUFlTSxJQUFmLENBQW9CRCxPQUFwQjtBQUNBLG1CQUFPQSxRQUFRRSxJQUFSLEVBQVA7QUFFSDs7OytCQUVNcEIsSSxFQUFNO0FBQUE7O0FBRVQsZ0NBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVLLE1BQWY7O0FBRUEsZ0JBQUlnQixVQUFVLGtCQUFRQyxVQUFSLENBQW1CdEIsSUFBbkIsQ0FBZDtBQUNBLGdCQUFJdUIsU0FBUyxLQUFLVixTQUFsQjtBQUNBLGdCQUFJWixTQUFTLEtBQUtXLE9BQWxCOztBQUVBLGdCQUFJWSxPQUFPLFNBQVBBLElBQU8sUUFBUzs7QUFFaEIsb0JBQUlDLEdBQUo7O0FBRUEsb0JBQUksQ0FBQ0MsS0FBTCxFQUFZOztBQUVSLHdCQUFJekIsTUFBSixFQUNJLE9BQU9BLE9BQU8wQixNQUFQLENBQWNOLE9BQWQsQ0FBUDs7QUFFSiwyQkFBTyw0QkFBa0JyQixJQUFsQixFQUF3QixNQUFLYyxPQUE3QixDQUFQO0FBRUgsaUJBUEQsTUFPTyxJQUFJTyxRQUFRTyxFQUFSLENBQVdGLE1BQU0xQixJQUFOLEVBQVgsQ0FBSixFQUE4Qjs7QUFFakMsMkJBQU8wQixNQUFNTixJQUFOLEVBQVA7QUFFSCxpQkFKTSxNQUlBLElBQUlDLFFBQVFRLE9BQVIsQ0FBZ0JILE1BQU0xQixJQUFOLEVBQWhCLENBQUosRUFBbUM7O0FBRXRDLDJCQUFPMEIsTUFBTUMsTUFBTixDQUFhM0IsSUFBYixDQUFQO0FBRUg7O0FBRUQsdUJBQU93QixLQUFLRCxPQUFPTyxHQUFQLEVBQUwsQ0FBUDtBQUNILGFBdEJEOztBQXdCQSxtQkFBT04sS0FBS0QsT0FBT08sR0FBUCxFQUFMLENBQVA7QUFFSDs7Ozs7O2tCQUlVL0Isa0IiLCJmaWxlIjoiRW1iZWRkZWRSZWZGYWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBOdWxsUmVmZXJlbmNlIGZyb20gJy4vTnVsbFJlZmVyZW5jZSc7XG5pbXBvcnQgU3lzdGVtIGZyb20gJy4vU3lzdGVtJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgUnVubmluZ1N0YXRlIGZyb20gJy4vc3RhdGUvUnVubmluZ1N0YXRlJztcbmltcG9ydCBDb25jZXJuRmFjdG9yeSBmcm9tICcuL0NvbmNlcm5GYWN0b3J5JztcbmltcG9ydCBBZGRyZXNzIGZyb20gJy4vQWRkcmVzcyc7XG5cbi8qKlxuICogRW1iZWRkZWRSZWZGYWN0b3J5XG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX1cbiAqL1xuY2xhc3MgRW1iZWRkZWRSZWZGYWN0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHBhcmVudCwgY2hpbGRyZW4sIHN5c3RlbSwgQ29uc3RydWN0b3IpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHBhcmVudCB9KS5vcHRpb25hbCgpLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IGNoaWxkcmVuIH0pLmluc3RhbmNlKEFycmF5KTtcbiAgICAgICAgYmVvZih7IHN5c3RlbSB9KS5pbnRlcmZhY2UoU3lzdGVtKTtcbiAgICAgICAgYmVvZih7Q29uc3RydWN0b3J9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgdGhpcy5fQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBuYW1lKSB7XG5cbiAgICAgICAgYmVvZih7IGZhY3RvcnkgfSkuaW50ZXJmYWNlKENvbmNlcm5GYWN0b3J5KTtcbiAgICAgICAgYmVvZih7IG5hbWUgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgdGhpcy5fQ29uc3RydWN0b3IoYCR7dGhpcy5fcGF0aH0vJHtuYW1lfWAsIHRoaXMsIGZhY3RvcnksIHRoaXMuX3N5c3RlbSk7XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goY29udGV4dCk7XG4gICAgICAgIHJldHVybiBjb250ZXh0LnNlbGYoKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgdmFyIGFkZHJlc3MgPSBBZGRyZXNzLmZyb21TdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuX3BhcmVudDtcblxuICAgICAgICB2YXIgbmV4dCA9IGNoaWxkID0+IHtcblxuICAgICAgICAgICAgdmFyIHJlZjtcblxuICAgICAgICAgICAgaWYgKCFjaGlsZCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5zZWxlY3QoYWRkcmVzcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE51bGxSZWZlcmVuY2UocGF0aCwgdGhpcy5fc3lzdGVtKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRyZXNzLmlzKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcy5pc0JlbG93KGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRW1iZWRkZWRSZWZGYWN0b3J5XG4iXX0=