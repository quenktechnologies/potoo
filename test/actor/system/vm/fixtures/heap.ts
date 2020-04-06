import { nothing, Maybe } from '@quenk/noni/lib/data/maybe';
import { Mock } from '@quenk/test/lib/mock';

import {
    HeapEntry,
    HeapReference,
    HeapValue
} from "../../../../../lib/actor/system/vm/runtime/heap";
import {
    DATA_TYPE_HEAP
} from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import {
    DATA_TYPE_HEAP_STRING
} from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { StringReference } from '../../../../../lib/actor/system/vm/runtime/heap';

export class HeapImpl {

    constructor(
        public pool: HeapEntry[] = [],
        public strings: string[] = []) { }

    mock = new Mock();

    add(h: HeapEntry): HeapReference {

        return this.mock.invoke<HeapReference>('add', [h], DATA_TYPE_HEAP | 0);

    }

    addString(value: string): HeapReference {

        return this.mock.invoke<HeapReference>('addString', [value],
            DATA_TYPE_HEAP_STRING | 0);

    }

    get(r: HeapReference): Maybe<HeapEntry> {

        return this.mock.invoke('get', [r], nothing());

    }

    getString(r: StringReference): string {

        return this.mock.invoke('getString', [r], '');

    }

    ref(v: HeapValue): Maybe<HeapReference> {

        return this.mock.invoke('ref', [v], nothing());

    }

    release(): void {

        return this.mock.invoke('release', [], undefined);

    }

}

export const newHeap = () => new HeapImpl();
