import { Envelope } from '../../system';
import { Local } from '.';

/**
 * Parent actor only spanws child actors.
 */
export class Parent extends Local {

    accept<M>(e: Envelope<M>) : Parent {

        this.__system.discard(e);
        return this;

    }

    run() { return this; }

}
