const { doFuture, voidPure } = require('@quenk/noni/lib/control/monad/future');

const { Immutable } = require('../../../lib/actor/resident/immutable');
const { Mutable } = require('../../../lib/actor/resident/mutable');

const { Case } = require('../../../lib/actor/resident/case');

const parent = 'parent';

class One extends Immutable {

    receive() {

        return [

            new Case('spawn', () => {

                this.tell(parent,
                    this.spawn({ id: 'two', create: s => new Two(s) }));

            })

        ];

    }

    run() {

        this.tell(parent, this.self());

    }

}

class Two extends Immutable {

    receive() {

        return [

            new Case('spawn', () => {

                this.tell(parent,
                    this.spawn({ id: 'three', create: s => new Three(s) }));

            })

        ];

    }

    run() {

        process.stdin.resume();

        this.tell(parent, this.self());

    }

}

class Three extends Mutable {

    run() {

        let count = 0;

        let cases = [

            new Case('add', () => {

                count = count + 1;

                if (count == 3)
                    this.tell(parent, 'finish');

                this.select(cases);

            }),

            new Case('total', () => {

                this.tell(parent, count);

                this.select(cases);

            }),

            new Case('exit', () => {

                process.stdin.destroy();

                this.tell(parent, 'exiting');

                setTimeout(()=> process.exit());

            })

        ];

        this.select(cases);

    }

}

module.exports = vm => ({

    id: 'one',

    create: () => new One({ getPlatform() { return vm; } })

})
