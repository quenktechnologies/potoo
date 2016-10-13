'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _Signal = require('../Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _RemoteMessage = require('../RemoteMessage');

var _RemoteMessage2 = _interopRequireDefault(_RemoteMessage);

var _ParentReference = require('./ParentReference');

var _ParentReference2 = _interopRequireDefault(_ParentReference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ProcessRouter is a class for treating the current process as a
 * system.
 * @param {Context} context
 */
var ProcessRouter = function ProcessRouter(context) {
    var _this = this;

    _classCallCheck(this, ProcessRouter);

    (0, _beof2.default)({ context: context }).interface(_Context2.default);

    process.on('message', function (message) {

        var m;

        try {
            m = JSON.parse(message);
            assert.ok((typeof m === 'undefined' ? 'undefined' : _typeof(m)) === 'object');
        } catch (e) {
            return context.publish(new InvalidMessageError(message, ''));
        }

        if (m.type === 'signal') {

            context.select(m.path).accept(new _Signal2.default[m.type](m.path), new _ParentReference2.default(process));
        } else if (_RemoteMessage2.default.is(m)) {

            _this._context.select(m.to).accept(m.body, new _ParentReference2.default(process));
        } else {

            context.publish(new InvalidMessageError(m, ''));
        }
    });

    ctx.on('generate', function (concern) {

        concern.watch(function (old, neu) {

            process.send(neu.toString());
        });
    });
};

exports.default = ProcessRouter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL1Byb2Nlc3NSb3V0ZXIuanMiXSwibmFtZXMiOlsiUHJvY2Vzc1JvdXRlciIsImNvbnRleHQiLCJpbnRlcmZhY2UiLCJwcm9jZXNzIiwib24iLCJtIiwiSlNPTiIsInBhcnNlIiwibWVzc2FnZSIsImFzc2VydCIsIm9rIiwiZSIsInB1Ymxpc2giLCJJbnZhbGlkTWVzc2FnZUVycm9yIiwidHlwZSIsInNlbGVjdCIsInBhdGgiLCJhY2NlcHQiLCJpcyIsIl9jb250ZXh0IiwidG8iLCJib2R5IiwiY3R4IiwiY29uY2VybiIsIndhdGNoIiwib2xkIiwibmV1Iiwic2VuZCIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7O0lBS01BLGEsR0FFRix1QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUVqQix3QkFBSyxFQUFFQSxnQkFBRixFQUFMLEVBQWtCQyxTQUFsQjs7QUFFQUMsWUFBUUMsRUFBUixDQUFXLFNBQVgsRUFBc0IsbUJBQVc7O0FBRTdCLFlBQUlDLENBQUo7O0FBRUEsWUFBSTtBQUNBQSxnQkFBSUMsS0FBS0MsS0FBTCxDQUFXQyxPQUFYLENBQUo7QUFDQUMsbUJBQU9DLEVBQVAsQ0FBVSxRQUFPTCxDQUFQLHlDQUFPQSxDQUFQLE9BQWEsUUFBdkI7QUFDSCxTQUhELENBR0UsT0FBT00sQ0FBUCxFQUFVO0FBQ1IsbUJBQU9WLFFBQVFXLE9BQVIsQ0FBZ0IsSUFBSUMsbUJBQUosQ0FBd0JMLE9BQXhCLEVBQWlDLEVBQWpDLENBQWhCLENBQVA7QUFDSDs7QUFFRCxZQUFJSCxFQUFFUyxJQUFGLEtBQVcsUUFBZixFQUF5Qjs7QUFFckJiLG9CQUFRYyxNQUFSLENBQWVWLEVBQUVXLElBQWpCLEVBQXVCQyxNQUF2QixDQUE4QixJQUFJLGlCQUFPWixFQUFFUyxJQUFULENBQUosQ0FBbUJULEVBQUVXLElBQXJCLENBQTlCLEVBQTBELDhCQUFvQmIsT0FBcEIsQ0FBMUQ7QUFFSCxTQUpELE1BSU8sSUFBSSx3QkFBY2UsRUFBZCxDQUFpQmIsQ0FBakIsQ0FBSixFQUF5Qjs7QUFFNUIsa0JBQUtjLFFBQUwsQ0FBY0osTUFBZCxDQUFxQlYsRUFBRWUsRUFBdkIsRUFBMkJILE1BQTNCLENBQWtDWixFQUFFZ0IsSUFBcEMsRUFBMEMsOEJBQW9CbEIsT0FBcEIsQ0FBMUM7QUFFSCxTQUpNLE1BSUE7O0FBRUhGLG9CQUFRVyxPQUFSLENBQWdCLElBQUlDLG1CQUFKLENBQXdCUixDQUF4QixFQUEyQixFQUEzQixDQUFoQjtBQUVIO0FBRUosS0F6QkQ7O0FBMkJBaUIsUUFBSWxCLEVBQUosQ0FBTyxVQUFQLEVBQW1CLFVBQVNtQixPQUFULEVBQWtCOztBQUVqQ0EsZ0JBQVFDLEtBQVIsQ0FBYyxVQUFTQyxHQUFULEVBQWNDLEdBQWQsRUFBbUI7O0FBRTdCdkIsb0JBQVF3QixJQUFSLENBQWFELElBQUlFLFFBQUosRUFBYjtBQUVILFNBSkQ7QUFNSCxLQVJEO0FBVUgsQzs7a0JBSVU1QixhIiwiZmlsZSI6IlByb2Nlc3NSb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4uL0NvbnRleHQnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9TaWduYWwnO1xuaW1wb3J0IFJlbW90ZU1lc3NhZ2UgZnJvbSAnLi4vUmVtb3RlTWVzc2FnZSc7XG5pbXBvcnQgUGFyZW50UmVmZXJlbmNlIGZyb20gJy4vUGFyZW50UmVmZXJlbmNlJztcblxuLyoqXG4gKiBQcm9jZXNzUm91dGVyIGlzIGEgY2xhc3MgZm9yIHRyZWF0aW5nIHRoZSBjdXJyZW50IHByb2Nlc3MgYXMgYVxuICogc3lzdGVtLlxuICogQHBhcmFtIHtDb250ZXh0fSBjb250ZXh0XG4gKi9cbmNsYXNzIFByb2Nlc3NSb3V0ZXIge1xuXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuXG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcblxuICAgICAgICBwcm9jZXNzLm9uKCdtZXNzYWdlJywgbWVzc2FnZSA9PiB7XG5cbiAgICAgICAgICAgIHZhciBtO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG0gPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGFzc2VydC5vayh0eXBlb2YgbSA9PT0gJ29iamVjdCcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0LnB1Ymxpc2gobmV3IEludmFsaWRNZXNzYWdlRXJyb3IobWVzc2FnZSwgJycpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG0udHlwZSA9PT0gJ3NpZ25hbCcpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2VsZWN0KG0ucGF0aCkuYWNjZXB0KG5ldyBTaWduYWxbbS50eXBlXShtLnBhdGgpLCBuZXcgUGFyZW50UmVmZXJlbmNlKHByb2Nlc3MpKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChSZW1vdGVNZXNzYWdlLmlzKG0pKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZXh0LnNlbGVjdChtLnRvKS5hY2NlcHQobS5ib2R5LCBuZXcgUGFyZW50UmVmZXJlbmNlKHByb2Nlc3MpKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQucHVibGlzaChuZXcgSW52YWxpZE1lc3NhZ2VFcnJvcihtLCAnJykpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3R4Lm9uKCdnZW5lcmF0ZScsIGZ1bmN0aW9uKGNvbmNlcm4pIHtcblxuICAgICAgICAgICAgY29uY2Vybi53YXRjaChmdW5jdGlvbihvbGQsIG5ldSkge1xuXG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zZW5kKG5ldS50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvY2Vzc1JvdXRlclxuIl19