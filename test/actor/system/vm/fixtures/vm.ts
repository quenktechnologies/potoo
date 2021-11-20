import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Either, right } from '@quenk/noni/lib/data/either';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';

import { System } from '../../../../../lib/actor/system';
import { Spawnable, Template } from '../../../../../lib/actor/template';
import { State, Runtimes } from '../../../../../lib/actor/system/vm/state';
import { Address } from '../../../../../lib/actor/address';
import { Context } from '../../../../../lib/actor/system/vm/runtime/context';
import { Platform } from '../../../../../lib/actor/system/vm';
import { Runtime, Operand, Opcode } from '../../../../../lib/actor/system/vm/runtime';
import { Message } from '../../../../../lib/actor/message';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Instance } from '../../../../../lib/actor';
import { HeapImpl } from './heap';
import { GarbageCollector } from '../../../../../lib/actor/system/vm/runtime/gc';
import { Script } from '../../../../../lib/actor/system/vm/script';

export class FPVM<S extends System> implements Platform {

    mock = new Mock();

    state: State = {

        runtimes: {},

        routers: {},

        groups: {},

        pendingMessages: {}

    };

    heap = new HeapImpl();

    gc = new GarbageCollector(this.heap);

    configuration = {};

    ident(): string {

        return '?';

    }

    allocate(addr: Address, t: Template): Either<Err, Address> {

        return this.mock.invoke('allocate', [addr, t], right('?'));

    }

    runActor(addr: Address): Future<void> {

        return this.mock.invoke('runActor', [addr], pure(<void>undefined));

    }

    sendMessage(to: Address, from: Address, m: Message): boolean {

        return this.mock.invoke('sendMessage', [to, from, m], true);

    }

    getRuntime(addr: Address): Maybe<Runtime> {

        return this.mock.invoke('getContext', [addr], nothing());

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.mock.invoke('getRouter', [addr], nothing());

    }

    getGroup(addr: Address): Maybe<Address[]> {

        return this.mock.invoke('getGroup', [addr], nothing());

    }

    putRuntime(addr: Address, ctx: Runtime): FPVM<S> {

        return this.mock.invoke('putRuntime', [addr, ctx], this);

    }

    getChildren(addr: Address): Maybe<Runtimes> {

        return this.mock.invoke('getChildren', [addr], nothing());

    }

    spawn(inst: Instance, spec: Spawnable): Address {

        return this.mock.invoke('spawn', [inst, spec], '?');

    }

    remove(addr: Address): FPVM<S> {

        return this.mock.invoke('remove', [addr], this);

    }

    putRoute(target: Address, router: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [target, router], this);

    }

    removeRoute(target: Address): FPVM<S> {

        return this.mock.invoke('removeRoute', [target], this);

    }

    putMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [group, addr], this);

    }

    removeMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('removeGroup', [group, addr], this);

    }

    raise(addr: Address, err: Err): void {

        return this.mock.invoke<undefined>('raise', [addr, err], undefined);

    }

    kill(parent: Address, target: Address): Future<void> {

        return this.mock.invoke('kill', [parent, target], pure(<void>undefined));

    }

    trigger(addr: Address, evt: string, ...args: any[]) {

        return this.mock.invoke('kill', [addr, evt, args], undefined);

    }

    logOp(r: Runtime, f: Frame, op: Opcode, oper: Operand) {

        return this.mock.invoke('logOp', [r, f, op, oper], undefined);

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

    exec(i: Instance, s: Script): void {

        return this.mock.invoke('runTask', [i, s], undefined);

    }

}

export const newPlatform = () => new FPVM();
