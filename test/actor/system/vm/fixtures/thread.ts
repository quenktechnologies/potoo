import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { right, Either } from '@quenk/noni/lib/data/either';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';

import { VMThread, THREAD_STATE_IDLE } from '../../../../../lib/actor/system/vm/thread';
import { Job } from '../../../../../lib/actor/system/vm/thread/shared';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Message } from '../../../../../lib/actor/message';
import { FunInfo } from '../../../../../lib/actor/system/vm/script/info';
import { PTValue } from '../../../../../lib/actor/system/vm/type';
import { Address } from '../../../../../lib/actor/address';
import { PScript } from '../../../../../lib/actor/system/vm/script';
import { FPVM } from './vm';
import { newContext } from './context';

export class ThreadImpl implements VMThread {

    constructor(
        public context = newContext(),
        public vm = new FPVM(),
        public script = new PScript('main')) { }

    mock = new Mock();

    state = THREAD_STATE_IDLE;

    fstack = [];

    fsp = 0;

    rp = 0;

    clear(): ThreadImpl {

        return this.mock.invoke('clear', [], this);

    }

    drop(m: Message): ThreadImpl {

        return this.mock.invoke('drop', [m], this);

    }

    raise(err: Err): void {

        console.error('ThreadImp.raise: ', err);

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

    wait(ft: Future<void>) {

        return this.mock.invoke('wait', [ft], right(undefined));

    }

    exec(funName: string, args: number[]): Maybe<PTValue> {

        return this.mock.invoke('exec', [funName, args], nothing());

    }

    resume(job: Job): void {

        return this.mock.invoke('resume', [job], undefined);

    }

}

export const newThread = (
    context = newContext(),
    vm = new FPVM(),
    script = new PScript('main')) => new ThreadImpl(context, vm, script);
