import RefFactory from './RefFactory';

/**
 * System
 * @interface
 */
class System extends RefFactory {

    /**
     * deadLetters returns the DeadLetters reference.
     * @returns {DeadLetters}
     */
    deadLetters() {

    }

    select(path) {

    }

    /**
     * concernOf considers a Concern part of this system when it activates.
     * @param {System.ConcernFactory} factory
     * @param {string} name
     * @returns {Reference}
     */
    concernOf(factory, name) {

    }

    /**
     * on - taken from EventEmitter
     */
    on() {

    }

    /**
     * emit - taken from EventEmitter
     */
    emit() {

    }

}

export default System;
