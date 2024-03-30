import { Err } from '@quenk/noni/lib/control/error';

/**
 * SystemError
 */
export class SystemError implements Err {
    constructor(public message: string) {}
}
