import Context from './Context';
/**
 * Concern interface represents a unit of work or some aspect of the application.
 * @interface
 */
class Concern {

      /**
     * onStart is called when the Concern is started
     * for the first time.
     * @returns {Promise|null}
     */
    onStart() {

    }

    /**
     * onPause is called when the Concern is to
     * be paused.
     * @returns {Promise|null}
     */
    onPause() {

    }

    /**
     * onResume is called when the Concern is to resume operations.
     * @returns {Promise|null}
     */
    onResume() {

    }

    /**
     * onStop is called when the Concern has been stopped.
     * @returns {Promise|null}
     */
    onStop() {

    }

    /**
     * receive a message from a sender
     * @param {*} message
     * @param {Concern} sender
     */
    receive() {

    }

}

export default Concern
