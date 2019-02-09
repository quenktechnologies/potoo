import { assert } from '@quenk/test/lib/assert';
import { ActorSystem, system } from '../../../src/actor/system/framework/default';
import { Case } from '../../../src/actor/resident/case';
import { Mutable } from '../../../src/actor/resident';
import { Context } from '../../../src/actor/context';
import { Process } from '../../../src/actor/process';
import { System } from '../../../src/actor/system';

class Sender extends Mutable<Context, ActorSystem> {

    constructor(
        public system: System<Context>,
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

            system({ log: { level: 1 } })

                .spawn({

                    id: 'echo',
                    create: s => new Process(`${__dirname}/echo.js`, s)

                })
                .spawn({

                    id: 'sender',
                    create: s => new Sender(s, done)

                })
        })

    })

})
