"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockMailbox
 */
var MockMailbox = function () {
    function MockMailbox() {
        _classCallCheck(this, MockMailbox);

        this.queue = [];
    }

    _createClass(MockMailbox, [{
        key: "enqueue",
        value: function enqueue(message) {

            this.queue.push(message);
        }
    }, {
        key: "dequeue",
        value: function dequeue() {

            return this.queue.unshift();
        }
    }]);

    return MockMailbox;
}();

exports.default = MockMailbox;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tNYWlsYm94LmpzIl0sIm5hbWVzIjpbIk1vY2tNYWlsYm94IiwicXVldWUiLCJtZXNzYWdlIiwicHVzaCIsInVuc2hpZnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7O0lBR01BLFc7QUFFRiwyQkFBYztBQUFBOztBQUVWLGFBQUtDLEtBQUwsR0FBYSxFQUFiO0FBRUg7Ozs7Z0NBRU9DLE8sRUFBUzs7QUFFYixpQkFBS0QsS0FBTCxDQUFXRSxJQUFYLENBQWlCRCxPQUFqQjtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sS0FBS0QsS0FBTCxDQUFXRyxPQUFYLEVBQVA7QUFFSDs7Ozs7O2tCQUdVSixXIiwiZmlsZSI6Ik1vY2tNYWlsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2NrTWFpbGJveFxuICovXG5jbGFzcyBNb2NrTWFpbGJveCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLnF1ZXVlID0gW107XG5cbiAgICB9XG5cbiAgICBlbnF1ZXVlKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goIG1lc3NhZ2UpO1xuXG4gICAgfVxuXG4gICAgZGVxdWV1ZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS51bnNoaWZ0KCk7XG5cbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0IE1vY2tNYWlsYm94XG4iXX0=