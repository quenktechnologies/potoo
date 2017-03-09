import must from 'must';
import { LocalT, ActorL, spawn, tell, receive } from 'potoo-lib/Actor';
import { System } from 'potoo-lib/System';


        let tt = s => s.tick().tock();

        let a1 = new LocalT({ id: 'a1' });

        let a2 = new LocalT({ id: 'a2' });

        let a3 = new LocalT({
            id: 'a3',
            start: () => spawn(new LocalT({
                id: 'a3a',
                start: () => receive(m => { debugger; return tell('a4', `You said : '${m}'`) })
            }))
        });

        new System()
            .spawn(a1)
            .spawn(a2)
            .spawn(a3)
            .tick()
            .tock()
            .chain(sys => {

                must(sys.actors.a1).be.instanceOf(ActorL);
                must(sys.actors.a2).be.instanceOf(ActorL);
                must(sys.actors.a3).be.instanceOf(ActorL);
                return sys.tick().tock();

            })
            .chain(sys => {

                must(sys.actors['a3/a3a']).be.instanceOf(ActorL);
                return sys.tick().tock();

            })
            .chain(sys =>
                sys
                .spawn(new LocalT({ id: 'a4', start: () => tell('a3/a3a', 'hi') }))
                .tick()
                .tock())
            .chain(sys => {

                must(sys.actors['a4']).be.instanceOf(ActorL);
                return sys.tick().tock();

            })
            .chain(sys => {

                must(sys.actors['a3/a3a'].mailbox[0]).be('hi');
                return sys.tick().tock();

            })
            .chain(sys => {

                console.log(sys.actors.a3.ops);
                must(sys.actors['a4'].mailbox[0]).be('You said : \'hi\'');
                return sys;

            })
            .run();


