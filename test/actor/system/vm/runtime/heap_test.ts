import { assert } from '@quenk/test/lib/assert';

import { Heap, HeapEntry } from '../../../../../lib/actor/system/vm/runtime/heap';

describe('Heap', () => {

    describe('add', () => {

        it('should add HeapEntrys', () => {

            let heap = new Heap();

            heap.add(new HeapEntry(1, true, 12));

            assert(heap.pool[0].value).equal(12);

        })

    })

    describe('get', () => {

        it('should retrieve a value from a reference', () => {

            let heap = new Heap();

            let ref = heap.add(new HeapEntry(1, true, 12));

            let e = heap.get(ref).get();

            assert(heap.get(ref).get().value).equal(12);

        });

    })

})
