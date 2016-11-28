'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Signal = require('../state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _InvalidMessage = require('./InvalidMessage');

var _InvalidMessage2 = _interopRequireDefault(_InvalidMessage);

var _RemoteReference = require('./RemoteReference');

var _RemoteReference2 = _interopRequireDefault(_RemoteReference);

var _Peer = require('./Peer');

var _Peer2 = _interopRequireDefault(_Peer);

var _System = require('../System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Monitor provides a monitor over a remote association to provide
 * a more stable experience.
 *
 * It looks out for errors, disconnections and messages and passes them
 * onto the relevant code.
 * @param {object} config - Configuration directives for the remote
 * @param {System} system
 *
 * message = {
 *
 *  namespace: 'system',
 *  to: 'parent:///app/main',
 *  from: '/app/worker'
 *  body: *
 * }
 */
var Monitor = function () {
    function Monitor(transport, system) {
        var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, Monitor);

        (0, _beof2.default)({ transport: transport }).interface(_Peer2.default);
        (0, _beof2.default)({ system: system }).interface(_System2.default);
        (0, _beof2.default)({ config: config }).optional().object();

        this._transport = transport;
        this._system = system;
        this._config = config;
    }

    _createClass(Monitor, [{
        key: '_handleSystemMessage',
        value: function _handleSystemMessage(message) {

            var m;
            var to = message.to;
            var from = message.from;

            if (_Signal2.default.hasOwnProperty(message.body.name)) m = _Signal2.default[message.body.signal].newInstance();else if (message.body.name === 'InvalidMessage') return this._system.emit('log', 'Remote: ' + message.body.message);else m = message.body;

            this._system.select(to).tell(m, new _RemoteReference2.default(from, this._transport));
        }
    }, {
        key: '_handleUserMessage',
        value: function _handleUserMessage(message) {

            var to = message.to;
            var from = message.from;

            this._system.select(to).tell(message.body, new _RemoteReference2.default(from, this._transport));
        }

        /**
         * associate the transport with this Monitor.
         */

    }, {
        key: 'associate',
        value: function associate() {
            var _this = this;

            this._transport.associate(this).catch(function (e) {
                return _this._system.shutdown(err);
            });
        }

        /**
         * error is called when the remote transport has encountered and error.
         * Should not be used for user space errors.
         * @param {Error} err
         */

    }, {
        key: 'error',
        value: function error(err) {

            //@todo In the future we will support restarting on error
            //if specified in the config, for now, shutdown the whole system.
            this._system.shutdown(err);
        }

        /**
         * closed is called when we lose our connection to the remote system.
         */

    }, {
        key: 'closed',
        value: function closed() {

            //Needs to be impoved significantly for now this just gives an idea of
            //what could be done.
            //
            if (this._config['keep_alive']) return this.associate();

            this._system.emit('closed');
        }

        /**
         * message is called to deliver a message to the intended local
         * recipient.
         * @param {object} message
         */

    }, {
        key: 'message',
        value: function message(_message) {

            if ((typeof _message === 'undefined' ? 'undefined' : _typeof(_message)) === 'object') {

                if (typeof _message.to === 'string') if (typeof _message.namespace === 'string') if (_message.hasOwnProperty('body')) {

                    if (_message.namespace === 'system') {

                        return this._handleSystemMessage(_message);
                    } else if (_message.namespace === 'user') {

                        return this._handleUserMessage(_message);
                    }
                }

                this._transport.send({
                    namespace: 'system',
                    to: '/remote',
                    from: '/remote',
                    body: new _InvalidMessage2.default(_message)
                });

                this._system.emit('log', +new _InvalidMessage2.default(_message));
            }
        }
    }]);

    return Monitor;
}();

