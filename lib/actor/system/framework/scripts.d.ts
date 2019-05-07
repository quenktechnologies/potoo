import { Address } from '../../address';
import { Template } from '../../template';
import { Script } from '../vm/script';
import { System } from '../';
/**
 * SpawnScript for spawning new actors and children from templates.
 */
export declare class SpawnScript extends Script {
    parent: Address;
    tmp: Template<System>;
    constructor(parent: Address, tmp: Template<System>);
}
