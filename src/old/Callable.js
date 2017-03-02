
/**
 * Callable is an interface for classes that have a call method.
 *
 * This interface is recognized internally to allow functions or classes
 * to act as actors. They are intended to mimic math functions and should
 * return a value for valid input.
 * @interface
 */
export class Callable {

    /**
     * call this Callable with an argument.
     * @param {*} arg
     * @returns {number|boolean|string|function,object|null}
     */
    call(arg) {

    }

}
export default Callable
