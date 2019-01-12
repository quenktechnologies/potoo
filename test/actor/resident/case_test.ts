import { must } from '@quenk/must';
import {  Case, Default } from '../../../src/actor/resident/case';

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

    describe('Case', () => {

        it('must match', () => {

            let x = 0;
            let f = (n: number) => { x = n }
            let c = new Case(12, f);

            must(c.match(12)).equal(true);
            must(x).equal(12);

        });

    });

    describe('Default', () => {

        it('must match', () => {

            let x = 0;
            let f = (_: any) => { x++ }
            let c = new Default(f);

            must(c.match(1)).equal(true);
            must(c.match('12')).equal(true);
            must(c.match({})).equal(true);
            must(x).equal(3);

        });

    });

});
