import {must} from '@quenk/must';
import {
    AbstractSystem,
    newState,
    newContext
}
from '../../../../src/actor/system/abstract';
import { Op } from '../../../../src/actor/system/op';
import { Context } from '../../../../src/actor/context';
import { Template } from '../../../../src/actor/template';

class Int extends Op<Context, Sys> {

    constructor(public f: () => void) {

        super();

    }
    public code = 0;

    public level = 0;

    exec(): void {

        return this.f();

    }

}

class Sys extends AbstractSystem<Context>{

    state = newState(this);

    allocate(t: Template<Context, Sys>) {

        let act = t.create(this);
        return newContext(act, t);

    }

}

describe('abstract', () => {

    describe('AbstractSystem', () => {

        it('should execute instructions as a queue', () => {

            let s = new Sys();
            let val: number[] = [];

            s.stack = [

                new Int(() => val.push(1)),

                new Int(() => val.push(2)),

                new Int(() => val.push(3))

            ]

            s.run();

            must(val).equate([1, 2, 3]);

        });

    });

});
