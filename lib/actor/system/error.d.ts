import { Err } from '../err';
/**
 * SystemError
 */
export declare class SystemError implements Err {
    message: string;
    constructor(message: string);
}
