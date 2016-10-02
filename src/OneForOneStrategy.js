import beof from 'beof';

/**
 * OneForOneStrategy applies the decisions to the failing child only.
 * @param {object} options - A map of Error constructors you want an action taken for.
 * @implements {ErrorHandlingStrategy}
 */
class OneForOneStrategy {

    constructor(decider) {

        beof({ decider }).function();

        this._decider = decider;

    }

    decide(e, signals) {

        return this._decider(e);

    }

    apply(sig, child, context) {

child.tell(sig, context.self());

    }

}

export default OneForOneStrategy
