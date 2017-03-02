'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ActorContext = exports.ActorL = exports.Actor = exports.LocalT = exports.ActorT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _be = require('./be');

var _Type4 = require('./Type');

var _monad = require('./monad');

var _System = require('./System');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
var ActorT = exports.ActorT = function (_Type) {
    _inherits(ActorT, _Type);

    function ActorT() {
        _classCallCheck(this, ActorT);

        return _possibleConstructorReturn(this, (ActorT.__proto__ || Object.getPrototypeOf(ActorT)).apply(this, arguments));
    }

    return ActorT;
}(_Type4.Type);

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */


var LocalT = exports.LocalT = function (_ActorT) {
    _inherits(LocalT, _ActorT);

    function LocalT(props) {
        _classCallCheck(this, LocalT);

        return _possibleConstructorReturn(this, (LocalT.__proto__ || Object.getPrototypeOf(LocalT)).call(this, props, {

            id: (0, _be.type)(String),
            start: (0, _be.type)(Function)

        }));
    }

    return LocalT;
}(ActorT);

/**
 * Actor
 */


var Actor = exports.Actor = function (_Type2) {
    _inherits(Actor, _Type2);

    function Actor() {
        _classCallCheck(this, Actor);

        return _possibleConstructorReturn(this, (Actor.__proto__ || Object.getPrototypeOf(Actor)).apply(this, arguments));
    }

    return Actor;
}(_Type4.Type);

/**
 * ActorL
 */


var ActorL = exports.ActorL = function (_Actor) {
    _inherits(ActorL, _Actor);

    function ActorL(props) {
        _classCallCheck(this, ActorL);

        return _possibleConstructorReturn(this, (ActorL.__proto__ || Object.getPrototypeOf(ActorL)).call(this, props, {

            parent: (0, _be.type)(String),
            path: (0, _be.type)(String),
            mailbox: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            template: (0, _be.type)(ActorT)

        }));
    }

    _createClass(ActorL, [{
        key: 'accept',
        value: function accept(message) {

            return (0, _Type4.copy)(this, { mailbox: this.mailbox.concat(message.message) });
        }
    }]);

    return ActorL;
}(Actor);

/**
 * ActorContext
 */


