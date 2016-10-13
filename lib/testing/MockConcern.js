"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockConcern
 */
var MockConcern = function () {
    function MockConcern() {
        _classCallCheck(this, MockConcern);

        this.calls = {
            onStart: 0,
            onRestart: 0,
            onStop: 0,
            onPause: 0,
            onResume: 0
        };
    }

    _createClass(MockConcern, [{
        key: "onStart",
        value: function onStart() {
            this.calls.onStart++;
        }
    }, {
        key: "onPause",
        value: function onPause() {
            this.calls.onPause++;
        }
    }, {
        key: "onResume",
        value: function onResume() {
            this.calls.onResume++;
        }
    }, {
        key: "onRestart",
        value: function onRestart() {
            this.calls.onRestart++;
        }
    }, {
        key: "onStop",
        value: function onStop() {
            this.calls.onStop++;
        }
    }]);

    return MockConcern;
}();

exports.default = MockConcern;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tDb25jZXJuLmpzIl0sIm5hbWVzIjpbIk1vY2tDb25jZXJuIiwiY2FsbHMiLCJvblN0YXJ0Iiwib25SZXN0YXJ0Iiwib25TdG9wIiwib25QYXVzZSIsIm9uUmVzdW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7OztJQUdNQSxXO0FBRUYsMkJBQWM7QUFBQTs7QUFFVixhQUFLQyxLQUFMLEdBQWE7QUFDVEMscUJBQVMsQ0FEQTtBQUVUQyx1QkFBVyxDQUZGO0FBR1RDLG9CQUFRLENBSEM7QUFJVEMscUJBQVMsQ0FKQTtBQUtUQyxzQkFBVTtBQUxELFNBQWI7QUFRSDs7OztrQ0FFUztBQUFDLGlCQUFLTCxLQUFMLENBQVdDLE9BQVg7QUFBdUI7OztrQ0FFeEI7QUFBRSxpQkFBS0QsS0FBTCxDQUFXSSxPQUFYO0FBQXNCOzs7bUNBRXZCO0FBQUUsaUJBQUtKLEtBQUwsQ0FBV0ssUUFBWDtBQUF1Qjs7O29DQUV4QjtBQUFFLGlCQUFLTCxLQUFMLENBQVdFLFNBQVg7QUFBd0I7OztpQ0FFN0I7QUFBRSxpQkFBS0YsS0FBTCxDQUFXRyxNQUFYO0FBQXFCOzs7Ozs7a0JBSXJCSixXIiwiZmlsZSI6Ik1vY2tDb25jZXJuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2NrQ29uY2VyblxuICovXG5jbGFzcyBNb2NrQ29uY2VybiB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNhbGxzID0ge1xuICAgICAgICAgICAgb25TdGFydDogMCxcbiAgICAgICAgICAgIG9uUmVzdGFydDogMCxcbiAgICAgICAgICAgIG9uU3RvcDogMCxcbiAgICAgICAgICAgIG9uUGF1c2U6IDAsXG4gICAgICAgICAgICBvblJlc3VtZTogMFxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgb25TdGFydCgpIHt0aGlzLmNhbGxzLm9uU3RhcnQrKzsgfVxuXG4gICAgb25QYXVzZSgpIHsgdGhpcy5jYWxscy5vblBhdXNlKys7fVxuXG4gICAgb25SZXN1bWUoKSB7IHRoaXMuY2FsbHMub25SZXN1bWUrKzt9XG5cbiAgICBvblJlc3RhcnQoKSB7IHRoaXMuY2FsbHMub25SZXN0YXJ0Kys7fVxuXG4gICAgb25TdG9wKCkgeyB0aGlzLmNhbGxzLm9uU3RvcCsrO31cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2NrQ29uY2VyblxuIl19