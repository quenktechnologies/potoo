'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _Actor = require('potoo-lib/Actor');

var _Ops = require('potoo-lib/Ops');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = new _Actor.LocalT({ id: '?' });
var a1 = new _Actor.LocalT({ id: 'a1' });
var a2 = new _Actor.LocalT({ id: 'a2' });
var a3 = new _Actor.LocalT({
    id: 'a3',
    start: function start() {
        return (0, _Ops.spawn)(new _Actor.LocalT({
            id: 'a3a',
            start: function start() {
                return (0, _Ops.receive)(function (m) {
                    return (0, _Ops.tell)('a4', 'You said : \'' + m + '\'');
                });
            }
        }));
    }
});

new _Actor.System().spawn(_).spawn(a1).spawn(a2).spawn(a3).tick().chain(function (sys) {

    (0, _must2.default)(sys.actors[0]).be.instanceOf(_Actor.ActorL);
    (0, _must2.default)(sys.actors[1]).be.instanceOf(_Actor.ActorL);
    (0, _must2.default)(sys.actors[2]).be.instanceOf(_Actor.ActorL);
    (0, _must2.default)(sys.actors[3]).be.instanceOf(_Actor.ActorL);
    return sys.tick();
}).chain(function (sys) {

    (0, _must2.default)(sys.actors[3].actors[0]).be.instanceOf(_Actor.ActorL);
    return sys.tick();
}).chain(function (sys) {
    return sys.spawn(new _Actor.LocalT({
        id: 'a4',
        start: function start() {
            return (0, _Ops.tell)('a3/a3a', 'hi');
        }
    })).tick();
}).chain(function (sys) {

    (0, _must2.default)(sys.actors[4]).be.instanceOf(_Actor.ActorL);
    return sys.tick();
}).chain(function (sys) {

    (0, _must2.default)(sys.actors[3].actors[0].mailbox[0]).be('hi');
    return sys.tick();
}).chain(function (sys) {
    return sys.tick();
}).chain(function (sys) {

    (0, _must2.default)(sys.actors[4].mailbox[0]).be('You said : \'hi\'');
    return sys.tick();
}).chain(function (s) {
    return s.tick();
}).chain(function (s) {
    return s.tick();
}).run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zYW1wbGUuanMiXSwibmFtZXMiOlsiXyIsImlkIiwiYTEiLCJhMiIsImEzIiwic3RhcnQiLCJtIiwic3Bhd24iLCJ0aWNrIiwiY2hhaW4iLCJzeXMiLCJhY3RvcnMiLCJiZSIsImluc3RhbmNlT2YiLCJtYWlsYm94IiwicyIsInJ1biJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBSUEsSUFBSSxrQkFBVyxFQUFFQyxJQUFJLEdBQU4sRUFBWCxDQUFSO0FBQ0EsSUFBSUMsS0FBSyxrQkFBVyxFQUFFRCxJQUFJLElBQU4sRUFBWCxDQUFUO0FBQ0EsSUFBSUUsS0FBSyxrQkFBVyxFQUFFRixJQUFJLElBQU4sRUFBWCxDQUFUO0FBQ0EsSUFBSUcsS0FBSyxrQkFBVztBQUNoQkgsUUFBSSxJQURZO0FBRWhCSSxXQUFPO0FBQUEsZUFBTSxnQkFBTSxrQkFBVztBQUMxQkosZ0JBQUksS0FEc0I7QUFFMUJJLG1CQUFPO0FBQUEsdUJBQU0sa0JBQVE7QUFBQSwyQkFBSyxlQUFLLElBQUwsb0JBQTBCQyxDQUExQixRQUFMO0FBQUEsaUJBQVIsQ0FBTjtBQUFBO0FBRm1CLFNBQVgsQ0FBTixDQUFOO0FBQUE7QUFGUyxDQUFYLENBQVQ7O0FBUUEsb0JBQ0tDLEtBREwsQ0FDV1AsQ0FEWCxFQUVLTyxLQUZMLENBRVdMLEVBRlgsRUFHS0ssS0FITCxDQUdXSixFQUhYLEVBSUtJLEtBSkwsQ0FJV0gsRUFKWCxFQUtLSSxJQUxMLEdBTUtDLEtBTkwsQ0FNVyxlQUFPOztBQUVWLHdCQUFLQyxJQUFJQyxNQUFKLENBQVcsQ0FBWCxDQUFMLEVBQW9CQyxFQUFwQixDQUF1QkMsVUFBdkI7QUFDQSx3QkFBS0gsSUFBSUMsTUFBSixDQUFXLENBQVgsQ0FBTCxFQUFvQkMsRUFBcEIsQ0FBdUJDLFVBQXZCO0FBQ0Esd0JBQUtILElBQUlDLE1BQUosQ0FBVyxDQUFYLENBQUwsRUFBb0JDLEVBQXBCLENBQXVCQyxVQUF2QjtBQUNBLHdCQUFLSCxJQUFJQyxNQUFKLENBQVcsQ0FBWCxDQUFMLEVBQW9CQyxFQUFwQixDQUF1QkMsVUFBdkI7QUFDQSxXQUFPSCxJQUFJRixJQUFKLEVBQVA7QUFFSCxDQWRMLEVBZUtDLEtBZkwsQ0FlVyxlQUFPOztBQUVWLHdCQUFLQyxJQUFJQyxNQUFKLENBQVcsQ0FBWCxFQUFjQSxNQUFkLENBQXFCLENBQXJCLENBQUwsRUFBOEJDLEVBQTlCLENBQWlDQyxVQUFqQztBQUNBLFdBQU9ILElBQUlGLElBQUosRUFBUDtBQUVILENBcEJMLEVBcUJLQyxLQXJCTCxDQXFCVztBQUFBLFdBQU9DLElBQUlILEtBQUosQ0FBVSxrQkFBVztBQUMvQk4sWUFBSSxJQUQyQjtBQUUvQkksZUFBTztBQUFBLG1CQUFNLGVBQUssUUFBTCxFQUFlLElBQWYsQ0FBTjtBQUFBO0FBRndCLEtBQVgsQ0FBVixFQUdWRyxJQUhVLEVBQVA7QUFBQSxDQXJCWCxFQXlCS0MsS0F6QkwsQ0F5QlcsZUFBTzs7QUFFVix3QkFBS0MsSUFBSUMsTUFBSixDQUFXLENBQVgsQ0FBTCxFQUFvQkMsRUFBcEIsQ0FBdUJDLFVBQXZCO0FBQ0EsV0FBT0gsSUFBSUYsSUFBSixFQUFQO0FBRUgsQ0E5QkwsRUErQktDLEtBL0JMLENBK0JXLGVBQU87O0FBRVYsd0JBQUtDLElBQUlDLE1BQUosQ0FBVyxDQUFYLEVBQWNBLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0JHLE9BQXhCLENBQWdDLENBQWhDLENBQUwsRUFBeUNGLEVBQXpDLENBQTRDLElBQTVDO0FBQ0EsV0FBT0YsSUFBSUYsSUFBSixFQUFQO0FBRUgsQ0FwQ0wsRUFxQ0tDLEtBckNMLENBcUNXO0FBQUEsV0FBT0MsSUFBSUYsSUFBSixFQUFQO0FBQUEsQ0FyQ1gsRUFzQ0tDLEtBdENMLENBc0NXLGVBQU87O0FBRVYsd0JBQUtDLElBQUlDLE1BQUosQ0FBVyxDQUFYLEVBQWNHLE9BQWQsQ0FBc0IsQ0FBdEIsQ0FBTCxFQUErQkYsRUFBL0IsQ0FBa0MsbUJBQWxDO0FBQ0EsV0FBT0YsSUFBSUYsSUFBSixFQUFQO0FBRUgsQ0EzQ0wsRUE0Q0tDLEtBNUNMLENBNENXO0FBQUEsV0FBS00sRUFBRVAsSUFBRixFQUFMO0FBQUEsQ0E1Q1gsRUE2Q0tDLEtBN0NMLENBNkNXO0FBQUEsV0FBS00sRUFBRVAsSUFBRixFQUFMO0FBQUEsQ0E3Q1gsRUE4Q0tRLEdBOUNMIiwiZmlsZSI6InNhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtdXN0IGZyb20gJ211c3QnO1xuaW1wb3J0IHsgTG9jYWxULCBBY3RvckwsIFN5c3RlbSB9IGZyb20gJ3BvdG9vLWxpYi9BY3Rvcic7XG5pbXBvcnQgeyBzcGF3biwgdGVsbCwgcmVjZWl2ZSB9IGZyb20gJ3BvdG9vLWxpYi9PcHMnO1xuXG5sZXQgXyA9IG5ldyBMb2NhbFQoeyBpZDogJz8nIH0pO1xubGV0IGExID0gbmV3IExvY2FsVCh7IGlkOiAnYTEnIH0pO1xubGV0IGEyID0gbmV3IExvY2FsVCh7IGlkOiAnYTInIH0pO1xubGV0IGEzID0gbmV3IExvY2FsVCh7XG4gICAgaWQ6ICdhMycsXG4gICAgc3RhcnQ6ICgpID0+IHNwYXduKG5ldyBMb2NhbFQoe1xuICAgICAgICBpZDogJ2EzYScsXG4gICAgICAgIHN0YXJ0OiAoKSA9PiByZWNlaXZlKG0gPT4gdGVsbCgnYTQnLCBgWW91IHNhaWQgOiAnJHttfSdgKSlcbiAgICB9KSlcbn0pO1xuXG5uZXcgU3lzdGVtKClcbiAgICAuc3Bhd24oXylcbiAgICAuc3Bhd24oYTEpXG4gICAgLnNwYXduKGEyKVxuICAgIC5zcGF3bihhMylcbiAgICAudGljaygpXG4gICAgLmNoYWluKHN5cyA9PiB7XG5cbiAgICAgICAgbXVzdChzeXMuYWN0b3JzWzBdKS5iZS5pbnN0YW5jZU9mKEFjdG9yTCk7XG4gICAgICAgIG11c3Qoc3lzLmFjdG9yc1sxXSkuYmUuaW5zdGFuY2VPZihBY3RvckwpO1xuICAgICAgICBtdXN0KHN5cy5hY3RvcnNbMl0pLmJlLmluc3RhbmNlT2YoQWN0b3JMKTtcbiAgICAgICAgbXVzdChzeXMuYWN0b3JzWzNdKS5iZS5pbnN0YW5jZU9mKEFjdG9yTCk7XG4gICAgICAgIHJldHVybiBzeXMudGljaygpO1xuXG4gICAgfSlcbiAgICAuY2hhaW4oc3lzID0+IHtcblxuICAgICAgICBtdXN0KHN5cy5hY3RvcnNbM10uYWN0b3JzWzBdKS5iZS5pbnN0YW5jZU9mKEFjdG9yTCk7XG4gICAgICAgIHJldHVybiBzeXMudGljaygpO1xuXG4gICAgfSlcbiAgICAuY2hhaW4oc3lzID0+IHN5cy5zcGF3bihuZXcgTG9jYWxUKHtcbiAgICAgICAgaWQ6ICdhNCcsXG4gICAgICAgIHN0YXJ0OiAoKSA9PiB0ZWxsKCdhMy9hM2EnLCAnaGknKVxuICAgIH0pKS50aWNrKCkpXG4gICAgLmNoYWluKHN5cyA9PiB7XG5cbiAgICAgICAgbXVzdChzeXMuYWN0b3JzWzRdKS5iZS5pbnN0YW5jZU9mKEFjdG9yTCk7XG4gICAgICAgIHJldHVybiBzeXMudGljaygpO1xuXG4gICAgfSlcbiAgICAuY2hhaW4oc3lzID0+IHtcblxuICAgICAgICBtdXN0KHN5cy5hY3RvcnNbM10uYWN0b3JzWzBdLm1haWxib3hbMF0pLmJlKCdoaScpO1xuICAgICAgICByZXR1cm4gc3lzLnRpY2soKTtcblxuICAgIH0pXG4gICAgLmNoYWluKHN5cyA9PiBzeXMudGljaygpKVxuICAgIC5jaGFpbihzeXMgPT4ge1xuXG4gICAgICAgIG11c3Qoc3lzLmFjdG9yc1s0XS5tYWlsYm94WzBdKS5iZSgnWW91IHNhaWQgOiBcXCdoaVxcJycpO1xuICAgICAgICByZXR1cm4gc3lzLnRpY2soKTtcblxuICAgIH0pXG4gICAgLmNoYWluKHMgPT4gcy50aWNrKCkpXG4gICAgLmNoYWluKHMgPT4gcy50aWNrKCkpXG4gICAgLnJ1bigpO1xuIl19