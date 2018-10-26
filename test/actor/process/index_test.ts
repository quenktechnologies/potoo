import * as must from 'must/register';
import { system } from '../../../src';
import { Mutable, Case } from '../../../src/actor/resident';
import { Process } from '../../../src/actor/process';
import { System } from '../../../src/actor/system';

class Sender extends Mutable<String> {

    constructor(
        public system: System,
        public done: () => void) { super(system); }

    receive = [

        new Case(String, (m: string) => {

            must(m).be('hi');

            this.done()

        })

    ]

    onRun() {

        this.tell('echo', { client: this.self(), message: 'hi' });

        this.select([

            new Case(String, (m: string) => {

                must(m).be('hi');

                this.done();

            })])

    }

}

describe('process', () => {

    describe('Process', () => {

        it('should be spawnable', done => {

            system({ log: { level: 8 } })

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
