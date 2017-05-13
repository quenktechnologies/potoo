import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { LocalT, system } from 'potoo-lib';
import { spawn, tell, receive, cps, noop } from 'potoo-lib';

describe('using ask semantics', function() {

    it('should be possible', function(done) {

        let a = new LocalT({
            id: '/a'
        });

        let b = new LocalT({
            id: '/b',
            start: () => cps(cb => setTimeout(() => cb(tell('/a', 'done')), 300))
        });

        return system({ start: () => spawn(a).chain(() => spawn(b)) })
            .start()
            .map(s => setTimeout(() => {

                must(s.actors['/a'].mailbox.value[0]).be('done');

                done();
            }, 1000))
            .run();

    });

});
