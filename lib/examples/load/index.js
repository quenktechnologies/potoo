'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _potooLib = require('potoo-lib');

var _Actor = require('potoo-lib/Actor');

var _monad = require('potoo-lib/monad');

var _Match = require('potoo-lib/Match');

var _statsd = require('./statsd');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visit = function Visit(req, res) {
    _classCallCheck(this, Visit);

    this.req = req;
    this.res = res;
};

var makeServer = function makeServer(port, cb) {
    return function () {
        return _http2.default.createServer().listen(port, function (req, res) {
            return cb(new Visit(res, res));
        });
    };
};

var serve = function serve(m) {
    return (0, _Match.match)(m).caseOf(Visit, function (_ref) {
        var res = _ref.res;
        return (0, _potooLib.tell)('/statsd', new _statsd.Get('/')).chain(function () {
            return (0, _potooLib.receive)(wait(res));
        });
    }).end();
};

var wait = function wait(res) {
    return function (m) {
        return (0, _Match.match)(m).caseOf(_statsd.Stats, function () {
            return (0, _potooLib.output)(function () {
                return res.send(m);
            }).chain(function () {
                return (0, _potooLib.receive)(serve);
            });
        }).end();
    };
};

(0, _potooLib.system)().spawn(new _Actor.LocalT({

    id: '/',
    start: function start() {
        return (0, _potooLib.spawn)(new _Actor.ChildT({ id: 'statsd', start: __dirname + '/statsd.js' })).chain(function () {
            return (0, _potooLib.stream)(function (cb) {
                return _monad.IO.of(makeServer(9000, cb));
            });
        }).chain(function () {
            return (0, _potooLib.receive)(serve);
        });
    }

})).start().run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leGFtcGxlcy9sb2FkL2luZGV4LmpzIl0sIm5hbWVzIjpbIlZpc2l0IiwicmVxIiwicmVzIiwibWFrZVNlcnZlciIsInBvcnQiLCJjYiIsImNyZWF0ZVNlcnZlciIsImxpc3RlbiIsInNlcnZlIiwibSIsImNhc2VPZiIsImNoYWluIiwid2FpdCIsImVuZCIsInNlbmQiLCJzcGF3biIsImlkIiwic3RhcnQiLCJfX2Rpcm5hbWUiLCJvZiIsInJ1biJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7SUFFTUEsSyxHQUNGLGVBQVlDLEdBQVosRUFBaUJDLEdBQWpCLEVBQXNCO0FBQUE7O0FBQ2xCLFNBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNILEM7O0FBR0wsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLElBQUQsRUFBT0MsRUFBUDtBQUFBLFdBQWM7QUFBQSxlQUM3QixlQUFLQyxZQUFMLEdBQW9CQyxNQUFwQixDQUEyQkgsSUFBM0IsRUFBaUMsVUFBQ0gsR0FBRCxFQUFNQyxHQUFOO0FBQUEsbUJBQWNHLEdBQUcsSUFBSUwsS0FBSixDQUFVRSxHQUFWLEVBQWVBLEdBQWYsQ0FBSCxDQUFkO0FBQUEsU0FBakMsQ0FENkI7QUFBQSxLQUFkO0FBQUEsQ0FBbkI7O0FBR0EsSUFBTU0sUUFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBSyxrQkFBTUMsQ0FBTixFQUNkQyxNQURjLENBQ1BWLEtBRE8sRUFDQTtBQUFBLFlBQUdFLEdBQUgsUUFBR0EsR0FBSDtBQUFBLGVBQWEsb0JBQUssU0FBTCxFQUFnQixnQkFBUSxHQUFSLENBQWhCLEVBQThCUyxLQUE5QixDQUFvQztBQUFBLG1CQUFNLHVCQUFRQyxLQUFLVixHQUFMLENBQVIsQ0FBTjtBQUFBLFNBQXBDLENBQWI7QUFBQSxLQURBLEVBRWRXLEdBRmMsRUFBTDtBQUFBLENBQWQ7O0FBSUEsSUFBTUQsT0FBTyxTQUFQQSxJQUFPO0FBQUEsV0FBTztBQUFBLGVBQUssa0JBQU1ILENBQU4sRUFDcEJDLE1BRG9CLGdCQUNOO0FBQUEsbUJBQU0sc0JBQU87QUFBQSx1QkFBTVIsSUFBSVksSUFBSixDQUFTTCxDQUFULENBQU47QUFBQSxhQUFQLEVBQTBCRSxLQUExQixDQUFnQztBQUFBLHVCQUFNLHVCQUFRSCxLQUFSLENBQU47QUFBQSxhQUFoQyxDQUFOO0FBQUEsU0FETSxFQUVwQkssR0FGb0IsRUFBTDtBQUFBLEtBQVA7QUFBQSxDQUFiOztBQUlBLHdCQUNLRSxLQURMLENBQ1csa0JBQVc7O0FBRWRDLFFBQUksR0FGVTtBQUdkQyxXQUFPO0FBQUEsZUFDSCxxQkFBTSxrQkFBVyxFQUFFRCxJQUFJLFFBQU4sRUFBZ0JDLE9BQVVDLFNBQVYsZUFBaEIsRUFBWCxDQUFOLEVBQ0NQLEtBREQsQ0FDTztBQUFBLG1CQUFNLHNCQUFPO0FBQUEsdUJBQU0sVUFBR1EsRUFBSCxDQUFNaEIsV0FBVyxJQUFYLEVBQWlCRSxFQUFqQixDQUFOLENBQU47QUFBQSxhQUFQLENBQU47QUFBQSxTQURQLEVBRUNNLEtBRkQsQ0FFTztBQUFBLG1CQUFNLHVCQUFRSCxLQUFSLENBQU47QUFBQSxTQUZQLENBREc7QUFBQTs7QUFITyxDQUFYLENBRFgsRUFVS1MsS0FWTCxHQVVhRyxHQVZiIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgeyBzeXN0ZW0sIHNwYXduLCB0ZWxsLCBvdXRwdXQsIHJlY2VpdmUsIHN0cmVhbSB9IGZyb20gJ3BvdG9vLWxpYic7XG5pbXBvcnQgeyBMb2NhbFQsIENoaWxkVCB9IGZyb20gJ3BvdG9vLWxpYi9BY3Rvcic7XG5pbXBvcnQgeyBJTyB9IGZyb20gJ3BvdG9vLWxpYi9tb25hZCc7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJ3BvdG9vLWxpYi9NYXRjaCc7XG5pbXBvcnQgeyBHZXQsIFN0YXRzIH0gZnJvbSAnLi9zdGF0c2QnO1xuXG5jbGFzcyBWaXNpdCB7XG4gICAgY29uc3RydWN0b3IocmVxLCByZXMpIHtcbiAgICAgICAgdGhpcy5yZXEgPSByZXE7XG4gICAgICAgIHRoaXMucmVzID0gcmVzO1xuICAgIH1cbn1cblxuY29uc3QgbWFrZVNlcnZlciA9IChwb3J0LCBjYikgPT4gKCkgPT5cbiAgICBodHRwLmNyZWF0ZVNlcnZlcigpLmxpc3Rlbihwb3J0LCAocmVxLCByZXMpID0+IGNiKG5ldyBWaXNpdChyZXMsIHJlcykpKTtcblxuY29uc3Qgc2VydmUgPSBtID0+IG1hdGNoKG0pXG4gICAgLmNhc2VPZihWaXNpdCwgKHsgcmVzIH0pID0+IHRlbGwoJy9zdGF0c2QnLCBuZXcgR2V0KCcvJykpLmNoYWluKCgpID0+IHJlY2VpdmUod2FpdChyZXMpKSkpXG4gICAgLmVuZCgpO1xuXG5jb25zdCB3YWl0ID0gcmVzID0+IG0gPT4gbWF0Y2gobSlcbiAgICAuY2FzZU9mKFN0YXRzLCAoKSA9PiBvdXRwdXQoKCkgPT4gcmVzLnNlbmQobSkpLmNoYWluKCgpID0+IHJlY2VpdmUoc2VydmUpKSlcbiAgICAuZW5kKCk7XG5cbnN5c3RlbSgpXG4gICAgLnNwYXduKG5ldyBMb2NhbFQoe1xuXG4gICAgICAgIGlkOiAnLycsXG4gICAgICAgIHN0YXJ0OiAoKSA9PlxuICAgICAgICAgICAgc3Bhd24obmV3IENoaWxkVCh7IGlkOiAnc3RhdHNkJywgc3RhcnQ6IGAke19fZGlybmFtZX0vc3RhdHNkLmpzYCB9KSlcbiAgICAgICAgICAgIC5jaGFpbigoKSA9PiBzdHJlYW0oY2IgPT4gSU8ub2YobWFrZVNlcnZlcig5MDAwLCBjYikpKSlcbiAgICAgICAgICAgIC5jaGFpbigoKSA9PiByZWNlaXZlKHNlcnZlKSlcblxuICAgIH0pKVxuICAgIC5zdGFydCgpLnJ1bigpO1xuIl19