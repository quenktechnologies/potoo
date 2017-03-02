import must from 'must';
import { Left, Right } from 'potoo-lib/monad';
import { System, Spawn } from 'potoo-lib/System';
import { ActorT } from 'potoo-lib/Actor';

var sys;

class FakeT extends ActorT {}

describe('System', function() {

    beforeEach(function() {

        sys = new System();

    });

    describe('spawn', function() {

        it('should create a new Spawn task', function() {

            let s = sys.spawn(new FakeT())
            must(s.tasks[0]).be.instanceOf(Spawn);

        });

    });

});

describe('processSysQ', function() {

    xit('should return Left if the system q is empty', function() {

        let l = processSysQ(new System())

        must(l).be.instanceOf(Left);
        must(l.cata(s => s, s => s)).be.instanceOf(System);

    });

    xit('should return right if the system q has messages', function() {

        let r = processSysQ(new System({}, { $: [new Kill()] }));

        must(r).be.instanceOf(Right);
        must(r.cata(s => s, s => s)).be.instanceOf(System);
        must(r.cata(s => s, s => s).mailboxes.$.length).be(0);

    });

});

describe('processUserQ', function() {

    xit('should take the correct action', function() {

        let a1 = new ActorT({ id: 'caw', start: x => x });
        let r = processUserQ(new System({}, { $: [] }, [new Spawn({ parent: '', template: a1 })]));

        must(r).be.instanceOf(System);
        must(r.actors.length).be(1);

    });

});
