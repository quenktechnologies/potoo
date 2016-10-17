import RefFactory from './RefFactory';

/**
 * Context represents the context a Concern is created in.
 * With a Context you can:
 * * Create Concerns
 * * Listen to events via subscribe()
 * * more
 * @interface
 */
class Context extends RefFactory {

    /**
     * path returns the path to this context
     * @returns {string}
     */
    path() {

    }

    /**
     * self returns the Reference for this Context
     * @returns {Reference}
     */
    self() {

    }

    /**
     * isChild tells us if ref is a child of this Context
     * @param {Reference} ref
     * @returns {boolean}
     */
    isChild(ref) {

    }

    /**
     * children returns an array of all this Context's children
     * @returns {array<Reference>}
     */
    children() {

    }

    /**
     * parent returns the parent Context for this Context or
     * null if none exists.
     * @returns {Context}
     */
    parent() {

    }

    /**
     * mailbox returns this Context's Mailbox.
     * @returns {Mailbox}
     */
    mailbox() {

    }

    /**
     * dispatcher returns this Context's Dispatcher
     * @returns {Dispatcher}
     */
    dispatcher() {

    }

    /**
     * system returns the System this Context belongs to.
     * @returns {System}
     */
    system() {

    }

    /**
     * concernOf creates a new child concern.
     * @param {ConcernFactory} factory
     * @param {string} name
     */
    concernOf() {

    }

}

export default Context;
