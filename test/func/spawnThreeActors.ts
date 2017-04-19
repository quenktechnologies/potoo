import 'mocha';
import * as must from 'must/register';
import { LocalT, ActorL, system } from '../../src';
import { spawn, tell, receive, finalReceive } from '../../src';

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let a1 = new LocalT({ id: 'a1' });
        let a2 = new LocalT({ id: 'a2' });
        let a3 = new LocalT({
            id: 'a3',
            start: () =>
                spawn(new LocalT({
                    id: 'a3a', start: () =>
                        receive(m => tell('a3', `You said : '${m}'`))
                }))
                    .chain(() => tell('a3/a3a', 'Hello!'))
                    .chain(() => finalReceive(m => {

                        must(m).be('You said : \'Hello!\'');
                        done();

                    }))

        });

        return system({

            start: () =>
                spawn(a1)
                    .chain(() => spawn(a2))
                    .chain(() => spawn(a3))

        })
            .start()
            .map(s => {

                must(s.actors['a1']).be.instanceOf(ActorL);
                must(s.actors['a2']).be.instanceOf(ActorL);
                must(s.actors['a3']).be.instanceOf(ActorL);
                must(s.actors['a3/a3a']).be.instanceOf(ActorL);
                return s;

            })
            .run();

    });

});
