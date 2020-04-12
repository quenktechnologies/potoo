import { Maybe } from '@quenk/noni/lib/data/maybe';

import { PVM } from '../../../../lib/actor/system/vm';
import { Instance } from '../../../../lib/actor';
import { PVM_Value, Script } from '../../../../lib/actor/system/vm/script';
import { Conf } from '../../../../lib/actor/system/vm/conf';
import { Template } from '../../../../lib/actor/template';

export class TestSystem {

    constructor(public conf: Partial<Conf> = {}) { }

    vm = PVM.create(this, this.conf);

    exec(i: Instance, s: Script): Maybe<PVM_Value> {

        return this.vm.exec(i, s);

    }

    spawn(t: Template<TestSystem>): TestSystem {

        this.vm.spawn(t);

        return this;

    }

}

export const system = (conf: Partial<Conf> = {}) => new TestSystem(conf)
