import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';

import { Runtime } from '../../../../../lib/actor/system/vm/runtime';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Message } from '../../../../../lib/actor/message';
import { PVM_Value } from '../../../../../lib/actor/system/vm/script';
import { FunInfo } from '../../../../../lib/actor/system/vm/script/info';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { FPVM } from './vm';
import { newContext } from './context';

export class RuntimeImpl implements Runtime {

    constructor(
        public self = '/',
        public context = newContext(),
        public vm = new FPVM(),
        public heap = new Heap()) { }

    mock = new Mock();

    clear(): RuntimeImpl {

        return this.mock.invoke('clear', [], this);

    }

    drop(m: Message): RuntimeImpl {

        return this.mock.invoke('drop', [m], this);

    }

    raise(err: Err): void {

        return this.mock.invoke<undefined>('raise', [err], undefined);

    }

    call(c: Frame, f: FunInfo, args: PVM_Value[]) {

        this.mock.invoke('call', [c, f, args], nothing());

    }

    run(): Maybe<PVM_Value> {

        return this.mock.invoke('run', [], nothing());

    }

}

export const newRuntime = (
    self = '/',
    context = newContext(),
    vm = new FPVM(),
    heap = new Heap()) => new RuntimeImpl(self, context, vm, heap);
