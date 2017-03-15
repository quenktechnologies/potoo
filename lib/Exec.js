'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exec = undefined;

var _Ops = require('./Ops');

var Ops = _interopRequireWildcard(_Ops);

var _Match = require('./Match');

var _util = require('./util');

var _monad = require('./monad');

var _Actor = require('./Actor');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _execSelect = function _execSelect(a, ios) {
    return function (_ref) {
        var path = _ref.path,
            next = _ref.next;
        return ios.chain(function (s) {
            return exec(a, _monad.IO.of(s), next(_monad.Maybe.not((0, _Actor.select)(path, s)).orJust((0, _Actor.get)('?', s)).extract()));
        });
    };
};

var _execInput = function _execInput(a, ios) {
    return function (_ref2) {
        var next = _ref2.next,
            iof = _ref2.iof;
        return ios.chain(function (s) {
            return iof().map(function (r) {
                return next(r);
            }).chain(function (fr) {
                return exec(a, _monad.IO.of(s), fr);
            });
        });
    };
};

/**
 * exec translates an Op into IO
 * @summary exec :: (Actor,IO<System>,Free<F,V>) →  IO<System>
 */
var exec = exports.exec = function exec(a, ios) {
    var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return !f ? ios : f.resume().cata(function (op) {
        return (/*console.log('Actor : ', a.path, 'Op: ', op, '\n') || */(0, _Match.match)(op).caseOf(Ops.System, function (_ref3) {
                var next = _ref3.next;
                return ios.chain(function (s) {
                    return exec(a, ios(s), next(s));
                });
            }).caseOf(Ops.Self, function (_ref4) {
                var next = _ref4.next;
                return exec(a, ios, next(a));
            }).caseOf(Ops.Get, function (_ref5) {
                var id = _ref5.id,
                    next = _ref5.next;
                return exec(a, ios, next((0, _Actor.get)(id, a)));
            }).caseOf(Ops.Put, function (_ref6) {
                var actor = _ref6.actor,
                    next = _ref6.next;
                return exec(a, ios, next((0, _Actor.put)(actor, a)));
            }).caseOf(Ops.Update, function (_ref7) {
                var actor = _ref7.actor,
                    next = _ref7.next;
                return exec(actor, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
            }).caseOf(Ops.Select, _execSelect(a, ios)).caseOf(Ops.Accept, function (_ref8) {
                var actor = _ref8.actor,
                    message = _ref8.message,
                    next = _ref8.next;
                return exec(a, ios, next((0, _Actor.accept)(message, actor)));
            }).caseOf(Ops.Replace, function (_ref9) {
                var actor = _ref9.actor,
                    next = _ref9.next;
                return exec(a, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
            }).caseOf(Ops.Output, function (_ref10) {
                var f = _ref10.f,
                    next = _ref10.next;
                return exec(a, ios.chain(function (s) {
                    return f().map(function () {
                        return s;
                    });
                }), next);
            }).caseOf(Ops.Input, _execInput(a, ios)).caseOf(Ops.Raise, function (_ref11) {
                var error = _ref11.error;
                throw error;
            }).end()
        );
    }, function () {
        return ios.map((0, _util.partial)(_Actor.replace, a));
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeGVjLmpzIl0sIm5hbWVzIjpbIk9wcyIsIl9leGVjU2VsZWN0IiwiYSIsImlvcyIsInBhdGgiLCJuZXh0IiwiY2hhaW4iLCJleGVjIiwib2YiLCJzIiwibm90Iiwib3JKdXN0IiwiZXh0cmFjdCIsIl9leGVjSW5wdXQiLCJpb2YiLCJtYXAiLCJyIiwiZnIiLCJmIiwicmVzdW1lIiwiY2F0YSIsIm9wIiwiY2FzZU9mIiwiU3lzdGVtIiwiU2VsZiIsIkdldCIsImlkIiwiUHV0IiwiYWN0b3IiLCJVcGRhdGUiLCJTZWxlY3QiLCJBY2NlcHQiLCJtZXNzYWdlIiwiUmVwbGFjZSIsIk91dHB1dCIsIklucHV0IiwiUmFpc2UiLCJlcnJvciIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztJQUFZQSxHOztBQUNaOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLENBQUNDLENBQUQsRUFBSUMsR0FBSjtBQUFBLFdBQVk7QUFBQSxZQUFHQyxJQUFILFFBQUdBLElBQUg7QUFBQSxZQUFTQyxJQUFULFFBQVNBLElBQVQ7QUFBQSxlQUFvQkYsSUFBSUcsS0FBSixDQUFVO0FBQUEsbUJBQzFEQyxLQUFLTCxDQUFMLEVBQVEsVUFBR00sRUFBSCxDQUFNQyxDQUFOLENBQVIsRUFDSUosS0FBSyxhQUNBSyxHQURBLENBQ0ksbUJBQU9OLElBQVAsRUFBYUssQ0FBYixDQURKLEVBRUFFLE1BRkEsQ0FFTyxnQkFBSSxHQUFKLEVBQVNGLENBQVQsQ0FGUCxFQUdBRyxPQUhBLEVBQUwsQ0FESixDQUQwRDtBQUFBLFNBQVYsQ0FBcEI7QUFBQSxLQUFaO0FBQUEsQ0FBcEI7O0FBT0EsSUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNYLENBQUQsRUFBSUMsR0FBSjtBQUFBLFdBQVk7QUFBQSxZQUFHRSxJQUFILFNBQUdBLElBQUg7QUFBQSxZQUFTUyxHQUFULFNBQVNBLEdBQVQ7QUFBQSxlQUMzQlgsSUFBSUcsS0FBSixDQUFV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SUFBMUMsQ0FBckI7QUFBQSxhQVI2QyxFQVNqRWlCLE1BVGlFLENBUzFEdEIsSUFBSWtDLE1BVHNELEVBUzlDO0FBQUEsb0JBQUdoQixDQUFILFVBQUdBLENBQUg7QUFBQSxvQkFBTWIsSUFBTixVQUFNQSxJQUFOO0FBQUEsdUJBQWlCRSxLQUFLTCxDQUFMLEVBQVFDLElBQUlHLEtBQUosQ0FBVTtBQUFBLDJCQUFLWSxJQUFJSCxHQUFKLENBQVE7QUFBQSwrQkFBTU4sQ0FBTjtBQUFBLHFCQUFSLENBQUw7QUFBQSxpQkFBVixDQUFSLEVBQTBDSixJQUExQyxDQUFqQjtBQUFBLGFBVDhDLEVBVWpFaUIsTUFWaUUsQ0FVMUR0QixJQUFJbUMsS0FWc0QsRUFVL0N0QixXQUFXWCxDQUFYLEVBQWNDLEdBQWQsQ0FWK0MsRUFXakVtQixNQVhpRSxDQVcxRHRCLElBQUlvQyxLQVhzRCxFQVcvQyxrQkFBZTtBQUFBLG9CQUFaQyxLQUFZLFVBQVpBLEtBQVk7QUFBRSxzQkFBTUEsS0FBTjtBQUFjLGFBWGdCLEVBWWpFQyxHQVppRTtBQUFoRTtBQUFBLEtBRE4sRUFhWTtBQUFBLGVBQU1uQyxJQUFJWSxHQUFKLENBQVEsbUNBQWlCYixDQUFqQixDQUFSLENBQU47QUFBQSxLQWJaLENBRmdCO0FBQUEsQ0FBYiIsImZpbGUiOiJFeGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgT3BzIGZyb20gJy4vT3BzJztcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi9NYXRjaCc7XG5pbXBvcnQgeyBwYXJ0aWFsIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IElPLCBNYXliZSB9IGZyb20gJy4vbW9uYWQnO1xuaW1wb3J0IHtnZXQsIHB1dCwgcmVwbGFjZSwgc2VsZWN0LCBhY2NlcHQgfSBmcm9tICcuL0FjdG9yJztcblxuY29uc3QgX2V4ZWNTZWxlY3QgPSAoYSwgaW9zKSA9PiAoeyBwYXRoLCBuZXh0IH0pID0+IGlvcy5jaGFpbihzID0+XG4gICAgZXhlYyhhLCBJTy5vZihzKSxcbiAgICAgICAgbmV4dChNYXliZVxuICAgICAgICAgICAgLm5vdChzZWxlY3QocGF0aCwgcykpXG4gICAgICAgICAgICAub3JKdXN0KGdldCgnPycsIHMpKVxuICAgICAgICAgICAgLmV4dHJhY3QoKSkpKVxuXG5jb25zdCBfZXhlY0lucHV0ID0gKGEsIGlvcykgPT4gKHsgbmV4dCwgaW9mIH0pID0+XG4gICAgaW9zLmNoYWluKHMgPT4gaW9mKCkubWFwKHIgPT4gbmV4dChyKSkuY2hhaW4oZnIgPT4gZXhlYyhhLCBJTy5vZihzKSwgZnIpKSlcblxuLyoqXG4gKiBleGVjIHRyYW5zbGF0ZXMgYW4gT3AgaW50byBJT1xuICogQHN1bW1hcnkgZXhlYyA6OiAoQWN0b3IsSU88U3lzdGVtPixGcmVlPEYsVj4pIOKGkiAgSU88U3lzdGVtPlxuICovXG5leHBvcnQgY29uc3QgZXhlYyA9IChhLCBpb3MsIGYgPSBudWxsKSA9PlxuICAgICFmID8gaW9zIDpcbiAgICBmLnJlc3VtZSgpXG4gICAgLmNhdGEob3AgPT4gLypjb25zb2xlLmxvZygnQWN0b3IgOiAnLCBhLnBhdGgsICdPcDogJywgb3AsICdcXG4nKSB8fCAqLyBtYXRjaChvcClcbiAgICAgICAgLmNhc2VPZihPcHMuU3lzdGVtLCAoeyBuZXh0IH0pID0+IGlvcy5jaGFpbihzID0+IGV4ZWMoYSwgaW9zKHMpLCBuZXh0KHMpKSkpXG4gICAgICAgIC5jYXNlT2YoT3BzLlNlbGYsICh7IG5leHQgfSkgPT4gZXhlYyhhLCBpb3MsIG5leHQoYSkpKVxuICAgICAgICAuY2FzZU9mKE9wcy5HZXQsICh7IGlkLCBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KGdldChpZCwgYSkpKSlcbiAgICAgICAgLmNhc2VPZihPcHMuUHV0LCAoeyBhY3RvciwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcywgbmV4dChwdXQoYWN0b3IsIGEpKSkpXG4gICAgICAgIC5jYXNlT2YoT3BzLlVwZGF0ZSwgKHsgYWN0b3IsIG5leHQgfSkgPT4gZXhlYyhhY3RvciwgaW9zLm1hcChwYXJ0aWFsKHJlcGxhY2UsIGFjdG9yKSksIG5leHQpKVxuICAgICAgICAuY2FzZU9mKE9wcy5TZWxlY3QsIF9leGVjU2VsZWN0KGEsIGlvcykpXG4gICAgICAgIC5jYXNlT2YoT3BzLkFjY2VwdCwgKHsgYWN0b3IsIG1lc3NhZ2UsIG5leHQgfSkgPT4gZXhlYyhhLCBpb3MsIG5leHQoYWNjZXB0KG1lc3NhZ2UsIGFjdG9yKSkpKVxuICAgICAgICAuY2FzZU9mKE9wcy5SZXBsYWNlLCAoeyBhY3RvciwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcy5tYXAocGFydGlhbChyZXBsYWNlLCBhY3RvcikpLCBuZXh0KSlcbiAgICAgICAgLmNhc2VPZihPcHMuT3V0cHV0LCAoeyBmLCBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLmNoYWluKHMgPT4gZigpLm1hcCgoKSA9PiBzKSksIG5leHQpKVxuICAgICAgICAuY2FzZU9mKE9wcy5JbnB1dCwgX2V4ZWNJbnB1dChhLCBpb3MpKVxuICAgICAgICAuY2FzZU9mKE9wcy5SYWlzZSwgKHsgZXJyb3IgfSkgPT4geyB0aHJvdyBlcnJvcjsgfSlcbiAgICAgICAgLmVuZCgpLCAoKSA9PiBpb3MubWFwKHBhcnRpYWwocmVwbGFjZSwgYSkpKTtcbiJdfQ==