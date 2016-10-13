/**
 * RefFactory  represents the context a Concern is created in.
 * With a Context you can:
 * * Create Concerns
 * * Listen to events via subscribe()
 * * more
 * @interface
 */
class RefFactory {

    /**
     * select a Concern based on it's path
     * @param {string} path
     */
    select(path) {

    }

    /**
     * concernOf considers a Concern part of this system when it activates.
     * @param {ConcernFactory} factory
     * @param {string} name
     * @returns {Reference}
     */
    concernOf(factory, name) {

    }

}

export default RefFactory;
