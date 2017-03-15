import must from 'must';
import { liftF, IO } from 'potoo-lib/monad';
import { exec } from 'potoo-lib/Exec';
import { LocalT, ActorL, System } from 'potoo-lib/Actor';
import * as Ops from 'potoo-lib/Ops';

const actor = new ActorL({
    id: 'A',
    parent: '',
    path: 'A',
    actors: [

        new ActorL({
            id: 'B',
            parent: 'A',
            path: 'A/B',
            actors: [],
            template: new LocalT({ id: 'B' })
        }),
        new ActorL({
            id: 'C',
            parent: 'A',
            path: 'A/C',
            actors: [],
            template: new LocalT({ id: 'C' })
        })

    ],
    template: new LocalT({ id: 'A' })
});

const system = new System({ actors: [actor] });
const next = x => x;

describe('exec ::', function() {

    it('(Actor, IO<System>, Free<Self,null>) →  IO<System>', function() {

        let x = exec(actor, IO.of(system), liftF(new Ops.Self({ next })));
        must(x).be.instanceOf(IO);
        must(x.run()).eql(system);

    });

    it('(Actor, IO<System>, Free<Get,null>) →  IO<System>', function() {

        let x = exec(actor, IO.of(system), liftF(new Ops.Get({ id: 'C', next }))
            .map(a => {

                must(a).be.instanceOf(ActorL);
                must(a.id).be('C');

            }));

        must(x).be.instanceOf(IO);
        must(x.run()).eql(system);

    });

    it('(Actor, IO<System>, Free<Put,null>) →  IO<System>', function() {

        let x = exec(actor, IO.of(system),
            liftF(new Ops.Put({
                actor: new ActorL({
                    id: 'D',
                    path: 'A/D',
                    parent: 'A',
                    template: new LocalT({ id: 'D' })
                }),
                next
            }))
            .map(a => {

                must(a).be.instanceOf(ActorL);
                must(a.id).be('A');
                must(a.actors[2].id).be('D');

            }));

        must(x).be.instanceOf(IO);

    });

    it('(Actor, IO<System>, Free<Update,null>', function() {

        let change = new ActorL({
            id: 'A',
            parent: '',
            path: 'A',
            actors: [
                new ActorL({
                    id: 'R',
                    parent: 'A',
                    path: 'A/C',
                    actors: [],
                    template: new LocalT({ id: 'C' })
                })

            ],
            template: new LocalT({ id: 'A' })
        });

        let x = exec(actor, IO.of(system), liftF(new Ops.Update({ actor: change, next })));

        must(x).be.instanceOf(IO);
        must(x.run()).not.be.eql(system);
        must(x.run().actors[0]).eql(change);

    });

    it('(Actor, IO<System>, Free<Input,null>', function() {

        let x = exec(actor, IO.of(system),
            liftF(new Ops.Input({ f: () => IO.of('hi'), next })).map(m => {

                must(m).be('hi');

            }));

        must(x).be.instanceOf(IO);

    });

});
