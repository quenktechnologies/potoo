import { Err } from '@quenk/noni/lib/control/error';
/**
 * SystemError
 */
export declare class SystemError implements Err {
    message: string;
    constructor(message: string);
}
