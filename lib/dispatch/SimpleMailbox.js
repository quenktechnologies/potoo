'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Mailbox = require('./Mailbox');

var _Mailbox2 = _interopRequireDefault(_Mailbox);

var _Envelope = require('./Envelope');

var _Envelope2 = _interopRequireDefault(_Envelope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SimpleMailbox is a simple no bacchanal Mailbox. Nothing
 * special but enqueue and dequeue behaviour.
 * @param {EnqueueListener} enqueueListener - The EnqueueListener that will be notified.
 * @implements {Mailbox}
 */
var SimpleMailbox = function () {
    function SimpleMailbox(enqueueListener) {
        _classCallCheck(this, SimpleMailbox);

        (0, _beof2.default)({ enqueueListener: enqueueListener }).interface(_Mailbox2.default.EnqueueListener);

        this._messages = [];
        this._enqueueListener = enqueueListener;
    }

    _createClass(SimpleMailbox, [{
        key: 'enqueue',
        value: function enqueue(message) {

            this._messages.push(message);
            this._enqueueListener.onEnqueue(this);
        }
    }, {
        key: 'dequeue',
        value: function dequeue() {

            if (this._messages.length > 0) return this._messages.shift();

            return null;
        }
    }]);

    return SimpleMailbox;
}();

exports.default = SimpleMailbox;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9TaW1wbGVNYWlsYm94LmpzIl0sIm5hbWVzIjpbIlNpbXBsZU1haWxib3giLCJlbnF1ZXVlTGlzdGVuZXIiLCJpbnRlcmZhY2UiLCJFbnF1ZXVlTGlzdGVuZXIiLCJfbWVzc2FnZXMiLCJfZW5xdWV1ZUxpc3RlbmVyIiwibWVzc2FnZSIsInB1c2giLCJvbkVucXVldWUiLCJsZW5ndGgiLCJzaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1NQSxhO0FBRUYsMkJBQVlDLGVBQVosRUFBNkI7QUFBQTs7QUFFekIsNEJBQUssRUFBRUEsZ0NBQUYsRUFBTCxFQUEwQkMsU0FBMUIsQ0FBb0Msa0JBQVFDLGVBQTVDOztBQUVBLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxnQkFBTCxHQUF3QkosZUFBeEI7QUFFSDs7OztnQ0FFT0ssTyxFQUFTOztBQUViLGlCQUFLRixTQUFMLENBQWVHLElBQWYsQ0FBb0JELE9BQXBCO0FBQ0EsaUJBQUtELGdCQUFMLENBQXNCRyxTQUF0QixDQUFnQyxJQUFoQztBQUVIOzs7a0NBRVM7O0FBRU4sZ0JBQUksS0FBS0osU0FBTCxDQUFlSyxNQUFmLEdBQXdCLENBQTVCLEVBQ0ksT0FBTyxLQUFLTCxTQUFMLENBQWVNLEtBQWYsRUFBUDs7QUFFSixtQkFBTyxJQUFQO0FBRUg7Ozs7OztrQkFLVVYsYSIsImZpbGUiOiJTaW1wbGVNYWlsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgTWFpbGJveCBmcm9tICcuL01haWxib3gnO1xuaW1wb3J0IEVudmVsb3BlIGZyb20gJy4vRW52ZWxvcGUnO1xuXG4vKipcbiAqIFNpbXBsZU1haWxib3ggaXMgYSBzaW1wbGUgbm8gYmFjY2hhbmFsIE1haWxib3guIE5vdGhpbmdcbiAqIHNwZWNpYWwgYnV0IGVucXVldWUgYW5kIGRlcXVldWUgYmVoYXZpb3VyLlxuICogQHBhcmFtIHtFbnF1ZXVlTGlzdGVuZXJ9IGVucXVldWVMaXN0ZW5lciAtIFRoZSBFbnF1ZXVlTGlzdGVuZXIgdGhhdCB3aWxsIGJlIG5vdGlmaWVkLlxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKi9cbmNsYXNzIFNpbXBsZU1haWxib3gge1xuXG4gICAgY29uc3RydWN0b3IoZW5xdWV1ZUxpc3RlbmVyKSB7XG5cbiAgICAgICAgYmVvZih7IGVucXVldWVMaXN0ZW5lciB9KS5pbnRlcmZhY2UoTWFpbGJveC5FbnF1ZXVlTGlzdGVuZXIpO1xuXG4gICAgICAgIHRoaXMuX21lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuX2VucXVldWVMaXN0ZW5lciA9IGVucXVldWVMaXN0ZW5lcjtcblxuICAgIH1cblxuICAgIGVucXVldWUobWVzc2FnZSkge1xuXG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuX2VucXVldWVMaXN0ZW5lci5vbkVucXVldWUodGhpcyk7XG5cbiAgICB9XG5cbiAgICBkZXF1ZXVlKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9tZXNzYWdlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLnNoaWZ0KCk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVNYWlsYm94XG4iXX0=