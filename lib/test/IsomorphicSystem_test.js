'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _IsomorphicSystem = require('potoo-lib/IsomorphicSystem');

var _IsomorphicSystem2 = _interopRequireDefault(_IsomorphicSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var system;

describe('The IsomorphicSystem', function () {

    beforeEach(function () {

        system = new _IsomorphicSystem2.default();
    });

    it('should allow for a basic 3 node setup', function (done) {

        var buffer = [];

        var start = function start() {
            this.receive(function (m) {
                return console.log(m);
            });
            this.receive(function (m) {
                buffer.push(m);
            });
        };

        system.spawn({ start: start }, 'one');
        system.spawn({ start: start }, 'two');
        system.spawn({ start: start }, 'three');

        system.select('/one').tell('well');
        system.select('/two').tell('hello');
        system.select('/three').tell('pretty lady');

        setTimeout(function () {
            (0, _must2.default)(buffer.join(' ')).be('well hello pretty lady');
            done();
        }, 1000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvSXNvbW9ycGhpY1N5c3RlbV90ZXN0LmpzIl0sIm5hbWVzIjpbInN5c3RlbSIsImRlc2NyaWJlIiwiYmVmb3JlRWFjaCIsIml0IiwiZG9uZSIsImJ1ZmZlciIsInN0YXJ0IiwicmVjZWl2ZSIsImNvbnNvbGUiLCJsb2ciLCJtIiwicHVzaCIsInNwYXduIiwic2VsZWN0IiwidGVsbCIsInNldFRpbWVvdXQiLCJqb2luIiwiYmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSUEsTUFBSjs7QUFFQUMsU0FBUyxzQkFBVCxFQUFpQyxZQUFXOztBQUV4Q0MsZUFBVyxZQUFXOztBQUVsQkYsaUJBQVMsZ0NBQVQ7QUFFSCxLQUpEOztBQU1BRyxPQUFHLHVDQUFILEVBQTRDLFVBQVNDLElBQVQsRUFBZTs7QUFFdkQsWUFBSUMsU0FBUyxFQUFiOztBQUVBLFlBQUlDLFFBQVEsU0FBUkEsS0FBUSxHQUFXO0FBQ25CLGlCQUFLQyxPQUFMLENBQWE7QUFBQSx1QkFBS0MsUUFBUUMsR0FBUixDQUFZQyxDQUFaLENBQUw7QUFBQSxhQUFiO0FBQ0EsaUJBQUtILE9BQUwsQ0FBYSxhQUFLO0FBQ2RGLHVCQUFPTSxJQUFQLENBQVlELENBQVo7QUFDSCxhQUZEO0FBR0gsU0FMRDs7QUFPQVYsZUFBT1ksS0FBUCxDQUFhLEVBQUVOLFlBQUYsRUFBYixFQUF3QixLQUF4QjtBQUNBTixlQUFPWSxLQUFQLENBQWEsRUFBRU4sWUFBRixFQUFiLEVBQXdCLEtBQXhCO0FBQ0FOLGVBQU9ZLEtBQVAsQ0FBYSxFQUFFTixZQUFGLEVBQWIsRUFBd0IsT0FBeEI7O0FBRUFOLGVBQU9hLE1BQVAsQ0FBYyxNQUFkLEVBQXNCQyxJQUF0QixDQUEyQixNQUEzQjtBQUNBZCxlQUFPYSxNQUFQLENBQWMsTUFBZCxFQUFzQkMsSUFBdEIsQ0FBMkIsT0FBM0I7QUFDQWQsZUFBT2EsTUFBUCxDQUFjLFFBQWQsRUFBd0JDLElBQXhCLENBQTZCLGFBQTdCOztBQUVBQyxtQkFBVyxZQUFNO0FBQ2IsZ0NBQUtWLE9BQU9XLElBQVAsQ0FBWSxHQUFaLENBQUwsRUFBdUJDLEVBQXZCLENBQTBCLHdCQUExQjtBQUNBYjtBQUNILFNBSEQsRUFHRyxJQUhIO0FBSUgsS0F2QkQ7QUF5QkgsQ0FqQ0QiLCJmaWxlIjoiSXNvbW9ycGhpY1N5c3RlbV90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG11c3QgZnJvbSAnbXVzdCc7XG5pbXBvcnQgSXNvbW9ycGhpY1N5c3RlbSBmcm9tICdwb3Rvby1saWIvSXNvbW9ycGhpY1N5c3RlbSc7XG5cbnZhciBzeXN0ZW07XG5cbmRlc2NyaWJlKCdUaGUgSXNvbW9ycGhpY1N5c3RlbScsIGZ1bmN0aW9uKCkge1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICBzeXN0ZW0gPSBuZXcgSXNvbW9ycGhpY1N5c3RlbSgpO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGZvciBhIGJhc2ljIDMgbm9kZSBzZXR1cCcsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICB2YXIgYnVmZmVyID0gW107XG5cbiAgICAgICAgdmFyIHN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUobSA9PiBjb25zb2xlLmxvZyhtKSk7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUobSA9PiB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2gobSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHN5c3RlbS5zcGF3bih7IHN0YXJ0IH0sICdvbmUnKTtcbiAgICAgICAgc3lzdGVtLnNwYXduKHsgc3RhcnQgfSwgJ3R3bycpO1xuICAgICAgICBzeXN0ZW0uc3Bhd24oeyBzdGFydCB9LCAndGhyZWUnKTtcblxuICAgICAgICBzeXN0ZW0uc2VsZWN0KCcvb25lJykudGVsbCgnd2VsbCcpO1xuICAgICAgICBzeXN0ZW0uc2VsZWN0KCcvdHdvJykudGVsbCgnaGVsbG8nKTtcbiAgICAgICAgc3lzdGVtLnNlbGVjdCgnL3RocmVlJykudGVsbCgncHJldHR5IGxhZHknKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIG11c3QoYnVmZmVyLmpvaW4oJyAnKSkuYmUoJ3dlbGwgaGVsbG8gcHJldHR5IGxhZHknKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG5cbn0pO1xuIl19