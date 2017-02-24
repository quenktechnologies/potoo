import must from 'must';
import { match, UnMatched, Matched } from 'potoo-lib/Match';

const id = x => x;

describe('match', function() {

    it('must return an UnMatched', function() {

        must(match(2)).be.instanceOf(UnMatched);

    });

});

describe('UnMatched', function() {

    it('should match numbers', function() {

        must(new UnMatched(1).caseOf(1, id)).be.instanceOf(Matched);
        must(new UnMatched(1).caseOf(12, id)).be.instanceOf(UnMatched);

    });

    it('should match strings', function() {

        must(new UnMatched('hi').caseOf('hi', id)).be.instanceOf(Matched);
        must(new UnMatched('hi').caseOf('x', id)).be.instanceOf(UnMatched);

    });

    it('should match functions (classes)', function() {

        must(new UnMatched(new Date()).caseOf(Date, id)).be.instanceOf(Matched);
        must(new UnMatched(new Date()).caseOf(/.*/, id)).be.instanceOf(UnMatched);

    });

    it('should match null and undefined', function() {

        let a;

        must(new UnMatched(undefined).caseOf(null, id)).be.instanceOf(Matched);
        must(new UnMatched(null).caseOf(null, id)).be.instanceOf(Matched);
        must(new UnMatched(a).caseOf(null, id)).be.instanceOf(Matched);

    });


    it('should execute the left end', function() {

        must(new UnMatched(1).end(id, () => null)).be(1);

    });

});

describe('Matched', function() {

    it('should execute the right end', function() {

        must(new Matched(1).end(id, x => x * 10)).be(10)

    });

});
