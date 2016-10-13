/**
 * ConcernFactory is an inteface for classes that provide Concerns.
 * The Context interface depends on these methods to create a Concern instance.
 * Instead of implementing a ConcernFactory, you can use the Defaults class instead.
 */
class ConcernFactory {

    /**
     * dispatcher provides the disptacher for the Concern.
     * @param {Context} context
     * @returns {Dispatcher}
     */
    dispatcher() {

    }

    /**
     * mailbox provides the Mailbox for the Concern
     * @param {Dispatcher} dispatcher
     * @returns {Mailbox}
     */
    mailbox() {

    }

    /**
     * errorHandlingStrategy provides the ErrorHandlingStrategy for
     * this Concern
     * @returns {ErrorHandlingStrategy}
     */
    errorHandlingStrategy() {

    }

    /**
     * reference generates the Reference for the Concern
     * @param {Context} context
     * @returns {Reference}
     */
    reference() {

    }

    /**
     * create is called to provide an instance of the Concern itself.
     * @param {Context} context
     * @returns {Concern}
     */
    create() {

    }

}

export default ConcernFactory
