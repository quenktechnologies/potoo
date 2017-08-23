/**
 * DuplicateActorPathError
 */
export class DuplicateActorPathError extends Error {

    __proto__: object;

    constructor(path: string) {

        super(`The path '${path}' is already in use!`);

        (Object.setPrototypeOf) ?
            Object.setPrototypeOf(this, DuplicateActorPathError.prototype) :
            this.__proto__ = DuplicateActorPathError.prototype;

        this.stack = (new Error(this.message)).stack;

        if (Error.hasOwnProperty('captureStackTrace'))
            Error.captureStackTrace(this, this.constructor);

    }

}

DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;


