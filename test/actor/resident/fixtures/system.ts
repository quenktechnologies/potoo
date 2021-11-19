import { PVM } from '../../../../lib/actor/system/vm';
import { Conf } from '../../../../lib/actor/system/vm/conf';
import { Template } from '../../../../lib/actor/template';

export class TestSystem {

    constructor(public conf: Partial<Conf> = {}) { }

    vm = PVM.create(this, this.conf);

    getPlatform(): PVM {

        return this.vm;

    }

    stop() {

        this.vm.stop();

    }

    spawn(t: Template): TestSystem {

        this.vm.spawn(this.vm, t);

        return this;

    }

}

export const system = (conf: Partial<Conf> = {}) => new TestSystem(conf)
