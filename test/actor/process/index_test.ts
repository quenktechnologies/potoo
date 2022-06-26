import { Case } from '../../../lib/actor/resident/case';
import { Immutable } from '../../../lib/actor/resident/immutable';
import { Process, VMProcess } from '../../../lib/actor/remote/process';
import { TestSystem, system } from '../resident/fixtures/system';

class ProcessTest extends Immutable<string> {

    constructor(
        public system: TestSystem,
        public done: () => void) { super(system); }

    process = '?';

    receive() {

        return [

            new Case('started', () => { this.tell(this.process, 'ping'); }),

            new Case('pong', () => { this.tell(this.process, 'self'); }),

            new Case(this.process, () => { this.tell(this.process, 'parent'); }),

            new Case(this.self(), () => { this.tell(this.process, 'exit'); }),

            new Case('exiting', () => { this.done() })

        ];

    }

    run() {

        this.process = this.spawn({

            id: 'process',

            create: s => new Process(s, `${__dirname}/ping.js`)

        });

        this.tell(this.process, this.self());

    }

}

class VMProcessTest extends Immutable<string> {

    process = '?';

    constructor(
        public system: TestSystem,
        public path: string,
        public done: () => void) { super(system); }

    receive() {

        return [

            new Case('parent/adder/one', (addr: string) => {

                this.tell(addr, 'spawn');

            }),

            new Case('parent/adder/one/two', (addr: string) => {

                this.tell(addr, 'spawn');

            }),

            new Case('parent/adder/one/two/three', (addr: string) => {

                this.tell(addr, 'add');

                this.tell(addr, 'add');

                this.tell(addr, 'add');

            }),

            new Case('finish', () => {

                this.tell('parent/adder/one/two/three', 'total');

            }),


            new Case(3, () => {

                this.tell('parent/adder/one/two/three', 'exit');

            }),

            new Case('exiting', () => this.done())

        ];

    }

    run() {

        this.process = this.spawn({

            id: 'adder',

            create: s => new VMProcess(s, this.path)

        });

    }

}

describe('process', () => {

    describe('Process', () => {

        let sys = system({ log_level: 7 });

        after(() => sys.stop())

        it('should work', done => {

            sys.spawn({

                id: 'parent',

                create: () => new ProcessTest(sys, done)

            })

        });

    });

    describe('VMProcess', () => {

        let sys = system({ log_level: 7 });

        after(() => sys.stop())

        it('should work', done => {

            sys.spawn({

                id: 'parent',

                create: () =>
                    new VMProcessTest(sys, `${__dirname}/vm-ping.js`, done)

            })

        });

    })

})
