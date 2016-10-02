import beof from 'beof';
import System from './System';

/**
 * DeadLetters is the catch all for messages that don't have a home.
 */
class DeadLetters {

    constructor(system) {

        beof({ system }).interface(System);

        this._system = system;

    }

    tell(message, from) {

        this._system.emit('bounce', message, from);

    }

}

export default DeadLetters
