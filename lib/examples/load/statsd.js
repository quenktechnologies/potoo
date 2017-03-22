'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Stats = exports.Get = undefined;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _monad = require('potoo-lib/monad');

var _potooLib = require('potoo-lib');

var _util = require('potoo-lib/util');

var _Match = require('potoo-lib/Match');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Get = exports.Get = function Get(client) {
    _classCallCheck(this, Get);

    this.client = client;
};

var Stats = exports.Stats = function Stats(data) {
    _classCallCheck(this, Stats);

    this.data = data;
};

var hostname = function hostname(o) {
    return _monad.IO.of(_os2.default.hostname).map(assign('hostname', o));
};
var freemem = function freemem(o) {
    return _monad.IO.of(_os2.default.freemem).map(assign('freemem', o));
};
var loadavg = function loadavg(o) {
    return _monad.IO.of(_os2.default.loadvg).map(assign('load', o));
};
var uptime = function uptime(o) {
    return _monad.IO.of(_os2.default.uptime).map(assign('uptime', o));
};
var assign = function assign(k, m) {
    return function (v) {
        return Object.assign({}, m, _defineProperty({}, k, v));
    };
};

var refresh = (0, _potooLib.input)(function () {
    return hostname({}).chain(freemem).chain(loadavg).chain(uptime);
});

var behaviour = function behaviour(s) {
    return function (m) {
        return (0, _Match.match)(m).caseOf('refresh', function () {
            return refresh().chain((0, _util.compose)(_potooLib.receive, behaviour));
        }).caseOf(Get, function (_ref) {
            var client = _ref.client;
            return (0, _potooLib.tell)(client, new Stats(s)).chain(function () {
                return (0, _potooLib.receive)(behaviour(s));
            });
        }).end();
    };
};

