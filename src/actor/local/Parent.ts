import { Envelope } from '../../system';
import { Result, rejected } from '..';
import { Resident } from '.';

/**
 * Parent actor only spanws child actors.
 */
export class Parent extends Resident {

    accept(e: Envelope): Result {

        return rejected(e);

    }

}
