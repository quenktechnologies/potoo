import must from 'must';
import { pipe, partial } from 'potoo-lib/util';

describe('pipe', function() {

    it('should pipe output', function() {

        let inc = x => x + 1;
        let dec = x => x - 1;
        let sqr = x => x * x;

        must(pipe(inc)(1)).be(2);
        must(pipe(inc, dec)(2)).be(2);
        must(pipe(inc, dec, sqr)(2)).be(4);

    });

});

describe('partial', function() {

    it('should partially apply', function() {

        let one = (x, y) => x * y;
        let two = (x, y, z) => x * y * z;
        let three = (x, y, z, a) => x * y * z * a;

        must(partial(one, 2)).be.function();
        must(partial(one, 2)(2)).be(4);

        must(partial(two, 2)).be.function();
        must(partial(partial(two, 2), 2)).be.function();
        must(partial(partial(two, 2), 2)(2)).be(8);

        must(partial(three, 2)).be.function();
        must(partial(partial(three, 2), 2)).be.function();
        must(partial(partial(partial(three, 2), 2), 2)).be.function();
        must(partial(partial(partial(three, 2),2), 2)(2)).be(16);

    });

});
