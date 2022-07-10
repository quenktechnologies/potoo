import { Address } from '../../address';
import { Map } from './map';
/**
 * GroupName is the name of a group complying to the regex [a-z][a-z0-9_]* .
 */
export declare type GroupName = string;
/**
 * GroupMap is a mapping of group names to the addresses that form part of the
 * group.
 */
export declare class GroupMap extends Map<Address[]> {
    /**
     * put the address of an actor into a group.
     */
    put(key: GroupName, value: Address): GroupMap;
}
