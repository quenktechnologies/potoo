import { Mock } from '@quenk/test/lib/mock';

import { System } from '../../../../../lib/actor/system';
import { Platform } from '../../../../../lib/actor/system/vm';
import { FPVM } from './vm';

export class SystemImpl implements System {

    mock = new Mock();

    vm = new FPVM();

    getPlatform(): Platform {

        return this.mock.invoke('exec', [], this.vm);

    }

}

export const newSystem = () => new SystemImpl();
