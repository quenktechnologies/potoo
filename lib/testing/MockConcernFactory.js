'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockDispatcher = require('./MockDispatcher');

var _MockDispatcher2 = _interopRequireDefault(_MockDispatcher);

var _MockMailbox = require('./MockMailbox');

var _MockMailbox2 = _interopRequireDefault(_MockMailbox);

var _MockConcern = require('./MockConcern');

var _MockConcern2 = _interopRequireDefault(_MockConcern);

var _MockReference = require('./MockReference');

var _MockReference2 = _interopRequireDefault(_MockReference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockConcernFactory = function () {
    function MockConcernFactory() {
        _classCallCheck(this, MockConcernFactory);

        this.Dispatcher = new _MockDispatcher2.default();
        this.Mailbox = new _MockMailbox2.default();
        this.Concern = new _MockConcern2.default();
    }

    _createClass(MockConcernFactory, [{
        key: 'dispatcher',
        value: function dispatcher() {

            return this.Dispatcher;
        }
    }, {
        key: 'mailbox',
        value: function mailbox() {

            return this.Mailbox;
        }
    }, {
        key: 'errorHandlingStrategy',
        value: function errorHandlingStrategy() {}
    }, {
        key: 'reference',
        value: function reference() {

            return new _MockReference2.default();
        }
    }, {
        key: 'create',
        value: function create() {

            return this.Concern;
        }
    }]);

    return MockConcernFactory;
}();

exports.default = MockConcernFactory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tDb25jZXJuRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJNb2NrQ29uY2VybkZhY3RvcnkiLCJEaXNwYXRjaGVyIiwiTWFpbGJveCIsIkNvbmNlcm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU1BLGtCO0FBRUYsa0NBQWM7QUFBQTs7QUFFVixhQUFLQyxVQUFMLEdBQWtCLDhCQUFsQjtBQUNBLGFBQUtDLE9BQUwsR0FBZSwyQkFBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZSwyQkFBZjtBQUVIOzs7O3FDQUVZOztBQUVULG1CQUFPLEtBQUtGLFVBQVo7QUFFSDs7O2tDQUVTOztBQUVOLG1CQUFPLEtBQUtDLE9BQVo7QUFFSDs7O2dEQUV1QixDQUd2Qjs7O29DQUVXOztBQUVSLG1CQUFPLDZCQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyxLQUFLQyxPQUFaO0FBRUg7Ozs7OztrQkFJVUgsa0IiLCJmaWxlIjoiTW9ja0NvbmNlcm5GYWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vY2tEaXNwYXRjaGVyIGZyb20gJy4vTW9ja0Rpc3BhdGNoZXInO1xuaW1wb3J0IE1vY2tNYWlsYm94IGZyb20gJy4vTW9ja01haWxib3gnO1xuaW1wb3J0IE1vY2tDb25jZXJuIGZyb20gJy4vTW9ja0NvbmNlcm4nO1xuaW1wb3J0IE1vY2tSZWZlcmVuY2UgZnJvbSAnLi9Nb2NrUmVmZXJlbmNlJztcblxuY2xhc3MgTW9ja0NvbmNlcm5GYWN0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuRGlzcGF0Y2hlciA9IG5ldyBNb2NrRGlzcGF0Y2hlcigpO1xuICAgICAgICB0aGlzLk1haWxib3ggPSBuZXcgTW9ja01haWxib3goKTtcbiAgICAgICAgdGhpcy5Db25jZXJuID0gbmV3IE1vY2tDb25jZXJuKCk7XG5cbiAgICB9XG5cbiAgICBkaXNwYXRjaGVyKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLkRpc3BhdGNoZXI7XG5cbiAgICB9XG5cbiAgICBtYWlsYm94KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLk1haWxib3g7XG5cbiAgICB9XG5cbiAgICBlcnJvckhhbmRsaW5nU3RyYXRlZ3koKSB7XG5cblxuICAgIH1cblxuICAgIHJlZmVyZW5jZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IE1vY2tSZWZlcmVuY2UoKTtcblxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5Db25jZXJuO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vY2tDb25jZXJuRmFjdG9yeVxuIl19