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
exports.UnknownFunErr = exports.UnknownInstanceErr = exports.InvalidFunctionErr = exports.InvalidConstructorErr = exports.MissingInfoErr = exports.InvalidPropertyIndex = exports.StackEmptyErr = exports.IntegerOverflowErr = exports.MissingSymbolErr = exports.UnknownAddressErr = exports.EmptyMailboxErr = exports.NoMailboxErr = exports.NoReceiverErr = exports.IllegalStopErr = exports.UnexpectedDataType = exports.NullPointerErr = exports.JumpOutOfBoundsErr = exports.NullFunctionPointerErr = exports.NullTemplatePointerErr = exports.DuplicateAddressErr = exports.UnknownParentAddressErr = exports.InvalidIdErr = exports.Error = void 0;
var address_1 = require("../../../address");
var frame_1 = require("./stack/frame");
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
    function JumpOutOfBoundsErr(location, size) {
        var _this = _super.call(this, "Cannot jump to location \"" + location + "\"! Max location: " + size + "!") || this;
        _this.location = location;
        _this.size = size;
        return _this;
    }
    return JumpOutOfBoundsErr;
}(Error));
exports.JumpOutOfBoundsErr = JumpOutOfBoundsErr;
/**
 * NullPointerErr
 */
var NullPointerErr = /** @class */ (function (_super) {
    __extends(NullPointerErr, _super);
    function NullPointerErr(data) {
        var _this = _super.call(this, "Value: [" + data.toString(16) + "]") || this;
        _this.data = data;
        return _this;
    }
    return NullPointerErr;
}(Error));
exports.NullPointerErr = NullPointerErr;
/**
 * UnexpectedDataType
 */
var UnexpectedDataType = /** @class */ (function (_super) {
    __extends(UnexpectedDataType, _super);
    function UnexpectedDataType(expected, got) {
        var _this = _super.call(this, "Expected: " + expected.toString(16) + ", " +
            ("Received: " + got.toString(16))) || this;
        _this.expected = expected;
        _this.got = got;
        return _this;
    }
    return UnexpectedDataType;
}(Error));
exports.UnexpectedDataType = UnexpectedDataType;
/**
 * IllegalStopErr
 */
var IllegalStopErr = /** @class */ (function (_super) {
    __extends(IllegalStopErr, _super);
    function IllegalStopErr(parent, child) {
        var _this = _super.call(this, "The actor at address \"" + parent + "\" can not kill \"" + child + "\"!") || this;
        _this.parent = parent;
        _this.child = child;
        return _this;
    }
    return IllegalStopErr;
}(Error));
exports.IllegalStopErr = IllegalStopErr;
/**
 * NoReceiverErr
 */
var NoReceiverErr = /** @class */ (function (_super) {
    __extends(NoReceiverErr, _super);
    function NoReceiverErr(actor) {
        var _this = _super.call(this, "Actor " + actor + " tried to read a message without a receiver!") || this;
        _this.actor = actor;
        return _this;
    }
    return NoReceiverErr;
}(Error));
exports.NoReceiverErr = NoReceiverErr;
/**
 * NoMailboxErr
 */
var NoMailboxErr = /** @class */ (function (_super) {
    __extends(NoMailboxErr, _super);
    function NoMailboxErr(actor) {
        var _this = _super.call(this, "Actor " + actor + " has no mailbox!") || this;
        _this.actor = actor;
        return _this;
    }
    return NoMailboxErr;
}(Error));
exports.NoMailboxErr = NoMailboxErr;
/**
 * EmptyMailboxErr
 */
var EmptyMailboxErr = /** @class */ (function (_super) {
    __extends(EmptyMailboxErr, _super);
    function EmptyMailboxErr() {
        return _super.call(this, 'Mailbox empty.') || this;
    }
    return EmptyMailboxErr;
}(Error));
exports.EmptyMailboxErr = EmptyMailboxErr;
/**
 * UnknownAddressErr
 */
var UnknownAddressErr = /** @class */ (function (_super) {
    __extends(UnknownAddressErr, _super);
    function UnknownAddressErr(actor) {
        var _this = _super.call(this, "The system has no actor for address \"" + actor + "\"!") || this;
        _this.actor = actor;
        return _this;
    }
    return UnknownAddressErr;
}(Error));
exports.UnknownAddressErr = UnknownAddressErr;
/**
 * MissingSymbolErr
 */
