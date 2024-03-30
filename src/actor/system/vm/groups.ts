import { Address } from '../../address';

/**
 * GroupName is the name of a group complying to the regex [a-z][a-z0-9_]* .
 */
export type GroupName = string;

/**
 * GroupMap is a mapping of group names to the addresses that form part of the
 * group.
 */
export class GroupMap {
    constructor(public items = new Map()) {}

    /**
     * get the set of addresses for a group.
     */
    get(key: GroupName): Address[] {
        return this.items.get(key)?.entries() ?? [];
    }

    /**
     * put the address of an actor into a group.
     */
    put(key: GroupName, value: Address): GroupMap {
        let group = this.items.get(key) ?? new Set();
        group.add(value);

        return this;
    }
}
