/**
 * Dispatcher is the interface ChildContext expects to handle receive execution.
 *
 * Dispatchers are notified when a message or receive is added to the respective queue.
 * @interface
 */
class Dispatcher  {

    /**
     * schedule a receive for future execution
     * @param {Callable} receive
     * @param {Context} context
     */
    schedule() {

    }

    /**
     * dispatch this dispatcher.
     */
    dispatch() {

    }

}

export default Dispatcher
