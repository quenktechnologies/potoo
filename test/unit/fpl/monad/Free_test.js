import must from 'must';
import { Either } from 'potoo-lib/fpl/monad/Either';
import { Identity } from 'potoo-lib/fpl/monad/Identity';
import * as Maybe from 'potoo-lib/fpl/monad/Maybe';
import { match } from 'potoo-lib/fpl/control/Match';
import * as Free from 'potoo-lib/fpl/monad/Free';

class Func {

    constructor(next) {

        this.next = next;

    }

    map(f) {

        return new Func(f(this.next));

    }

}

class Func2 {

    constructor(next) {

        this.next = next;

    }

    map(f) {

        return new Func2(f(this.next));

    }

}

const _makeFunc = next => new Func(next);
const _makeFunc2 = next => new Func2(next);

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
    // https://raw.githubusercontent.com/cwmyers/monet.js/b3faf9ddd7341effded44fdfabf6f6976e993554/LICENSE

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

describe('ap', function() {

    it('Free<F,A> →  Free<F (A → B)> →  Free<F,B>', function() {

        let f1 = Free.liftF(_makeFunc(3));
        let f2 = new Free.Return(x => x * 2);
        let f3 = f1.ap(f2);

        must(f3.go(f => f.next)).be(6);

    });

});

describe('apRight', function() {

    it('Free<F,A> →  Free<F,B> →  Free<F,B>', function() {

        let f1 = Free.liftF(_makeFunc('a'));
        let f2 = Free.liftF(_makeFunc('b'));
        must(f1.apRight(f2).go(f => f.next)).be('b');

    });

});

describe('hoist', function() {

    it('Free<F<B>> →  (F<A> →  G<A>) →  Free<G<B>>  ', function() {

        let fr = Free.liftF(_makeFunc('b'));
        let _fr = fr.hoist(({ next }) => _makeFunc2(next));

        must(_fr.go(f => {

            must(f).be.instanceOf(Func2);
            return f.next;
        })).be('b');

    });

});

describe('fold', function() {

    it('Free<F<A>> →  (F<X> → M<X>) →  M<A>', function() {

        let fr = Free.liftF(_makeFunc('a'))
            .chain(() => Free.liftF(_makeFunc2('b')))
            .chain(() => Free.liftF(_makeFunc('c')));

        let folder = f => match(f)
            .caseOf(Func, ({ next }) => Maybe.of(next))
            .caseOf(Func2, ({ next }) => Maybe.of(next))
            .caseOf(Free.Return, ({ a }) => Maybe.of(a))
            .end();

        must(fr.fold(folder).a).be('c');

    });

});

describe('reduce', function() {

    it('Free<F<A>> →  ((M<X>, F<X>)→ M<[X, F<X>]>) →  M<A>', function() {

        let fr = Free.liftF(_makeFunc())
            .chain(() => Free.liftF(_makeFunc2()))
            .chain(() => Free.liftF(_makeFunc()));

        let reducer = (m, f) => match(f)
            .caseOf(Func, ({ next }) => m.map(c => [Maybe.of(c + 1), next]))
            .caseOf(Func2, ({ next }) => m.map(c => [Maybe.of(c + 2), next]))
            .end();

        must(fr.reduce(reducer, Maybe.of(1)).get()).be(5);

    });

});
