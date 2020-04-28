import { assert } from '@quenk/test/lib/assert';
import { Case, Default } from '../../../src/actor/resident/case';

class Flag { constructor(public value: boolean) { } }

class ChildCase extends Case<Flag> {

    constructor() { super(Flag, f => f.value); }

}

describe('case', () => {

    describe('Case', function() {

        it('assert be extendable', () => {

            assert(new ChildCase().test(new Flag(true))).be.true();

        });

    });

    describe('Case', () => {

        it('assert match', () => {

            let x = 0;
            let f = (n: number) => { x = n }
            let c = new Case(12, f);

            assert(c.test(12)).equal(true);

        });

    });

    describe('Default', () => {

        it('assert match', () => {

            let x = 0;
            let f = (_: any) => { x++ }
            let c = new Default(f);

            assert(c.test(1)).equal(true);
            assert(c.test('12')).equal(true);
            assert(c.test({})).equal(true);

        });

    });

});
