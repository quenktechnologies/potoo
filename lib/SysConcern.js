'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Signal = require('./state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _OneForOneStrategy = require('./OneForOneStrategy');

var _OneForOneStrategy2 = _interopRequireDefault(_OneForOneStrategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AppConcern is a basic Concern that does just enough to satisfy the Concern
 * interface
 * @implements {Concern}
 */
var AppConcern = function () {
    function AppConcern(context) {
        _classCallCheck(this, AppConcern);

        this.context = context;
    }

    _createClass(AppConcern, [{
        key: 'onStart',
        value: function onStart() {}
    }, {
        key: 'onReceive',
        value: function onReceive() {}
    }, {
        key: 'onPause',
        value: function onPause() {}
    }, {
        key: 'onResmue',
        value: function onResmue() {}
    }, {
        key: 'onRestart',
        value: function onRestart() {}
    }, {
        key: 'onStop',
        value: function onStop() {}
    }]);

    return AppConcern;
}();

exports.default = AppConcern;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXNDb25jZXJuLmpzIl0sIm5hbWVzIjpbIkFwcENvbmNlcm4iLCJjb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7OztJQUtNQSxVO0FBRUYsd0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFFakIsYUFBS0EsT0FBTCxHQUFlQSxPQUFmO0FBRUg7Ozs7a0NBRVMsQ0FBRTs7O29DQUVBLENBQUU7OztrQ0FFSixDQUFFOzs7bUNBRUQsQ0FBRTs7O29DQUVELENBQUU7OztpQ0FFTCxDQUFFOzs7Ozs7a0JBSUFELFUiLCJmaWxlIjoiU3lzQ29uY2Vybi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IE9uZUZvck9uZVN0cmF0ZWd5IGZyb20gJy4vT25lRm9yT25lU3RyYXRlZ3knO1xuXG4vKipcbiAqIEFwcENvbmNlcm4gaXMgYSBiYXNpYyBDb25jZXJuIHRoYXQgZG9lcyBqdXN0IGVub3VnaCB0byBzYXRpc2Z5IHRoZSBDb25jZXJuXG4gKiBpbnRlcmZhY2VcbiAqIEBpbXBsZW1lbnRzIHtDb25jZXJufVxuICovXG5jbGFzcyBBcHBDb25jZXJuIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgfVxuXG4gICAgb25TdGFydCgpIHt9XG5cbiAgICBvblJlY2VpdmUoKSB7fVxuXG4gICAgb25QYXVzZSgpIHt9XG5cbiAgICBvblJlc211ZSgpIHt9XG5cbiAgICBvblJlc3RhcnQoKSB7fVxuXG4gICAgb25TdG9wKCkge31cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBDb25jZXJuXG4iXX0=