exports.default = Monitor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdGUvTW9uaXRvci5qcyJdLCJuYW1lcyI6WyJNb25pdG9yIiwidHJhbnNwb3J0Iiwic3lzdGVtIiwiY29uZmlnIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJvYmplY3QiLCJfdHJhbnNwb3J0IiwiX3N5c3RlbSIsIl9jb25maWciLCJtZXNzYWdlIiwibSIsInRvIiwiZnJvbSIsImhhc093blByb3BlcnR5IiwiYm9keSIsIm5hbWUiLCJzaWduYWwiLCJuZXdJbnN0YW5jZSIsImVtaXQiLCJzZWxlY3QiLCJ0ZWxsIiwiYXNzb2NpYXRlIiwiY2F0Y2giLCJzaHV0ZG93biIsImVyciIsIm5hbWVzcGFjZSIsIl9oYW5kbGVTeXN0ZW1NZXNzYWdlIiwiX2hhbmRsZVVzZXJNZXNzYWdlIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQk1BLE87QUFFRixxQkFBWUMsU0FBWixFQUF1QkMsTUFBdkIsRUFBNEM7QUFBQSxZQUFiQyxNQUFhLHlEQUFKLEVBQUk7O0FBQUE7O0FBRXhDLDRCQUFLLEVBQUVGLG9CQUFGLEVBQUwsRUFBb0JHLFNBQXBCO0FBQ0EsNEJBQUssRUFBRUYsY0FBRixFQUFMLEVBQWlCRSxTQUFqQjtBQUNBLDRCQUFLLEVBQUVELGNBQUYsRUFBTCxFQUFpQkUsUUFBakIsR0FBNEJDLE1BQTVCOztBQUVBLGFBQUtDLFVBQUwsR0FBa0JOLFNBQWxCO0FBQ0EsYUFBS08sT0FBTCxHQUFlTixNQUFmO0FBQ0EsYUFBS08sT0FBTCxHQUFlTixNQUFmO0FBRUg7Ozs7NkNBRW9CTyxPLEVBQVM7O0FBRTFCLGdCQUFJQyxDQUFKO0FBQ0EsZ0JBQUlDLEtBQUtGLFFBQVFFLEVBQWpCO0FBQ0EsZ0JBQUlDLE9BQU9ILFFBQVFHLElBQW5COztBQUVBLGdCQUFJLGlCQUFPQyxjQUFQLENBQXNCSixRQUFRSyxJQUFSLENBQWFDLElBQW5DLENBQUosRUFDSUwsSUFBSSxpQkFBT0QsUUFBUUssSUFBUixDQUFhRSxNQUFwQixFQUE0QkMsV0FBNUIsRUFBSixDQURKLEtBRUssSUFBSVIsUUFBUUssSUFBUixDQUFhQyxJQUFiLEtBQXNCLGdCQUExQixFQUNELE9BQU8sS0FBS1IsT0FBTCxDQUFhVyxJQUFiLENBQWtCLEtBQWxCLGVBQW9DVCxRQUFRSyxJQUFSLENBQWFMLE9BQWpELENBQVAsQ0FEQyxLQUdEQyxJQUFJRCxRQUFRSyxJQUFaOztBQUVKLGlCQUFLUCxPQUFMLENBQWFZLE1BQWIsQ0FBb0JSLEVBQXBCLEVBQXdCUyxJQUF4QixDQUE2QlYsQ0FBN0IsRUFBZ0MsOEJBQW9CRSxJQUFwQixFQUEwQixLQUFLTixVQUEvQixDQUFoQztBQUVIOzs7MkNBRWtCRyxPLEVBQVM7O0FBRXhCLGdCQUFJRSxLQUFLRixRQUFRRSxFQUFqQjtBQUNBLGdCQUFJQyxPQUFPSCxRQUFRRyxJQUFuQjs7QUFFQSxpQkFBS0wsT0FBTCxDQUFhWSxNQUFiLENBQW9CUixFQUFwQixFQUF3QlMsSUFBeEIsQ0FBNkJYLFFBQVFLLElBQXJDLEVBQTJDLDhCQUFvQkYsSUFBcEIsRUFBMEIsS0FBS04sVUFBL0IsQ0FBM0M7QUFFSDs7QUFFRDs7Ozs7O29DQUdZO0FBQUE7O0FBRVIsaUJBQUtBLFVBQUwsQ0FBZ0JlLFNBQWhCLENBQTBCLElBQTFCLEVBQ0FDLEtBREEsQ0FDTTtBQUFBLHVCQUFLLE1BQUtmLE9BQUwsQ0FBYWdCLFFBQWIsQ0FBc0JDLEdBQXRCLENBQUw7QUFBQSxhQUROO0FBR0g7O0FBRUQ7Ozs7Ozs7OzhCQUtNQSxHLEVBQUs7O0FBRVA7QUFDQTtBQUNBLGlCQUFLakIsT0FBTCxDQUFhZ0IsUUFBYixDQUFzQkMsR0FBdEI7QUFFSDs7QUFFRDs7Ozs7O2lDQUdTOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGdCQUFJLEtBQUtoQixPQUFMLENBQWEsWUFBYixDQUFKLEVBQ0ksT0FBTyxLQUFLYSxTQUFMLEVBQVA7O0FBRUosaUJBQUtkLE9BQUwsQ0FBYVcsSUFBYixDQUFrQixRQUFsQjtBQUdIOztBQUVEOzs7Ozs7OztnQ0FLUVQsUSxFQUFTOztBQUViLGdCQUFJLFFBQU9BLFFBQVAseUNBQU9BLFFBQVAsT0FBbUIsUUFBdkIsRUFBaUM7O0FBRTdCLG9CQUFJLE9BQU9BLFNBQVFFLEVBQWYsS0FBc0IsUUFBMUIsRUFDSSxJQUFJLE9BQU9GLFNBQVFnQixTQUFmLEtBQTZCLFFBQWpDLEVBQ0ksSUFBSWhCLFNBQVFJLGNBQVIsQ0FBdUIsTUFBdkIsQ0FBSixFQUFvQzs7QUFFaEMsd0JBQUlKLFNBQVFnQixTQUFSLEtBQXNCLFFBQTFCLEVBQW9DOztBQUVoQywrQkFBTyxLQUFLQyxvQkFBTCxDQUEwQmpCLFFBQTFCLENBQVA7QUFFSCxxQkFKRCxNQUlPLElBQUlBLFNBQVFnQixTQUFSLEtBQXNCLE1BQTFCLEVBQWtDOztBQUVyQywrQkFBTyxLQUFLRSxrQkFBTCxDQUF3QmxCLFFBQXhCLENBQVA7QUFFSDtBQUNKOztBQUVULHFCQUFLSCxVQUFMLENBQWdCc0IsSUFBaEIsQ0FBcUI7QUFDakJILCtCQUFXLFFBRE07QUFFakJkLHdCQUFJLFNBRmE7QUFHakJDLDBCQUFNLFNBSFc7QUFJakJFLDBCQUFNLDZCQUFtQkwsUUFBbkI7QUFKVyxpQkFBckI7O0FBT0EscUJBQUtGLE9BQUwsQ0FBYVcsSUFBYixDQUFrQixLQUFsQixFQUF5QixDQUFDLDZCQUFtQlQsUUFBbkIsQ0FBMUI7QUFFSDtBQUVKOzs7Ozs7a0JBSVVWLE8iLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IEludmFsaWRNZXNzYWdlIGZyb20gJy4vSW52YWxpZE1lc3NhZ2UnO1xuaW1wb3J0IFJlbW90ZVJlZmVyZW5jZSBmcm9tICcuL1JlbW90ZVJlZmVyZW5jZSc7XG5pbXBvcnQgUGVlciBmcm9tICcuL1BlZXInO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuLi9TeXN0ZW0nO1xuXG4vKipcbiAqIE1vbml0b3IgcHJvdmlkZXMgYSBtb25pdG9yIG92ZXIgYSByZW1vdGUgYXNzb2NpYXRpb24gdG8gcHJvdmlkZVxuICogYSBtb3JlIHN0YWJsZSBleHBlcmllbmNlLlxuICpcbiAqIEl0IGxvb2tzIG91dCBmb3IgZXJyb3JzLCBkaXNjb25uZWN0aW9ucyBhbmQgbWVzc2FnZXMgYW5kIHBhc3NlcyB0aGVtXG4gKiBvbnRvIHRoZSByZWxldmFudCBjb2RlLlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gZGlyZWN0aXZlcyBmb3IgdGhlIHJlbW90ZVxuICogQHBhcmFtIHtTeXN0ZW19IHN5c3RlbVxuICpcbiAqIG1lc3NhZ2UgPSB7XG4gKlxuICogIG5hbWVzcGFjZTogJ3N5c3RlbScsXG4gKiAgdG86ICdwYXJlbnQ6Ly8vYXBwL21haW4nLFxuICogIGZyb206ICcvYXBwL3dvcmtlcidcbiAqICBib2R5OiAqXG4gKiB9XG4gKi9cbmNsYXNzIE1vbml0b3Ige1xuXG4gICAgY29uc3RydWN0b3IodHJhbnNwb3J0LCBzeXN0ZW0sIGNvbmZpZyA9IHt9KSB7XG5cbiAgICAgICAgYmVvZih7IHRyYW5zcG9ydCB9KS5pbnRlcmZhY2UoUGVlcik7XG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG4gICAgICAgIGJlb2YoeyBjb25maWcgfSkub3B0aW9uYWwoKS5vYmplY3QoKTtcblxuICAgICAgICB0aGlzLl90cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuXG4gICAgfVxuXG4gICAgX2hhbmRsZVN5c3RlbU1lc3NhZ2UobWVzc2FnZSkge1xuXG4gICAgICAgIHZhciBtO1xuICAgICAgICB2YXIgdG8gPSBtZXNzYWdlLnRvO1xuICAgICAgICB2YXIgZnJvbSA9IG1lc3NhZ2UuZnJvbTtcblxuICAgICAgICBpZiAoU2lnbmFsLmhhc093blByb3BlcnR5KG1lc3NhZ2UuYm9keS5uYW1lKSlcbiAgICAgICAgICAgIG0gPSBTaWduYWxbbWVzc2FnZS5ib2R5LnNpZ25hbF0ubmV3SW5zdGFuY2UoKTtcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZS5ib2R5Lm5hbWUgPT09ICdJbnZhbGlkTWVzc2FnZScpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3lzdGVtLmVtaXQoJ2xvZycsIGBSZW1vdGU6ICR7bWVzc2FnZS5ib2R5Lm1lc3NhZ2V9YCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG0gPSBtZXNzYWdlLmJvZHk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtLnNlbGVjdCh0bykudGVsbChtLCBuZXcgUmVtb3RlUmVmZXJlbmNlKGZyb20sIHRoaXMuX3RyYW5zcG9ydCkpO1xuXG4gICAgfVxuXG4gICAgX2hhbmRsZVVzZXJNZXNzYWdlKG1lc3NhZ2UpIHtcblxuICAgICAgICB2YXIgdG8gPSBtZXNzYWdlLnRvO1xuICAgICAgICB2YXIgZnJvbSA9IG1lc3NhZ2UuZnJvbTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0uc2VsZWN0KHRvKS50ZWxsKG1lc3NhZ2UuYm9keSwgbmV3IFJlbW90ZVJlZmVyZW5jZShmcm9tLCB0aGlzLl90cmFuc3BvcnQpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFzc29jaWF0ZSB0aGUgdHJhbnNwb3J0IHdpdGggdGhpcyBNb25pdG9yLlxuICAgICAqL1xuICAgIGFzc29jaWF0ZSgpIHtcblxuICAgICAgICB0aGlzLl90cmFuc3BvcnQuYXNzb2NpYXRlKHRoaXMpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuX3N5c3RlbS5zaHV0ZG93bihlcnIpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVycm9yIGlzIGNhbGxlZCB3aGVuIHRoZSByZW1vdGUgdHJhbnNwb3J0IGhhcyBlbmNvdW50ZXJlZCBhbmQgZXJyb3IuXG4gICAgICogU2hvdWxkIG5vdCBiZSB1c2VkIGZvciB1c2VyIHNwYWNlIGVycm9ycy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAgICAgKi9cbiAgICBlcnJvcihlcnIpIHtcblxuICAgICAgICAvL0B0b2RvIEluIHRoZSBmdXR1cmUgd2Ugd2lsbCBzdXBwb3J0IHJlc3RhcnRpbmcgb24gZXJyb3JcbiAgICAgICAgLy9pZiBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZywgZm9yIG5vdywgc2h1dGRvd24gdGhlIHdob2xlIHN5c3RlbS5cbiAgICAgICAgdGhpcy5fc3lzdGVtLnNodXRkb3duKGVycik7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbG9zZWQgaXMgY2FsbGVkIHdoZW4gd2UgbG9zZSBvdXIgY29ubmVjdGlvbiB0byB0aGUgcmVtb3RlIHN5c3RlbS5cbiAgICAgKi9cbiAgICBjbG9zZWQoKSB7XG5cbiAgICAgICAgLy9OZWVkcyB0byBiZSBpbXBvdmVkIHNpZ25pZmljYW50bHkgZm9yIG5vdyB0aGlzIGp1c3QgZ2l2ZXMgYW4gaWRlYSBvZlxuICAgICAgICAvL3doYXQgY291bGQgYmUgZG9uZS5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZ1sna2VlcF9hbGl2ZSddKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzb2NpYXRlKCk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtLmVtaXQoJ2Nsb3NlZCcpO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBtZXNzYWdlIGlzIGNhbGxlZCB0byBkZWxpdmVyIGEgbWVzc2FnZSB0byB0aGUgaW50ZW5kZWQgbG9jYWxcbiAgICAgKiByZWNpcGllbnQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2VcbiAgICAgKi9cbiAgICBtZXNzYWdlKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS50byA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlLm5hbWVzcGFjZSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLmhhc093blByb3BlcnR5KCdib2R5JykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UubmFtZXNwYWNlID09PSAnc3lzdGVtJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZVN5c3RlbU1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5uYW1lc3BhY2UgPT09ICd1c2VyJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZVVzZXJNZXNzYWdlKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdHJhbnNwb3J0LnNlbmQoe1xuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgdG86ICcvcmVtb3RlJyxcbiAgICAgICAgICAgICAgICBmcm9tOiAnL3JlbW90ZScsXG4gICAgICAgICAgICAgICAgYm9keTogbmV3IEludmFsaWRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fc3lzdGVtLmVtaXQoJ2xvZycsICtuZXcgSW52YWxpZE1lc3NhZ2UobWVzc2FnZSkpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNb25pdG9yXG4iXX0=