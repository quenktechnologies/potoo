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

export class HeapImpl implements Heap {

    constructor(
        public objects: HeapObject[] = [],
        public strings: string[] = []) { }

    mock = new Mock();

    addObject(h: HeapObject): HeapAddress {

        return this.mock.invoke<HeapAddress>('addObject', [h], 0);

    }

    addString(value: string): HeapAddress {

        return this.mock.invoke<HeapAddress>('addString', [value],
            DATA_TYPE_HEAP_STRING | 0);

    }

    getObject(r: HeapAddress): Maybe<HeapObject> {

        return this.mock.invoke('getObject', [r], nothing());

    }

    getString(r: HeapAddress): string {

        return this.mock.invoke('getString', [r], '');

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
