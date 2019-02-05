import { Mock } from '@quenk/test/lib/mock';
import { Maybe, just, fromNullable } from '@quenk/noni/lib/data/maybe';
import { tail } from '@quenk/noni/lib/data/array';
import { reduce, merge, rmerge } from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';
import { Err } from '@quenk/noni/lib/control/error';
import { Address } from '../../src/actor/address';
import { System } from '../../src/actor/system';
import { Handle } from '../../src/actor/system/vm/handle';
import { Instance, Actor } from '../../src/actor';
import { Template as T } from '../../src/actor/template';
import { State } from '../../src/actor/system/state';
import { Runtime } from '../../src/actor/system/vm/runtime';
import { Constants as C, Script } from '../../src/actor/system/vm/script';
import { Frame } from '../../src/actor/system/vm/frame';
import { Contexts as Ctxs, Context as Ctx } from '../../src/actor/context';
import { Envelope } from '../../src/actor/message';

export type Constants = C<Ctx, SystemImpl>;

export interface Contexts extends Ctxs<Context> { }

export interface Context extends Ctx { }

export interface Template extends T<Context, SystemImpl> { }

export class InstanceImpl extends Mock implements Instance {

    init(c: Context) {

        return this.MOCK.record('init', [c], c);

    }

    accept(e: Envelope) {

        return this.MOCK.record('accept', [e], this);

    }

    notify() {

        this.MOCK.record('notify', [], this);

    }

    run() {

        this.MOCK.record('run', [], undefined);

    }

    stop() {

        this.MOCK.record('stop', [], undefined);

    }

}

export class SystemImpl extends InstanceImpl implements System<Context> {

    state: State<Context> = { contexts: {}, routers: {} };

    configuration = {}

    allocate(
        a: Actor<Context>,
        h: Handle<Context, SystemImpl>,
        t: Template): Context {

        return this.MOCK.record('allocate', [a, h, t], a.init(newContext({
            handler: { raise() { console.error('TURKET') } }

        })));

    }

}

export class RuntimeImpl extends Mock implements Runtime<Context, SystemImpl> {

    constructor(
        public self = '?',
        public system = new SystemImpl(),
        public stack: Frame<Context, SystemImpl>[] = []) { super(); }

    contexts: { [key: string]: Context } = {};

    routers: { [key: string]: Address } = {};

    current(): Maybe<Frame<Context, SystemImpl>> {

        return this.MOCK.record('current', [], fromNullable(tail(this.stack)));

    }

    raise(e: Err): void {
console.error(e);
        return this.MOCK.record('raise', [e], undefined);

    }

    allocate(addr: Address, t: T<Context, SystemImpl>): Context {

        return this.MOCK.record('allocate', [addr, t], newContext());

    }

    getContext(addr: Address): Maybe<Context> {

        return this.MOCK.record('getContext', [addr],
            fromNullable<Context>(this.contexts[addr]));

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.MOCK.record('getRouter', [addr],
            fromNullable<Context>(
                reduce(this.routers, <Context | undefined>undefined, (p, c, k) =>
                    startsWith(addr, k) ? this.contexts[c] : p)));

    }

    getChildren(addr: Address): Maybe<Contexts> {

        return this.MOCK.record('getContexts', [addr],
            fromNullable(reduce(this.contexts, <Contexts>{}, (p, c, k) =>
                startsWith(k, addr) ? merge(p, { [k]: c }) : p)));

    }

    putContext(addr: Address, ctx: Context): RuntimeImpl {

        this.contexts[addr] = ctx;
        return this.MOCK.record('putContext', [addr, ctx], this);

    }

    removeContext(addr: Address): RuntimeImpl {

        delete this.contexts[addr];
        return this.MOCK.record('removeContext', [addr], this);

    }

    putRoute(target: Address, router: Address): RuntimeImpl {

        this.routers[target] = router;
        return this.MOCK.record('putRoute', [target], this);

    }

    removeRoute(target: Address): RuntimeImpl {

        delete this.routers[target];
        return this.MOCK.record('removeRoute', [target], this);

    }

    push(f: Frame<Context, SystemImpl>): RuntimeImpl {

        this.stack.push(f);
        return this.MOCK.record('push', [f], this);

    }

    clear(): RuntimeImpl {

        this.stack = [];
        return this;

    }

    drop(): RuntimeImpl {

        return this;

    }

    exec(s: Script<Context, SystemImpl>) {

        this.MOCK.record('exec', [s], undefined);

    }

}

export const newContext = (o: Partial<Context> = {}): Context => rmerge({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

    handler: { raise() { } },

    template: { id: 'test', create: () => new InstanceImpl() }

}, <any>o);
