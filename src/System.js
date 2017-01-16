/**
 * System implementations are the system part of the actor model¹.
 *
 * A System is effectively a mesh network where any node can
 * communicate with another provided they have an address for each other
 * (and are allowed to).
 *
 * The methods described here allow us to create actors and
 * retrieve references to them given an address. Once an
 * actor is created the actual actor instance cannot/should not
 * be accessed directly by external code, use the reference instead.
 *
 * ¹ https://en.wikipedia.org/wiki/Actor_model
 *
 * @interface
 */
class System {

    /**
     * select an actor's reference from the hierarchy.
     *
     * If the actor is not found you will be given a false
     * reference that effectively drops all its messages.
     * @param {string} path
     * @returns {Reference}
     */
    select() {

    }

    /**
     * spawn adds an actor to the system.
     * @param {ActorFactory} factory
     * @param {string} name - If not provided, a uuid is used instead.
     */
    spawn() {

    }

    /**
     * subscribe to the System's event stream.
     * @param {Callable} f
     */
    subscribe() {

    }

    /**
     * unsubscribe a Callable from the event stream.
     * @param {Callable} f
     */
    unsubscribe() {

    }

    /**
     * publish a message to the System's stream.
     * @param {Object} evt
     */
    publish() {

    }

}

export default System
