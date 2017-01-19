'use strict';

var _IsomorphicSystem = require('potoo-lib/IsomorphicSystem');

var _IsomorphicSystem2 = _interopRequireDefault(_IsomorphicSystem);

var _bytes = require('bytes');

var _bytes2 = _interopRequireDefault(_bytes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var system = new _IsomorphicSystem2.default();
var buffer = [];
var ref;
var collect = function collect(context) {
    return function (m) {
        buffer.push(m);
        if (m === 'die') return m;
        return context.receive(collect);
    };
};
var start = function start(context) {
    return context.receive(collect(context));
};
var run = function run(ref, i) {
    return setTimeout(function () {
        return ref.tell('data');
    }, i * 2), ref;
};
var pre = process.memoryUsage();
var humanize = function humanize(o) {

    var oo = {};

    Object.keys(o).forEach(function (k) {
        oo[k] = (0, _bytes2.default)(o[k]);
    });

    return oo;
};
var measure = function measure() {

    var neu = process.memoryUsage();
    var diff = neu.heapTotal - pre.heapTotal;
    if (diff !== 0) {
        console.info('Heap Change ' + (0, _bytes2.default)(diff));
    }
    pre = neu;
};

console.log('Start: ', humanize(process.memoryUsage()));
for (var i = 0; i < 1000; i++) {

    ref = run(system.spawn({ start: start }), i);
    measure();
    ref.tell('more data');
    ref.tell('die');
    measure();
}

console.log('Spawned: ', humanize(process.memoryUsage()));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvcGVyZi9tZW1vcnlfY29uc3VtcHRpb24uanMiXSwibmFtZXMiOlsic3lzdGVtIiwiYnVmZmVyIiwicmVmIiwiY29sbGVjdCIsInB1c2giLCJtIiwiY29udGV4dCIsInJlY2VpdmUiLCJzdGFydCIsInJ1biIsImkiLCJzZXRUaW1lb3V0IiwidGVsbCIsInByZSIsInByb2Nlc3MiLCJtZW1vcnlVc2FnZSIsImh1bWFuaXplIiwib28iLCJPYmplY3QiLCJrZXlzIiwibyIsImZvckVhY2giLCJrIiwibWVhc3VyZSIsIm5ldSIsImRpZmYiLCJoZWFwVG90YWwiLCJjb25zb2xlIiwiaW5mbyIsImxvZyIsInNwYXduIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7OztBQUNBLElBQUlBLFNBQVMsZ0NBQWI7QUFDQSxJQUFJQyxTQUFTLEVBQWI7QUFDQSxJQUFJQyxHQUFKO0FBQ0EsSUFBSUMsVUFBVSxTQUFWQSxPQUFVO0FBQUEsV0FBWSxhQUFLO0FBQzNCRixlQUFPRyxJQUFQLENBQVlDLENBQVo7QUFDQSxZQUFJQSxNQUFNLEtBQVYsRUFDSSxPQUFPQSxDQUFQO0FBQ0osZUFBT0MsUUFBUUMsT0FBUixDQUFnQkosT0FBaEIsQ0FBUDtBQUVILEtBTmE7QUFBQSxDQUFkO0FBT0EsSUFBSUssUUFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBV0YsUUFBUUMsT0FBUixDQUFnQkosUUFBUUcsT0FBUixDQUFoQixDQUFYO0FBQUEsQ0FBWjtBQUNBLElBQUlHLE1BQU0sU0FBTkEsR0FBTSxDQUFDUCxHQUFELEVBQU1RLENBQU47QUFBQSxXQUFhQyxXQUFXO0FBQUEsZUFBTVQsSUFBSVUsSUFBSixDQUFTLE1BQVQsQ0FBTjtBQUFBLEtBQVgsRUFBb0NGLElBQUksQ0FBeEMsR0FBNkNSLEdBQTFEO0FBQUEsQ0FBVjtBQUNBLElBQUlXLE1BQU1DLFFBQVFDLFdBQVIsRUFBVjtBQUNBLElBQUlDLFdBQVcsU0FBWEEsUUFBVyxJQUFLOztBQUVoQixRQUFJQyxLQUFLLEVBQVQ7O0FBRUFDLFdBQU9DLElBQVAsQ0FBWUMsQ0FBWixFQUFlQyxPQUFmLENBQXVCLGFBQUs7QUFDeEJKLFdBQUdLLENBQUgsSUFBUSxxQkFBTUYsRUFBRUUsQ0FBRixDQUFOLENBQVI7QUFDSCxLQUZEOztBQUlBLFdBQU9MLEVBQVA7QUFFSCxDQVZEO0FBV0EsSUFBSU0sVUFBVSxTQUFWQSxPQUFVLEdBQU07O0FBRWhCLFFBQUlDLE1BQU1WLFFBQVFDLFdBQVIsRUFBVjtBQUNBLFFBQUlVLE9BQU9ELElBQUlFLFNBQUosR0FBZ0JiLElBQUlhLFNBQS9CO0FBQ0EsUUFBSUQsU0FBUyxDQUFiLEVBQWdCO0FBQ1pFLGdCQUFRQyxJQUFSLGtCQUE0QixxQkFBTUgsSUFBTixDQUE1QjtBQUNIO0FBQ0RaLFVBQU1XLEdBQU47QUFFSCxDQVREOztBQVdBRyxRQUFRRSxHQUFSLENBQVksU0FBWixFQUF1QmIsU0FBU0YsUUFBUUMsV0FBUixFQUFULENBQXZCO0FBQ0EsS0FBSyxJQUFJTCxJQUFJLENBQWIsRUFBZ0JBLElBQUksSUFBcEIsRUFBMEJBLEdBQTFCLEVBQStCOztBQUUzQlIsVUFBTU8sSUFBSVQsT0FBTzhCLEtBQVAsQ0FBYSxFQUFFdEIsWUFBRixFQUFiLENBQUosRUFBNkJFLENBQTdCLENBQU47QUFDQWE7QUFDQXJCLFFBQUlVLElBQUosQ0FBUyxXQUFUO0FBQ0FWLFFBQUlVLElBQUosQ0FBUyxLQUFUO0FBQ0FXO0FBRUg7O0FBRURJLFFBQVFFLEdBQVIsQ0FBWSxXQUFaLEVBQXlCYixTQUFTRixRQUFRQyxXQUFSLEVBQVQsQ0FBekIiLCJmaWxlIjoibWVtb3J5X2NvbnN1bXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElzb21vcnBoaWNTeXN0ZW0gZnJvbSAncG90b28tbGliL0lzb21vcnBoaWNTeXN0ZW0nO1xuaW1wb3J0IGJ5dGVzIGZyb20gJ2J5dGVzJztcbnZhciBzeXN0ZW0gPSBuZXcgSXNvbW9ycGhpY1N5c3RlbSgpO1xudmFyIGJ1ZmZlciA9IFtdO1xudmFyIHJlZjtcbnZhciBjb2xsZWN0ID0gY29udGV4dCA9PiAobSA9PiB7XG4gICAgYnVmZmVyLnB1c2gobSk7XG4gICAgaWYgKG0gPT09ICdkaWUnKVxuICAgICAgICByZXR1cm4gbTtcbiAgICByZXR1cm4gY29udGV4dC5yZWNlaXZlKGNvbGxlY3QpO1xuXG59KTtcbnZhciBzdGFydCA9IGNvbnRleHQgPT4gY29udGV4dC5yZWNlaXZlKGNvbGxlY3QoY29udGV4dCkpO1xudmFyIHJ1biA9IChyZWYsIGkpID0+IChzZXRUaW1lb3V0KCgpID0+IHJlZi50ZWxsKCdkYXRhJyksIChpICogMikpLCByZWYpO1xudmFyIHByZSA9IHByb2Nlc3MubWVtb3J5VXNhZ2UoKTtcbnZhciBodW1hbml6ZSA9IG8gPT4ge1xuXG4gICAgdmFyIG9vID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhvKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBvb1trXSA9IGJ5dGVzKG9ba10pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9vO1xuXG59O1xudmFyIG1lYXN1cmUgPSAoKSA9PiB7XG5cbiAgICB2YXIgbmV1ID0gcHJvY2Vzcy5tZW1vcnlVc2FnZSgpO1xuICAgIHZhciBkaWZmID0gbmV1LmhlYXBUb3RhbCAtIHByZS5oZWFwVG90YWw7XG4gICAgaWYgKGRpZmYgIT09IDApIHtcbiAgICAgICAgY29uc29sZS5pbmZvKGBIZWFwIENoYW5nZSAke2J5dGVzKGRpZmYpfWApO1xuICAgIH1cbiAgICBwcmUgPSBuZXU7XG5cbn1cblxuY29uc29sZS5sb2coJ1N0YXJ0OiAnLCBodW1hbml6ZShwcm9jZXNzLm1lbW9yeVVzYWdlKCkpKTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG5cbiAgICByZWYgPSBydW4oc3lzdGVtLnNwYXduKHsgc3RhcnQgfSksIGkpO1xuICAgIG1lYXN1cmUoKTtcbiAgICByZWYudGVsbCgnbW9yZSBkYXRhJyk7XG4gICAgcmVmLnRlbGwoJ2RpZScpO1xuICAgIG1lYXN1cmUoKTtcblxufVxuXG5jb25zb2xlLmxvZygnU3Bhd25lZDogJywgaHVtYW5pemUocHJvY2Vzcy5tZW1vcnlVc2FnZSgpKSk7XG4iXX0=