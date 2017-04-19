import must from 'must';
import * as Either from 'potoo-lib/fpl/monad/Either';

describe('Left', function() {

    it('Left#map<A> :: (A →  B) →  Left<A>', function() {

        must(Either.left(12).map(v => v * v).l).be(12);

    });

    it('Left#chain<A> :: (A →  B) →  Left<B>', function() {

        must(Either.left(12).chain(() => Either.left(144)).l).be(12);

    });

});

describe('Right', function() {

    it('Right#map<A> :: (A → B) →  Right<B>', function() {

        must(Either.right(12).map(v => v * v).r).be(144);

    });

    it('Right#chain<A> :: (A →  B) →  Left<B>', function() {

        must(Either.right(12).chain(() => Either.right(144)).r).be(144);

    });

});
