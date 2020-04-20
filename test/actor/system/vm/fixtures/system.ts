import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';

import { Script } from '../../../../../lib/actor/system/vm/script';
import { PTValue } from '../../../../../lib/actor/system/vm/type';
import { System } from '../../../../../lib/actor/system';
import { Instance } from '../../../../../lib/actor';

export class SystemImpl implements System {

    mock = new Mock();

    exec(i: Instance, s: Script): Maybe<PTValue> {

        return this.mock.invoke('exec', [i, s], nothing());

    }

}

export const newSystem = () => new SystemImpl();
