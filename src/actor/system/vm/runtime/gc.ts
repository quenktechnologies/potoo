import { forEach } from '@quenk/noni/lib/data/record';

import {
    Data,
    DATA_MASK_TYPE,
    DATA_TYPE_HEAP_OBJECT,
    DATA_TYPE_HEAP_STRING,
    StackFrame
} from './stack/frame';
import { Heap } from './heap';
import { VMThread } from '../thread';

/**
 * GarbageCollector is a simple reference count based garbage collector for 
 * Heap objects.
 */
export class GarbageCollector {

    constructor(public heap: Heap) { }

    /**
     * refCounts holds the reference count for every heap object in the system.
     */
    refs: { [key: number]: number } = {};

    /**
     * addRef adds an address to the reference table, initalizing it to 1.
     */
    addRef(addr: Data) {

        let typ = addr & DATA_MASK_TYPE;

        if ((typ === DATA_TYPE_HEAP_STRING) || (typ === DATA_TYPE_HEAP_OBJECT)) {

            let ref = this.refs[addr];

            this.refs[addr] = ref == null ? 1 : ref++;

        }

    }

    /**
     * frameRemoved is called to indicate a StackFrame has been removed and its
     * references should be cleaned up.
     *
     * This uses the locals property of the frame to detect what references were
     * held on to.
     */
    frameRemoved(thread: VMThread, frame: StackFrame) {

        frame.locals.forEach(ref => {

            if (this.refs[ref] && thread.rp != ref) {

                --this.refs[ref];

                if (this.refs[ref] == 0) {

                    this.heap.release(ref);
                }

            }

        });

    }

    /**
     * reclaim will review the ref count of all objects and eject the ones that
     * have a 0 reference count.
     */
    reclaim() {

        forEach(this.refs, (count, ref) => {

            if (count === 0) {

                this.heap.release(Number(ref));

            }

        });

    }

}
