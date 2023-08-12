import { assert } from '@quenk/test/lib/assert';

import { count } from '@quenk/noni/lib/data/record';

import {
    DefaultHeapLedger
} from '../../../../../../lib/actor/system/vm/runtime/heap/ledger';
import {
    DATA_TYPE_HEAP_STRING,
    DATA_TYPE_HEAP_OBJECT
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import { newFrame } from '../../fixtures/frame';
import { newHeapObject } from '../../type/fixtures/object';
import { newThread } from '../../fixtures/thread';

let firstString = DATA_TYPE_HEAP_STRING | 0;
let firstObject = DATA_TYPE_HEAP_OBJECT | 0;

describe('heap', () => {

    describe('DefaultHeapLedger', () => {

        describe('addObject', () => {

            it('should add objects to the pool', () => {

                let heap = new DefaultHeapLedger();

                let obj = newHeapObject();

                heap.addObject(newFrame(), obj);

                assert(heap.objects[firstObject]).equal(obj);

            })

        })

        describe('addString', () => {

            it('should add strings to the pool', () => {

                let heap = new DefaultHeapLedger();

                heap.addString(newFrame(), 'foo');

                assert(heap.objects[firstString]).equal('foo');

            });

          // Disabled until we decided if no string dups is worth the effort.
            xit('should not duplicate', () => {

                let heap = new DefaultHeapLedger();

                heap.addString(newFrame(), 'foo');

                heap.addString(newFrame(), 'foo');

                assert(count(heap.objects)).equal(1);

            });

        });

        describe('getObject', () => {

            it('should retrieve a value from a reference', () => {

                let obj = newHeapObject();

                let heap = new DefaultHeapLedger();

                let ref = heap.addObject(newFrame(), obj);

                assert(heap.getObject(ref).get()).equal(obj);

            });

        })

        describe('getString', () => {

            it('should retrieve a string from a reference', () => {

                let heap = new DefaultHeapLedger();

                let ref = heap.addString(newFrame(), 'foo');

                assert(heap.getString(ref)).equal('foo');

            });

        })

        describe('getFrameRefs', () => {

            it('should provide the refs for a frame', () => {

                let target = 'test@22#main';

                let heap = new DefaultHeapLedger({

                    123: {},

                    1234: [12],

                    123456: 'string'

                }, {

                    123: 'unknown@22#main',

                    1234: target,

                    123456: target

                });

                let frame = newFrame(target);

                assert(heap.getFrameRefs(frame)).equate([1234, 123456]);

            });

        });

        describe('getThreadRefs', () => {

            it('should provide the refs for a thread', () => {

                let target = 'test@22#main';

                let heap = new DefaultHeapLedger({

                    123: {},

                    1234: [12],

                    123456: 'string'

                }, {

                    123: 'unknown@23#main',

                    1234: target,

                    123456: target

                });

                let thread = newThread();

                thread.context.template.id = 'test';

                thread.context.aid = 22;

                assert(heap.getThreadRefs(thread)).equate([1234, 123456]);

            });

        });

        describe('intern', () => {

            it('should intern strings automatically', () => {

                let heap = new DefaultHeapLedger();

                let str = 'ibis';

                assert(heap.intern(newFrame(), str)).not.equal(0);

                assert(heap.objects[firstString]).equal(str);

            });

            it('should provide references for objects', () => {

                let heap = new DefaultHeapLedger();

                let obj = newHeapObject();

                heap.objects[firstObject] = obj;

                assert(heap.intern(newFrame(), obj)).equal(firstObject);

            });

            it('should return numeric values', () => {

                let heap = new DefaultHeapLedger();

                let n = 22;

                assert(heap.intern(newFrame(), n)).equal(n);

            });

        });

        describe('frameExit', () => {

            it('should remove all addresses owned by the frame', () => {

                let target = 'test@22#main';

                let heap = new DefaultHeapLedger({

                    123: 'food',

                    1234: [12],

                    123456: 'string'

                }, {

                    123: 'unknown@22#main',

                    1234: target,

                    123456: target

                });

                heap.frameExit(newFrame(target));

                assert(count(heap.objects)).equal(1);

                assert(count(heap.owners)).equal(1);

                assert(heap.objects[123]).equal('food');

                assert(heap.owners[123]).equal('unknown@22#main');

            });

        });

        describe('threadExit', () => {

            it('should remove all addresses owned by the thread', () => {

                let target = 'test@22#main';

                let heap = new DefaultHeapLedger({

                    123: 'food',

                    1234: [12],

                    123456: 'string'

                }, {

                    123: 'unknown@23#main',

                    1234: target,

                    123456: 'other@22#main'

                });

                let thread = newThread();

                thread.context.template.id = 'test';

                thread.context.aid = 22;

                heap.threadExit(thread);

                assert(count(heap.objects)).equal(1);

                assert(count(heap.owners)).equal(1);

                assert(heap.objects[123]).equal('food');

                assert(heap.owners[123]).equal('unknown@23#main');

            })

        })

    })

})
