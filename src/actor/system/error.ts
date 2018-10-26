import { Err } from '../err';

/**
 * SystemError
 */
export class SystemError implements Err {

    constructor(public message: string) { }

}
