import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { right, Either } from '@quenk/noni/lib/data/either';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';

import { Runtime } from '../../../../../lib/actor/system/vm/runtime';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Message } from '../../../../../lib/actor/message';
import { Script } from '../../../../../lib/actor/system/vm/script';
import { FunInfo } from '../../../../../lib/actor/system/vm/script/info';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { PTValue } from '../../../../../lib/actor/system/vm/type';
import { Address } from '../../../../../lib/actor/address';
import { FPVM } from './vm';
import { newContext } from './context';

export class RuntimeImpl implements Runtime {

    constructor(
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

    invokeVM(p: Frame, f: FunInfo) {

        this.mock.invoke('invokeVM', [p, f], undefined);

    }

    invokeForeign(p: Frame, f: FunInfo, args: PTValue[]) {

        this.mock.invoke('invokeForeign', [p, f, args], undefined);

    }

    die(): Future<void> {

        return this.mock.invoke('die', [], pure(<void>undefined));

    }

    kill(target: Address): Either<Err, void> {

        return this.mock.invoke('kill', [target], right(undefined));

    }

    runTask(ft: Future<void>) {

        return this.mock.invoke('runTask', [ft], right(undefined));

    }

    exec(s: Script): Maybe<PTValue> {

        return this.mock.invoke('exec', [s], nothing());

    }

}

export const newRuntime = (
    context = newContext(),
    vm = new FPVM(),
    heap = new Heap()) => new RuntimeImpl(context, vm, heap);
