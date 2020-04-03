import { just } from '@quenk/noni/lib/data/maybe';
import { merge } from '@quenk/noni/lib/data/record';

import { Context } from '../../../../../lib/actor/system/vm/runtime/context';
import { InstanceImpl } from './instance';

export const newContext = (o: Partial<Context> = {}): Context => merge({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

    template: { id: '/', create: () => new InstanceImpl() }

}, <any>o);
