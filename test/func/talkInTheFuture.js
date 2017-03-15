import must from 'must';
import fs from 'fs';
import Future from 'fluture';
import { IO } from 'potoo-lib/monad';
import { System, LocalT } from 'potoo-lib/Actor';
import { tell, future } from 'potoo-lib/Ops';

describe('using futures', function() {

    it('should be possible', function(end) {

        let _ = new LocalT({ id: '?' });
        let a = new LocalT({ id: 'A' });
        let b = new LocalT({ id: 'B' });
        let c = new LocalT({
            id: 'C',
            start: () =>
                future(() => Future.node(done => fs.readFile(`${__dirname}/afile.txt`, done)))
                .chain(() => tell('C', 'hello'))
        });

        new System()
            .spawn(_)
            .spawn(a)
            .spawn(b)
            .spawn(c)
            .tick()
            .chain(sys => sys.tick())
            .chain(sys =>
                IO
                .of()
                .chain(() => IO.of(setTimeout(() => {

                    sys
                        .tick()
                        .chain(sys => sys.tick())
                        .chain(sys => sys.tick())
                        .chain(sys => sys.tick())
                        .chain(sys => sys.tick())
                        .map(sys => {
                            must(sys.actors[3].mailbox.length).be(2);
                            must(sys.actors[3].mailbox.map(v => String(v)).join(' ').trim()).be('hello davis');
                            return sys;
                        })
                        .chain(() => IO.of(end)).run();

                }, 1000))))
            .run();

    });

});
