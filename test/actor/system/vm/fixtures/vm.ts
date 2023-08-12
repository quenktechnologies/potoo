import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Either, right } from '@quenk/noni/lib/data/either';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';

import { Spawnable, Template } from '../../../../../lib/actor/template';
import { Address } from '../../../../../lib/actor/address';
import { Context  } from '../../../../../lib/actor/system/vm/runtime/context';
import { Platform } from '../../../../../lib/actor/system/vm';
import { Message } from '../../../../../lib/actor/message';
import { Instance } from '../../../../../lib/actor';
import { HeapLedgerImpl } from './heap/ledger';
import { LogWritableImpl } from './log';
import { EventSourceImpl } from './event';
import { ActorTable } from '../../../../../lib/actor/system/vm/table';

export class FPVM implements Platform {

    mock = new Mock();

    actors = new ActorTable();

    heap = new HeapLedgerImpl();

    log = new LogWritableImpl();

    events = new EventSourceImpl();

    allocate(addr: Address, t: Template): Either<Err, Address> {

        return this.mock.invoke('allocate', [addr, t], right('?'));

    }

    sendMessage(to: Address, from: Address, m: Message): boolean {

        return this.mock.invoke('sendMessage', [to, from, m], true);

    }

    spawn(inst: Instance, spec: Spawnable): Address {

        return this.mock.invoke('spawn', [inst, spec], '?');

    }

    identify(target: Instance): Maybe<Address> {

        return this.mock.invoke('identify', [target], nothing());

    }

    raise(parent: Instance, err: Err): void {

        this.mock.invoke<undefined>('raise', [parent, err], undefined);

        // Do this to avoid hiding vm errors.
        console.error('FPVM.raise: ', err);

    }

    kill(parent: Instance, target: Address): Future<void> {

        return this.mock.invoke('kill', [parent, target], pure(<void>undefined));

    }

    runTask(addr: Address, ft: Future<void>) {

        return this.mock.invoke('runTask', [addr, ft], undefined);

    }

    init(c: Context): Context {

        return this.mock.invoke('init', [c], c);

    }

    accept(m: Message) {

        return this.mock.invoke('accept', [m], undefined);

    }

    start() {

        return this.mock.invoke('start', [], undefined);

    }

    notify() {

        return this.mock.invoke('notify', [], undefined);

    }

    stop() {

        return this.mock.invoke('stop', [], undefined);

    }

    exec(actor: Instance, funName: string, args?: any[]) {

        return this.mock.invoke('exec', [actor, funName, args], undefined);

    }

}

export const newPlatform = () => new FPVM();
