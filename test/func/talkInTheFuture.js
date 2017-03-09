import must from 'must';
import Future from 'fluture';
import { LocalT, FutureT } from 'potoo-lib/Actor';
import { System } from 'potoo-lib/System';

describe('talk in the future', function() {

    it('should be possible', function(done) {

        let tiktok = s => s.tick().tock();

        let store = (context, list) => m => list.length === 3 ? ende(list) :
            context.receive(store(context, list.concat(m)));

        let ende = list => {

            must(list).eql(['You', 'Must', 'Learn']);
            done();


        };

        new System()
            .spawn(new LocalT({
                id: 'join',
                start: context => context
                    .spawn(new FutureT({

                        to: 'join',
                        future: Future.node(finish => setTimeout(() => finish(null, 'You')))

                    }))
                    .chain(() => context.receive(store([])))
            }))
            .spawn(new FutureT({

                to: 'join',
                future: Future.node(finish => setTimeout(() => finish(null, 'Must')))

            }))
            .spawn(new FutureT({

                to: 'join',
                future: Future.node(finish => setTimeout(() => finish(null, 'Learn')))

            }))
            /*  .chain(tiktok)
              .chain(tiktok)
              .chain(tiktok)
              .chain(tiktok)*/
            .clock()
            .run();

    });

});
