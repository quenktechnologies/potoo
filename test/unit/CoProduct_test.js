import must from 'must';
import {  left, right } from 'potoo-lib/fpl/data/CoProduct';
import { Identity } from 'potoo-lib/fpl/monad/Identity';

describe('CoProduct', function() {

    it('map :: CoProduct<F<A>> →  (A→ B) →  CoProduct<F<B>>', function(done) {

        let l = ({ value }) => must(value).be(100) || done();
        let r = () => done(new Error('Right should not be called!'));

        must(left(new Identity(10)).map(x => x * x).cata(l, r))

    });

    it('map :: CoProduct<G<A>> →  (A→ B) →  CoProduct<G<B>>', function(done) {

        let l = () => done(new Error('Left should not be called!'));
        let r = ({ value }) => must(value).be(1) || done();

        must(right(new Identity(10)).map(x => x / x).cata(l, r));

    });

});
