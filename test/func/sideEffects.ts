import 'mocha';
import * as must from 'must/register';
import { LocalT, system } from '../../src';
import { effect, spawn, tell } from '../../src';

describe('using side effects', function() {

    it('should be possible', function(done) {

        let a = new LocalT({
            id: 'A',
            start: () => spawn(new LocalT({
                id: 'C',
                start: () =>
                    effect(() => { console.info('ok'); return 22; })
                        .chain(n => tell('A', n))
            }))

        });

        return system({

            start: () => spawn(a)

        })
            .start()
            .map(s => {

                must(s.actors['A'].mailbox.value).eql([22]);
                done();

            })
            .run();

    });

});
