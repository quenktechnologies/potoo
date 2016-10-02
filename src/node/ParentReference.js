import Promise from 'bluebird';
import RemoteMessage from '../RemoteMessage';

/**
 * ParentReference represents a Reference to
 */
class ParentReference {

    constructor(process) {

        this._process = process;

    }

    accept(msg, sender) {

this._process.send(RemoteMessage.asString('', msg, sender.path()));

    }

    acceptAndPromise(msg, sender) {

        return Promise.resolve(this.accept(msg, sender));

    }

}

export default ParentReference
