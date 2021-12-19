import { nothing, Maybe } from '@quenk/noni/lib/data/maybe';
import { Mock } from '@quenk/test/lib/mock';

import {
    HeapObject
} from '../../../../../lib/actor/system/vm/runtime/heap/object';
import {
    Heap,
    HeapAddress
} from '../../../../../lib/actor/system/vm/runtime/heap';
import {
    DATA_TYPE_HEAP_STRING
} from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { PTValue } from '../../../../../lib/actor/system/vm/type';
import { FunInfo } from '../../../../../lib/actor/system/vm/script/info';
import { Type } from '@quenk/noni/lib/data/type';

export class HeapImpl implements Heap {

    constructor(
        public objects: HeapObject[] = [],
        public strings: string[] = []) { }

    mock = new Mock();

    addString(value: string): HeapAddress {

        return this.mock.invoke<HeapAddress>('addString', [value],
            DATA_TYPE_HEAP_STRING | 0);

    }

    addObject(h: HeapObject): HeapAddress {

        return this.mock.invoke<HeapAddress>('addObject', [h], 0);

    }

    addFun(val: FunInfo): HeapAddress {

        return this.mock.invoke<HeapAddress>('addFun', [val], 0);

    }

    addForeign(val: Type): HeapAddress {

        return this.mock.invoke<HeapAddress>('addForeign', [val], 0);

    }

    getString(r: HeapAddress): string {

        return this.mock.invoke('getString', [r], '');

    }

    getObject(r: HeapAddress): Maybe<HeapObject> {

        return this.mock.invoke('getObject', [r], nothing());

    }

    getFun(ptr: HeapAddress): Maybe<FunInfo> {

        return this.mock.invoke('getFun', [ptr], nothing());

    }

    getForeign(ptr: HeapAddress): Maybe<Type> {

        return this.mock.invoke('getForeign', [ptr], nothing());

    }

    getAddress(v: PTValue): HeapAddress {

        return this.mock.invoke('getAddress', [v], 0);

    }

    exists(o: HeapObject): boolean {

        return this.mock.invoke('exists', [o], false);

    }

    release(): void {

        return this.mock.invoke('release', [], undefined);

    }

}

export const newHeap = () => new HeapImpl();
