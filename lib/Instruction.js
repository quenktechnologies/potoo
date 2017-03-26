'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.become = exports.dequeue = exports.deliver = exports.raise = exports.create = exports.self = exports.map = exports.Deliver = exports.Raise = exports.Create = exports.Self = exports.Instruction = undefined;

var _be = require('./be');

var _Type2 = require('./fpl/data/Type');

var _util = require('./fpl/util');

var _Match = require('./fpl/control/Match');

var _Actor = require('./Actor');

var _Free = require('./fpl/monad/Free');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var id = function id(x) {
  return x;
};

/**
 * Instruction
 * @property {Free<F<*>,A> | * →  Free<F<*>, A>} next
 */

var Instruction = exports.Instruction = function (_Type) {
  _inherits(Instruction, _Type);

  function Instruction(props, checks) {
    _classCallCheck(this, Instruction);

    var _this = _possibleConstructorReturn(this, (Instruction.__proto__ || Object.getPrototypeOf(Instruction)).call(this, props, (0, _util.merge)({ next: _be.any }, checks)));

    _this.map = map(_this);

    return _this;
  }

  return Instruction;
}(_Type2.Type);

/**
 * Self
 */


var Self = exports.Self = function (_Instruction) {
  _inherits(Self, _Instruction);

  function Self(props) {
    _classCallCheck(this, Self);

    return _possibleConstructorReturn(this, (Self.__proto__ || Object.getPrototypeOf(Self)).call(this, props, { next: (0, _be.type)(Function) }));
  }

  return Self;
}(Instruction);

/**
 * Create
 * @property {string} parent
 * @property {Template} template
 */


var Create = exports.Create = function (_Instruction2) {
  _inherits(Create, _Instruction2);

  function Create(props) {
    _classCallCheck(this, Create);

    return _possibleConstructorReturn(this, (Create.__proto__ || Object.getPrototypeOf(Create)).call(this, props, { parent: (0, _be.type)(String), template: (0, _be.type)(_Actor.Template) }));
  }

  return Create;
}(Instruction);

/**
 * Raise
 * @property {Error} error
 */


var Raise = exports.Raise = function (_Instruction3) {
  _inherits(Raise, _Instruction3);

  function Raise(props) {
    _classCallCheck(this, Raise);

    return _possibleConstructorReturn(this, (Raise.__proto__ || Object.getPrototypeOf(Raise)).call(this, props, { error: (0, _be.type)(Error) }));
  }

  return Raise;
}(Instruction);

/**
 * Deliver
 * @property {string} to
 * @property {string} from
 * @proeprty {*} message
 */


var Deliver = exports.Deliver = function (_Instruction4) {
  _inherits(Deliver, _Instruction4);

  function Deliver(props) {
    _classCallCheck(this, Deliver);

    return _possibleConstructorReturn(this, (Deliver.__proto__ || Object.getPrototypeOf(Deliver)).call(this, props, { to: (0, _be.type)(String), from: (0, _be.type)(String), message: _be.any }));
  }

  return Deliver;
}(Instruction);

/**
 * map
 * @summary map :: Instruction<A> →  (A →  B) →  Instruction<B>
 */


var map = exports.map = function map(i) {
  return function (f) {
    return (0, _Match.match)(i).caseOf(Self, function (_ref) {
      var next = _ref.next;
      return i.copy({ next: (0, _util.compose)(f, next) });
    }).caseOf(Raise, function (i) {
      return i;
    }).caseOf(Instruction, function (_ref2) {
      var next = _ref2.next;
      return i.copy({ next: f(next) });
    }).end();
  };
};

/**
 * self provides the actor from the context
 * @summary {self :: () →  Free<F<*>, ActorL>
 */
var self = exports.self = function self() {
  return (0, _Free.liftF)(new Self({ next: id }));
};

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, Template)  →  Free<F<*>, Actor>
 */
var create = exports.create = function create(parent, template) {
  return (0, _Free.liftF)(new Create({ parent: parent, template: template }));
};

/**
 * raise an error within the system.
 * @summary raise :: Error →  Free<null,Error>
 */
var raise = exports.raise = function raise(error) {
  return (0, _Free.liftF)(new Raise({ error: error }));
};

/**
 * deliver a message to another actor
 * @summary deliver :: (string, string, *) →  Free<F,null>
 */
var deliver = exports.deliver = function deliver(to, from, message) {
  return (0, _Free.liftF)(new Deliver({ to: to, from: from, message: message }));
};

/**
 * dequeue a message from an actor's mailbox
 * @summary dequeue :: (* →  Free<F,*>,  a) →  Free<F,F>
 */
var dequeue = exports.dequeue = function dequeue(behaviour, actor) {
  return (0, _Free.liftF)(new Dequeue({ behaviour: behaviour, actor: actor }));
};

