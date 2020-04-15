import { assert } from '@quenk/test/lib/assert';

import { Case } from '../../../src/actor/resident/case';
import { Mutable } from '../../../lib/actor/resident';
import { Process } from '../../../lib/actor/process';
import { TestSystem, system } from '../resident/fixtures/system';

class Sender extends Mutable<TestSystem> {

    constructor(
        public system: TestSystem,
        public done: () => void) { super(system); }

    run() {

        this.tell('echo', { client: this.self(), message: 'hi' });

        this.select([

            new Case(String, (m: string) => {

                assert(m).equal('hi');

                this.done();

            })]);

    }

}

describe('process', () => {

    describe('Process', () => {

        it('should be spawnable', done => {

            let s = system();

            s.spawn({

                id: 'echo',
                create: s => new Process(`${__dirname}/echo.js`, s)

            });

            s.spawn({

                id: 'sender',
                create: s => new Sender(s, done)

            });

            s.stop();

        })

    })

})
