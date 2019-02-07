import { Mock } from '@quenk/test/lib/mock';
import { Maybe, just, nothing } from '@quenk/noni/lib/data/maybe';
import { rmerge } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/error';
import { System } from '../../src/actor/system';
import { Instance, Actor } from '../../src/actor';
import { Template as T } from '../../src/actor/template';
import { State } from '../../src/actor/system/state';
import { Runtime } from '../../src/actor/system/vm/runtime';
import { This } from '../../src/actor/system/vm/runtime/this';
import { Frame } from '../../src/actor/system/vm/frame';
import { Address } from '../../src/actor/address';
import { Message } from '../../src/actor/message';
import { Constants as C, Value, Script } from '../../src/actor/system/vm/script';
import { Configuration } from '../../src/actor/system/configuration';
import { Contexts as Ctxs, Context as Ctx } from '../../src/actor/context';
import { Envelope } from '../../src/actor/message';
import { Platform } from '../../src/actor/system/vm';

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

export class RuntimeImpl extends Mock implements Runtime<Context, SystemImpl> {

    constructor(public self = '/', public system = new SystemImpl()) { super();  }

    config(): Configuration {

        return this.MOCK.record('config', [], this.system.configuration);

    }

    current(): Maybe<Frame<Context, SystemImpl>> {

        return this.MOCK.record('current', [], nothing());

    }

    allocate(addr: Address, t: Template): Context {

        return this.MOCK.record('allocate', [addr, t], newContext());

    }

    getContext(addr: Address): Maybe<Context> {

        return this.MOCK.record('getContext', [addr], nothing());

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.MOCK.record('getRouter', [addr], nothing());

    }

    getChildren(addr: Address): Maybe<Contexts> {

        return this.MOCK.record('getChildren', [addr], nothing());

    }

    putContext(addr: Address, ctx: Context): RuntimeImpl {

        return this.MOCK.record('putContext', [addr, ctx], this);

    }

    removeContext(addr: Address): RuntimeImpl {

        return this.MOCK.record('removeContext', [addr], this);

    }

    putRoute(target: Address, router: Address): RuntimeImpl {

        return this.MOCK.record('putRoute', [target, router], this);

    }

    removeRoute(target: Address): RuntimeImpl {

        return this.MOCK.record('removeRoute', [target], this);

    }

    push(f: Frame<Context, SystemImpl>): RuntimeImpl {

        return this.MOCK.record('push', [f], this);

    }

    clear(): RuntimeImpl {

        return this.MOCK.record('clear', [], this);

    }

    drop(m: Message): RuntimeImpl {

        return this.MOCK.record('drop', [m], this);

    }

    raise(err: Err): void {

        return this.MOCK.record('raise', [err], <void>undefined);

    }

    exec(s: Script<Context, SystemImpl>): Maybe<Value<Context, SystemImpl>> {

        return this.MOCK.record('exec', [s], nothing());


    }

    run(): Maybe<Value<Context, SystemImpl>> {

        return this.MOCK.record('run', [], nothing());

    }

}

export class SystemImpl extends InstanceImpl
    implements System<Context>, Platform<Context> {

    state: State<Context> = { contexts: {}, routers: {} };

    configuration = {}

    ident(): string {

        return '?';

    }

    allocate(
        a: Actor<Context>,
        h: Runtime<Context, SystemImpl>,
        t: Template): Context {

        return this.MOCK.record('allocate', [a, h, t], a.init(newContext()));

    }

    exec(i: Instance, s: Script<Context, SystemImpl>)
        : Maybe<Value<Context, System<Context>>> {

        return this.MOCK.record('exec', [i, s], nothing());

    }

}

export const newContext = (o: Partial<Context> = {}): Context => rmerge({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

  runtime: new RuntimeImpl(),

    template: { id: '/', create: () => new InstanceImpl() }

}, <any>o);
