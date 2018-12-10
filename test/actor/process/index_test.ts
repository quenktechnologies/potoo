import {must} from '@quenk/must';
import { ActorSystem, system } from '../../../src';
import { Mutable, Case } from '../../../src/actor/resident';
import { Context } from '../../../src/actor/context';
import { Process } from '../../../src/actor/process';
import { System } from '../../../src/actor/system';

class Sender extends Mutable<String, Context, ActorSystem> {

    constructor(
        public system: System<Context>,
        public done: () => void) { super(system); }

    receive = [

        new Case(String, (m: string) => {

            must(m).equal('hi');

            this.done()

        })

    ]

    run() {

        this.tell('echo', { client: this.self(), message: 'hi' });

        this.select([

            new Case(String, (m: string) => {

                must(m).equal('hi');

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
