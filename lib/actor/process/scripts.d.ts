import { Script } from '../system/vm/script';
import { System } from '../system';
import { Context } from '../context';
/**
 * RaiseScript
 */
export declare class RaiseScript<C extends Context, S extends System<C>> extends Script<C, S> {
    emsg: string;
    constructor(emsg: string);
}