var ActorContext = exports.ActorContext = function (_Type3) {
    _inherits(ActorContext, _Type3);

    function ActorContext(props) {
        _classCallCheck(this, ActorContext);

        return _possibleConstructorReturn(this, (ActorContext.__proto__ || Object.getPrototypeOf(ActorContext)).call(this, props, {

            parent: (0, _be.type)(String),
            self: (0, _be.type)(String)

        }));
    }

    /**
     * spawn a new child actor
     * @param {ActorT} template
     * @return {Free}
     */


    _createClass(ActorContext, [{
        key: 'spawn',
        value: function spawn(template) {

            return _monad.Free.liftF(new _System.Spawn({ template: template, parent: this.self }));
        }

        /**
         * tell another actor something
         * @param {string} to
         * @param {*} message
         * @summary { (string, *) →  Free}
         */

    }, {
        key: 'tell',
        value: function tell(to, message) {

            return _monad.Free.liftF(new _System.Send({ from: this.self, to: to, message: message }));
        }

        /**
         * receive the next message, optionally filtering unwanted
         * messages.
         * @summary { (* →  Free | null ) →  Free }
         */

    }, {
        key: 'receive',
        value: function receive(behaviour) {

            return _monad.Free.liftF(new _System.Receive({ path: this.self, behaviour: behaviour }));
        }
    }]);

    return ActorContext;
}(_Type4.Type);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rvci5qcyJdLCJuYW1lcyI6WyJBY3RvclQiLCJMb2NhbFQiLCJwcm9wcyIsImlkIiwiU3RyaW5nIiwic3RhcnQiLCJGdW5jdGlvbiIsIkFjdG9yIiwiQWN0b3JMIiwicGFyZW50IiwicGF0aCIsIm1haWxib3giLCJBcnJheSIsIm9wcyIsInRlbXBsYXRlIiwibWVzc2FnZSIsImNvbmNhdCIsIkFjdG9yQ29udGV4dCIsInNlbGYiLCJsaWZ0RiIsInRvIiwiZnJvbSIsImJlaGF2aW91ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1hQSxNLFdBQUFBLE07Ozs7Ozs7Ozs7OztBQUViOzs7Ozs7O0lBS2FDLE0sV0FBQUEsTTs7O0FBRVQsb0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrR0FFVEEsS0FGUyxFQUVGOztBQUVUQyxnQkFBSSxjQUFLQyxNQUFMLENBRks7QUFHVEMsbUJBQU8sY0FBS0MsUUFBTDs7QUFIRSxTQUZFO0FBU2xCOzs7RUFYdUJOLE07O0FBZTVCOzs7OztJQUdhTyxLLFdBQUFBLEs7Ozs7Ozs7Ozs7OztBQUViOzs7OztJQUdhQyxNLFdBQUFBLE07OztBQUVULG9CQUFZTixLQUFaLEVBQW1CO0FBQUE7O0FBQUEsK0dBRVRBLEtBRlMsRUFFRjs7QUFFVE8sb0JBQVEsY0FBS0wsTUFBTCxDQUZDO0FBR1RNLGtCQUFNLGNBQUtOLE1BQUwsQ0FIRztBQUlUTyxxQkFBUyxZQUFHLGNBQUtDLEtBQUwsQ0FBSCxFQUFnQixlQUFNLEVBQU4sQ0FBaEIsQ0FKQTtBQUtUQyxpQkFBSyxZQUFHLDBCQUFILEVBQWUsZUFBTSxJQUFOLENBQWYsQ0FMSTtBQU1UQyxzQkFBVSxjQUFLZCxNQUFMOztBQU5ELFNBRkU7QUFZbEI7Ozs7K0JBRU1lLE8sRUFBUzs7QUFFWixtQkFBTyxpQkFBSyxJQUFMLEVBQVcsRUFBRUosU0FBUyxLQUFLQSxPQUFMLENBQWFLLE1BQWIsQ0FBb0JELFFBQVFBLE9BQTVCLENBQVgsRUFBWCxDQUFQO0FBRUg7Ozs7RUFwQnVCUixLOztBQXdCNUI7Ozs7O0lBR2FVLFksV0FBQUEsWTs7O0FBRVQsMEJBQVlmLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwySEFFVEEsS0FGUyxFQUVGOztBQUVUTyxvQkFBUSxjQUFLTCxNQUFMLENBRkM7QUFHVGMsa0JBQU0sY0FBS2QsTUFBTDs7QUFIRyxTQUZFO0FBU2xCOztBQUVEOzs7Ozs7Ozs7OEJBS01VLFEsRUFBVTs7QUFFWixtQkFBTyxZQUFLSyxLQUFMLENBQVcsa0JBQVUsRUFBRUwsa0JBQUYsRUFBWUwsUUFBUSxLQUFLUyxJQUF6QixFQUFWLENBQVgsQ0FBUDtBQUVIOztBQUVEOzs7Ozs7Ozs7NkJBTUtFLEUsRUFBSUwsTyxFQUFTOztBQUVkLG1CQUFPLFlBQUtJLEtBQUwsQ0FBVyxpQkFBUyxFQUFFRSxNQUFNLEtBQUtILElBQWIsRUFBbUJFLE1BQW5CLEVBQXVCTCxnQkFBdkIsRUFBVCxDQUFYLENBQVA7QUFFSDs7QUFFRDs7Ozs7Ozs7Z0NBS1FPLFMsRUFBVzs7QUFFZixtQkFBTyxZQUFLSCxLQUFMLENBQVcsb0JBQVksRUFBQ1QsTUFBSyxLQUFLUSxJQUFYLEVBQWlCSSxvQkFBakIsRUFBWixDQUFYLENBQVA7QUFFSCIsImZpbGUiOiJBY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUsIGZvcmNlLCBvciB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgVHlwZSwgY29weSB9IGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgeyBGcmVlIH0gZnJvbSAnLi9tb25hZCc7XG5pbXBvcnQgeyBTcGF3biwgU2VuZCwgUmVjZWl2ZSB9IGZyb20gJy4vU3lzdGVtJztcblxuLyoqXG4gKiBBY3RvclQgaXMgYSB0ZW1wbGF0ZSBmb3IgY3JlYXRpbmcgYWN0b3JzIHRoYXQgcnVuIGluXG4gKiB0aGUgc2FtZSBldmVudCBsb29wIGFzIHRoZSBzeXN0ZW0uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgLSBtdXN0IGJlIHVuaXF1ZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc3RhcnQgLSBBY3RvciDihpIgIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvclQgZXh0ZW5kcyBUeXBlIHt9XG5cbi8qKlxuICogTG9jYWxUIGlzIGEgdGVtcGxhdGUgZm9yIGNyZWF0aW5nIGEgbG9jYWwgYWN0b3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc3RhcnRcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsVCBleHRlbmRzIEFjdG9yVCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBzdGFydDogdHlwZShGdW5jdGlvbilcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvciBleHRlbmRzIFR5cGUge31cblxuLyoqXG4gKiBBY3RvckxcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yTCBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgcGFyZW50OiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBtYWlsYm94OiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHR5cGUoQWN0b3JUKVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgYWNjZXB0KG1lc3NhZ2UpIHtcblxuICAgICAgICByZXR1cm4gY29weSh0aGlzLCB7IG1haWxib3g6IHRoaXMubWFpbGJveC5jb25jYXQobWVzc2FnZS5tZXNzYWdlKSB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFjdG9yQ29udGV4dFxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JDb250ZXh0IGV4dGVuZHMgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIHBhcmVudDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgc2VsZjogdHlwZShTdHJpbmcpXG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzcGF3biBhIG5ldyBjaGlsZCBhY3RvclxuICAgICAqIEBwYXJhbSB7QWN0b3JUfSB0ZW1wbGF0ZVxuICAgICAqIEByZXR1cm4ge0ZyZWV9XG4gICAgICovXG4gICAgc3Bhd24odGVtcGxhdGUpIHtcblxuICAgICAgICByZXR1cm4gRnJlZS5saWZ0RihuZXcgU3Bhd24oeyB0ZW1wbGF0ZSwgcGFyZW50OiB0aGlzLnNlbGYgfSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGVsbCBhbm90aGVyIGFjdG9yIHNvbWV0aGluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b1xuICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAqIEBzdW1tYXJ5IHsgKHN0cmluZywgKikg4oaSICBGcmVlfVxuICAgICAqL1xuICAgIHRlbGwodG8sIG1lc3NhZ2UpIHtcblxuICAgICAgICByZXR1cm4gRnJlZS5saWZ0RihuZXcgU2VuZCh7IGZyb206IHRoaXMuc2VsZiwgdG8sIG1lc3NhZ2UgfSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVjZWl2ZSB0aGUgbmV4dCBtZXNzYWdlLCBvcHRpb25hbGx5IGZpbHRlcmluZyB1bndhbnRlZFxuICAgICAqIG1lc3NhZ2VzLlxuICAgICAqIEBzdW1tYXJ5IHsgKCog4oaSICBGcmVlIHwgbnVsbCApIOKGkiAgRnJlZSB9XG4gICAgICovXG4gICAgcmVjZWl2ZShiZWhhdmlvdXIpIHtcblxuICAgICAgICByZXR1cm4gRnJlZS5saWZ0RihuZXcgUmVjZWl2ZSh7cGF0aDp0aGlzLnNlbGYsIGJlaGF2aW91cn0pKTtcblxuICAgIH1cblxuXG59XG4iXX0=