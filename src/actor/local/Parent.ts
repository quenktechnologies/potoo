import { Envelope } from '../../system';
import { Resident } from '.';

/**
 * Parent actor only spanws child actors.
 */
export class Parent extends Resident {

    accept<M>(e: Envelope<M>): Parent {

        this.system.discard(e);
        return this;

    }

    run() {

        return this;

    }

}
