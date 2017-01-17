import must from 'must';
import * as funcs from 'potoo-lib/funcs';

var func;

describe('funcs', function() {

    beforeEach(function() {

        func = null;

    });

    describe('Or', function() {

        it('should execute the right if the left fails', function() {

            func = new funcs.Or(v => false, v => true);
            must(func.call(null, false)).be(true);
            must(funcs.or(v => false, v => true)(false)).be(true);

        });

        it('should not execute the right if the left succeeds', function() {

            func = new funcs.Or(v => v, v => false);
            must(func.call(null, true)).be(true);
            must(funcs.or(v => v, v => false)(true)).be(true);

        });


    });

    describe('InstanceOf', function() {

        it('should not execute if the instanceof check fails', function() {

            func = new funcs.InstanceOf(Date, d => 22);
            must(func.call(null, 'today')).be(null);
            must(funcs.insof(Date, d => 22)('today')).be(null);

        });

        it('should execute if the instanceof check succeeds', function() {

            func = new funcs.InstanceOf(Date, d => 22);
            must(func.call(null, new Date())).be(22);
            must(funcs.insof(Date, d => 22)(new Date())).be(22);

        });

    });

    describe('Required', function() {

        it('should not execute if the spec fails', function() {

            var check = { name: true, age: false };
            var value = { name: 'Halesh', age: 44 };
            var f = d => 'success';

            func = new funcs.Required(check, f);
            must(func.call(null, value)).be(null);
            must(funcs.required(check, f)(value)).be(null);

        });

        it('should execute if the check succeeds', function() {

            var check = { name: true, age: false , gender:true};
            var value = { name: 'Halesh', age: 44 };
            var f = d => 'success';

            func = new funcs.Required(check, f);
            must(func.call(null, value)).be(null);
            must(funcs.required(check, f)(value)).be(null);

        });

    });

    describe('ok', function() {

        it('should work', function() {

            must(funcs.ok(false, x => x)(22)).be(null);
            must(funcs.ok(true, x => x)(22)).be(22);

        });

    });


});
