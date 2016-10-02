import beof from 'beof';

/**
 * AllForOneStrategy applies the decisions to all children of the current context. Game over...
 * @param {function} decider
 * @implements {ErrorHandlingStrategy}
 */
class AllForOneStrategy {

    constructor(decider) {

        beof({ decider }).function();

        this._decider = decider;

    }

    decide(e, signals) {

        return this._decider(e);

    }

    apply(sig, child, context) {

        context.children().
            forEach(child=>child.self().tell(sig, context.self()));

    }

}

export default AllForOneStrategy
