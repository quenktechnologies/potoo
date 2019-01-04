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
var type_1 = require("@quenk/noni/lib/data/type");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var function_1 = require("@quenk/noni/lib/data/function");
var address_1 = require("./address");
var spawn_1 = require("./system/op/spawn");
var tell_1 = require("./system/op/tell");
var kill_1 = require("./system/op/kill");
var discard_1 = require("./system/op/discard");
var receive_1 = require("./system/op/receive");
var detached_1 = require("./system/detached");
/**
 * Case is provided for situations where
 * it is better to extend the Case class instead of creating
 * new instances.
 */
var Case = /** @class */ (function () {
    function Case(pattern) {
        this.pattern = pattern;
    }
    /**
     * match a message against a pattern.
     *
     * A successful match results in a side effect.
     */
    Case.prototype.match = function (m) {
        if (type_1.test(m, this.pattern)) {
            this.apply(m);
            return true;
        }
        else {
            return false;
        }
    };
    return Case;
}());
exports.Case = Case;
/**
 * CaseClass allows for the selective matching of patterns
 * for processing messages
 */
var CaseClass = /** @class */ (function (_super) {
    __extends(CaseClass, _super);
    function CaseClass(pattern, handler) {
        var _this = _super.call(this, pattern) || this;
        _this.pattern = pattern;
        _this.handler = handler;
        return _this;
    }
    CaseClass.prototype.apply = function (m) {
        this.handler(m);
    };
    return CaseClass;
}(Case));
exports.CaseClass = CaseClass;
/**
 * AbstractResident implementation.
 */
var AbstractResident = /** @class */ (function () {
    function AbstractResident(system) {
        var _this = this;
        this.system = system;
        this.ref = function (addr) { return function (m) { return _this.tell(addr, m); }; };
        this.self = function () { return _this.system.identify(_this); };
    }
    AbstractResident.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        this.system.exec(new discard_1.Discard(to, from, message));
        return this;
    };
    AbstractResident.prototype.spawn = function (t) {
        this.system.exec(new spawn_1.Spawn(this, t));
        return address_1.isRestricted(t.id) ?
            address_1.ADDRESS_DISCARD :
            address_1.make(this.self(), t.id);
    };
    AbstractResident.prototype.tell = function (ref, m) {
        this.system.exec(new tell_1.Tell(ref, this.self(), m));
        return this;
    };
    AbstractResident.prototype.kill = function (addr) {
        this.system.exec(new kill_1.Kill(this, addr));
        return this;
    };
    AbstractResident.prototype.exit = function () {
        this.kill(this.self());
    };
    AbstractResident.prototype.stop = function () {
        this.system = new detached_1.DetachedSystem();
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
        this.system.exec(new receive_1.Receive(this.self(), false, mbehaviour(cases)));
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
//# sourceMappingURL=resident.js.map