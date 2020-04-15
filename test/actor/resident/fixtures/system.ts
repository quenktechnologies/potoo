import { PVM } from '../../../../lib/actor/system/vm';
import { Instance } from '../../../../lib/actor';
import { Script } from '../../../../lib/actor/system/vm/script';
import { Conf } from '../../../../lib/actor/system/vm/conf';
import { Template } from '../../../../lib/actor/template';

export class TestSystem {

    constructor(public conf: Partial<Conf> = {}) { }

    vm = PVM.create(this, this.conf);

    exec(i: Instance, s: Script) {

        this.vm.exec(i, s);

    }

    stop() {

        this.vm.stop();

    }

    spawn(t: Template<TestSystem>): TestSystem {

        this.vm.spawn(t);

        return this;

    }

}

export const system = (conf: Partial<Conf> = {}) => new TestSystem(conf)
