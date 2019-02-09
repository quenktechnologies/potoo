import { Script } from '../system/vm/script';
import { Context } from '../context';
import { System } from '../system';
/**
 * RaiseScript
 */
export declare class RaiseScript<C extends Context, S extends System<C>> extends Script<C, S> {
    emsg: string;
    constructor(emsg: string);
}