exports.default = function () {
    return refresh().chain((0, _util.compose)(_potooLib.receive, behaviour)).chain(function () {
        return (0, _potooLib.stream)(function (f) {
            return setInterval(function () {
                return f('refresh');
            }, 200);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leGFtcGxlcy9sb2FkL3N0YXRzZC5qcyJdLCJuYW1lcyI6WyJHZXQiLCJjbGllbnQiLCJTdGF0cyIsImRhdGEiLCJob3N0bmFtZSIsIm9mIiwibWFwIiwiYXNzaWduIiwibyIsImZyZWVtZW0iLCJsb2FkYXZnIiwibG9hZHZnIiwidXB0aW1lIiwiayIsIm0iLCJPYmplY3QiLCJ2IiwicmVmcmVzaCIsImNoYWluIiwiYmVoYXZpb3VyIiwiY2FzZU9mIiwicyIsImVuZCIsInNldEludGVydmFsIiwiZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0lBRWFBLEcsV0FBQUEsRyxHQUFNLGFBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFBRSxTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFBdUIsQzs7SUFDbkRDLEssV0FBQUEsSyxHQUFRLGVBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFBRSxTQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFBbUIsQzs7QUFFNUQsSUFBTUMsV0FBVyxTQUFYQSxRQUFXO0FBQUEsV0FBSyxVQUFHQyxFQUFILENBQU0sYUFBR0QsUUFBVCxFQUFtQkUsR0FBbkIsQ0FBdUJDLE9BQU8sVUFBUCxFQUFtQkMsQ0FBbkIsQ0FBdkIsQ0FBTDtBQUFBLENBQWpCO0FBQ0EsSUFBTUMsVUFBVSxTQUFWQSxPQUFVO0FBQUEsV0FBSyxVQUFHSixFQUFILENBQU0sYUFBR0ksT0FBVCxFQUFrQkgsR0FBbEIsQ0FBc0JDLE9BQU8sU0FBUCxFQUFrQkMsQ0FBbEIsQ0FBdEIsQ0FBTDtBQUFBLENBQWhCO0FBQ0EsSUFBTUUsVUFBVSxTQUFWQSxPQUFVO0FBQUEsV0FBSyxVQUFHTCxFQUFILENBQU0sYUFBR00sTUFBVCxFQUFpQkwsR0FBakIsQ0FBcUJDLE9BQU8sTUFBUCxFQUFlQyxDQUFmLENBQXJCLENBQUw7QUFBQSxDQUFoQjtBQUNBLElBQU1JLFNBQVMsU0FBVEEsTUFBUztBQUFBLFdBQUssVUFBR1AsRUFBSCxDQUFNLGFBQUdPLE1BQVQsRUFBaUJOLEdBQWpCLENBQXFCQyxPQUFPLFFBQVAsRUFBaUJDLENBQWpCLENBQXJCLENBQUw7QUFBQSxDQUFmO0FBQ0EsSUFBTUQsU0FBUyxTQUFUQSxNQUFTLENBQUNNLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVU7QUFBQSxlQUFLQyxPQUFPUixNQUFQLENBQWMsRUFBZCxFQUFrQk8sQ0FBbEIsc0JBQ3pCRCxDQUR5QixFQUNyQkcsQ0FEcUIsRUFBTDtBQUFBLEtBQVY7QUFBQSxDQUFmOztBQUlBLElBQU1DLFVBQVUscUJBQU07QUFBQSxXQUNsQmIsU0FBUyxFQUFULEVBQ0NjLEtBREQsQ0FDT1QsT0FEUCxFQUVDUyxLQUZELENBRU9SLE9BRlAsRUFHQ1EsS0FIRCxDQUdPTixNQUhQLENBRGtCO0FBQUEsQ0FBTixDQUFoQjs7QUFNQSxJQUFNTyxZQUFZLFNBQVpBLFNBQVk7QUFBQSxXQUFLO0FBQUEsZUFBSyxrQkFBTUwsQ0FBTixFQUN2Qk0sTUFEdUIsQ0FDaEIsU0FEZ0IsRUFDTDtBQUFBLG1CQUFNSCxVQUFVQyxLQUFWLENBQWdCLHNDQUFpQkMsU0FBakIsQ0FBaEIsQ0FBTjtBQUFBLFNBREssRUFFdkJDLE1BRnVCLENBRWhCcEIsR0FGZ0IsRUFFWDtBQUFBLGdCQUFHQyxNQUFILFFBQUdBLE1BQUg7QUFBQSxtQkFBZ0Isb0JBQUtBLE1BQUwsRUFBYSxJQUFJQyxLQUFKLENBQVVtQixDQUFWLENBQWIsRUFBMkJILEtBQTNCLENBQWlDO0FBQUEsdUJBQU0sdUJBQVFDLFVBQVVFLENBQVYsQ0FBUixDQUFOO0FBQUEsYUFBakMsQ0FBaEI7QUFBQSxTQUZXLEVBR3ZCQyxHQUh1QixFQUFMO0FBQUEsS0FBTDtBQUFBLENBQWxCOztrQkFLZTtBQUFBLFdBQU1MLFVBQ2hCQyxLQURnQixDQUNWLHNDQUFpQkMsU0FBakIsQ0FEVSxFQUVoQkQsS0FGZ0IsQ0FFVjtBQUFBLGVBQU0sc0JBQU87QUFBQSxtQkFBS0ssWUFBWTtBQUFBLHVCQUFNQyxFQUFFLFNBQUYsQ0FBTjtBQUFBLGFBQVosRUFBZ0MsR0FBaEMsQ0FBTDtBQUFBLFNBQVAsQ0FBTjtBQUFBLEtBRlUsQ0FBTjtBQUFBLEMiLCJmaWxlIjoic3RhdHNkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB7IElPIH0gZnJvbSAncG90b28tbGliL21vbmFkJztcbmltcG9ydCB7IGlucHV0LCByZWNlaXZlLCB0ZWxsLCBzdHJlYW0gfSBmcm9tICdwb3Rvby1saWInO1xuaW1wb3J0IHsgY29tcG9zZSB9IGZyb20gJ3BvdG9vLWxpYi91dGlsJztcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSAncG90b28tbGliL01hdGNoJztcblxuZXhwb3J0IGNsYXNzIEdldCB7IGNvbnN0cnVjdG9yKGNsaWVudCkgeyB0aGlzLmNsaWVudCA9IGNsaWVudDsgfSB9XG5leHBvcnQgY2xhc3MgU3RhdHMgeyBjb25zdHJ1Y3RvcihkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGE7IH0gfVxuXG5jb25zdCBob3N0bmFtZSA9IG8gPT4gSU8ub2Yob3MuaG9zdG5hbWUpLm1hcChhc3NpZ24oJ2hvc3RuYW1lJywgbykpO1xuY29uc3QgZnJlZW1lbSA9IG8gPT4gSU8ub2Yob3MuZnJlZW1lbSkubWFwKGFzc2lnbignZnJlZW1lbScsIG8pKTtcbmNvbnN0IGxvYWRhdmcgPSBvID0+IElPLm9mKG9zLmxvYWR2ZykubWFwKGFzc2lnbignbG9hZCcsIG8pKTtcbmNvbnN0IHVwdGltZSA9IG8gPT4gSU8ub2Yob3MudXB0aW1lKS5tYXAoYXNzaWduKCd1cHRpbWUnLCBvKSk7XG5jb25zdCBhc3NpZ24gPSAoaywgbSkgPT4gdiA9PiBPYmplY3QuYXNzaWduKHt9LCBtLCB7XG4gICAgW2tdOiB2XG59KTtcblxuY29uc3QgcmVmcmVzaCA9IGlucHV0KCgpID0+XG4gICAgaG9zdG5hbWUoe30pXG4gICAgLmNoYWluKGZyZWVtZW0pXG4gICAgLmNoYWluKGxvYWRhdmcpXG4gICAgLmNoYWluKHVwdGltZSkpO1xuXG5jb25zdCBiZWhhdmlvdXIgPSBzID0+IG0gPT4gbWF0Y2gobSlcbiAgICAuY2FzZU9mKCdyZWZyZXNoJywgKCkgPT4gcmVmcmVzaCgpLmNoYWluKGNvbXBvc2UocmVjZWl2ZSwgYmVoYXZpb3VyKSkpXG4gICAgLmNhc2VPZihHZXQsICh7IGNsaWVudCB9KSA9PiB0ZWxsKGNsaWVudCwgbmV3IFN0YXRzKHMpKS5jaGFpbigoKSA9PiByZWNlaXZlKGJlaGF2aW91cihzKSkpKVxuICAgIC5lbmQoKTtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gcmVmcmVzaCgpXG4gICAgLmNoYWluKGNvbXBvc2UocmVjZWl2ZSwgYmVoYXZpb3VyKSlcbiAgICAuY2hhaW4oKCkgPT4gc3RyZWFtKGYgPT4gc2V0SW50ZXJ2YWwoKCkgPT4gZigncmVmcmVzaCcpLCAyMDApKSk7XG4iXX0=