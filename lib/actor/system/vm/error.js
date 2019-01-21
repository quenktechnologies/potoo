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
var address_1 = require("../../address");
/**
 * Error
 */
var Error = /** @class */ (function () {
    function Error(message) {
        this.message = message;
    }
    return Error;
}());
exports.Error = Error;
/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
var InvalidIdErr = /** @class */ (function (_super) {
    __extends(InvalidIdErr, _super);
    function InvalidIdErr(id) {
        var _this = _super.call(this, "The id \"" + id + " must not contain" +
            (address_1.ADDRESS_RESTRICTED + " or be an empty string!")) || this;
        _this.id = id;
        return _this;
    }
    return InvalidIdErr;
}(Error));
exports.InvalidIdErr = InvalidIdErr;
/**
 * UnknownParentAddressErr indicates the parent address used for
 * spawning an actor does not exist.
 */
var UnknownParentAddressErr = /** @class */ (function (_super) {
    __extends(UnknownParentAddressErr, _super);
    function UnknownParentAddressErr(address) {
        var _this = _super.call(this, "The parent address \"" + address + "\" is not part of the system!") || this;
        _this.address = address;
        return _this;
    }
    return UnknownParentAddressErr;
}(Error));
exports.UnknownParentAddressErr = UnknownParentAddressErr;
/**
 * DuplicateAddressErr indicates the address of a freshly spawned
 * actor is already in use.
 */
var DuplicateAddressErr = /** @class */ (function (_super) {
    __extends(DuplicateAddressErr, _super);
    function DuplicateAddressErr(address) {
        var _this = _super.call(this, "Duplicate address \"" + address + "\" detected!") || this;
        _this.address = address;
        return _this;
    }
    return DuplicateAddressErr;
}(Error));
exports.DuplicateAddressErr = DuplicateAddressErr;
/**
 * NullTemplatePointerErr occurs when a reference to a template
 * does not exist in the templates table.
 */
var NullTemplatePointerErr = /** @class */ (function (_super) {
    __extends(NullTemplatePointerErr, _super);
    function NullTemplatePointerErr(index) {
        var _this = _super.call(this, "The index \"" + index + "\" does not exist in the Template table!") || this;
        _this.index = index;
        return _this;
    }
    return NullTemplatePointerErr;
}(Error));
exports.NullTemplatePointerErr = NullTemplatePointerErr;
var NullFunctionPointerErr = /** @class */ (function (_super) {
    __extends(NullFunctionPointerErr, _super);
    function NullFunctionPointerErr(index) {
        var _this = _super.call(this, "The index \"" + index + "\" does not exist in the function table!") || this;
        _this.index = index;
        return _this;
    }
    return NullFunctionPointerErr;
}(Error));
exports.NullFunctionPointerErr = NullFunctionPointerErr;
/**
 * JumpOutOfBoundsErr
 */
var JumpOutOfBoundsErr = /** @class */ (function (_super) {
    __extends(JumpOutOfBoundsErr, _super);
    function JumpOutOfBoundsErr(location) {
        var _this = _super.call(this, "Cannot jump to location \"" + location + "\"!") || this;
        _this.location = location;
        return _this;
    }
    return JumpOutOfBoundsErr;
}(Error));
exports.JumpOutOfBoundsErr = JumpOutOfBoundsErr;
var NullPointerErr = /** @class */ (function (_super) {
    __extends(NullPointerErr, _super);
    function NullPointerErr(data) {
        var _this = _super.call(this, "Reference: " + data) || this;
        _this.data = data;
        return _this;
    }
    return NullPointerErr;
}(Error));
exports.NullPointerErr = NullPointerErr;
var TypeErr = /** @class */ (function (_super) {
    __extends(TypeErr, _super);
    function TypeErr(expected, got) {
        var _this = _super.call(this, "Expected: " + expected + ", Received: " + got) || this;
        _this.expected = expected;
        _this.got = got;
        return _this;
    }
    return TypeErr;
}(Error));
exports.TypeErr = TypeErr;
//# sourceMappingURL=error.js.map