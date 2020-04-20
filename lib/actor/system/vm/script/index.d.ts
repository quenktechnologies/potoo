import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Instruction } from '../runtime';
import { Info } from './info';
import { PTNumber, PTString } from '../type';
export declare const CONSTANTS_INDEX_NUMBER = 0;
export declare const CONSTANTS_INDEX_STRING = 1;
/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 */
export declare type Constants = [PTNumber[], PTString[]];
/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 */
export interface Script {
    /**
     * name of the Script.
     * This is an absolute path or an id for dynamically generated scripts.
     */
    name: string;
    /**
     * constants pool for the actor where certain references are resolved from.
     */
    constants: Constants;
    /**
     * info is a table of various named structures within the script source.
     */
    info: Info[];
    /**
     * code is the actual instructions the VM will execute.
     */
    code: Instruction[];
}
/**
 * PScript provides a constructor for creating Scripts.
 */
export declare class PScript implements Script {
    name: string;
    constants: Constants;
    info: Info[];
    code: Instruction[];
    constructor(name: string, constants?: Constants, info?: Info[], code?: Instruction[]);
}
/**
 * getInfo retrivies an Info object from the info section.
 */
export declare const getInfo: (s: Script, idx: number) => Either<Err, Info>;
