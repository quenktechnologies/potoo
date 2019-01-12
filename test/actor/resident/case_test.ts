import { must } from '@quenk/must';
import { Case, ClassCase, DefaultCase } from '../../../src/actor/resident/case';

class Flag { constructor(public value: boolean) { } }

class ChildCase extends Case<Flag> {

    constructor() { super(Flag, f => f.value); }

}

describe('case', () => {

    describe('Case', function() {

        it('must be extendable', () => {

            must(new ChildCase().match(new Flag(true))).be.true();

        });

    });

    describe('ClassCase', () => {

        it('must match', () => {

            let x = 0;
            let f = (n: number) => { x = n }
            let c = new ClassCase(12, f);

            must(c.match(12)).equal(true);
            must(x).equal(12);

        });

    });

    describe('DefaultCase', () => {

        it('must match', () => {

            let x = 0;
            let f = (_: any) => { x++ }
            let c = new DefaultCase(f);

            must(c.match(1)).equal(true);
            must(c.match('12')).equal(true);
            must(c.match({})).equal(true);
            must(x).equal(3);

        });

    });

});
