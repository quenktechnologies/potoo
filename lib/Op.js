'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noopF = exports.noop = exports.ioopF = exports.ioop = exports.dropF = exports.drop = exports.replaceF = exports.replace = exports.receiveF = exports.receive = exports.stopF = exports.stop = exports.sendF = exports.send = exports.spawnF = exports.spawn = exports.Drop = exports.NOOP = exports.IOOP = exports.Replace = exports.Receive = exports.Stop = exports.Send = exports.Spawn = exports.Op = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require('uuid');

var _util = require('./util');

var _be = require('./be');

var _monad = require('./monad');

var _Type2 = require('./Type');

var _Actor = require('./Actor');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module Ops
 *
 * Provides classes that represent instructions the system must carry out
 * and constructor functions.
 */

/**
 * Op is the base class of all instruction classes.
 * @abstract
 */
var Op = exports.Op = function (_Type) {
  _inherits(Op, _Type);

  function Op(props, checks) {
    _classCallCheck(this, Op);

    return _possibleConstructorReturn(this, (Op.__proto__ || Object.getPrototypeOf(Op)).call(this, props, (0, _util.merge)({ next: _be.any }, checks)));
  }

  _createClass(Op, [{
    key: 'map',
    value: function map(f) {

      return this.copy({ next: f(this.next) });
    }
  }]);

  return Op;
}(_Type2.Type);

/**
 * Spawn a new child actor.
 */


var Spawn = exports.Spawn = function (_Op) {
  _inherits(Spawn, _Op);

  function Spawn(props) {
    _classCallCheck(this, Spawn);

    return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).call(this, props, {
      id: (0, _be.or)((0, _be.type)(String), (0, _be.call)(_uuid.v4)),
      template: (0, _be.type)(_Actor.ActorT),
      next: _be.any
    }));
  }

  return Spawn;
}(Op);

/**
 * Send a message to an actor.
 * @property {to} string
 * @property {*} message
 */


var Send = exports.Send = function (_Op2) {
  _inherits(Send, _Op2);

  function Send(props) {
    _classCallCheck(this, Send);

    return _possibleConstructorReturn(this, (Send.__proto__ || Object.getPrototypeOf(Send)).call(this, props, {
      id: (0, _be.or)((0, _be.type)(String), (0, _be.call)(_uuid.v4)),
      to: (0, _be.type)(String),
      message: _be.any
    }));
  }

  return Send;
}(Op);

/**
 * Stop the system or an actor.
 * @property {string}
 */


var Stop = exports.Stop = function (_Op3) {
  _inherits(Stop, _Op3);

  function Stop(props) {
    _classCallCheck(this, Stop);

    return _possibleConstructorReturn(this, (Stop.__proto__ || Object.getPrototypeOf(Stop)).call(this, props, {

      path: (0, _be.type)(String),
      next: _be.any

    }));
  }

  return Stop;
}(Op);

/**
 * Receive represents a request to receive the earliest message
 */


var Receive = exports.Receive = function (_Op4) {
  _inherits(Receive, _Op4);

  function Receive(props) {
    _classCallCheck(this, Receive);

    return _possibleConstructorReturn(this, (Receive.__proto__ || Object.getPrototypeOf(Receive)).call(this, props, {

      id: (0, _be.or)((0, _be.type)(String), (0, _be.call)(_uuid.v4)),
      behaviour: (0, _be.type)(Function),
      next: _be.any

    }));
  }

  return Receive;
}(Op);

/**
 * Replace
 * @private
 */


var Replace = exports.Replace = function (_Op5) {
  _inherits(Replace, _Op5);

  function Replace(props) {
    _classCallCheck(this, Replace);

    return _possibleConstructorReturn(this, (Replace.__proto__ || Object.getPrototypeOf(Replace)).call(this, props, {

      id: (0, _be.call)(_uuid.v4),
      actor: (0, _be.type)(_Actor.Actor)

    }));
  }

  return Replace;
}(Op);

/**
 * IOOP
 * @property {function} io
 */


