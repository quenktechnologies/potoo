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
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var function_1 = require("@quenk/noni/lib/data/function");
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
var scripts_1 = require("../system/vm/runtime/scripts");
var scripts_2 = require("../system/framework/scripts");
var system_1 = require("../system");
var address_1 = require("../address");
var scripts_3 = require("./scripts");
/**
 * AbstractResident implementation.
 */
var AbstractResident = /** @class */ (function () {
    function AbstractResident(system) {
        this.system = system;
    }
    AbstractResident.prototype.notify = function () {
        this.system.exec(this, new scripts_3.NotifyScript());
    };
    AbstractResident.prototype.self = function () {
        return this.system.ident(this);
    };
    AbstractResident.prototype.accept = function (m) {
        this.system.exec(this, new scripts_3.AcceptScript(m));
    };
    AbstractResident.prototype.spawn = function (t) {
        var id = address_1.randomID();
        var tmpl = type_1.isObject(t) ?
            record_1.merge({ id: id }, t) :
            { id: id, create: t };
        this.system.exec(this, new scripts_2.SpawnScript(this.self(), tmpl));
        return address_1.isRestricted(tmpl.id) ?
            address_1.ADDRESS_DISCARD :
            address_1.make(this.self(), tmpl.id);
    };
    AbstractResident.prototype.spawnGroup = function (group, tmpls) {
        var _this = this;
        return record_1.map(tmpls, function (t) { return _this.spawn(type_1.isObject(t) ?
            record_1.merge(t, { group: group }) : { group: group, create: t }); });
    };
    AbstractResident.prototype.tell = function (ref, m) {
        this.system.exec(this, new scripts_3.TellScript(ref, m));
        return this;
    };
    AbstractResident.prototype.raise = function (e) {
        this.system.exec(this, new scripts_3.RaiseScript(e));
        return this;
    };
    AbstractResident.prototype.kill = function (addr) {
        this.system.exec(this, new scripts_1.StopScript(addr));
        return this;
    };
    AbstractResident.prototype.exit = function () {
        this.system.exec(this, new scripts_1.StopScript(this.self()));
    };
    AbstractResident.prototype.stop = function () {
        //XXX: this is a temp hack to avoid the system parameter being of type
        //System<C>. As much as possibl we want to keep the system type to
        //make implementing an actor system simple.
        //
        //In future revisions we may wrap the system in a Maybe or have
        //the runtime check if the actor is the valid instance but for now,
        //we force void. This may result in some crashes if not careful.
        this.system = new system_1.Void();
    };
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
        c.behaviour.push(ibehaviour(this));
        c.mailbox = maybe_1.just([]);
        c.flags.immutable = true;
        c.flags.buffered = true;
        return c;
    };
    /**
     * select noop.
     */
    Immutable.prototype.select = function (_) {
        return this;
    };
    Immutable.prototype.run = function () { };
    return Immutable;
}(AbstractResident));
exports.Immutable = Immutable;
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
        c.mailbox = maybe_1.just([]);
        c.flags.immutable = false;
        c.flags.buffered = true;
        return c;
    };
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    Mutable.prototype.select = function (cases) {
        this.system.exec(this, new scripts_3.ReceiveScript(mbehaviour(cases)));
        return this;
    };
    return Mutable;
}(AbstractResident));
exports.Mutable = Mutable;
var mbehaviour = function (cases) { return function (m) {
    return either_1.fromBoolean(cases.some(function (c) { return c.match(m); }))
        .lmap(function () { return m; })
        .map(function_1.noop);
}; };
var ibehaviour = function (i) { return function (m) {
    return either_1.fromBoolean(i.receive.some(function (c) { return c.match(m); }))
        .lmap(function () { return m; })
        .map(function_1.noop);
}; };
/**
 * ref produces a function for sending messages to an actor address.
 */
exports.ref = function (res, addr) {
    return function (m) {
        return res.tell(addr, m);
    };
};
//# sourceMappingURL=index.js.map