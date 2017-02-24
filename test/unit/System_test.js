import must from 'must';
import { Left, Right } from 'potoo-lib/monad';
import { System, processSysQ, processUserQ } from 'potoo-lib/System';
import { Kill, Spawn } from 'potoo-lib/Message';
import { ActorT } from 'potoo-lib/Actor';

describe('processSysQ', function() {

    it('should return Left if the system q is empty', function() {

        let l = processSysQ(new System())

        must(l).be.instanceOf(Left);
        must(l.cata(s => s, s => s)).be.instanceOf(System);

    });

    it('should return right if the system q has messages', function() {

        let r = processSysQ(new System({}, { $: [new Kill()] }));

        must(r).be.instanceOf(Right);
        must(r.cata(s => s, s => s)).be.instanceOf(System);
        must(r.cata(s => s, s => s).mailboxes.$.length).be(0);

    });

});

describe('processUserQ', function() {

    it('should take the correct action', function() {

        let a1 = new ActorT({ id: 'caw', start: x => x });
        let r = processUserQ(new System({}, { $: [] }, [new Spawn({ parent: '', template: a1 })]));

        must(r).be.instanceOf(System);
        must(r.actors.length).be(1);

    });

});
