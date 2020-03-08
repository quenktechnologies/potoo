import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Runtime } from '../../src/actor/system/vm/runtime';
import { Frame } from '../../src/actor/system/vm/runtime/stack/frame';
import { Message } from '../../src/actor/message';
import { PVM_Value } from '../../src/actor/system/vm/script';
import { FunInfo } from '../../lib/actor/system/vm/script/info';
import { Heap } from '../../lib/actor/system/vm/runtime/heap';
import { FPVM } from './vm';
import { newContext } from './context';

export class RuntimeImpl extends Mock implements Runtime {

    constructor(
        public self = '/',
        public context = newContext(),
        public vm = new FPVM(),
        public heap = new Heap()) { super(); }

    clear(): RuntimeImpl {

        return this.MOCK.record('clear', [], this);

    }

    drop(m: Message): RuntimeImpl {

        return this.MOCK.record('drop', [m], this);

    }

    raise(err: Err): void {

        return this.MOCK.record('raise', [err], <void>undefined);

    }

    exec(c: Frame, f: FunInfo, args: PVM_Value[]) {

        this.MOCK.record('exec', [c, f, args], nothing());

    }

    run(): Maybe<PVM_Value> {

        return this.MOCK.record('run', [], nothing());

    }

}
