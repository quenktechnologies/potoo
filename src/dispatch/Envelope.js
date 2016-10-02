import beof from 'beof';
import Reference from '../Reference';

/**
 * Envelope is a wrapper around a message, it's sender and the destination Concern.
 * It is used by the dispatcher to do message delivery.
 * @param {*} message
 * @param {Reference} from
 *
 * @property {*} message
 * @property {Reference} from
 */
class Envelope {

    constructor(message, from) {

        beof({ from }).interface(Reference);

        this.message = message;
        this.from = from;

    }

}

export default Envelope
