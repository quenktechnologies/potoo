
/**
 * DuplicateActorPathError
 */
export function DuplicateActorPathError(path) {

    this.message = `The path '${path}' is already in use!`;
    this.path = path;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;


