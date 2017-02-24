import must from 'must';
import { System } from 'potoo-lib/System';
import { Actor, ActorT } from 'potoo-lib/Actor';
import { IO } from 'potoo-lib/monad';

const parent = child => ctx => ctx.spawn(new ActorT({ id: 'child', start: child }));
const identity = ctx => ctx;

describe('System', function() {

    it('should spawn children', function() {

        let a1 = new ActorT(1, identity);
        let a2 = new ActorT(2, identity);
        let a3 = new ActorT(3, identity);

        let s = new System()
            .spawn(a1)
            .spawn(a2)
            .spawn(a3)

        must(s.tasks.length).be(3);

        [a1, a2, a3].forEach((a, n, l) => {
            must(s.tasks[n].parent).be('');
            must(s.tasks[n].template).be(l[n]);
        })

    });

    it('should spawn children recursively', function(done) {

        let a1 = new ActorT({ id: 1, start: parent(parent(identity)) });
        let ticktock = s => IO.of(() => s.tick().tock(s => IO.of(() => s.tick().tock(check))));

        let check = s => {

            must(s.actors['/1']).be.instanceOf(Actor);
            must(s.actors['/1/child']).be.instanceOf(Actor);
            must(s.actors['/1/child/child']).be.instanceOf(Actor);
            return IO.of(done);

        };

        new System()
            .spawn(a1)
            .tick()
            .tock(ticktock);

    });


});
