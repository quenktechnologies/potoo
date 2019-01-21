import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing, fromNullable } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Address } from '../../src/actor/address';
import { System } from '../..//src/actor/system';
import { Op } from '../..//src/actor/system/op';
import { Instance, Actor } from '../../src/actor';
import { Template } from '../../src/actor/template';
import { Executor } from '../../src/actor/system/vm';
import { Frame } from '../../src/actor/system/vm/frame';
import { Context } from '../../src/actor/context';
import { Envelope } from '../../src/actor/mailbox';

export class InstanceImpl extends Mock implements Instance {

    init(c: Context) {

        return this.MOCK.record('init', [c], c);

    }

    accept(e: Envelope) {

        return this.MOCK.record('accept', [e], this);

    }

    run() {

        this.MOCK.record('run', [], undefined);

    }

    stop() {

        this.MOCK.record('stop', [], undefined);

    }

}

export class SystemImpl extends InstanceImpl implements System<Context> {

    identify(a: Actor<Context>): Address {

        return this.MOCK.record('identify', [a], 'test');

    }

    exec(code: Op<Context, SystemImpl>): SystemImpl {

        return this.MOCK.record('exec', [code], this);

    }

}

export class ExecutorImpl extends Mock implements Executor<Context, SystemImpl> {

    constructor(
        public current: Frame<Context, SystemImpl>,
        public stack: Frame<Context, SystemImpl>[]=[]) { super(); }

    contexts: { [key: string]: Context } = {};

    raise(e: Err): void {

        return this.MOCK.record('raise', [e], undefined);

    }

    allocate(t: Template<Context, SystemImpl>): Context {

        return this.MOCK.record('allocate', [t], newContext());

    }

    getContext(addr: Address): Maybe<Context> {

        return this.MOCK.record('getContext', [addr],
            fromNullable<Context>(this.contexts[addr]));

    }

    putContext(addr: Address, ctx: Context): ExecutorImpl {

        this.contexts[addr] = ctx;
        return this.MOCK.record('putContext', [addr, ctx], this);

    }

    removeContext(addr: Address): ExecutorImpl {

        delete this.contexts[addr];
        return this.MOCK.record('removeContext', [addr], this);

    }

    push(f: Frame<Context, SystemImpl>): ExecutorImpl {

        this.stack.push(f);
        return this.MOCK.record('push', [f], this);

    }

}


export const newContext = (): Context => ({

    mailbox: nothing(),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: false },

    template: { id: 'test', create: () => new InstanceImpl() }

});
