import { Mock } from '@quenk/test/lib/mock';

import { Instance } from '../../lib/actor';
import { Envelope } from '../../lib/actor/message';
import { Context } from '../../lib/actor/context';

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
