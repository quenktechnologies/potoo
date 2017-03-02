import must from 'must';
import { Free } from 'potoo-lib/monad';

class Functor {

    constructor(v) {

        this.value = v;

    }

    map(f) {

        return new Functor(f(this.value));

    }

}

describe('Free', function() {

    it('should run multiple effects', function() {

        let functor = x => Free.liftF(new Functor(x));
        let free = functor(1).chain(v => functor(v + 2)).chain(v => functor(v + 3));
        let interpret = free => free.resume().cata(({ value }) => interpret(value), x => x);

        must(interpret(free)).be(6);

    });

});
