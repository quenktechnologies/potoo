import must from 'must';
import { LocalT, ActorL, System } from 'potoo-lib/Actor';
import { spawn, tell, receive } from 'potoo-lib/Ops';

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let _ = new LocalT({ id: '?' });
        let a1 = new LocalT({ id: 'a1' });
        let a2 = new LocalT({ id: 'a2' });
        let a3 = new LocalT({
            id: 'a3',
            start: () => spawn(new LocalT({
                id: 'a3a',
                start: () => receive(m => tell('a4', `You said : '${m}'`))
            }))
        });

        new System()
            .spawn(_)
            .spawn(a1)
            .spawn(a2)
            .spawn(a3)
            .tick()
            .chain(sys => {

                must(sys.actors[0]).be.instanceOf(ActorL);
                must(sys.actors[1]).be.instanceOf(ActorL);
                must(sys.actors[2]).be.instanceOf(ActorL);
                must(sys.actors[3]).be.instanceOf(ActorL);
                return sys.tick();

            })
            .chain(sys => {

                must(sys.actors[3].actors[0]).be.instanceOf(ActorL);
                return sys.tick();

            })
            .chain(sys => sys.spawn(new LocalT({
                id: 'a4',
                start: () => tell('a3/a3a', 'hi')
            })).tick())
            .chain(sys => {

                must(sys.actors[4]).be.instanceOf(ActorL);
                return sys.tick();

            })
            .chain(sys => {

                must(sys.actors[3].actors[0].mailbox[0]).be('hi');
                return sys.tick();

            })
            .chain(sys => sys.tick())
            .chain(sys => {

                must(sys.actors[4].mailbox[0]).be('You said : \'hi\'');
                return sys.tick();

            })
            .chain(s => s.tick())
            .chain(s => s.tick())
            .map(() => done())
            .run();

    });

});
