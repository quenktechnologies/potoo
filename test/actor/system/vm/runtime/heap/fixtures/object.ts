import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Mock } from '@quenk/test/lib/mock';

import {
    HeapObject
} from '../../../../../../../lib/actor/system/vm/runtime/heap/object';
import {
    objectType
} from '../../../../../../../lib/actor/system/vm/script/info';
import { PTValue } from '../../../../../../../lib/actor/system/vm/type';
import { HeapAddress } from '../../../../../../../lib/actor/system/vm/runtime/heap';

export class HeapObjectImpl implements HeapObject {

    mock = new Mock();

    cons = objectType;

    get(key: number): Maybe<PTValue> {

        return this.mock.invoke('get', [key], nothing());

    }

    getCount(): number {

        return this.mock.invoke('getCount', [], 0);

    }

    set(key: number, value: PTValue): void {

        return this.mock.invoke('set', [key, value], undefined);

    }

    toAddress(): HeapAddress {

        return this.mock.invoke('toAddress', [], 0);

    }

    promote(): object {

        return this.mock.invoke('promote', [], {});

    }

}

export const newHeapObject = () => new HeapObjectImpl();
