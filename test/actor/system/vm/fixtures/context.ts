import { merge } from '@quenk/noni/lib/data/record';

import { Context } from '../../../../../lib/actor/system/vm/runtime/context';
import { InstanceImpl } from './instance';

export const newContext = (o: Partial<Context> = {}): Context => merge({

    mailbox: [],

    address: '?',

    actor: new InstanceImpl(),

    receivers: [],

    flags: { immutable: true, buffered: true },

    template: { id: '/', create: () => new InstanceImpl() }

}, <any>o);
