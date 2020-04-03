import { Mock } from '@quenk/test/lib/mock';

import { Instance } from '../../../../../lib/actor';
import { Envelope } from '../../../../../lib/actor/message';
import { Context } from '../../../../../lib/actor/system/vm/runtime/context';

export class InstanceImpl implements Instance {

    mock = new Mock();

    init(c: Context) {

        return this.mock.invoke('init', [c], c);

    }

    accept(e: Envelope) {

        return this.mock.invoke('accept', [e], this);

    }

    notify() {

        this.mock.invoke('notify', [], this);

    }

    run() {

        this.mock.invoke('run', [], undefined);

    }

    stop() {

        this.mock.invoke('stop', [], undefined);

    }

}

export const newInstance = () => new InstanceImpl()
