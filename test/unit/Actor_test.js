import must from 'must';
import Future from 'fluture';

import {
    Actor,
    ActorFT,
    ActorL,
    LocalT,
    future,
    replace,
    fold,
    tick
} from 'potoo-lib/Actor';

import { IO } from 'potoo-lib/monad';
import { tell, self, spawn } from 'potoo-lib/Ops';

class FActor extends Actor {

    constructor({ id, path, actors, ops }) {

        super();
        this.id = id;
        this.path = path;
        this.actors = actors;
        this.ops = ops;

    }

}

const makeActor = (id, path, actors = []) => new FActor({
    id,
    path,
    actors
});

const makeActorWithOp = (id, path, parent = '', actors = [], ops = null) => new ActorL({
    id,
    path,
    parent,
    actors,
    ops,
    template: new LocalT({ id })
});

const s = makeActor('s', 's', [
    makeActor('sa', 's/a', [
        makeActor('saa', 's/a/a', [
            makeActor('saaa', 's/a/a/a', []),
            makeActor('saab', 's/a/a/b', []),
            makeActor('saac', 's/a/a/c', [])
        ]),
        makeActor('sb', 's/b', [makeActor('sba', 's/b/a', [])])
    ])
]);

describe('future', function() {

    xit('Future →  Free<IOOP<Actor→  () →  IO<ActorFT>, null>', function(done) {

        future(Future.node(dun => setTimeout(() => dun(22), 0)))
            .go(op => {

                if (op instanceof IOOP) {

                    let io = op.f(new ActorL({
                        path: 'a',
                        parent: '',
                        template: new LocalT({ id: 'a', })
                    }));

                    return io
                        .map(actor => must(actor).be.instanceOf(ActorFT))
                        .map(() => { done(); return op.next })
                        .run();

                }

            })
    });

});

describe('replace', function() {

    it('should replace an actor recursively', function() {

        let s2 = replace(makeActor('saab', 's/a/a/b', [makeActor('saaba', 's/a/a/b/a', [])]), s);

        must(JSON.stringify(s2)).eql(JSON.stringify(
            makeActor('s', 's', [
                makeActor('sa', 's/a', [
                    makeActor('saa', 's/a/a', [
                        makeActor('saaa', 's/a/a/a', []),
                        makeActor('saab', 's/a/a/b', [makeActor('saaba', 's/a/a/b/a', [])]),
                        makeActor('saac', 's/a/a/c', [])
                    ]),
                    makeActor('sb', 's/b', [makeActor('sba', 's/b/a', [])])
                ])
            ])));

    });

});

describe('fold', function() {

    it('fold :: (Actor, *→ *, *) →  *', function() {

        must(fold(s, (p, c) => `${p}${c.id},`, 'ids: ')).be('ids: sa,');
        must(fold(s.actors[0].actors[0], (p, c) => `${p},${c.id}`, 'ids: ')).be('ids: ,saaa,saab,saac');

    });

});

describe('tick', function() {

    it('should chain all the IOs', function() {

        let top = makeActorWithOp('A', 'A', '', [

            makeActorWithOp('B', 'A/B', 'A', [], self()),
            makeActorWithOp('C', 'A/C', 'A', [makeActorWithOp('D', 'A/C/D', 'A/C', [

                    makeActorWithOp('E', 'A/C/D/E', 'A/C/D', []),
                    makeActorWithOp('F', 'A/C/D/F', 'A/C/D', [], tell('A/B', 'how are you?'))


                ], tell('A/C/D/E', 'hi'))

            ], spawn(new LocalT({ id: 'foo' })))

        ]);

        let io = tick(top, IO.of(top));

        must(io).be.instanceOf(IO);

        let s = io.run();

        must(s.actors[0].mailbox).eql(['how are you?']);
        must(s.actors[1].actors[0].actors[0].mailbox).eql(['hi']);

    });

});
