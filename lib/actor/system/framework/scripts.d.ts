import { Context } from '../../context';
import { Address } from '../../address';
import { Template } from '../../template';
import { Script } from '../vm/script';
import { System } from '../';
/**
 * SpawnScript for spawning new actors and children from templates.
 */
export declare class SpawnScript<C extends Context, S extends System<C>> extends Script<C, S> {
    parent: Address;
    tmp: Template<C, S>;
    constructor(parent: Address, tmp: Template<C, S>);
}
