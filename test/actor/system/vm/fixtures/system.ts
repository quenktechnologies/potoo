import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';

import { Script, PVM_Value } from '../../../../../lib/actor/system/vm/script';
import { Instance } from '../../../../../lib/actor';
import { System } from '../../../../../lib/actor/system';

export class SystemImpl implements System {

    mock = new Mock();

    exec(i: Instance, s: Script): Maybe<PVM_Value> {

        return this.mock.invoke('exec', [i, s], nothing());

    }

}

export const newSystem = () => new SystemImpl();