var IOOP = exports.IOOP = function (_Op6) {
  _inherits(IOOP, _Op6);

  function IOOP(props) {
    _classCallCheck(this, IOOP);

    return _possibleConstructorReturn(this, (IOOP.__proto__ || Object.getPrototypeOf(IOOP)).call(this, props, { f: (0, _be.type)(Function) }));
  }

  return IOOP;
}(Op);

/**
 * NOOP
 * @private
 */


var NOOP = exports.NOOP = function (_Op7) {
  _inherits(NOOP, _Op7);

  function NOOP() {
    _classCallCheck(this, NOOP);

    return _possibleConstructorReturn(this, (NOOP.__proto__ || Object.getPrototypeOf(NOOP)).apply(this, arguments));
  }

  return NOOP;
}(Op);

/**
 * Drop represents a request to drop a message.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */


var Drop = exports.Drop = function (_Op8) {
  _inherits(Drop, _Op8);

  function Drop(props) {
    _classCallCheck(this, Drop);

    return _possibleConstructorReturn(this, (Drop.__proto__ || Object.getPrototypeOf(Drop)).call(this, props, {

      to: (0, _be.type)(String),
      from: (0, _be.type)(String),
      message: _be.any

    }));
  }

  return Drop;
}(Op);

/**
 * spawn creates a new spawn request
 * @param {ActorT} template
 * @return {Free}
 * @summary {ActorT →  Free<Functor, Spawn>}
 */


var spawn = exports.spawn = function spawn(template) {
  return new Spawn({ template: template });
};

/**
 * spawnF
 * @summary {ActorT →  Free<F,O>}
 */
var spawnF = exports.spawnF = function spawnF(t) {
  return _monad.Free.liftF(spawn(t));
};

/**
 * send creates a Send
 * @summary {(string, string,  *) →  Free<Send, null> }
 */
var send = exports.send = function send(to, message) {
  return new Send({ to: to, message: message });
};

/**
 * sendF
 * @summary {(string, string,  *) →  Free<F,O>}
 */
var sendF = exports.sendF = function sendF(t, m) {
  return _monad.Free.liftF(send(t, m));
};

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
var stop = exports.stop = function stop(path) {
  return new Stop({ path: path });
};

/**
 * stopF
 * @summary {string →  Free<F,O>
 */
var stopF = exports.stopF = function stopF(p) {
  return _monad.Free.liftF(stop(p));
};

/**
 * receive creates a new receive request.
 * @param {function} behaviour
 * @summary { (* →  Free<Functor, Op>) →  Receive }
 */
var receive = exports.receive = function receive(behaviour) {
  return new Receive({ behaviour: behaviour });
};

/**
 * receiveF
 * @summary {Behaviour →  Free<F,O>}
 */
var receiveF = exports.receiveF = function receiveF(b) {
  return _monad.Free.liftF(receive(b));
};

/**
 * replace
 * @summary {Actor →  Replace}
 */
var replace = exports.replace = function replace(actor) {
  return new Replace({ actor: actor });
};

/**
 * replaceF
 * @summary {Actor →  Free<Replace, null>}
 */
var replaceF = exports.replaceF = function replaceF(a) {
  return _monad.Free.liftF(replace(a));
};

/**
 * drop
 * @param {string} to
 * @param {*} message
 * @summary {(string, string, *) →  Drop}
 */
var drop = exports.drop = function drop(to, from, message) {
  return new Drop({ to: to, from: from, message: message });
};

/**
 * dropF
 * @summary {(string, *) →  Free<F,O>}
 */
var dropF = exports.dropF = function dropF(t, m) {
  return _monad.Free.liftF(drop(t, m));
};

/**
 * ioop
 * @param {function} f
 * @summary {(System →  IO<System>) →  IOOP
 */
var ioop = exports.ioop = function ioop(f) {
  return new IOOP({ f: f });
};

/**
 * ioopF
 * @param {function} f
 * @summary {(System →  IO<System>) →  Free<F,O>}
 */
var ioopF = exports.ioopF = function ioopF(f) {
  return _monad.Free.liftF(ioop(f));
};

var _noop = new NOOP();

/**
 * noop
 * @private
 */
var noop = exports.noop = function noop() {
  return _noop;
};

/**
 * noopF
 * @summary {() →  Free<F,O>
 */
