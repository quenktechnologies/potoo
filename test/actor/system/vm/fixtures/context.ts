import { just } from '@quenk/noni/lib/data/maybe';
import { rmerge } from '@quenk/noni/lib/data/record';

import { Context } from '../../../../../lib/actor/context';
import { InstanceImpl } from './instance';

export const newContext = (o: Partial<Context> = {}): Context => rmerge({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

    template: { id: '/', create: () => new InstanceImpl() }

}, <any>o);