/**
 * become
 * @summary become :: Free<Axiom,*> →  Free<F,*>
 */
var become = exports.become = function become(axiom) {
  return (0, _Free.liftF)(new Become({ axiom: axiom }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnN0cnVjdGlvbi5qcyJdLCJuYW1lcyI6WyJpZCIsIngiLCJJbnN0cnVjdGlvbiIsInByb3BzIiwiY2hlY2tzIiwibmV4dCIsIm1hcCIsIlNlbGYiLCJGdW5jdGlvbiIsIkNyZWF0ZSIsInBhcmVudCIsIlN0cmluZyIsInRlbXBsYXRlIiwiUmFpc2UiLCJlcnJvciIsIkVycm9yIiwiRGVsaXZlciIsInRvIiwiZnJvbSIsIm1lc3NhZ2UiLCJpIiwiY2FzZU9mIiwiY29weSIsImYiLCJlbmQiLCJzZWxmIiwiY3JlYXRlIiwicmFpc2UiLCJkZWxpdmVyIiwiZGVxdWV1ZSIsImJlaGF2aW91ciIsImFjdG9yIiwiRGVxdWV1ZSIsImJlY29tZSIsIkJlY29tZSIsImF4aW9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxTQUFMQSxFQUFLO0FBQUEsU0FBS0MsQ0FBTDtBQUFBLENBQVg7O0FBRUE7Ozs7O0lBSWFDLFcsV0FBQUEsVzs7O0FBRVQsdUJBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUEsMEhBRWpCRCxLQUZpQixFQUVWLGlCQUFNLEVBQUVFLGFBQUYsRUFBTixFQUFxQkQsTUFBckIsQ0FGVTs7QUFHdkIsVUFBS0UsR0FBTCxHQUFXQSxVQUFYOztBQUh1QjtBQUsxQjs7Ozs7QUFJTDs7Ozs7SUFHYUMsSSxXQUFBQSxJOzs7QUFFVCxnQkFBWUosS0FBWixFQUFtQjtBQUFBOztBQUFBLHVHQUVUQSxLQUZTLEVBRUYsRUFBRUUsTUFBTSxjQUFLRyxRQUFMLENBQVIsRUFGRTtBQUlsQjs7O0VBTnFCTixXOztBQVUxQjs7Ozs7OztJQUthTyxNLFdBQUFBLE07OztBQUVULGtCQUFZTixLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMkdBRVRBLEtBRlMsRUFFRixFQUFFTyxRQUFRLGNBQUtDLE1BQUwsQ0FBVixFQUF3QkMsVUFBVyw4QkFBbkMsRUFGRTtBQUlsQjs7O0VBTnVCVixXOztBQVU1Qjs7Ozs7O0lBSWFXLEssV0FBQUEsSzs7O0FBRVQsaUJBQVlWLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx5R0FFVEEsS0FGUyxFQUVGLEVBQUVXLE9BQU8sY0FBS0MsS0FBTCxDQUFULEVBRkU7QUFJbEI7OztFQU5zQmIsVzs7QUFVM0I7Ozs7Ozs7O0lBTWFjLE8sV0FBQUEsTzs7O0FBRVQsbUJBQVliLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw2R0FFVEEsS0FGUyxFQUVGLEVBQUVjLElBQUksY0FBS04sTUFBTCxDQUFOLEVBQW9CTyxNQUFNLGNBQUtQLE1BQUwsQ0FBMUIsRUFBd0NRLGdCQUF4QyxFQUZFO0FBSWxCOzs7RUFOd0JqQixXOztBQVU3Qjs7Ozs7O0FBSU8sSUFBTUksb0JBQU0sU0FBTkEsR0FBTTtBQUFBLFNBQUs7QUFBQSxXQUFLLGtCQUFNYyxDQUFOLEVBQ3hCQyxNQUR3QixDQUNqQmQsSUFEaUIsRUFDWDtBQUFBLFVBQUdGLElBQUgsUUFBR0EsSUFBSDtBQUFBLGFBQWNlLEVBQUVFLElBQUYsQ0FBTyxFQUFFakIsTUFBTSxtQkFBUWtCLENBQVIsRUFBV2xCLElBQVgsQ0FBUixFQUFQLENBQWQ7QUFBQSxLQURXLEVBRXhCZ0IsTUFGd0IsQ0FFakJSLEtBRmlCLEVBRVY7QUFBQSxhQUFLTyxDQUFMO0FBQUEsS0FGVSxFQUd4QkMsTUFId0IsQ0FHakJuQixXQUhpQixFQUdKO0FBQUEsVUFBR0csSUFBSCxTQUFHQSxJQUFIO0FBQUEsYUFBY2UsRUFBRUUsSUFBRixDQUFPLEVBQUVqQixNQUFNa0IsRUFBRWxCLElBQUYsQ0FBUixFQUFQLENBQWQ7QUFBQSxLQUhJLEVBSXhCbUIsR0FKd0IsRUFBTDtBQUFBLEdBQUw7QUFBQSxDQUFaOztBQU1QOzs7O0FBSU8sSUFBTUMsc0JBQU8sU0FBUEEsSUFBTztBQUFBLFNBQU0saUJBQU0sSUFBSWxCLElBQUosQ0FBUyxFQUFFRixNQUFNTCxFQUFSLEVBQVQsQ0FBTixDQUFOO0FBQUEsQ0FBYjs7QUFFUDs7Ozs7QUFLTyxJQUFNMEIsMEJBQVMsU0FBVEEsTUFBUyxDQUFDaEIsTUFBRCxFQUFTRSxRQUFUO0FBQUEsU0FBc0IsaUJBQU0sSUFBSUgsTUFBSixDQUFXLEVBQUVDLGNBQUYsRUFBVUUsa0JBQVYsRUFBWCxDQUFOLENBQXRCO0FBQUEsQ0FBZjs7QUFFUDs7OztBQUlPLElBQU1lLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxTQUFTLGlCQUFNLElBQUlkLEtBQUosQ0FBVSxFQUFFQyxZQUFGLEVBQVYsQ0FBTixDQUFUO0FBQUEsQ0FBZDs7QUFFUDs7OztBQUlPLElBQU1jLDRCQUFVLFNBQVZBLE9BQVUsQ0FBQ1gsRUFBRCxFQUFLQyxJQUFMLEVBQVdDLE9BQVg7QUFBQSxTQUF1QixpQkFBTSxJQUFJSCxPQUFKLENBQVksRUFBRUMsTUFBRixFQUFNQyxVQUFOLEVBQVlDLGdCQUFaLEVBQVosQ0FBTixDQUF2QjtBQUFBLENBQWhCOztBQUVQOzs7O0FBSU8sSUFBTVUsNEJBQVUsU0FBVkEsT0FBVSxDQUFDQyxTQUFELEVBQVlDLEtBQVo7QUFBQSxTQUFzQixpQkFBTSxJQUFJQyxPQUFKLENBQVksRUFBRUYsb0JBQUYsRUFBYUMsWUFBYixFQUFaLENBQU4sQ0FBdEI7QUFBQSxDQUFoQjs7QUFFUDs7OztBQUlPLElBQU1FLDBCQUFTLFNBQVRBLE1BQVM7QUFBQSxTQUFTLGlCQUFNLElBQUlDLE1BQUosQ0FBVyxFQUFFQyxZQUFGLEVBQVgsQ0FBTixDQUFUO0FBQUEsQ0FBZiIsImZpbGUiOiJJbnN0cnVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUsIGFueSB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vZnBsL2RhdGEvVHlwZSc7XG5pbXBvcnQgeyBtZXJnZSwgY29tcG9zZSB9IGZyb20gJy4vZnBsL3V0aWwnO1xuaW1wb3J0IHsgbWF0Y2ggfSBmcm9tICcuL2ZwbC9jb250cm9sL01hdGNoJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnLi9BY3Rvcic7XG5pbXBvcnQgeyBsaWZ0RiB9IGZyb20gJy4vZnBsL21vbmFkL0ZyZWUnO1xuXG5jb25zdCBpZCA9IHggPT4geDtcblxuLyoqXG4gKiBJbnN0cnVjdGlvblxuICogQHByb3BlcnR5IHtGcmVlPEY8Kj4sQT4gfCAqIOKGkiAgRnJlZTxGPCo+LCBBPn0gbmV4dFxuICovXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb24gZXh0ZW5kcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjaGVja3MpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgbWVyZ2UoeyBuZXh0OiBhbnkgfSwgY2hlY2tzKSk7XG4gICAgICAgIHRoaXMubWFwID0gbWFwKHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU2VsZlxuICovXG5leHBvcnQgY2xhc3MgU2VsZiBleHRlbmRzIEluc3RydWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgbmV4dDogdHlwZShGdW5jdGlvbikgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDcmVhdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXJlbnRcbiAqIEBwcm9wZXJ0eSB7VGVtcGxhdGV9IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBDcmVhdGUgZXh0ZW5kcyBJbnN0cnVjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IHBhcmVudDogdHlwZShTdHJpbmcpLCB0ZW1wbGF0ZTogKHR5cGUoVGVtcGxhdGUpKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFJhaXNlXG4gKiBAcHJvcGVydHkge0Vycm9yfSBlcnJvclxuICovXG5leHBvcnQgY2xhc3MgUmFpc2UgZXh0ZW5kcyBJbnN0cnVjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGVycm9yOiB0eXBlKEVycm9yKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIERlbGl2ZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGZyb21cbiAqIEBwcm9lcHJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgRGVsaXZlciBleHRlbmRzIEluc3RydWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgdG86IHR5cGUoU3RyaW5nKSwgZnJvbTogdHlwZShTdHJpbmcpLCBtZXNzYWdlOiBhbnkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBtYXBcbiAqIEBzdW1tYXJ5IG1hcCA6OiBJbnN0cnVjdGlvbjxBPiDihpIgIChBIOKGkiAgQikg4oaSICBJbnN0cnVjdGlvbjxCPlxuICovXG5leHBvcnQgY29uc3QgbWFwID0gaSA9PiBmID0+IG1hdGNoKGkpXG4gICAgLmNhc2VPZihTZWxmLCAoeyBuZXh0IH0pID0+IGkuY29weSh7IG5leHQ6IGNvbXBvc2UoZiwgbmV4dCkgfSkpXG4gICAgLmNhc2VPZihSYWlzZSwgaSA9PiBpKVxuICAgIC5jYXNlT2YoSW5zdHJ1Y3Rpb24sICh7IG5leHQgfSkgPT4gaS5jb3B5KHsgbmV4dDogZihuZXh0KSB9KSlcbiAgICAuZW5kKCk7XG5cbi8qKlxuICogc2VsZiBwcm92aWRlcyB0aGUgYWN0b3IgZnJvbSB0aGUgY29udGV4dFxuICogQHN1bW1hcnkge3NlbGYgOjogKCkg4oaSICBGcmVlPEY8Kj4sIEFjdG9yTD5cbiAqL1xuZXhwb3J0IGNvbnN0IHNlbGYgPSAoKSA9PiBsaWZ0RihuZXcgU2VsZih7IG5leHQ6IGlkIH0pKTtcblxuLyoqXG4gKiBjcmVhdGUgYW4gYWN0b3IsIHRoYXQncyBpdCBkb2VzIG5vdCBhZGQgaXQgdG8gdGhlIHN5c3RlbSBvclxuICogYW55dGhpbmcgZWxzZS5cbiAqIEBzdW1tYXJ5IGNyZWF0ZSA6OiAoc3RyaW5nLCBUZW1wbGF0ZSkgIOKGkiAgRnJlZTxGPCo+LCBBY3Rvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IChwYXJlbnQsIHRlbXBsYXRlKSA9PiBsaWZ0RihuZXcgQ3JlYXRlKHsgcGFyZW50LCB0ZW1wbGF0ZSB9KSk7XG5cbi8qKlxuICogcmFpc2UgYW4gZXJyb3Igd2l0aGluIHRoZSBzeXN0ZW0uXG4gKiBAc3VtbWFyeSByYWlzZSA6OiBFcnJvciDihpIgIEZyZWU8bnVsbCxFcnJvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IHJhaXNlID0gZXJyb3IgPT4gbGlmdEYobmV3IFJhaXNlKHsgZXJyb3IgfSkpO1xuXG4vKipcbiAqIGRlbGl2ZXIgYSBtZXNzYWdlIHRvIGFub3RoZXIgYWN0b3JcbiAqIEBzdW1tYXJ5IGRlbGl2ZXIgOjogKHN0cmluZywgc3RyaW5nLCAqKSDihpIgIEZyZWU8RixudWxsPlxuICovXG5leHBvcnQgY29uc3QgZGVsaXZlciA9ICh0bywgZnJvbSwgbWVzc2FnZSkgPT4gbGlmdEYobmV3IERlbGl2ZXIoeyB0bywgZnJvbSwgbWVzc2FnZSB9KSk7XG5cbi8qKlxuICogZGVxdWV1ZSBhIG1lc3NhZ2UgZnJvbSBhbiBhY3RvcidzIG1haWxib3hcbiAqIEBzdW1tYXJ5IGRlcXVldWUgOjogKCog4oaSICBGcmVlPEYsKj4sICBhKSDihpIgIEZyZWU8RixGPlxuICovXG5leHBvcnQgY29uc3QgZGVxdWV1ZSA9IChiZWhhdmlvdXIsIGFjdG9yKSA9PiBsaWZ0RihuZXcgRGVxdWV1ZSh7IGJlaGF2aW91ciwgYWN0b3IgfSkpO1xuXG4vKipcbiAqIGJlY29tZVxuICogQHN1bW1hcnkgYmVjb21lIDo6IEZyZWU8QXhpb20sKj4g4oaSICBGcmVlPEYsKj5cbiAqL1xuZXhwb3J0IGNvbnN0IGJlY29tZSA9IGF4aW9tID0+IGxpZnRGKG5ldyBCZWNvbWUoeyBheGlvbSB9KSk7XG4iXX0=