var noopF = exports.noopF = function noopF() {
  return _monad.Free.liftF(noop());
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PcC5qcyJdLCJuYW1lcyI6WyJPcCIsInByb3BzIiwiY2hlY2tzIiwibmV4dCIsImYiLCJjb3B5IiwiU3Bhd24iLCJpZCIsIlN0cmluZyIsInRlbXBsYXRlIiwiU2VuZCIsInRvIiwibWVzc2FnZSIsIlN0b3AiLCJwYXRoIiwiUmVjZWl2ZSIsImJlaGF2aW91ciIsIkZ1bmN0aW9uIiwiUmVwbGFjZSIsImFjdG9yIiwiSU9PUCIsIk5PT1AiLCJEcm9wIiwiZnJvbSIsInNwYXduIiwic3Bhd25GIiwibGlmdEYiLCJ0Iiwic2VuZCIsInNlbmRGIiwibSIsInN0b3AiLCJzdG9wRiIsInAiLCJyZWNlaXZlIiwicmVjZWl2ZUYiLCJiIiwicmVwbGFjZSIsInJlcGxhY2VGIiwiYSIsImRyb3AiLCJkcm9wRiIsImlvb3AiLCJpb29wRiIsIl9ub29wIiwibm9vcCIsIm5vb3BGIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7OztBQU9BOzs7O0lBSWFBLEUsV0FBQUEsRTs7O0FBRVQsY0FBWUMsS0FBWixFQUFtQkMsTUFBbkIsRUFBMkI7QUFBQTs7QUFBQSxtR0FFakJELEtBRmlCLEVBRVYsaUJBQU0sRUFBRUUsYUFBRixFQUFOLEVBQXFCRCxNQUFyQixDQUZVO0FBSTFCOzs7O3dCQUVHRSxDLEVBQUc7O0FBRUgsYUFBTyxLQUFLQyxJQUFMLENBQVUsRUFBRUYsTUFBTUMsRUFBRSxLQUFLRCxJQUFQLENBQVIsRUFBVixDQUFQO0FBRUg7Ozs7OztBQUlMOzs7OztJQUdhRyxLLFdBQUFBLEs7OztBQUVULGlCQUFZTCxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUdBRVRBLEtBRlMsRUFFRjtBQUNUTSxVQUFJLFlBQUcsY0FBS0MsTUFBTCxDQUFILEVBQWlCLHVCQUFqQixDQURLO0FBRVRDLGdCQUFVLDRCQUZEO0FBR1ROO0FBSFMsS0FGRTtBQVFsQjs7O0VBVnNCSCxFOztBQWEz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bUIsTUFBWCxDQUFOO0FBQUEsQ0FBZCIsImZpbGUiOiJPcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB0eXBlLCBhbnksIGNhbGwsIG9yIH0gZnJvbSAnLi9iZSc7XG5pbXBvcnQgeyBGcmVlIH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBUeXBlIH0gZnJvbSAnLi9UeXBlJztcbmltcG9ydCB7IEFjdG9yLCBBY3RvclQsIE1WYXIgfSBmcm9tICcuL0FjdG9yJztcblxuLyoqXG4gKiBAbW9kdWxlIE9wc1xuICpcbiAqIFByb3ZpZGVzIGNsYXNzZXMgdGhhdCByZXByZXNlbnQgaW5zdHJ1Y3Rpb25zIHRoZSBzeXN0ZW0gbXVzdCBjYXJyeSBvdXRcbiAqIGFuZCBjb25zdHJ1Y3RvciBmdW5jdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBPcCBpcyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgaW5zdHJ1Y3Rpb24gY2xhc3Nlcy5cbiAqIEBhYnN0cmFjdFxuICovXG5leHBvcnQgY2xhc3MgT3AgZXh0ZW5kcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjaGVja3MpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgbWVyZ2UoeyBuZXh0OiBhbnkgfSwgY2hlY2tzKSk7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoeyBuZXh0OiBmKHRoaXMubmV4dCkgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTcGF3biBhIG5ldyBjaGlsZCBhY3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwYXduIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgaWQ6IG9yKHR5cGUoU3RyaW5nKSwgY2FsbCh2NCkpLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHR5cGUoQWN0b3JUKSxcbiAgICAgICAgICAgIG5leHQ6IGFueVxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSB0byBhbiBhY3Rvci5cbiAqIEBwcm9wZXJ0eSB7dG99IHN0cmluZ1xuICogQHByb3BlcnR5IHsqfSBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBTZW5kIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgaWQ6IG9yKHR5cGUoU3RyaW5nKSwgY2FsbCh2NCkpLFxuICAgICAgICAgICAgdG86IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFueVxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuLyoqXG4gKiBTdG9wIHRoZSBzeXN0ZW0gb3IgYW4gYWN0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG5leHQ6IGFueVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogUmVjZWl2ZSByZXByZXNlbnRzIGEgcmVxdWVzdCB0byByZWNlaXZlIHRoZSBlYXJsaWVzdCBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNlaXZlIGV4dGVuZHMgT3Age1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBpZDogb3IodHlwZShTdHJpbmcpLCBjYWxsKHY0KSksXG4gICAgICAgICAgICBiZWhhdmlvdXI6IHR5cGUoRnVuY3Rpb24pLFxuICAgICAgICAgICAgbmV4dDogYW55XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSZXBsYWNlXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgUmVwbGFjZSBleHRlbmRzIE9wIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgaWQ6IGNhbGwodjQpLFxuICAgICAgICAgICAgYWN0b3I6IHR5cGUoQWN0b3IpLFxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogSU9PUFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gaW9cbiAqL1xuZXhwb3J0IGNsYXNzIElPT1AgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGY6IHR5cGUoRnVuY3Rpb24pIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogTk9PUFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE5PT1AgZXh0ZW5kcyBPcCB7fVxuXG4vKipcbiAqIERyb3AgcmVwcmVzZW50cyBhIHJlcXVlc3QgdG8gZHJvcCBhIG1lc3NhZ2UuXG4gKiBAcHJvcGVydHkge3RvfSBzdHJpbmdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBmcm9tXG4gKiBAcHJvcGVydHkgeyp9IG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGNsYXNzIERyb3AgZXh0ZW5kcyBPcCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIHRvOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBmcm9tOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBtZXNzYWdlOiBhbnlcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIHNwYXduIGNyZWF0ZXMgYSBuZXcgc3Bhd24gcmVxdWVzdFxuICogQHBhcmFtIHtBY3RvclR9IHRlbXBsYXRlXG4gKiBAcmV0dXJuIHtGcmVlfVxuICogQHN1bW1hcnkge0FjdG9yVCDihpIgIEZyZWU8RnVuY3RvciwgU3Bhd24+fVxuICovXG5leHBvcnQgY29uc3Qgc3Bhd24gPSB0ZW1wbGF0ZSA9PiBuZXcgU3Bhd24oeyB0ZW1wbGF0ZSB9KTtcblxuLyoqXG4gKiBzcGF3bkZcbiAqIEBzdW1tYXJ5IHtBY3RvclQg4oaSICBGcmVlPEYsTz59XG4gKi9cbmV4cG9ydCBjb25zdCBzcGF3bkYgPSB0ID0+IEZyZWUubGlmdEYoc3Bhd24odCkpO1xuXG4vKipcbiAqIHNlbmQgY3JlYXRlcyBhIFNlbmRcbiAqIEBzdW1tYXJ5IHsoc3RyaW5nLCBzdHJpbmcsICAqKSDihpIgIEZyZWU8U2VuZCwgbnVsbD4gfVxuICovXG5leHBvcnQgY29uc3Qgc2VuZCA9ICh0bywgbWVzc2FnZSkgPT4gbmV3IFNlbmQoeyB0bywgbWVzc2FnZSB9KTtcblxuLyoqXG4gKiBzZW5kRlxuICogQHN1bW1hcnkgeyhzdHJpbmcsIHN0cmluZywgICopIOKGkiAgRnJlZTxGLE8+fVxuICovXG5leHBvcnQgY29uc3Qgc2VuZEYgPSAodCwgbSkgPT4gRnJlZS5saWZ0RihzZW5kKHQsIG0pKTtcblxuLyoqXG4gKiBzdG9wIGNyZWF0ZXMgYSBuZXcgU3RvcCByZXF1ZXN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqL1xuZXhwb3J0IGNvbnN0IHN0b3AgPSBwYXRoID0+IG5ldyBTdG9wKHsgcGF0aCB9KTtcblxuLyoqXG4gKiBzdG9wRlxuICogQHN1bW1hcnkge3N0cmluZyDihpIgIEZyZWU8RixPPlxuICovXG5leHBvcnQgY29uc3Qgc3RvcEYgPSBwID0+IEZyZWUubGlmdEYoc3RvcChwKSk7XG5cbi8qKlxuICogcmVjZWl2ZSBjcmVhdGVzIGEgbmV3IHJlY2VpdmUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGJlaGF2aW91clxuICogQHN1bW1hcnkgeyAoKiDihpIgIEZyZWU8RnVuY3RvciwgT3A+KSDihpIgIFJlY2VpdmUgfVxuICovXG5leHBvcnQgY29uc3QgcmVjZWl2ZSA9IGJlaGF2aW91ciA9PiBuZXcgUmVjZWl2ZSh7IGJlaGF2aW91ciB9KTtcblxuLyoqXG4gKiByZWNlaXZlRlxuICogQHN1bW1hcnkge0JlaGF2aW91ciDihpIgIEZyZWU8RixPPn1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlY2VpdmVGID0gYiA9PiBGcmVlLmxpZnRGKHJlY2VpdmUoYikpO1xuXG4vKipcbiAqIHJlcGxhY2VcbiAqIEBzdW1tYXJ5IHtBY3RvciDihpIgIFJlcGxhY2V9XG4gKi9cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gYWN0b3IgPT4gbmV3IFJlcGxhY2UoeyBhY3RvciB9KTtcblxuLyoqXG4gKiByZXBsYWNlRlxuICogQHN1bW1hcnkge0FjdG9yIOKGkiAgRnJlZTxSZXBsYWNlLCBudWxsPn1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlcGxhY2VGID0gYSA9PiBGcmVlLmxpZnRGKHJlcGxhY2UoYSkpO1xuXG4vKipcbiAqIGRyb3BcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b1xuICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gKiBAc3VtbWFyeSB7KHN0cmluZywgc3RyaW5nLCAqKSDihpIgIERyb3B9XG4gKi9cbmV4cG9ydCBjb25zdCBkcm9wID0gKHRvLCBmcm9tLCBtZXNzYWdlKSA9PiBuZXcgRHJvcCh7IHRvLCBmcm9tLCBtZXNzYWdlIH0pO1xuXG4vKipcbiAqIGRyb3BGXG4gKiBAc3VtbWFyeSB7KHN0cmluZywgKikg4oaSICBGcmVlPEYsTz59XG4gKi9cbmV4cG9ydCBjb25zdCBkcm9wRiA9ICh0LCBtKSA9PiBGcmVlLmxpZnRGKGRyb3AodCwgbSkpO1xuXG4vKipcbiAqIGlvb3BcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqIEBzdW1tYXJ5IHsoU3lzdGVtIOKGkiAgSU88U3lzdGVtPikg4oaSICBJT09QXG4gKi9cbmV4cG9ydCBjb25zdCBpb29wID0gZiA9PiBuZXcgSU9PUCh7IGYgfSk7XG5cbi8qKlxuICogaW9vcEZcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqIEBzdW1tYXJ5IHsoU3lzdGVtIOKGkiAgSU88U3lzdGVtPikg4oaSICBGcmVlPEYsTz59XG4gKi9cbmV4cG9ydCBjb25zdCBpb29wRiA9IGYgPT4gRnJlZS5saWZ0Rihpb29wKGYpKTtcblxuY29uc3QgX25vb3AgPSBuZXcgTk9PUCgpO1xuXG4vKipcbiAqIG5vb3BcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBub29wID0gKCkgPT4gX25vb3A7XG5cbi8qKlxuICogbm9vcEZcbiAqIEBzdW1tYXJ5IHsoKSDihpIgIEZyZWU8RixPPlxuICovXG5leHBvcnQgY29uc3Qgbm9vcEYgPSAoKSA9PiBGcmVlLmxpZnRGKG5vb3AoKSk7XG4iXX0=