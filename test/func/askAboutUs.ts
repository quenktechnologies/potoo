import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { LocalT, system } from 'potoo-lib';
import { spawn, ask, tell, receive, noop } from 'potoo-lib';

describe('using ask semantics', function() {

    it('should be possible', function(done) {

        let a = new LocalT({
            id: 'serverA',
            start: () =>
                receive(({ sender, message }) => tell(sender, `${message}->A`))
        });

        let b = new LocalT({
            id: 'serverB',
            start: () =>
                receive(({ sender, message }) => tell(sender, `${message}->B`))
        });

        let c = new LocalT({
            id: 'client',
            start: () =>
                ask('serverA', { sender: 'client', message: 'start' })
                    .chain(message => ask('serverB', { sender: 'client', message }))
                    .chain(msg => {

                        must(msg).be('start->A->B');
                        return noop();

                    })

        });

        return system({

            start: () =>
                spawn(a)
                    .chain(() => spawn(b))
                    .chain(() => spawn(c))

        })
            .start()
            .map(s => setTimeout(() => done(), 1000))
            .run();

    });

});
