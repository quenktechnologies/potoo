import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { Future } from 'fluture';
import { LocalT, system } from '../../src';
import { spawn, task } from '../../src';

describe('using futures', function() {

    it('should be possible', function(done) {

        let a = new LocalT({ id: 'A' });
        let b = new LocalT({ id: 'B' });
        let c = new LocalT({
            id: 'C',
            start: () =>
                task(Future.node(done => fs.readFile(`${__dirname}/afile.txt`, done)), 'A')
        });

        return system({

            start: () =>
                spawn(a)
                    .chain(() => spawn(b))
                    .chain(() => spawn(c))

        })
            .start()
            .map(s => {

                setTimeout(() => {

                    must(String(s.actors['A'].mailbox.value[0])).be('davis\n');
                    done();

                }, 1000)
            })
            .run();


    });

});
