"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var system_1 = require("../../system");
/**
 * Resident provides a LocalActor impleemntation.
 */
var Resident = /** @class */ (function () {
    function Resident(system) {
        var _this = this;
        this.system = system;
        this.self = function () { return _this.system.toAddress(_this).get(); };
    }
    Resident.prototype.spawn = function (t) {
        return this.system.putChild(this, t);
    };
    Resident.prototype.tell = function (ref, m) {
        this.system.putMessage(new system_1.Envelope(ref, this.self(), m));
        return this;
    };
    Resident.prototype.ask = function (ref, m, time) {
        if (time === void 0) { time = Infinity; }
        return this.system.askMessage(new system_1.Envelope(ref, this.self(), m), time);
    };
    Resident.prototype.select = function (_) {
        return this;
    };
    Resident.prototype.run = function (_) { };
    Resident.prototype.kill = function (addr) {
        this.system.removeActor(this, addr);
        return this;
    };
    Resident.prototype.exit = function () {
        this.kill(this.self());
    };
    Resident.prototype.terminate = function () {
        this.system = new system_1.PsuedoSystem(this.system);
    };
    return Resident;
}());
exports.Resident = Resident;
//# sourceMappingURL=Resident.js.map