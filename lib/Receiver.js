"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AnyReceiver accepts any value.
 */
var AnyReceiver = (function () {
    function AnyReceiver(behaviour) {
        this.behaviour = behaviour;
    }
    AnyReceiver.prototype.willReceive = function (_) {
        return true;
    };
    AnyReceiver.prototype.receive = function (m) {
        this.behaviour(m);
    };
    return AnyReceiver;
}());
exports.AnyReceiver = AnyReceiver;
//# sourceMappingURL=Receiver.js.map