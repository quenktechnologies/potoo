/**
 * ReferenceProvider is an interface for providing Reference instance.
 * @interface
 */
class ReferenceProvider {

    /**
     * select a Reference to provide.
     * @param {string} path
     * @param {Context} context
     */
    select() {

    }

    /**
     * reselect a Reference that may have gone away.
     * @param {string} path
     * @param {Context} context
     */
    reselect() {

    }

}

export default ReferenceProvider
