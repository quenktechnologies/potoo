import { nothing, Maybe } from '@quenk/noni/lib/data/maybe';
import { Mock } from '@quenk/test/lib/mock';

import {
    HeapValue,
    HeapMap,
    HeapObject,
    Owners,
    HeapLedger
} from '../../../../../../lib/actor/system/vm/runtime/heap/ledger';
import {
    HeapAddress
} from '../../../../../../lib/actor/system/vm/runtime/heap';
import {
    DATA_TYPE_HEAP_FUN,
    DATA_TYPE_HEAP_OBJECT,
    DATA_TYPE_HEAP_STRING, Frame, FrameName
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import { VMThread } from '../../../../../../lib/actor/system/vm/thread';
import { FunInfo } from '../../../../../../lib/actor/system/vm/script/info';

export class HeapLedgerImpl implements HeapLedger {

    constructor(
        public objects: HeapMap = {},
        public owners: Owners = {}) { }

    mock = new Mock();

    string(value: string): HeapAddress {

        return this.mock.invoke<HeapAddress>('string', [value],
            DATA_TYPE_HEAP_STRING | 0);

    }

    object(value: object): HeapAddress {

        return this.mock.invoke<HeapAddress>('object', [value],
            DATA_TYPE_HEAP_OBJECT | 0);

    }

    fun(value: FunInfo): HeapAddress {

        return this.mock.invoke<HeapAddress>('fun', [value],
            DATA_TYPE_HEAP_FUN | 0);

    }

    addString(frame: Frame, value: string): HeapAddress {

        return this.mock.invoke<HeapAddress>('addString', [frame, value],
            DATA_TYPE_HEAP_STRING | 0);

    }

    addObject(frame: Frame, obj: HeapObject): HeapAddress {

        return this.mock.invoke<HeapAddress>('addObject', [frame, obj],
            DATA_TYPE_HEAP_OBJECT | 0);

    }

    addFun(frame: Frame, obj: FunInfo): HeapAddress {

        return this.mock.invoke<HeapAddress>('addFun', [frame, obj],
            DATA_TYPE_HEAP_FUN | 0);

    }

    getString(r: HeapAddress): string {

        return this.mock.invoke('getString', [r], '');

    }

    getObject(r: HeapAddress): Maybe<HeapObject> {

        return this.mock.invoke('getObject', [r], nothing());

    }

    getFrameRefs(frame: Frame): HeapAddress[] {

        return this.mock.invoke('getFrameRefs', [frame], []);

    }

    getThreadRefs(thread: VMThread): HeapAddress[] {

        return this.mock.invoke('getThreadRefs', [thread], []);

    }

    intern(frame: Frame, value: HeapValue): HeapAddress {

        return this.mock.invoke('intern', [frame, value], 0);

    }

    move(ref:HeapAddress, newOwner: FrameName) : HeapAddress {

    return this.mock.invoke('intern', [ref, newOwner], 0);

    }

    frameExit(frame: Frame): void {

        return this.mock.invoke('frameExit', [frame], undefined);

    }

    threadExit(thread: VMThread): void {

        return this.mock.invoke('threadExit', [thread], undefined);

    }


}

export const newHeap = () => new HeapLedgerImpl();
