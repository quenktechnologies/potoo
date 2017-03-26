'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.execAxiomWithAuditing = exports.auditAxiom = exports.execAxiom = exports.receive = exports.spawn = exports.tell = exports.map = exports.Receive = exports.Tell = exports.Spawn = exports.Axiom = undefined;

var _be = require('./be');

var _Type2 = require('./fpl/data/Type');

var _Actor = require('./Actor');

var _Match = require('./fpl/control/Match');

var _util = require('./fpl/util');

var _Free = require('./fpl/monad/Free');

var _CoProduct = require('./fpl/data/CoProduct');

var _Instruction = require('./Instruction');

var _Log = require('./Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Axiom represents a member of the userland DSL.
 *
 * Typically corresponds to one of the actor model axioms.
 * @abstract
 */
var Axiom = exports.Axiom = function (_Type) {
    _inherits(Axiom, _Type);

    function Axiom(props, checks) {
        _classCallCheck(this, Axiom);

        var _this = _possibleConstructorReturn(this, (Axiom.__proto__ || Object.getPrototypeOf(Axiom)).call(this, props, (0, _util.merge)(checks, { next: _be.any })));

        _this.map = map(_this);

        return _this;
    }

    return Axiom;
}(_Type2.Type);

/**
 * Spawn
 * @property {Actor.Template} template
 */


var Spawn = exports.Spawn = function (_Axiom) {
    _inherits(Spawn, _Axiom);

    function Spawn(props) {
        _classCallCheck(this, Spawn);

        return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).call(this, props, { template: (0, _be.type)(_Actor.Template), next: _be.any }));
    }

    return Spawn;
}(Axiom);

/**
 * Tell
 */


var Tell = exports.Tell = function (_Axiom2) {
    _inherits(Tell, _Axiom2);

    function Tell(props) {
        _classCallCheck(this, Tell);

        return _possibleConstructorReturn(this, (Tell.__proto__ || Object.getPrototypeOf(Tell)).call(this, props, { to: (0, _be.type)(String), message: _be.any }));
    }

    return Tell;
}(Axiom);

/**
 * Receive
 */


var Receive = exports.Receive = function (_Axiom3) {
    _inherits(Receive, _Axiom3);

    function Receive(props) {
        _classCallCheck(this, Receive);

        return _possibleConstructorReturn(this, (Receive.__proto__ || Object.getPrototypeOf(Receive)).call(this, props, { behaviour: (0, _be.type)(Function) }));
    }

    return Receive;
}(Axiom);

/**
 * map
 * @summary map :: Axiom →  (* →  *) →  Axiom
 */


var map = exports.map = function map(ax) {
    return function (f) {
        return (0, _Match.match)(ax).caseOf(Receive, function (r) {
            return r;
        }).caseOf(Axiom, function (_ref) {
            var next = _ref.next;
            return ax.copy({ next: f(next) });
        }).end();
    };
};

/* User apis */

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
var tell = exports.tell = function tell(to, message) {
    return (0, _Free.liftF)(new Tell({ to: to, message: message }));
};

/**
 * spawn a new actor
 * @summary {Template →  Free<F, *>}
 */
var spawn = exports.spawn = function spawn(template) {
    return (0, _Free.liftF)(new Spawn({ template: template }));
};

/**
 * receive the next message with the passed behaviour
 * @summary receive :: (* → Free<F,*>) →  Free<_,null>
 */
var receive = exports.receive = function receive(behaviour) {
    return (0, _Free.liftF)(new Receive({ behaviour: behaviour }));
};

/**
 * execAxiom expands a user api to the primitive DSL.
 * @summary execAxiom :: Axiom →  Free<Instruction, A>
 */
var execAxiom = exports.execAxiom = function execAxiom(ax) {
    return (0, _Match.match)(ax).caseOf(Spawn, function (_ref2) {
        var id = _ref2.template.id;
        return (0, _Instruction.self)().chain(function (a) {
            return (0, _Actor.getChild)(id, a).map(function () {
                return (0, _Instruction.raise)(new _Actor.DuplicateActorIdError(a.path, id));
            }).orJust(function () {
                return (0, _Instruction.create)(a.path, ax.template);
            }).get();
        });
    }).caseOf(Tell, function (_ref3) {
        var to = _ref3.to,
            message = _ref3.message;
        return (0, _Instruction.self)().chain(function (a) {
            return (0, _Instruction.deliver)(to, a.path, message);
        });
    }).caseOf(Receive, function (_ref4) {
        var behaviour = _ref4.behaviour;
        return (0, _Instruction.self)().chain((0, _util.partial)(_Instruction.dequeue, behaviour)).chain(_Instruction.become);
    }).end();
};

/**
 * auditAxiom
 * @summary auditAxiom :: Axiom →  Free<Log,null>
 */
