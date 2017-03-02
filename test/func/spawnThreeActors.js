import must from 'must';
import { Free } from 'potoo-lib/monad';
import { LocalT, ActorL } from 'potoo-lib/Actor';
import { System, Spawn } from 'potoo-lib/System';

const noop = () => {};

describe('spawning three actors', function() {

    it('should que them up', function() {

        let spawn = mod => context => context.spawn(mod);

        let a1 = new LocalT({ id: 'a1', start: noop });

        let a2 = new LocalT({ id: 'a2', start: noop });

        let a3 = new LocalT({
            id: 'a3',
            start: spawn(new LocalT({
                id: 'a3a',
                start: context => context
                    .spawn(new LocalT({ id: 'a3aa', start: noop }))
                    .chain(() => console.log('ran an ') || context.receive(m => context.tell('a4', `You said : '${m}'`)))
            }))
        });

        let system = new System().spawn(a1).spawn(a2).spawn(a3);

        must(system.ops.length).be(3);
        system.ops.forEach(t => must(t).be.instanceOf(Free));

        system = system.tock(x => x);
        must(system.actors.a1).be.instanceOf(ActorL);
        must(system.actors.a2).be.instanceOf(ActorL);
        must(system.actors.a3).be.instanceOf(ActorL);

        system = system.tick();
        must(system.ops.length).be(1);

        system = system.tock(x => x);
        must(system.ops.length).be(0);
        must(system.actors['a3/a3a']).be.instanceOf(ActorL);

        system = system.tick();
        console.log(system);
        must(system.ops.length).be(1);

        system = system.tock(x => x);
        must(system.ops.length).be(0);
        must(system.actors['a3/a3a/a3aa']).be.instanceOf(ActorL);

        system = system.tick().tock(x => x).tick().tock(x => x).tick().tock(x => x);

        system = system.spawn(new LocalT({ id: 'a4', start: context => context.tell('a3/a3a', 'hi') }));
        system = system.tick().tock();
        must(system.actors['a4']).be.instanceOf(ActorL);

        system = system.tick().tock();
        must(system.actors['a3/a3a'].mailbox[0]).be('hi');
        //       console.log(system);

    });

});
