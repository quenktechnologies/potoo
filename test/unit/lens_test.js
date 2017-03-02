import must from 'must';
import { index, HEAD, TAIL, path } from 'potoo-lib/lens';

describe('index', function() {

    it('should provide the head', function() {

        must(index(HEAD)([0, 1, 2])).be(0);

    });

    it('should provide the tail', function() {

        must(index(TAIL)([2, 2, 3])).be(3);

    });

    it('should provide the indexed value', function() {

        must(index(2)(['a', 'b', 'c', 'd'])).be('c');

    });

    it('should set the HEAD', function() {

        must(index(HEAD)(12, [1, 1])).eql([12, 1, 1]);

    });

    it('should set the TAIL', function() {

        must(index(TAIL)(12, [1, 1])).eql([1, 1, 12]);

    });

    it('should set the index', function() {

        must(index(2)('b', ['a', 'a', 'a', 'a'])).eql(['a', 'a', 'b', 'a']);

    });

});

describe('path', function() {

    it('should set the value', function() {

        let o = { name: { last: 'Betterman' } };
        let r = path('name.first')('Bodaiju', o);

         must(o).not.be(r);
        must(r).eql({ name: { first: 'Bodaiju', last: 'Betterman' } });

    });

});
