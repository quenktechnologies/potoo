'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Reference = require('../Reference');

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Envelope is a wrapper around a message, it's sender and the destination Concern.
 * It is used by the dispatcher to do message delivery.
 * @param {*} message
 * @param {Reference} from
 *
 * @property {*} message
 * @property {Reference} from
 */
var Envelope = function Envelope(message, from) {
    _classCallCheck(this, Envelope);

    (0, _beof2.default)({ from: from }).interface(_Reference2.default);

    this.message = message;
    this.from = from;
};

exports.default = Envelope;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9FbnZlbG9wZS5qcyJdLCJuYW1lcyI6WyJFbnZlbG9wZSIsIm1lc3NhZ2UiLCJmcm9tIiwiaW50ZXJmYWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7SUFTTUEsUSxHQUVGLGtCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQjtBQUFBOztBQUV2Qix3QkFBSyxFQUFFQSxVQUFGLEVBQUwsRUFBZUMsU0FBZjs7QUFFQSxTQUFLRixPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFFSCxDOztrQkFJVUYsUSIsImZpbGUiOiJFbnZlbG9wZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuLi9SZWZlcmVuY2UnO1xuXG4vKipcbiAqIEVudmVsb3BlIGlzIGEgd3JhcHBlciBhcm91bmQgYSBtZXNzYWdlLCBpdCdzIHNlbmRlciBhbmQgdGhlIGRlc3RpbmF0aW9uIENvbmNlcm4uXG4gKiBJdCBpcyB1c2VkIGJ5IHRoZSBkaXNwYXRjaGVyIHRvIGRvIG1lc3NhZ2UgZGVsaXZlcnkuXG4gKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7UmVmZXJlbmNlfSBmcm9tXG4gKlxuICogQHByb3BlcnR5IHsqfSBtZXNzYWdlXG4gKiBAcHJvcGVydHkge1JlZmVyZW5jZX0gZnJvbVxuICovXG5jbGFzcyBFbnZlbG9wZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgYmVvZih7IGZyb20gfSkuaW50ZXJmYWNlKFJlZmVyZW5jZSk7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBFbnZlbG9wZVxuIl19