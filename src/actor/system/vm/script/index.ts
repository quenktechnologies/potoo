import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';

import { MissingInfoErr } from '../runtime/error';
import { PTNumber, PTString } from '../type';
import { Instruction } from '../op';
import { Info } from './info';

export const CONSTANTS_INDEX_NUMBER = 0;
export const CONSTANTS_INDEX_STRING = 1;

/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 */
export type Constants = [PTNumber[], PTString[]];

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
export class PScript implements Script {
    constructor(
        public name: string,
        public constants: Constants = [[], []],
        public info: Info[] = [],
        public code: Instruction[] = []
    ) {}
}

/**
 * getInfo retrivies an Info object from the info section.
 */
export const getInfo = (s: Script, idx: number): Either<Err, Info> => {
    if (s.info[idx] == null) return left(new MissingInfoErr(idx));

    return right(s.info[idx]);
};
