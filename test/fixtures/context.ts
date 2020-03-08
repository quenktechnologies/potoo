import { Mock } from '@quenk/test/lib/mock';
import { Maybe, just, nothing } from '@quenk/noni/lib/data/maybe';
import { rmerge } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/error';
import { System } from '../../src/actor/system';
import { Instance, Actor } from '../../src/actor';
import { Template as T } from '../../src/actor/template';
import { State } from '../../src/actor/system/state';
import { Runtime } from '../../src/actor/system/vm/runtime';
import { Frame } from '../../src/actor/system/vm/runtime/stack/frame';
import { Address } from '../../src/actor/address';
import { Message } from '../../src/actor/message';
import { Constants as C, PVM_Value, Script } from '../../src/actor/system/vm/script';
import { Configuration } from '../../src/actor/system/configuration';
import { Contexts as Ctxs, Context as Ctx } from '../../src/actor/context';
import { Envelope } from '../../src/actor/message';
import { InstanceImpl } from './instance';
import { Context } from '../../lib/actor/context';
import { RuntimeImpl } from './runtime';

export const newContext = (o: Partial<Context> = {}): Context => rmerge({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

    runtime: new RuntimeImpl(),

    template: { id: '/', create: () => new InstanceImpl() }

}, <any>o);
