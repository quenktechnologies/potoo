"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawn = exports.ref = exports.Mutable = exports.Temp = exports.Immutable = exports.AbstractResident = void 0;
var scripts = require("./scripts");
var events = require("../system/vm/event");
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
var info_1 = require("../system/vm/script/info");
var address_1 = require("../address");
var template_1 = require("../template");
var flags_1 = require("../flags");
/**
 * AbstractResident implementation.
 */
var AbstractResident = /** @class */ (function () {
    function AbstractResident(system) {
        this.system = system;
        this.self = function () { return address_1.ADDRESS_DISCARD; };
    }
    AbstractResident.prototype.notify = function () {
        this.system.exec(this, new scripts.Notify());
    };
    AbstractResident.prototype.accept = function (_) {
    };
    AbstractResident.prototype.spawn = function (t) {
        return exports.spawn(this.system, this, t);
    };
    AbstractResident.prototype.spawnGroup = function (group, tmpls) {
        var _this = this;
        return record_1.map(tmpls, function (t) { return _this.spawn(type_1.isObject(t) ?
            record_1.merge(t, { group: group }) : { group: group, create: t }); });
    };
    AbstractResident.prototype.tell = function (ref, m) {
        this.system.exec(this, new scripts.Tell(ref, m));
        return this;
    };
    AbstractResident.prototype.raise = function (e) {
        this.system.exec(this, new scripts.Raise(e.message));
        return this;
    };
    AbstractResident.prototype.kill = function (addr) {
        this.system.exec(this, new scripts.Kill(addr));
        return this;
    };
    AbstractResident.prototype.exit = function () {
        this.system.exec(this, new scripts.Kill(this.self()));
    };
    AbstractResident.prototype.start = function (addr) {
        this.self = function () { return addr; };
        return this.run();
    };
    AbstractResident.prototype.run = function () { };
    AbstractResident.prototype.stop = function () { };
    return AbstractResident;
}());
exports.AbstractResident = AbstractResident;
/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
var Immutable = /** @class */ (function (_super) {
    __extends(Immutable, _super);
    function Immutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Immutable.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_BUFFERED;
        c.receivers.push(receiveFun(this.receive));
        return c;
    };
    /**
     * select noop.
     */
    Immutable.prototype.select = function (_) {
        return this;
    };
    return Immutable;
}(AbstractResident));
exports.Immutable = Immutable;
/**
 * Temp automatically removes itself from the system after a succesfull match
 * of any of its cases.
 */
var Temp = /** @class */ (function (_super) {
    __extends(Temp, _super);
    function Temp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Temp.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_TEMPORARY | flags_1.FLAG_BUFFERED;
        c.receivers.push(receiveFun(this.receive));
        return c;
    };
    return Temp;
}(Immutable));
exports.Temp = Temp;
/**
 * Mutable actors can change their behaviour after message processing.
 */
var Mutable = /** @class */ (function (_super) {
    __extends(Mutable, _super);
    function Mutable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.receive = [];
        return _this;
    }
    Mutable.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_BUFFERED;
        return c;
    };
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    Mutable.prototype.select = function (cases) {
        this.system.exec(this, new scripts.Receive(receiveFun(cases)));
        return this;
    };
    return Mutable;
}(AbstractResident));
exports.Mutable = Mutable;
/**
 * ref produces a function for sending messages to an actor address.
 */
exports.ref = function (res, addr) {
    return function (m) {
        return res.tell(addr, m);
    };
};
/**
 * spawn an actor using the Spawn script.
 */
exports.spawn = function (sys, i, t) {
    var tmpl = template_1.normalize(type_1.isObject(t) ? t : { create: t });
    return sys
        .execNow(i, new scripts.Spawn(tmpl))
        .orJust(function () { return address_1.ADDRESS_DISCARD; })
        .get();
};
var receiveFun = function (cases) {
    return new info_1.NewForeignFunInfo('receive', 1, function (r, m) {
        if (cases.some(function (c) {
            var ok = c.test(m);
            if (ok) {
                var ft = c.apply(m);
                if (ft != null)
                    r.runTask(ft);
            }
            return ok;
        })) {
            r.vm.trigger(r.context.address, events.EVENT_MESSAGE_READ, m);
        }
        else {
            r.vm.trigger(r.context.address, events.EVENT_MESSAGE_DROPPED, m);
        }
        return 0;
    });
};
//# sourceMappingURL=index.js.map