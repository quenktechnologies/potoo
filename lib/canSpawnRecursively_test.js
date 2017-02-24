'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _potooLib = require('potoo-lib');

var _monad = require('potoo-lib/monad');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parent = function parent(child) {
    return function (ctx) {
        return ctx.spawn(new _potooLib.ActorT('child', child));
    };
};
var identity = function identity(ctx) {
    return ctx;
};
//const chatty = ctx => ctx.tell('nobody', 'blah,blah,blah');

var a1 = new _potooLib.ActorT(1, parent(parent(identity)));

var check = function check(s) {

    console.log(s);

    return _monad.IO.of(null);
};

new _potooLib.System().spawn(a1).tick().tock(function (s) {
    return s.tick().tock(check);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jYW5TcGF3blJlY3Vyc2l2ZWx5X3Rlc3QuanMiXSwibmFtZXMiOlsicGFyZW50IiwiY3R4Iiwic3Bhd24iLCJjaGlsZCIsImlkZW50aXR5IiwiYTEiLCJjaGVjayIsImNvbnNvbGUiLCJsb2ciLCJzIiwib2YiLCJ0aWNrIiwidG9jayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsU0FBUyxTQUFUQSxNQUFTO0FBQUEsV0FBUztBQUFBLGVBQU9DLElBQUlDLEtBQUosQ0FBVSxxQkFBVyxPQUFYLEVBQW9CQyxLQUFwQixDQUFWLENBQVA7QUFBQSxLQUFUO0FBQUEsQ0FBZjtBQUNBLElBQU1DLFdBQVcsU0FBWEEsUUFBVztBQUFBLFdBQU9ILEdBQVA7QUFBQSxDQUFqQjtBQUNBOztBQUVBLElBQUlJLEtBQUsscUJBQVcsQ0FBWCxFQUFjTCxPQUFPQSxPQUFPSSxRQUFQLENBQVAsQ0FBZCxDQUFUOztBQUVBLElBQUlFLFFBQVEsU0FBUkEsS0FBUSxJQUFLOztBQUViQyxZQUFRQyxHQUFSLENBQVlDLENBQVo7O0FBRUEsV0FBTyxVQUFHQyxFQUFILENBQU0sSUFBTixDQUFQO0FBRUgsQ0FORDs7QUFRQSx1QkFDS1IsS0FETCxDQUNXRyxFQURYLEVBRUtNLElBRkwsR0FHS0MsSUFITCxDQUdVO0FBQUEsV0FBS0gsRUFBRUUsSUFBRixHQUFTQyxJQUFULENBQWNOLEtBQWQsQ0FBTDtBQUFBLENBSFYiLCJmaWxlIjoiY2FuU3Bhd25SZWN1cnNpdmVseV90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG11c3QgZnJvbSAnbXVzdCc7XG5pbXBvcnQgeyBTeXN0ZW0sIEFjdG9yVCB9IGZyb20gJ3BvdG9vLWxpYic7XG5pbXBvcnQgeyBJTyB9IGZyb20gJ3BvdG9vLWxpYi9tb25hZCc7XG5cbmNvbnN0IHBhcmVudCA9IGNoaWxkID0+IGN0eCA9PiBjdHguc3Bhd24obmV3IEFjdG9yVCgnY2hpbGQnLCBjaGlsZCkpO1xuY29uc3QgaWRlbnRpdHkgPSBjdHggPT4gY3R4O1xuLy9jb25zdCBjaGF0dHkgPSBjdHggPT4gY3R4LnRlbGwoJ25vYm9keScsICdibGFoLGJsYWgsYmxhaCcpO1xuXG5sZXQgYTEgPSBuZXcgQWN0b3JUKDEsIHBhcmVudChwYXJlbnQoaWRlbnRpdHkpKSk7XG5cbmxldCBjaGVjayA9IHMgPT4ge1xuXG4gICAgY29uc29sZS5sb2cocyk7XG5cbiAgICByZXR1cm4gSU8ub2YobnVsbCk7XG5cbn07XG5cbm5ldyBTeXN0ZW0oKVxuICAgIC5zcGF3bihhMSlcbiAgICAudGljaygpXG4gICAgLnRvY2socyA9PiBzLnRpY2soKS50b2NrKGNoZWNrKSk7XG4iXX0=