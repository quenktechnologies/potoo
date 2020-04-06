import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';

import { Script, PVM_Value } from '../../../../../lib/actor/system/vm/script';
import { System } from '../../../../../lib/actor/system';
import { Address } from '../../../../../lib/actor/address';
import { Instance } from '../../../../../lib/actor';

export class SystemImpl implements System {

    mock = new Mock();

    exec(i: Instance, s: Script): Maybe<PVM_Value> {

        return this.mock.invoke('exec', [i, s], nothing());

    }

    ident(i: Instance): Address {

        return this.mock.invoke('exec', [i], '?');

    }

}

export const newSystem = () => new SystemImpl();
