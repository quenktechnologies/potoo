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
/**
 * DuplicateActorPathError
 */
var DuplicateActorPathError = (function (_super) {
    __extends(DuplicateActorPathError, _super);
    function DuplicateActorPathError(path) {
        var _this = _super.call(this, "The path '" + path + "' is already in use!") || this;
        (Object.setPrototypeOf) ?
            Object.setPrototypeOf(_this, DuplicateActorPathError.prototype) :
            _this.__proto__ = DuplicateActorPathError.prototype;
        _this.stack = (new Error(_this.message)).stack;
        if (Error.hasOwnProperty('captureStackTrace'))
            Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return DuplicateActorPathError;
}(Error));
exports.DuplicateActorPathError = DuplicateActorPathError;
DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;
//# sourceMappingURL=DuplicateActorPathError.js.map