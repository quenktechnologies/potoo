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
var log = require("../log");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var function_1 = require("@quenk/noni/lib/data/function");
var state_1 = require("../state");
var address_1 = require("../../address");
var error_1 = require("../error");
var raise_1 = require("./raise");
var run_1 = require("./run");
var _1 = require("./");
exports.RUN_START_TAG = 'start';
var InvalidIdError = /** @class */ (function (_super) {
    __extends(InvalidIdError, _super);
    function InvalidIdError(id) {
        var _this = _super.call(this, "Actor id \"" + id + "\" must not inclue \"$\", \"?\" or \"/\"!") || this;
        _this.id = id;
        return _this;
    }
    return InvalidIdError;
}(error_1.SystemError));
exports.InvalidIdError = InvalidIdError;
var DuplicateAddressError = /** @class */ (function (_super) {
    __extends(DuplicateAddressError, _super);
    function DuplicateAddressError(address) {
        var _this = _super.call(this, "Unable to spawn actor \"" + address + "\": Duplicate address!") || this;
        _this.address = address;
        return _this;
    }
    return DuplicateAddressError;
}(error_1.SystemError));
exports.DuplicateAddressError = DuplicateAddressError;
/**
 * Spawn instruction.
 */
var Spawn = /** @class */ (function (_super) {
    __extends(Spawn, _super);
    function Spawn(parent, template) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.template = template;
        _this.code = _1.OP_SPAWN;
        _this.level = log.INFO;
        return _this;
    }
    Spawn.prototype.exec = function (s) {
        return exports.execSpawn(s, this);
    };
    return Spawn;
}(_1.Op));
exports.Spawn = Spawn;
/**
 * execSpawn instruction.
 *
 * Here we ensure the parent is still in the system then validate
 * the child id.
 *
 * If that is successfull we create and check for a duplicate id
 * then finally add the child to the system.
 */
exports.execSpawn = function (s, _a) {
    var parent = _a.parent, template = _a.template;
    return state_1.getAddress(s.state, parent)
        .chain(function (path) {
        return maybe_1.fromBoolean(!address_1.isRestricted(template.id))
            .orElse(raiseInvalidIdError(s, template.id, path))
            .map(function () { return template; })
            .chain(makeAddress(path))
            .chain(function (addr) {
            return checkAddress(s, addr)
                .orElse(raiseDuplicateAddressError(s, path, addr))
                .map(function_1.cons(addr))
                .chain(generate(s, template))
                .chain(spawnChildren(s, template))
                .map(function () { });
        });
    })
        .map(function_1.noop)
        .orJust(function_1.noop)
        .get();
};
var makeAddress = function (parent) { return function (template) {
    return maybe_1.fromString(address_1.make(parent, template.id));
}; };
var checkAddress = function (s, addr) {
    return maybe_1.fromBoolean(!state_1.exists(s.state, addr));
};
var generate = function (s, template) { return function (addr) {
    return maybe_1.fromNullable(s.allocate(template))
        .map(function (f) {
        s.state = state_1.put(s.state, addr, f);
        s.exec(new run_1.Run(exports.RUN_START_TAG, addr, template.delay || 0, function () { return state_1.runInstance(s.state, addr); }));
        return f.actor;
    });
}; };
var spawnChildren = function (s, t) { return function (parent) {
    return maybe_1.fromNullable(t.children)
        .map(function (children) { return children.forEach(function (c) { return s.exec(new Spawn(parent, c)); }); });
}; };
var raiseInvalidIdError = function (s, id, parent) { return function () {
    s.exec(new raise_1.Raise(new InvalidIdError(id), parent, parent));
    return maybe_1.nothing();
}; };
var raiseDuplicateAddressError = function (s, parent, addr) { return function () {
    s.exec(new raise_1.Raise(new DuplicateAddressError(addr), parent, parent));
    return maybe_1.nothing();
}; };
//# sourceMappingURL=spawn.js.map