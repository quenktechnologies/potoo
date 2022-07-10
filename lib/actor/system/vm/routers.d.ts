import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Map } from './map';
/**
 * RouterMap is a mapping of address prefixes to the address of an actor that
 * serves as a router for any address beneath the prefix.
 */
export declare class RouterMap extends Map<Address> {
    /**
     * getFor attempts to find a router for the specified address.
     */
    getFor(addr: Address): Maybe<Address>;
}
