/**
 * Context acts as a private mini-system for each actor allowing additional
 * spawning and interaction with the rest of the system.
 *
 * @interface
 */
export class Context {

    /**
     * path returns the path to this context
     * @returns {string}
     */
    path() {

    }

    /**
     * self returns a Reference for the actor.
     * @returns {Reference}
     */
    self() {

    }

    parent() {

    }

    /**
     * root returns the root of all actors in the system.
     * Used internally only to handle messages, logging etc.
     * @return {Reference}
     */
    root() {

    }

    /**
     * none returns an actor reference that is effectively a noop.
     * @returns {Reference}
     */
    none() {

    }

    /**
     * select an actor Reference given a path.
     *
     * An un-registered path yields an actor that drops messages automatically.
     * @param {string} path
     */
    select() {

    }

    /**
     * spawn a child actor.
     * @param {ChildSpec} spec
     * @param {string} name
     * @return {Reference}
     */
    spawn() {

    }

    /**
     * receive the next message for this Context's actor.
     *
     * The behaviour passed can call receive again to change
     * how the next message is handled. Once a message has been received,
     * the current behaviour is discarded and messages will continue to buffer
     * until the next receive call or an error occurs.
     *
     * If time is specified, the Promise returned form receive is rejected and
     * is NOT intercepted by the error handling stratgy. Use the catch() method
     * of the returned Promise to react to timeout errors.
     * @param {function} behaviour
     * @param {number} [time] - Time to wait for execution.
     * @returns {Promise<*>}
     */
    receive() {

    }

}

export default Context