var MissingSymbolErr = /** @class */ (function (_super) {
    __extends(MissingSymbolErr, _super);
    function MissingSymbolErr(index) {
        var _this = _super.call(this, "Cannot locate symbol at index 0x" + index.toString(16)) || this;
        _this.index = index;
        return _this;
    }
    return MissingSymbolErr;
}(Error));
exports.MissingSymbolErr = MissingSymbolErr;
/**
 * IntegerOverflowErr
 */
var IntegerOverflowErr = /** @class */ (function (_super) {
    __extends(IntegerOverflowErr, _super);
    function IntegerOverflowErr() {
        return _super.call(this, "DATA_MAX_SAFE_UINT32=" + frame_1.DATA_MAX_SAFE_UINT32) || this;
    }
    return IntegerOverflowErr;
}(Error));
exports.IntegerOverflowErr = IntegerOverflowErr;
/**
 * StackEmptyErr
 */
var StackEmptyErr = /** @class */ (function (_super) {
    __extends(StackEmptyErr, _super);
    function StackEmptyErr() {
        return _super.call(this, 'Stack is empty.') || this;
    }
    return StackEmptyErr;
}(Error));
exports.StackEmptyErr = StackEmptyErr;
/**
 * InvalidPropertyIndex
 */
var InvalidPropertyIndex = /** @class */ (function (_super) {
    __extends(InvalidPropertyIndex, _super);
    function InvalidPropertyIndex(cons, idx) {
        var _this = _super.call(this, "Constructor: " + cons.name + ", index: " + idx) || this;
        _this.cons = cons;
        _this.idx = idx;
        return _this;
    }
    return InvalidPropertyIndex;
}(Error));
exports.InvalidPropertyIndex = InvalidPropertyIndex;
/**
 * MissingInfoErr
 */
var MissingInfoErr = /** @class */ (function (_super) {
    __extends(MissingInfoErr, _super);
    function MissingInfoErr(idx) {
        var _this = _super.call(this, "No info object index: " + idx + "!") || this;
        _this.idx = idx;
        return _this;
    }
    return MissingInfoErr;
}(Error));
exports.MissingInfoErr = MissingInfoErr;
/**
 * InvalidConstructorErr
 */
var InvalidConstructorErr = /** @class */ (function (_super) {
    __extends(InvalidConstructorErr, _super);
    function InvalidConstructorErr(name) {
        var _this = _super.call(this, "Named object \"" + name + "\" cannot be used as a constructor!") || this;
        _this.name = name;
        return _this;
    }
    return InvalidConstructorErr;
}(Error));
exports.InvalidConstructorErr = InvalidConstructorErr;
/**
 * InvalidFunctionErr
 */
var InvalidFunctionErr = /** @class */ (function (_super) {
    __extends(InvalidFunctionErr, _super);
    function InvalidFunctionErr(name) {
        var _this = _super.call(this, "Named object \"" + name + "\" cannot be used as a function!") || this;
        _this.name = name;
        return _this;
    }
    return InvalidFunctionErr;
}(Error));
exports.InvalidFunctionErr = InvalidFunctionErr;
/**
 * UnknownInstanceErr
 */
var UnknownInstanceErr = /** @class */ (function (_super) {
    __extends(UnknownInstanceErr, _super);
    function UnknownInstanceErr(instance) {
        var _this = _super.call(this, 'The instance provided with constructor ' +
            (instance ? instance.constructor.name || instance : instance) +
            '" is not in the system!') || this;
        _this.instance = instance;
        return _this;
    }
    return UnknownInstanceErr;
}(Error));
exports.UnknownInstanceErr = UnknownInstanceErr;
/**
 * UnknownFuncErr
 */
var UnknownFunErr = /** @class */ (function (_super) {
    __extends(UnknownFunErr, _super);
    function UnknownFunErr(name) {
        var _this = _super.call(this, "The function '" + name + "' does not exist and cannot be executed!") || this;
        _this.name = name;
        return _this;
    }
    return UnknownFunErr;
}(Error));
exports.UnknownFunErr = UnknownFunErr;
//# sourceMappingURL=error.js.map