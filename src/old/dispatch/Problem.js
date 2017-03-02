import beof from 'beof';
import Context from '../Context';

/**
 * Problem is recognized internally that an error has occured during message
 * handling.
 * @param {Error} error
 * @param {Context} context
 * @property {Error} error
 * @property {Context} context
 * @extends {Error}
 */
export function Problem(error, context) {

    beof({ error }).instance(Error);
    beof({ context }).interface(Context);

    this.error = error;
    this.context = context;
    this.message = `Actor '${context.path()}' threw an error!\n` +
        `No one handled it so System will now crash!\n${error.stack}\n`;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

Problem.prototype = Object.create(Error.prototype);
Problem.prototype.constructor = Problem;

export default Problem
