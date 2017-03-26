import must from 'must';
import { Either } from 'potoo-lib/fpl/monad/Either';
import { Identity } from 'potoo-lib/fpl/monad/Identity';
import * as Free from 'potoo-lib/fpl/monad/Free';

class Func {

    constructor(next) {

        this.next = next;

    }

    map(f) {

        return new Func(f(this.next));

    }

}

const _makeFunc = next => new Func(next);

describe('Free', function() {

    it('of :: A →  Free<F,A>', function() {

        let x = Free.of(12);

        must(x).be.instanceOf(Free.Return);
        must(x.a).be(12);

    });

    it('liftF :: F<A> →  Free<F,A>', function() {

        let x = Free.liftF(_makeFunc());

        must(x).be.instanceOf(Free.Suspend);
        must(x.f).be.instanceOf(Func);

    });

    it('map :: Free<F,A> →  (A → B) →  Free<F,B>', function() {

        let x = Free.liftF(_makeFunc(1));
        let _x = x.map(y => y * 2);

        must(_x).be.instanceOf(Free.Suspend);
        must(_x.f).be.instanceOf(Func);
        must(_x.f.next.a).be(2);

    });

    it('chain :: Free<F,A> →  (A → Free<F,B>) →  Free<F,B>', function() {

        let x = Free.liftF(_makeFunc());

        let _x = x
            .chain(y => Free.liftF(_makeFunc(y)))
            .chain(y => Free.liftF(_makeFunc(y)))
            .chain(y => Free.liftF(_makeFunc(y)));

        must(_x).be.instanceOf(Free.Suspend);
        must(_x.f).be.instanceOf(Func);

    });

    it('resume :: Free<F,A> → ()→  Either<F<Free<F,A>>, A>', function() {

        let F = { map(x) { return x } };
        let x = Free.liftF(F);

        must(x.resume()).be.instanceOf(Either);

    });

});

describe('go', function() {

    //Tests from :
    // https://github.com/cwmyers/monet.js/blob/master/test/free-spec.js
    //https://raw.githubusercontent.com/cwmyers/monet.js/b3faf9ddd7341effded44fdfabf6f6976e993554/LICENSE

    it('do Ken\'s simple box example', function() {

        let s1 = Free.liftF(new Identity(1));
        let s2 = Free.liftF(new Identity(2));
        let s3 = Free.liftF(new Identity(3));

        let free = s1.chain(i1 =>
            s2.chain(i2 =>
                s3.map(i3 =>
                    i1 + i2 + i3)));

        must(free.go(box => box.get())).be(6);

    });

    it('will not blow the stack', function() {

        let limit = 2000;

        function g(a) {
            return (a < limit) ?
                new Free.Suspend(() => g(a + 1)) : new Free.Return(a)
        }

        must(Free.run(g(1))).be(limit)
    });

});
