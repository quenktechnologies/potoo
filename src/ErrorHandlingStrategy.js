/**
 * ErrorHandlingStrategy is an interface for handling errors.
 * @interface
 */
class ErrorHandlingStrategy {

    /**
     * decide what Signal to use on the misbehaving Concern.
     * @param {Error} e
     * @param {Signal} signals
     */
    decide(e, signals) {


    }

    /**
     * apply the strategy
     * @param {Signal} sig
     * @param {Reference} child
     * @param {Context} context
     */
    apply() {

    }

}

export default ErrorHandlingStrategy
