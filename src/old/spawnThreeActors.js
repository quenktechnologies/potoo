import must from 'must';
import { Free } from 'potoo-lib/monad';
import { LocalT, ActorL } from 'potoo-lib/Actor';
import { System, Spawn } from 'potoo-lib/System';

const noop = () => {};


        let spawn = mod => context => context.spawn(mod);
        let a1 = new LocalT({ id: 'a1', start: noop });
        let a2 = new LocalT({ id: 'a2', start: noop });

        let a3 = new LocalT({
            id: 'a3',
            start: spawn(new LocalT({
                id: 'a3a',
                start: spawn(new LocalT({ id: 'a3aa', start: noop }))
            }))
        });

        let system = new System().spawn(a1).spawn(a2).spawn(a3);

        must(system.ops.length).be(3);
        system.ops.forEach(t => must(t).be.instanceOf(Free));

        system = system.tock(x => x);
        must(system.actors.a1).be.instanceOf(ActorL);
        must(system.actors.a2).be.instanceOf(ActorL);
        must(system.actors.a3).be.instanceOf(ActorL);

        console.log(system)
        system = system.tick();
        must(system.ops.length).be(1);


