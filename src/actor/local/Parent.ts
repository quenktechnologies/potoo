import { Envelope } from '../../system';
import { Resident } from '.';

/**
 * Parent actor only spanws child actors.
 */
export class Parent extends Resident {

    accept(e: Envelope): Parent {

        this.system.discard(e);
        return this;

    }

    run() {

        return this;

    }

}
