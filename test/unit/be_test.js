import must from 'must';
import { left, right, Left, Right } from 'potoo-lib/monad';
import { seq, every, type, kind, defaults } from 'potoo-lib/be';

describe('seq', function() {

    it('should sequence ', function() {

        let l = x => left(new Error(x));
        let r = x => right(x);
        let s1 = seq(r);
        let s2 = seq(r, r);
        let s3 = seq(r, l, r);

        must(s1(1)).be.instanceOf(Right);
        must(s2(1)).be.instanceOf(Right);
        must(s3(null)).be.instanceOf(Left);

    });

});

describe('every', function() {

    it('should run for each key in the array', function() {

        let list = [1, '2', 3];
        let num = x => typeof x !== 'number' ? left(new TypeError()) : right(x);
        let result = every(num)(list);

        must(result).be.instanceOf(Left);
        result.map(x => must(x).be.instanceOf(TypeError));

    });

});

describe('type', function() {

    it('should run type checks', function() {

        let check = type(Date);

        must(check(new Date())).be.instanceOf(Right);
        must(check(new RegExp())).be.instanceOf(Left);

    });

    it('should recognize strings as String', function() {

        must(type(String)('str')).be.instanceOf(Right);

    });

});

describe('kind', function() {

    it('should check for interface implementations', function() {

        let Iface = class { m1() {}
            m2() {} };
        must(kind(Iface)(new Date())).be.instanceOf(Left);
        must(kind(Iface)({ m1() {}, m2() {} })).be.instanceOf(Right);

    });


});


describe('defaults', function() {

    it('should provide a default value', function() {

        let t1 = defaults(12)();
        let t2 = defaults(11)(null);
        let t3 = defaults(10)(20);

        must(t1).be.instanceOf(Right);
        must(t1.right()).be(12);
        must(t2).be.instanceOf(Right);
        must(t2.right()).be(11);
        must(t3).instanceOf(Right);
        must(t3.right()).be(20);


    });


});
