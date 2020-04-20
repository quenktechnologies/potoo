import { Maybe } from '@quenk/noni/lib/data/maybe';

import { TypeInfo } from '../../../script/info';
import { PTValue } from '../../../type';
import { HeapAddress } from '../';

/**
 * HeapObject is the interface of objects stored in the object pool.
 */
export interface HeapObject {

    /**
     * cons is the constructor for the object.
     */
    cons: TypeInfo

    /**
     * get a property from the object by name.
     */
    get(key: number): Maybe<PTValue>

    /**
     * getCount of items in the object.
     *
     * This method is intended for arrays.
     */
    getCount(): number;

    /**
     * set a property on the object by name.
     */
    set(key: number, value: PTValue): void

    /**
     * toAddress converts a HeapObject into its address.
     *
     * If the object is not on the heap the address is void.
     */
    toAddress(): HeapAddress

    /**
     * promote this HeapObject to an opaque ECMAScript object.
     */
    promote(): object

}
