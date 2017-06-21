"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * DuplicateActorPathError
 */
function DuplicateActorPathError(path) {
    this.message = "The path '" + path + "' is already in use!";
    this.path = path;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;
    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);
}
exports.DuplicateActorPathError = DuplicateActorPathError;
DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;
//# sourceMappingURL=DuplicateActorPathError.js.map