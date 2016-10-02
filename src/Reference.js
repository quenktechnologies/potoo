/**
 * Reference serves as a handle to a Concern.
 * @interface
 */
class Reference {

    /**
     * path returns the full path (inclusive of protocol information) of this Reference.
     * @returns {string}
     */
    path() {


    }

    /**
     * watch allows the state of this Reference to be monitored
     * by another Reference.
     * @param {Reference} ref
     */
    watch() {

    }

    /**
     * unwatch a Reference
     * @param {Reference} ref
     */
    unwatch() {

    }

    /**
     * tell a message to for this Reference's Concern
     * @param {*} message
     * @param {Reference} from
     */
    tell() {

    }

}

export default Reference
