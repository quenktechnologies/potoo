"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("@quenk/noni/lib/data/type");
var either_1 = require("@quenk/noni/lib/data/either");
var function_1 = require("@quenk/noni/lib/data/function");
var address_1 = require("./address");
var spawn_1 = require("./system/op/spawn");
var tell_1 = require("./system/op/tell");
var kill_1 = require("./system/op/kill");
var drop_1 = require("./system/op/drop");
var receive_1 = require("./system/op/receive");
var system_1 = require("./system");
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = /** @class */ (function () {
    function Case(pattern, handler) {
        this.pattern = pattern;
        this.handler = handler;
    }
    /**
     * match checks if the supplied type satisfies this Case
     */
    Case.prototype.match = function (m) {
        if (type_1.test(m, this.pattern)) {
            this.handler(m);
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
 * AbstractCase is provided for situations where
 * it is better to extend the Case class instead of creating
 * new instances.
 */
var AbstractCase = /** @class */ (function (_super) {
    __extends(AbstractCase, _super);
    function AbstractCase(pattern) {
        var _this = _super.call(this, pattern, function (m) { return _this.apply(m); }) || this;
        _this.pattern = pattern;
        return _this;
    }
    return AbstractCase;
}(Case));
exports.AbstractCase = AbstractCase;
/**
 * AbstractResident impleemntation.
 */
var AbstractResident = /** @class */ (function () {
    function AbstractResident(system) {
        var _this = this;
        this.system = system;
        this.ref = function (addr) { return function (m) { return _this.tell(addr, m); }; };
        this.self = function () { return _this.system.identify(_this); };
    }
    AbstractResident.prototype.init = function () {
        return [undefined, undefined];
    };
    AbstractResident.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        this.system.exec(new drop_1.Drop(to, from, message));
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
        this.system.exec(new kill_1.Kill(addr, this));
        return this;
    };
    AbstractResident.prototype.exit = function () {
        this.kill(this.self());
    };
    AbstractResident.prototype.stop = function () {
        this.system = new system_1.NullSystem();
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
    Immutable.prototype.init = function () {
        return [ibehaviour(this), { immutable: true, buffered: true }];
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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mutable.prototype.init = function () {
        return [
            (this.receive.length > 0) ? mbehaviour(this.receive) : undefined,
            { immutable: false, buffered: true }
        ];
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