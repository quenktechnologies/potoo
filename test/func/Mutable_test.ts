import * as must from 'must/register';
import * as local from '../../lib/actor/local';
import * as system from '../../lib/system';
import * as log from '../../lib/system/log';

class ShouldWork extends local.Mutable {

    constructor(public s: system.System, public done: () => void) {

        super(s);

    }

    run() {

        let bucket = [];

        let cases = [

            new local.Case('one', () => (bucket.push(1), this.select(cases))),
            new local.Case('two', () => (bucket.push(2), this.select(cases))),

            new local.Case('three', () => (bucket.push(3), this.select(cases))),
            new local.Case('done', () => { must(bucket.join(',')).eql('1,2,3'); this.done(); })

        ];

        this
            .select(cases)
            .tell('selector', 'one')
            .tell('selector', 'two')
            .tell('selector', 'three')
            .tell('selector', 'done');

        return this;

    }

}

describe('Mutable', () =>
    describe('#select', () =>

        it('should work', done => {

            system
                .ActorSystem
                .create({ log: { level: log.INFO, logger: console } })
                .spawn({ id: 'selector', create: s => new ShouldWork(s, done) });

        })));
