'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * InvalidMessage
 */
var InvalidMessage = function () {
    function InvalidMessage(message, url) {
        _classCallCheck(this, InvalidMessage);

        this._invalid = message;
        this._url = url;
    }

    _createClass(InvalidMessage, [{
        key: 'toJSON',
        value: function toJSON() {

            return {

                name: 'InvalidMessage',
                message: this.toString(),
                invalid: this._invalid

            };
        }
    }, {
        key: 'toString',
        value: function toString() {

            var invalid;

            try {

                JSON.stringify(this._invalid);
            } catch (e) {

                invalid = this._invalid;
            }

            return 'Invalid message received from ' + this._url + ': "' + invalid + '"!';
        }
    }]);

    return InvalidMessage;
}();

exports.default = InvalidMessage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdGUvSW52YWxpZE1lc3NhZ2UuanMiXSwibmFtZXMiOlsiSW52YWxpZE1lc3NhZ2UiLCJtZXNzYWdlIiwidXJsIiwiX2ludmFsaWQiLCJfdXJsIiwibmFtZSIsInRvU3RyaW5nIiwiaW52YWxpZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxjO0FBRUYsNEJBQVlDLE9BQVosRUFBcUJDLEdBQXJCLEVBQTBCO0FBQUE7O0FBRXRCLGFBQUtDLFFBQUwsR0FBZ0JGLE9BQWhCO0FBQ0EsYUFBS0csSUFBTCxHQUFZRixHQUFaO0FBRUg7Ozs7aUNBRVE7O0FBRUwsbUJBQU87O0FBRUhHLHNCQUFNLGdCQUZIO0FBR0hKLHlCQUFTLEtBQUtLLFFBQUwsRUFITjtBQUlIQyx5QkFBUyxLQUFLSjs7QUFKWCxhQUFQO0FBUUg7OzttQ0FFVTs7QUFFUCxnQkFBSUksT0FBSjs7QUFFQSxnQkFBSTs7QUFFQUMscUJBQUtDLFNBQUwsQ0FBZSxLQUFLTixRQUFwQjtBQUVILGFBSkQsQ0FJRSxPQUFPTyxDQUFQLEVBQVU7O0FBRVJILDBCQUFVLEtBQUtKLFFBQWY7QUFFSDs7QUFFRCxzREFBd0MsS0FBS0MsSUFBN0MsV0FBdURHLE9BQXZEO0FBRUg7Ozs7OztrQkFHVVAsYyIsImZpbGUiOiJJbnZhbGlkTWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSW52YWxpZE1lc3NhZ2VcbiAqL1xuY2xhc3MgSW52YWxpZE1lc3NhZ2Uge1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgdXJsKSB7XG5cbiAgICAgICAgdGhpcy5faW52YWxpZCA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcblxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBuYW1lOiAnSW52YWxpZE1lc3NhZ2UnLFxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50b1N0cmluZygpLFxuICAgICAgICAgICAgaW52YWxpZDogdGhpcy5faW52YWxpZFxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHZhciBpbnZhbGlkO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuX2ludmFsaWQpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgaW52YWxpZCA9IHRoaXMuX2ludmFsaWQ7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgSW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkIGZyb20gJHt0aGlzLl91cmx9OiBcIiR7aW52YWxpZH1cIiFgO1xuXG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBJbnZhbGlkTWVzc2FnZVxuIl19