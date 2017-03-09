import must from 'must';
import Future from 'fluture';
import { next, future, ActorFT, ActorL, LocalT } from 'potoo-lib/Actor';
import { IOOP } from 'potoo-lib/Op';
import { makeMVar } from 'potoo-lib/MVar';

describe('future', function() {

    it('Future →  Free<IOOP<Actor→  () →  IO<ActorFT>, null>', function(done) {

        future(Future.node(dun => setTimeout(() => dun(22), 0)))
            .go(op => {

                if (op instanceof IOOP) {

                    let io = op.f(new ActorL({
                        path: 'a',
                        parent: '',
                        template: new LocalT({ id: 'a', })
                    }));

                    return io
                        .map(actor => must(actor).be.instanceOf(ActorFT))
                        .map(() => { done(); return op.next })
                        .run();

                }

            })
    });

});

describe('next', function() {

    it('ActorFT →  Free<IOOP<Actor →  () →  IO<Free<Op,null>>>, null>', function(done) {

        return makeMVar()
            .map(mvar =>
                next(new ActorFT({ parent: '', to: 'b', path: 'a', mvar, abort: () => {} }))
                .resume()
                .cata(op => must(op).be.instanceOf(IOOP), x => x))
            .map(done)
            .run();

    });

});
