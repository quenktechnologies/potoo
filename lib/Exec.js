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

/**
 * exec translates an Op into IO
 * @summary exec :: (Actor,IO<System>,Free<O,*>) →  IO<System>
 */
var exec = exports.exec = function exec(a, ios, F) {
    return _monad.Maybe.not(F).map(function () {
        return F.resume().cata(function (op) {
            return (0, _Match.match)(op).caseOf(Ops.System, function (_ref) {
                var next = _ref.next;
                return ios.chain(function (s) {
                    return exec(a, ios(s), next(s));
                });
            }).caseOf(Ops.Self, function (_ref2) {
                var next = _ref2.next;
                return exec(a, ios, next(a));
            }).caseOf(Ops.Get, function (_ref3) {
                var id = _ref3.id,
                    next = _ref3.next;
                return exec(a, ios, next((0, _Actor.get)(id, a)));
            }).caseOf(Ops.Put, function (_ref4) {
                var actor = _ref4.actor,
                    next = _ref4.next;
                return exec(a, ios, next((0, _Actor.put)(actor, a)));
            }).caseOf(Ops.Update, function (_ref5) {
                var actor = _ref5.actor,
                    next = _ref5.next;
                return exec(actor, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
            }).caseOf(Ops.Select, _execSelect(a, ios)).caseOf(Ops.Accept, function (_ref6) {
                var actor = _ref6.actor,
                    message = _ref6.message,
                    next = _ref6.next;
                return exec(a, ios, next((0, _Actor.accept)(message, actor)));
            }).caseOf(Ops.AcceptIO, _execIOAccept(a, ios)).caseOf(Ops.Replace, function (_ref7) {
                var actor = _ref7.actor,
                    next = _ref7.next;
                return exec(a, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
            }).caseOf(Ops.Output, function (_ref8) {
                var f = _ref8.f,
                    next = _ref8.next;
                return exec(a, ios.chain(function (s) {
                    return f().map(function () {
                        return s;
                    });
                }), next);
            }).caseOf(Ops.Input, _execInput(a, ios)).caseOf(Ops.Raise, function (_ref9) {
                var error = _ref9.error;
                throw error;
            }).caseOf(Ops.Log, _execLog(a, ios)).caseOf(Ops.NOOP, function (_ref10) {
                var next = _ref10.next;
                return exec(a, ios, next);
            }).end();
        }, function () {
            return ios.map((0, _util.partial)(_Actor.replace, a));
        });
    }).orJust(ios).extract();
}; /**
    * @module Exec
    *
    * Provides functions for interpreting Ops.
    *
    */


var _exec = function _exec(a, ios, op) {
    return (0, _Match.match)(op).caseOf(Ops.System, function (_ref11) {
        var next = _ref11.next;
        return ios.chain(function (s) {
            return exec(a, ios(s), next(s));
        });
    }).caseOf(Ops.Self, function (_ref12) {
        var next = _ref12.next;
        return exec(a, ios, next(a));
    }).caseOf(Ops.Get, function (_ref13) {
        var id = _ref13.id,
            next = _ref13.next;
        return exec(a, ios, next((0, _Actor.get)(id, a)));
    }).caseOf(Ops.Put, function (_ref14) {
        var actor = _ref14.actor,
            next = _ref14.next;
        return exec(a, ios, next((0, _Actor.put)(actor, a)));
    }).caseOf(Ops.Update, function (_ref15) {
        var actor = _ref15.actor,
            next = _ref15.next;
        return exec(actor, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
    }).caseOf(Ops.Select, _execSelect(a, ios)).caseOf(Ops.Accept, function (_ref16) {
        var actor = _ref16.actor,
            message = _ref16.message,
            next = _ref16.next;
        return exec(a, ios, next((0, _Actor.accept)(message, actor)));
    }).caseOf(Ops.AcceptIO, _execIOAccept(a, ios)).caseOf(Ops.Replace, function (_ref17) {
        var actor = _ref17.actor,
            next = _ref17.next;
        return exec(a, ios.map((0, _util.partial)(_Actor.replace, actor)), next);
    }).caseOf(Ops.Output, function (_ref18) {
        var f = _ref18.f,
            next = _ref18.next;
        return exec(a, ios.chain(function (s) {
            return f().map(function () {
                return s;
            });
        }), next);
    }).caseOf(Ops.Input, _execInput(a, ios)).caseOf(Ops.Raise, function (_ref19) {
        var error = _ref19.error;
        throw error;
    }).caseOf(Ops.Log, _execLog(a, ios)).caseOf(Ops.NOOP, function (_ref20) {
        var next = _ref20.next;
        return exec(a, ios, next);
    }).end();
};

var _execSelect = function _execSelect(a, ios) {
    return function (_ref21) {
        var path = _ref21.path,
            next = _ref21.next;
        return ios.chain(function (s) {
            return exec(a, _monad.IO.of(s), next(_monad.Maybe.not((0, _Actor.select)(path, s)).orJust((0, _Actor.get)('?', s)).extract()));
        });
    };
};

var _execInput = function _execInput(a, ios) {
    return function (_ref22) {
        var next = _ref22.next,
            f = _ref22.f;
        return ios.chain(function (s) {
            return f().map(function (r) {
                return next(r);
            }).chain(function (fr) {
                return exec(a, _monad.IO.of(s), fr);
            });
        });
    };
};

var _execIOAccept = function _execIOAccept(a, ios) {
    return function (_ref23) {
        var actor = _ref23.actor,
            message = _ref23.message,
            next = _ref23.next;
        return ios.chain(function (s) {
            return (0, _Actor.accept)(message, actor).chain(function (b) {
                return exec(a, _monad.IO.of(s), next(b));
            });
        });
    };
};

var _execLog = function _execLog(a, ios) {
    return function (_ref24) {
        var op = _ref24.op,
            next = _ref24.next;
        return exec(a, ios.chain(function (s) {
            return s.log(op, a).map((0, _util.constant)(s));
        }), next(op));
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeGVjLmpzIl0sIm5hbWVzIjpbIk9wcyIsImV4ZWMiLCJhIiwiaW9zIiwiRiIsIm5vdCIsIm1hcCIsInJlc3VtZSIsImNhdGEiLCJvcCIsImNhc2VPZiIsIlN5c3RlbSIsIm5leHQiLCJjaGFpbiIsInMiLCJTZWxmIiwiR2V0IiwiaWQiLCJQdXQiLCJhY3RvciIsIlVwZGF0ZSIsIlNlbGVjdCIsIl9leGVjU2VsZWN0IiwiQWNjZXB0IiwibWVzc2FnZSIsIkFjY2VwdElPIiwiX2V4ZWNJT0FjY2VwdCIsIlJlcGxhY2UiLCJPdXRwdXQiLCJmIiwiSW5wdXQiLCJfZXhlY0lucHV0IiwiUmFpc2UiLCJlcnJvciIsIkxvZyIsIl9leGVjTG9nIiwiTk9PUCIsImVuZCIsIm9ySnVzdCIsImV4dHJhY3QiLCJfZXhlYyIsInBhdGgiLCJvZiIsInIiLCJmciIsImIiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFNQTs7SUFBWUEsRzs7QUFDWjs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBSU8sSUFBTUMsc0JBQU8sU0FBUEEsSUFBTyxDQUFDQyxDQUFELEVBQUlDLEdBQUosRUFBU0MsQ0FBVDtBQUFBLFdBQ2hCLGFBQ0NDLEdBREQsQ0FDS0QsQ0FETCxFQUVDRSxHQUZELENBRUs7QUFBQSxlQUNERixFQUNDRyxNQURELEdBRUNDLElBRkQsQ0FFTTtBQUFBLG1CQUFNLGtCQUFNQyxFQUFOLEVBQ1BDLE1BRE8sQ0FDQVYsSUFBSVcsTUFESixFQUNZO0FBQUEsb0JBQUdDLElBQUgsUUFBR0EsSUFBSDtBQUFBLHVCQUFjVCxJQUFJVSxLQUFKLENBQVU7QUFBQSwyQkFBS1osS0FBS0MsQ0FBTCxFQUFRQyxJQUFJVyxDQUFKLENBQVIsRUFBZ0JGLEtBQUtFLENBQUwsQ0FBaEIsQ0FBTDtBQUFBLGlCQUFWLENBQWQ7QUFBQSxhQURaLEVBRVBKLE1BRk8sQ0FFQVYsSUFBSWUsSUFGSixFQUVVO0FBQUEsb0JBQUdILElBQUgsU0FBR0EsSUFBSDtBQUFBLHVCQUFjWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBS1YsQ0FBTCxDQUFiLENBQWQ7QUFBQSxhQUZWLEVBR1BRLE1BSE8sQ0FHQVYsSUFBSWdCLEdBSEosRUFHUztBQUFBLG9CQUFHQyxFQUFILFNBQUdBLEVBQUg7QUFBQSxvQkFBT0wsSUFBUCxTQUFPQSxJQUFQO0FBQUEsdUJBQWtCWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBSyxnQkFBSUssRUFBSixFQUFRZixDQUFSLENBQUwsQ0FBYixDQUFsQjtBQUFBLGFBSFQsRUFJUFEsTUFKTyxDQUlBVixJQUFJa0IsR0FKSixFQUlTO0FBQUEsb0JBQUdDLEtBQUgsU0FBR0EsS0FBSDtBQUFBLG9CQUFVUCxJQUFWLFNBQVVBLElBQVY7QUFBQSx1QkFBcUJYLEtBQUtDLENBQUwsRUFBUUMsR0FBUixFQUFhUyxLQUFLLGdCQUFJTyxLQUFKLEVBQVdqQixDQUFYLENBQUwsQ0FBYixDQUFyQjtBQUFBLGFBSlQsRUFLUFEsTUFMTyxDQUtBVixJQUFJb0IsTUFMSixFQUtZO0FBQUEsb0JBQUdELEtBQUgsU0FBR0EsS0FBSDtBQUFBLG9CQUFVUCxJQUFWLFNBQVVBLElBQVY7QUFBQSx1QkFBcUJYLEtBQUtrQixLQUFMLEVBQVloQixJQUFJRyxHQUFKLENBQVEsbUNBQWlCYSxLQUFqQixDQUFSLENBQVosRUFBOENQLElBQTlDLENBQXJCO0FBQUEsYUFMWixFQU1QRixNQU5PLENBTUFWLElBQUlxQixNQU5KLEVBTVlDLFlBQVlwQixDQUFaLEVBQWVDLEdBQWYsQ0FOWixFQU9QTyxNQVBPLENBT0FWLElBQUl1QixNQVBKLEVBT1k7QUFBQSxvQkFBR0osS0FBSCxTQUFHQSxLQUFIO0FBQUEsb0JBQVVLLE9BQVYsU0FBVUEsT0FBVjtBQUFBLG9CQUFtQlosSUFBbkIsU0FBbUJBLElBQW5CO0FBQUEsdUJBQThCWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBSyxtQkFBT1ksT0FBUCxFQUFnQkwsS0FBaEIsQ0FBTCxDQUFiLENBQTlCO0FBQUEsYUFQWixFQVFQVCxNQVJPLENBUUFWLElBQUl5QixRQVJKLEVBUWNDLGNBQWN4QixDQUFkLEVBQWlCQyxHQUFqQixDQVJkLEVBU1BPLE1BVE8sQ0FTQVYsSUFBSTJCLE9BVEosRUFTYTtBQUFBLG9CQUFHUixLQUFILFNBQUdBLEtBQUg7QUFBQSxvQkFBVVAsSUFBVixTQUFVQSxJQUFWO0FBQUEsdUJBQXFCWCxLQUFLQyxDQUFMLEVBQVFDLElBQUlHLEdBQUosQ0FBUSxtQ0FBaUJhLEtBQWpCLENBQVIsQ0FBUixFQUEwQ1AsSUFBMUMsQ0FBckI7QUFBQSxhQVRiLEVBVVBGLE1BVk8sQ0FVQVYsSUFBSTRCLE1BVkosRUFVWTtBQUFBLG9CQUFHQyxDQUFILFNBQUdBLENBQUg7QUFBQSxvQkFBTWpCLElBQU4sU0FBTUEsSUFBTjtBQUFBLHVCQUFpQlgsS0FBS0MsQ0FBTCxFQUFRQyxJQUFJVSxLQUFKLENBQVU7QUFBQSwyQkFBS2dCLElBQUl2QixHQUFKLENBQVE7QUFBQSwrQkFBTVEsQ0FBTjtBQUFBLHFCQUFSLENBQUw7QUFBQSxpQkFBVixDQUFSLEVBQTBDRixJQUExQyxDQUFqQjtBQUFBLGFBVlosRUFXUEYsTUFYTyxDQVdBVixJQUFJOEIsS0FYSixFQVdXQyxXQUFXN0IsQ0FBWCxFQUFjQyxHQUFkLENBWFgsRUFZUE8sTUFaTyxDQVlBVixJQUFJZ0MsS0FaSixFQVlXLGlCQUFlO0FBQUEsb0JBQVpDLEtBQVksU0FBWkEsS0FBWTtBQUFFLHNCQUFNQSxLQUFOO0FBQWMsYUFaMUMsRUFhUHZCLE1BYk8sQ0FhQVYsSUFBSWtDLEdBYkosRUFhU0MsU0FBU2pDLENBQVQsRUFBWUMsR0FBWixDQWJULEVBY1BPLE1BZE8sQ0FjQVYsSUFBSW9DLElBZEosRUFjVTtBQUFBLG9CQUFHeEIsSUFBSCxVQUFHQSxJQUFIO0FBQUEsdUJBQWNYLEtBQUtDLENBQUwsRUFBUUMsR0FBUixFQUFhUyxJQUFiLENBQWQ7QUFBQSxhQWRWLEVBZVB5QixHQWZPLEVBQU47QUFBQSxTQUZOLEVBaUJZO0FBQUEsbUJBQU1sQyxJQUFJRyxHQUFKLENBQVEsbUNBQWlCSixDQUFqQixDQUFSLENBQU47QUFBQSxTQWpCWixDQURDO0FBQUEsS0FGTCxFQXFCQ29DLE1BckJELENBcUJRbkMsR0FyQlIsRUFzQkNvQyxPQXRCRCxFQURnQjtBQUFBLENBQWIsQyxDQWhCUDs7Ozs7Ozs7QUF5Q0EsSUFBTUMsUUFBUSxTQUFSQSxLQUFRLENBQUN0QyxDQUFELEVBQUlDLEdBQUosRUFBU00sRUFBVDtBQUFBLFdBQ1Ysa0JBQU1BLEVBQU4sRUFDQ0MsTUFERCxDQUNRVixJQUFJVyxNQURaLEVBQ29CO0FBQUEsWUFBR0MsSUFBSCxVQUFHQSxJQUFIO0FBQUEsZUFBY1QsSUFBSVUsS0FBSixDQUFVO0FBQUEsbUJBQUtaLEtBQUtDLENBQUwsRUFBUUMsSUFBSVcsQ0FBSixDQUFSLEVBQWdCRixLQUFLRSxDQUFMLENBQWhCLENBQUw7QUFBQSxTQUFWLENBQWQ7QUFBQSxLQURwQixFQUVDSixNQUZELENBRVFWLElBQUllLElBRlosRUFFa0I7QUFBQSxZQUFHSCxJQUFILFVBQUdBLElBQUg7QUFBQSxlQUFjWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBS1YsQ0FBTCxDQUFiLENBQWQ7QUFBQSxLQUZsQixFQUdDUSxNQUhELENBR1FWLElBQUlnQixHQUhaLEVBR2lCO0FBQUEsWUFBR0MsRUFBSCxVQUFHQSxFQUFIO0FBQUEsWUFBT0wsSUFBUCxVQUFPQSxJQUFQO0FBQUEsZUFBa0JYLEtBQUtDLENBQUwsRUFBUUMsR0FBUixFQUFhUyxLQUFLLGdCQUFJSyxFQUFKLEVBQVFmLENBQVIsQ0FBTCxDQUFiLENBQWxCO0FBQUEsS0FIakIsRUFJQ1EsTUFKRCxDQUlRVixJQUFJa0IsR0FKWixFQUlpQjtBQUFBLFlBQUdDLEtBQUgsVUFBR0EsS0FBSDtBQUFBLFlBQVVQLElBQVYsVUFBVUEsSUFBVjtBQUFBLGVBQXFCWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBSyxnQkFBSU8sS0FBSixFQUFXakIsQ0FBWCxDQUFMLENBQWIsQ0FBckI7QUFBQSxLQUpqQixFQUtDUSxNQUxELENBS1FWLElBQUlvQixNQUxaLEVBS29CO0FBQUEsWUFBR0QsS0FBSCxVQUFHQSxLQUFIO0FBQUEsWUFBVVAsSUFBVixVQUFVQSxJQUFWO0FBQUEsZUFBcUJYLEtBQUtrQixLQUFMLEVBQVloQixJQUFJRyxHQUFKLENBQVEsbUNBQWlCYSxLQUFqQixDQUFSLENBQVosRUFBOENQLElBQTlDLENBQXJCO0FBQUEsS0FMcEIsRUFNQ0YsTUFORCxDQU1RVixJQUFJcUIsTUFOWixFQU1vQkMsWUFBWXBCLENBQVosRUFBZUMsR0FBZixDQU5wQixFQU9DTyxNQVBELENBT1FWLElBQUl1QixNQVBaLEVBT29CO0FBQUEsWUFBR0osS0FBSCxVQUFHQSxLQUFIO0FBQUEsWUFBVUssT0FBVixVQUFVQSxPQUFWO0FBQUEsWUFBbUJaLElBQW5CLFVBQW1CQSxJQUFuQjtBQUFBLGVBQThCWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsS0FBSyxtQkFBT1ksT0FBUCxFQUFnQkwsS0FBaEIsQ0FBTCxDQUFiLENBQTlCO0FBQUEsS0FQcEIsRUFRQ1QsTUFSRCxDQVFRVixJQUFJeUIsUUFSWixFQVFzQkMsY0FBY3hCLENBQWQsRUFBaUJDLEdBQWpCLENBUnRCLEVBU0NPLE1BVEQsQ0FTUVYsSUFBSTJCLE9BVFosRUFTcUI7QUFBQSxZQUFHUixLQUFILFVBQUdBLEtBQUg7QUFBQSxZQUFVUCxJQUFWLFVBQVVBLElBQVY7QUFBQSxlQUFxQlgsS0FBS0MsQ0FBTCxFQUFRQyxJQUFJRyxHQUFKLENBQVEsbUNBQWlCYSxLQUFqQixDQUFSLENBQVIsRUFBMENQLElBQTFDLENBQXJCO0FBQUEsS0FUckIsRUFVQ0YsTUFWRCxDQVVRVixJQUFJNEIsTUFWWixFQVVvQjtBQUFBLFlBQUdDLENBQUgsVUFBR0EsQ0FBSDtBQUFBLFlBQU1qQixJQUFOLFVBQU1BLElBQU47QUFBQSxlQUFpQlgsS0FBS0MsQ0FBTCxFQUFRQyxJQUFJVSxLQUFKLENBQVU7QUFBQSxtQkFBS2dCLElBQUl2QixHQUFKLENBQVE7QUFBQSx1QkFBTVEsQ0FBTjtBQUFBLGFBQVIsQ0FBTDtBQUFBLFNBQVYsQ0FBUixFQUEwQ0YsSUFBMUMsQ0FBakI7QUFBQSxLQVZwQixFQVdDRixNQVhELENBV1FWLElBQUk4QixLQVhaLEVBV21CQyxXQUFXN0IsQ0FBWCxFQUFjQyxHQUFkLENBWG5CLEVBWUNPLE1BWkQsQ0FZUVYsSUFBSWdDLEtBWlosRUFZbUIsa0JBQWU7QUFBQSxZQUFaQyxLQUFZLFVBQVpBLEtBQVk7QUFBRSxjQUFNQSxLQUFOO0FBQWMsS0FabEQsRUFhQ3ZCLE1BYkQsQ0FhUVYsSUFBSWtDLEdBYlosRUFhaUJDLFNBQVNqQyxDQUFULEVBQVlDLEdBQVosQ0FiakIsRUFjQ08sTUFkRCxDQWNRVixJQUFJb0MsSUFkWixFQWNrQjtBQUFBLFlBQUd4QixJQUFILFVBQUdBLElBQUg7QUFBQSxlQUFjWCxLQUFLQyxDQUFMLEVBQVFDLEdBQVIsRUFBYVMsSUFBYixDQUFkO0FBQUEsS0FkbEIsRUFlQ3lCLEdBZkQsRUFEVTtBQUFBLENBQWQ7O0FBbUJBLElBQU1mLGNBQWMsU0FBZEEsV0FBYyxDQUFDcEIsQ0FBRCxFQUFJQyxHQUFKO0FBQUEsV0FBWTtBQUFBLFlBQUdzQyxJQUFILFVBQUdBLElBQUg7QUFBQSxZQUFTN0IsSUFBVCxVQUFTQSxJQUFUO0FBQUEsZUFBb0JULElBQUlVLEtBQUosQ0FBVTtBQUFBLG1CQUMxRFosS0FBS0MsQ0FBTCxFQUFRLFVBQUd3QyxFQUFILENBQU01QixDQUFOLENBQVIsRUFDSUYsS0FBSyxhQUNBUCxHQURBLENBQ0ksbUJBQU9vQyxJQUFQLEVBQWEzQixDQUFiLENBREosRUFFQXdCLE1BRkEsQ0FFTyxnQkFBSSxHQUFKLEVBQVN4QixDQUFULENBRlAsRUFHQXlCLE9BSEEsRUFBTCxDQURKLENBRDBEO0FBQUEsU0FBVixDQUFwQjtBQUFBLEtBQVo7QUFBQSxDQUFwQjs7QUFPQSxJQUFNUixhQUFhLFNBQWJBLFVBQWEsQ0FBQzdCLENBQUQsRUFBSUMsR0FBSjtBQUFBLFdBQVk7QUFBQSxZQUFHUyxJQUFILFVBQUdBLElBQUg7QUFBQSxZQUFTaUIsQ0FBVCxVQUFTQSxDQUFUO0FBQUEsZUFDM0IxQixJQUFJVSxLQUFKLENBQVU7QUFBQSxtQkFBS2dCLElBQUl2QixHQUFKLENBQVE7QUFBQSx1QkFBS00sS0FBSytCLENBQUwsQ0FBTDtBQUFBLGFBQVIsRUFBc0I5QixLQUF0QixDQUE0QjtBQUFBLHVCQUFNWixLQUFLQyxDQUFMLEVBQVEsVUFBR3dDLEVBQUgsQ0FBTTVCLENBQU4sQ0FBUixFQUFrQjhCLEVBQWxCLENBQU47QUFBQSxhQUE1QixDQUFMO0FBQUEsU0FBVixDQUQyQjtBQUFBLEtBQVo7QUFBQSxDQUFuQjs7QUFHQSxJQUFNbEIsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDeEIsQ0FBRCxFQUFJQyxHQUFKO0FBQUEsV0FBWTtBQUFBLFlBQUdnQixLQUFILFVBQUdBLEtBQUg7QUFBQSxZQUFVSyxPQUFWLFVBQVVBLE9BQVY7QUFBQSxZQUFtQlosSUFBbkIsVUFBbUJBLElBQW5CO0FBQUEsZUFDOUJULElBQUlVLEtBQUosQ0FBVTtBQUFBLG1CQUFLLG1CQUFPVyxPQUFQLEVBQWdCTCxLQUFoQixFQUF1Qk4sS0FBdkIsQ0FBNkI7QUFBQSx1QkFBS1osS0FBS0MsQ0FBTCxFQUFRLFVBQUd3QyxFQUFILENBQU01QixDQUFOLENBQVIsRUFBa0JGLEtBQUtpQyxDQUFMLENBQWxCLENBQUw7QUFBQSxhQUE3QixDQUFMO0FBQUEsU0FBVixDQUQ4QjtBQUFBLEtBQVo7QUFBQSxDQUF0Qjs7QUFHQSxJQUFNVixXQUFXLFNBQVhBLFFBQVcsQ0FBQ2pDLENBQUQsRUFBSUMsR0FBSjtBQUFBLFdBQVk7QUFBQSxZQUFHTSxFQUFILFVBQUdBLEVBQUg7QUFBQSxZQUFPRyxJQUFQLFVBQU9BLElBQVA7QUFBQSxlQUN6QlgsS0FBS0MsQ0FBTCxFQUFRQyxJQUFJVSxLQUFKLENBQVU7QUFBQSxtQkFBS0MsRUFBRWdDLEdBQUYsQ0FBTXJDLEVBQU4sRUFBVVAsQ0FBVixFQUFhSSxHQUFiLENBQWlCLG9CQUFTUSxDQUFULENBQWpCLENBQUw7QUFBQSxTQUFWLENBQVIsRUFBdURGLEtBQUtILEVBQUwsQ0FBdkQsQ0FEeUI7QUFBQSxLQUFaO0FBQUEsQ0FBakIiLCJmaWxlIjoiRXhlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQG1vZHVsZSBFeGVjXG4gKlxuICogUHJvdmlkZXMgZnVuY3Rpb25zIGZvciBpbnRlcnByZXRpbmcgT3BzLlxuICpcbiAqL1xuaW1wb3J0ICogYXMgT3BzIGZyb20gJy4vT3BzJztcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi9NYXRjaCc7XG5pbXBvcnQgeyBwYXJ0aWFsLCBjb25zdGFudCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBJTywgTWF5YmUgfSBmcm9tICcuL21vbmFkJztcbmltcG9ydCB7Z2V0LCBwdXQsIHJlcGxhY2UsIHNlbGVjdCwgYWNjZXB0IH0gZnJvbSAnLi9BY3Rvcic7XG5cbi8qKlxuICogZXhlYyB0cmFuc2xhdGVzIGFuIE9wIGludG8gSU9cbiAqIEBzdW1tYXJ5IGV4ZWMgOjogKEFjdG9yLElPPFN5c3RlbT4sRnJlZTxPLCo+KSDihpIgIElPPFN5c3RlbT5cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWMgPSAoYSwgaW9zLCBGKSA9PlxuICAgIE1heWJlXG4gICAgLm5vdChGKVxuICAgIC5tYXAoKCkgPT5cbiAgICAgICAgRlxuICAgICAgICAucmVzdW1lKClcbiAgICAgICAgLmNhdGEob3AgPT4gbWF0Y2gob3ApXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5TeXN0ZW0sICh7IG5leHQgfSkgPT4gaW9zLmNoYWluKHMgPT4gZXhlYyhhLCBpb3MocyksIG5leHQocykpKSlcbiAgICAgICAgICAgIC5jYXNlT2YoT3BzLlNlbGYsICh7IG5leHQgfSkgPT4gZXhlYyhhLCBpb3MsIG5leHQoYSkpKVxuICAgICAgICAgICAgLmNhc2VPZihPcHMuR2V0LCAoeyBpZCwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcywgbmV4dChnZXQoaWQsIGEpKSkpXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5QdXQsICh7IGFjdG9yLCBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KHB1dChhY3RvciwgYSkpKSlcbiAgICAgICAgICAgIC5jYXNlT2YoT3BzLlVwZGF0ZSwgKHsgYWN0b3IsIG5leHQgfSkgPT4gZXhlYyhhY3RvciwgaW9zLm1hcChwYXJ0aWFsKHJlcGxhY2UsIGFjdG9yKSksIG5leHQpKVxuICAgICAgICAgICAgLmNhc2VPZihPcHMuU2VsZWN0LCBfZXhlY1NlbGVjdChhLCBpb3MpKVxuICAgICAgICAgICAgLmNhc2VPZihPcHMuQWNjZXB0LCAoeyBhY3RvciwgbWVzc2FnZSwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcywgbmV4dChhY2NlcHQobWVzc2FnZSwgYWN0b3IpKSkpXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5BY2NlcHRJTywgX2V4ZWNJT0FjY2VwdChhLCBpb3MpKVxuICAgICAgICAgICAgLmNhc2VPZihPcHMuUmVwbGFjZSwgKHsgYWN0b3IsIG5leHQgfSkgPT4gZXhlYyhhLCBpb3MubWFwKHBhcnRpYWwocmVwbGFjZSwgYWN0b3IpKSwgbmV4dCkpXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5PdXRwdXQsICh7IGYsIG5leHQgfSkgPT4gZXhlYyhhLCBpb3MuY2hhaW4ocyA9PiBmKCkubWFwKCgpID0+IHMpKSwgbmV4dCkpXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5JbnB1dCwgX2V4ZWNJbnB1dChhLCBpb3MpKVxuICAgICAgICAgICAgLmNhc2VPZihPcHMuUmFpc2UsICh7IGVycm9yIH0pID0+IHsgdGhyb3cgZXJyb3I7IH0pXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5Mb2csIF9leGVjTG9nKGEsIGlvcykpXG4gICAgICAgICAgICAuY2FzZU9mKE9wcy5OT09QLCAoeyBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KSlcbiAgICAgICAgICAgIC5lbmQoKSwgKCkgPT4gaW9zLm1hcChwYXJ0aWFsKHJlcGxhY2UsIGEpKSkpXG4gICAgLm9ySnVzdChpb3MpXG4gICAgLmV4dHJhY3QoKTtcblxuY29uc3QgX2V4ZWMgPSAoYSwgaW9zLCBvcCkgPT5cbiAgICBtYXRjaChvcClcbiAgICAuY2FzZU9mKE9wcy5TeXN0ZW0sICh7IG5leHQgfSkgPT4gaW9zLmNoYWluKHMgPT4gZXhlYyhhLCBpb3MocyksIG5leHQocykpKSlcbiAgICAuY2FzZU9mKE9wcy5TZWxmLCAoeyBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KGEpKSlcbiAgICAuY2FzZU9mKE9wcy5HZXQsICh7IGlkLCBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KGdldChpZCwgYSkpKSlcbiAgICAuY2FzZU9mKE9wcy5QdXQsICh7IGFjdG9yLCBuZXh0IH0pID0+IGV4ZWMoYSwgaW9zLCBuZXh0KHB1dChhY3RvciwgYSkpKSlcbiAgICAuY2FzZU9mKE9wcy5VcGRhdGUsICh7IGFjdG9yLCBuZXh0IH0pID0+IGV4ZWMoYWN0b3IsIGlvcy5tYXAocGFydGlhbChyZXBsYWNlLCBhY3RvcikpLCBuZXh0KSlcbiAgICAuY2FzZU9mKE9wcy5TZWxlY3QsIF9leGVjU2VsZWN0KGEsIGlvcykpXG4gICAgLmNhc2VPZihPcHMuQWNjZXB0LCAoeyBhY3RvciwgbWVzc2FnZSwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcywgbmV4dChhY2NlcHQobWVzc2FnZSwgYWN0b3IpKSkpXG4gICAgLmNhc2VPZihPcHMuQWNjZXB0SU8sIF9leGVjSU9BY2NlcHQoYSwgaW9zKSlcbiAgICAuY2FzZU9mKE9wcy5SZXBsYWNlLCAoeyBhY3RvciwgbmV4dCB9KSA9PiBleGVjKGEsIGlvcy5tYXAocGFydGlhbChyZXBsYWNlLCBhY3RvcikpLCBuZXh0KSlcbiAgICAuY2FzZU9mKE9wcy5PdXRwdXQsICh7IGYsIG5leHQgfSkgPT4gZXhlYyhhLCBpb3MuY2hhaW4ocyA9PiBmKCkubWFwKCgpID0+IHMpKSwgbmV4dCkpXG4gICAgLmNhc2VPZihPcHMuSW5wdXQsIF9leGVjSW5wdXQoYSwgaW9zKSlcbiAgICAuY2FzZU9mKE9wcy5SYWlzZSwgKHsgZXJyb3IgfSkgPT4geyB0aHJvdyBlcnJvcjsgfSlcbiAgICAuY2FzZU9mKE9wcy5Mb2csIF9leGVjTG9nKGEsIGlvcykpXG4gICAgLmNhc2VPZihPcHMuTk9PUCwgKHsgbmV4dCB9KSA9PiBleGVjKGEsIGlvcywgbmV4dCkpXG4gICAgLmVuZCgpO1xuXG5cbmNvbnN0IF9leGVjU2VsZWN0ID0gKGEsIGlvcykgPT4gKHsgcGF0aCwgbmV4dCB9KSA9PiBpb3MuY2hhaW4ocyA9PlxuICAgIGV4ZWMoYSwgSU8ub2YocyksXG4gICAgICAgIG5leHQoTWF5YmVcbiAgICAgICAgICAgIC5ub3Qoc2VsZWN0KHBhdGgsIHMpKVxuICAgICAgICAgICAgLm9ySnVzdChnZXQoJz8nLCBzKSlcbiAgICAgICAgICAgIC5leHRyYWN0KCkpKSlcblxuY29uc3QgX2V4ZWNJbnB1dCA9IChhLCBpb3MpID0+ICh7IG5leHQsIGYgfSkgPT5cbiAgICBpb3MuY2hhaW4ocyA9PiBmKCkubWFwKHIgPT4gbmV4dChyKSkuY2hhaW4oZnIgPT4gZXhlYyhhLCBJTy5vZihzKSwgZnIpKSlcblxuY29uc3QgX2V4ZWNJT0FjY2VwdCA9IChhLCBpb3MpID0+ICh7IGFjdG9yLCBtZXNzYWdlLCBuZXh0IH0pID0+XG4gICAgaW9zLmNoYWluKHMgPT4gYWNjZXB0KG1lc3NhZ2UsIGFjdG9yKS5jaGFpbihiID0+IGV4ZWMoYSwgSU8ub2YocyksIG5leHQoYikpKSk7XG5cbmNvbnN0IF9leGVjTG9nID0gKGEsIGlvcykgPT4gKHsgb3AsIG5leHQgfSkgPT5cbiAgICBleGVjKGEsIGlvcy5jaGFpbihzID0+IHMubG9nKG9wLCBhKS5tYXAoY29uc3RhbnQocykpKSwgbmV4dChvcCkpO1xuIl19