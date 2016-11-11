import beof from 'beof';
import DeadLetters from './DeadLetters';

/**
 * NullReference is a reference that we could not resolve.
 */
class NullReference {

    constructor(path, deadLetters) {

        beof({ path }).string();
        beof({ deadLetters }).instance(DeadLetters);

        this._path = path;
        this._deadLetters = deadLetters;

    }

    path() {

    }

    watch() {

    }

    unwatch() {

    }

    tell(message, from) {

        this._deadLetters.tell({ to: this._path, message }, from);

    }

}

export default NullReference