var auditAxiom = exports.auditAxiom = function auditAxiom(ax) {
    return (0, _Match.match)(ax).caseOf(Spawn, function (_ref5) {
        var template = _ref5.template;
        return (0, _Log.info)('Spawn child \'' + template.id + '\'');
    }).caseOf(Tell, function (_ref6) {
        var to = _ref6.to,
            message = _ref6.message;
        return (0, _Log.info)('Tell \'' + to + '\' message ' + message);
    }).caseOf(Receive, function () {
        return (0, _Log.info)('Started receiving.');
    }).end();
};

var _audit = (0, _util.compose)(_Free.liftF, _CoProduct.left, auditAxiom);
var _exec = (0, _util.compose)(_Free.liftF, _CoProduct.right, execAxiom);

/**
 * execAxiomWithAuditing tags on a command to log the op so
 * we can keep track of what is going on at the user level.
 * @summary execAxiomWithAuditing :: Axiom →  Free<CoProduct<Log, Instruction>
 */
var execAxiomWithAuditing = exports.execAxiomWithAuditing = function execAxiomWithAuditing(ax) {
    return _audit(ax).chain(function () {
        return _exec(ax);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BeGlvbS5qcyJdLCJuYW1lcyI6WyJBeGlvbSIsInByb3BzIiwiY2hlY2tzIiwibmV4dCIsIm1hcCIsIlNwYXduIiwidGVtcGxhdGUiLCJUZWxsIiwidG8iLCJTdHJpbmciLCJtZXNzYWdlIiwiUmVjZWl2ZSIsImJlaGF2aW91ciIsIkZ1bmN0aW9uIiwiYXgiLCJjYXNlT2YiLCJyIiwiY29weSIsImYiLCJlbmQiLCJ0ZWxsIiwic3Bhd24iLCJyZWNlaXZlIiwiZXhlY0F4aW9tIiwiaWQiLCJjaGFpbiIsImEiLCJwYXRoIiwib3JKdXN0IiwiZ2V0IiwiYXVkaXRBeGlvbSIsIl9hdWRpdCIsIl9leGVjIiwiZXhlY0F4aW9tV2l0aEF1ZGl0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1hQSxLLFdBQUFBLEs7OztBQUVULG1CQUFZQyxLQUFaLEVBQW1CQyxNQUFuQixFQUEyQjtBQUFBOztBQUFBLGtIQUVqQkQsS0FGaUIsRUFFVixpQkFBTUMsTUFBTixFQUFjLEVBQUVDLGFBQUYsRUFBZCxDQUZVOztBQUl2QixjQUFLQyxHQUFMLEdBQVdBLFVBQVg7O0FBSnVCO0FBTTFCOzs7OztBQUlMOzs7Ozs7SUFJYUMsSyxXQUFBQSxLOzs7QUFFVCxtQkFBWUosS0FBWixFQUFtQjtBQUFBOztBQUFBLDZHQUVUQSxLQUZTLEVBRUYsRUFBRUssVUFBVSw4QkFBWixFQUE0QkgsYUFBNUIsRUFGRTtBQUlsQjs7O0VBTnNCSCxLOztBQVUzQjs7Ozs7SUFHYU8sSSxXQUFBQSxJOzs7QUFFVCxrQkFBWU4sS0FBWixFQUFtQjtBQUFBOztBQUFBLDJHQUVUQSxLQUZTLEVBRUYsRUFBRU8sSUFBSSxjQUFLQyxNQUFMLENBQU4sRUFBb0JDLGdCQUFwQixFQUZFO0FBSWxCOzs7RUFOcUJWLEs7O0FBVTFCOzs7OztJQUdhVyxPLFdBQUFBLE87OztB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QkUsT0FBN0IsQ0FEVTtBQUFBLEtBSGMsRUFLM0JLLE1BTDJCLENBS3BCSixPQUxvQixFQUtYO0FBQUEsZUFDYixvQ0FEYTtBQUFBLEtBTFcsRUFPM0JRLEdBUDJCLEVBQU47QUFBQSxDQUFuQjs7QUFTUCxJQUFNWSxTQUFTLGlEQUFxQkQsVUFBckIsQ0FBZjtBQUNBLElBQU1FLFFBQVEsa0RBQXNCVCxTQUF0QixDQUFkOztBQUVBOzs7OztBQUtPLElBQU1VLHdEQUF3QixTQUF4QkEscUJBQXdCO0FBQUEsV0FBTUYsT0FBT2pCLEVBQVAsRUFBV1csS0FBWCxDQUFpQjtBQUFBLGVBQU1PLE1BQU1sQixFQUFOLENBQU47QUFBQSxLQUFqQixDQUFOO0FBQUEsQ0FBOUIiLCJmaWxlIjoiQXhpb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlLCBhbnkgfSBmcm9tICcuL2JlJztcbmltcG9ydCB7IFR5cGUgfSBmcm9tICcuL2ZwbC9kYXRhL1R5cGUnO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICcuL0FjdG9yJztcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi9mcGwvY29udHJvbC9NYXRjaCc7XG5pbXBvcnQgeyBtZXJnZSwgcGFydGlhbCwgY29tcG9zZSB9IGZyb20gJy4vZnBsL3V0aWwnO1xuaW1wb3J0IHsgbGlmdEYgfSBmcm9tICcuL2ZwbC9tb25hZC9GcmVlJztcbmltcG9ydCB7IGxlZnQsIHJpZ2h0IH0gZnJvbSAnLi9mcGwvZGF0YS9Db1Byb2R1Y3QnO1xuaW1wb3J0IHsgZ2V0Q2hpbGQsIER1cGxpY2F0ZUFjdG9ySWRFcnJvciB9IGZyb20gJy4vQWN0b3InO1xuaW1wb3J0IHsgc2VsZiwgY3JlYXRlLCByYWlzZSwgZGVsaXZlciwgZGVxdWV1ZSwgYmVjb21lIH0gZnJvbSAnLi9JbnN0cnVjdGlvbic7XG5pbXBvcnQgeyBpbmZvIH0gZnJvbSAnLi9Mb2cnO1xuXG4vKipcbiAqIEF4aW9tIHJlcHJlc2VudHMgYSBtZW1iZXIgb2YgdGhlIHVzZXJsYW5kIERTTC5cbiAqXG4gKiBUeXBpY2FsbHkgY29ycmVzcG9uZHMgdG8gb25lIG9mIHRoZSBhY3RvciBtb2RlbCBheGlvbXMuXG4gKiBAYWJzdHJhY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEF4aW9tIGV4dGVuZHMgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY2hlY2tzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIG1lcmdlKGNoZWNrcywgeyBuZXh0OiBhbnkgfSkpO1xuXG4gICAgICAgIHRoaXMubWFwID0gbWFwKHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogU3Bhd25cbiAqIEBwcm9wZXJ0eSB7QWN0b3IuVGVtcGxhdGV9IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGF3biBleHRlbmRzIEF4aW9tIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgdGVtcGxhdGU6IHR5cGUoVGVtcGxhdGUpLCBuZXh0OiBhbnkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBUZWxsXG4gKi9cbmV4cG9ydCBjbGFzcyBUZWxsIGV4dGVuZHMgQXhpb20ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyB0bzogdHlwZShTdHJpbmcpLCBtZXNzYWdlOiBhbnkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSZWNlaXZlXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNlaXZlIGV4dGVuZHMgQXhpb20ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBiZWhhdmlvdXI6IHR5cGUoRnVuY3Rpb24pIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbWFwXG4gKiBAc3VtbWFyeSBtYXAgOjogQXhpb20g4oaSICAoKiDihpIgICopIOKGkiAgQXhpb21cbiAqL1xuZXhwb3J0IGNvbnN0IG1hcCA9IGF4ID0+IGYgPT4gbWF0Y2goYXgpXG4gICAgLmNhc2VPZihSZWNlaXZlLCByID0+IHIpXG4gICAgLmNhc2VPZihBeGlvbSwgKHsgbmV4dCB9KSA9PiBheC5jb3B5KHsgbmV4dDogZihuZXh0KSB9KSlcbiAgICAuZW5kKCk7XG5cbi8qIFVzZXIgYXBpcyAqL1xuXG4vKipcbiAqIHRlbGwgYW5vdGhlciBhY3RvciBhIG1lc3NhZ2VcbiAqIEBzdW1tYXJ5IHRlbGwgOjogKHN0cmluZywqKSDihpIgIEZyZWU8RiwgQWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCB0ZWxsID0gKHRvLCBtZXNzYWdlKSA9PiBsaWZ0RihuZXcgVGVsbCh7IHRvLCBtZXNzYWdlIH0pKTtcblxuLyoqXG4gKiBzcGF3biBhIG5ldyBhY3RvclxuICogQHN1bW1hcnkge1RlbXBsYXRlIOKGkiAgRnJlZTxGLCAqPn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNwYXduID0gdGVtcGxhdGUgPT4gbGlmdEYobmV3IFNwYXduKHsgdGVtcGxhdGUgfSkpO1xuXG4vKipcbiAqIHJlY2VpdmUgdGhlIG5leHQgbWVzc2FnZSB3aXRoIHRoZSBwYXNzZWQgYmVoYXZpb3VyXG4gKiBAc3VtbWFyeSByZWNlaXZlIDo6ICgqIOKGkiBGcmVlPEYsKj4pIOKGkiAgRnJlZTxfLG51bGw+XG4gKi9cbmV4cG9ydCBjb25zdCByZWNlaXZlID0gYmVoYXZpb3VyID0+IGxpZnRGKG5ldyBSZWNlaXZlKHsgYmVoYXZpb3VyIH0pKTtcblxuLyoqXG4gKiBleGVjQXhpb20gZXhwYW5kcyBhIHVzZXIgYXBpIHRvIHRoZSBwcmltaXRpdmUgRFNMLlxuICogQHN1bW1hcnkgZXhlY0F4aW9tIDo6IEF4aW9tIOKGkiAgRnJlZTxJbnN0cnVjdGlvbiwgQT5cbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWNBeGlvbSA9IGF4ID0+IG1hdGNoKGF4KVxuICAgIC5jYXNlT2YoU3Bhd24sICh7IHRlbXBsYXRlOiB7IGlkIH0gfSkgPT5cbiAgICAgICAgc2VsZigpXG4gICAgICAgIC5jaGFpbihhID0+XG4gICAgICAgICAgICBnZXRDaGlsZChpZCwgYSlcbiAgICAgICAgICAgIC5tYXAoKCkgPT4gcmFpc2UobmV3IER1cGxpY2F0ZUFjdG9ySWRFcnJvcihhLnBhdGgsIGlkKSkpXG4gICAgICAgICAgICAub3JKdXN0KCgpID0+IGNyZWF0ZShhLnBhdGgsIGF4LnRlbXBsYXRlKSlcbiAgICAgICAgICAgIC5nZXQoKSkpXG4gICAgLmNhc2VPZihUZWxsLCAoeyB0bywgbWVzc2FnZSB9KSA9PlxuICAgICAgICBzZWxmKClcbiAgICAgICAgLmNoYWluKGEgPT4gZGVsaXZlcih0bywgYS5wYXRoLCBtZXNzYWdlKSkpXG4gICAgLmNhc2VPZihSZWNlaXZlLCAoeyBiZWhhdmlvdXIgfSkgPT5cbiAgICAgICAgc2VsZigpXG4gICAgICAgIC5jaGFpbihwYXJ0aWFsKGRlcXVldWUsIGJlaGF2aW91cikpXG4gICAgICAgIC5jaGFpbihiZWNvbWUpKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBhdWRpdEF4aW9tXG4gKiBAc3VtbWFyeSBhdWRpdEF4aW9tIDo6IEF4aW9tIOKGkiAgRnJlZTxMb2csbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGF1ZGl0QXhpb20gPSBheCA9PiBtYXRjaChheClcbiAgICAuY2FzZU9mKFNwYXduLCAoeyB0ZW1wbGF0ZSB9KSA9PlxuICAgICAgICBpbmZvKGBTcGF3biBjaGlsZCAnJHt0ZW1wbGF0ZS5pZH0nYCkpXG4gICAgLmNhc2VPZihUZWxsLCAoeyB0bywgbWVzc2FnZSB9KSA9PlxuICAgICAgICBpbmZvKGBUZWxsICcke3RvfScgbWVzc2FnZSAke21lc3NhZ2V9YCkpXG4gICAgLmNhc2VPZihSZWNlaXZlLCAoKSA9PlxuICAgICAgICBpbmZvKGBTdGFydGVkIHJlY2VpdmluZy5gKSlcbiAgICAuZW5kKCk7XG5cbmNvbnN0IF9hdWRpdCA9IGNvbXBvc2UobGlmdEYsIGxlZnQsIGF1ZGl0QXhpb20pO1xuY29uc3QgX2V4ZWMgPSBjb21wb3NlKGxpZnRGLCByaWdodCwgZXhlY0F4aW9tKTtcblxuLyoqXG4gKiBleGVjQXhpb21XaXRoQXVkaXRpbmcgdGFncyBvbiBhIGNvbW1hbmQgdG8gbG9nIHRoZSBvcCBzb1xuICogd2UgY2FuIGtlZXAgdHJhY2sgb2Ygd2hhdCBpcyBnb2luZyBvbiBhdCB0aGUgdXNlciBsZXZlbC5cbiAqIEBzdW1tYXJ5IGV4ZWNBeGlvbVdpdGhBdWRpdGluZyA6OiBBeGlvbSDihpIgIEZyZWU8Q29Qcm9kdWN0PExvZywgSW5zdHJ1Y3Rpb24+XG4gKi9cbmV4cG9ydCBjb25zdCBleGVjQXhpb21XaXRoQXVkaXRpbmcgPSBheCA9PiBfYXVkaXQoYXgpLmNoYWluKCgpID0+IF9leGVjKGF4KSk7XG4iXX0=