'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Dispatcher = require('./Dispatcher');

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * UnboundedMailbox is a simple no bacchanal Mailbox. Nothing
 * special but enqueue and dequeue behaviour, does not care if you run out of memory or not.
 * @implements {Mailbox}
 */
var UnboundedMailbox = function () {
    function UnboundedMailbox(dispatch) {
        _classCallCheck(this, UnboundedMailbox);

        (0, _beof2.default)({ dispatch: dispatch }).interface(_Dispatcher2.default);

        this._messages = [];
        this._dispatch = dispatch;
    }

    _createClass(UnboundedMailbox, [{
        key: 'enqueue',
        value: function enqueue(message) {

            this._messages.push(message);
            this._dispatch.dispatch();
        }
    }, {
        key: 'dequeue',
        value: function dequeue() {

            if (this._messages.length > 0) return this._messages.shift();

            return null;
        }
    }]);

    return UnboundedMailbox;
}();

exports.default = UnboundedMailbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9VbmJvdW5kZWRNYWlsYm94LmpzIl0sIm5hbWVzIjpbIlVuYm91bmRlZE1haWxib3giLCJkaXNwYXRjaCIsImludGVyZmFjZSIsIl9tZXNzYWdlcyIsIl9kaXNwYXRjaCIsIm1lc3NhZ2UiLCJwdXNoIiwibGVuZ3RoIiwic2hpZnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7SUFLTUEsZ0I7QUFFRiw4QkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUVsQiw0QkFBSyxFQUFFQSxrQkFBRixFQUFMLEVBQW1CQyxTQUFuQjs7QUFFQSxhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQkgsUUFBakI7QUFFSDs7OztnQ0FFT0ksTyxFQUFTOztBQUViLGlCQUFLRixTQUFMLENBQWVHLElBQWYsQ0FBb0JELE9BQXBCO0FBQ0EsaUJBQUtELFNBQUwsQ0FBZUgsUUFBZjtBQUVIOzs7a0NBRVM7O0FBRU4sZ0JBQUksS0FBS0UsU0FBTCxDQUFlSSxNQUFmLEdBQXdCLENBQTVCLEVBQ0ksT0FBTyxLQUFLSixTQUFMLENBQWVLLEtBQWYsRUFBUDs7QUFFSixtQkFBTyxJQUFQO0FBRUg7Ozs7OztrQkFLVVIsZ0IiLCJmaWxlIjoiVW5ib3VuZGVkTWFpbGJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi9EaXNwYXRjaGVyJztcblxuLyoqXG4gKiBVbmJvdW5kZWRNYWlsYm94IGlzIGEgc2ltcGxlIG5vIGJhY2NoYW5hbCBNYWlsYm94LiBOb3RoaW5nXG4gKiBzcGVjaWFsIGJ1dCBlbnF1ZXVlIGFuZCBkZXF1ZXVlIGJlaGF2aW91ciwgZG9lcyBub3QgY2FyZSBpZiB5b3UgcnVuIG91dCBvZiBtZW1vcnkgb3Igbm90LlxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKi9cbmNsYXNzIFVuYm91bmRlZE1haWxib3gge1xuXG4gICAgY29uc3RydWN0b3IoZGlzcGF0Y2gpIHtcblxuICAgICAgICBiZW9mKHsgZGlzcGF0Y2ggfSkuaW50ZXJmYWNlKERpc3BhdGNoZXIpO1xuXG4gICAgICAgIHRoaXMuX21lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoID0gZGlzcGF0Y2g7XG5cbiAgICB9XG5cbiAgICBlbnF1ZXVlKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaC5kaXNwYXRjaCgpO1xuXG4gICAgfVxuXG4gICAgZGVxdWV1ZSgpIHtcblxuICAgICAgICBpZiAodGhpcy5fbWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5zaGlmdCgpO1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVW5ib3VuZGVkTWFpbGJveFxuIl19