import { must } from '@quenk/must';
import { Case } from '../../../src/actor/resident/case';

class Flag { constructor(public value: boolean) { } }

class ChildCase extends Case<Flag> {

    constructor() { super(Flag); }

    apply({ value }: Flag): boolean {

        return value;

    }

}

describe('case', () => {

    describe('Case', function() {

        it('must be extendable', () => {

            must(new ChildCase().apply(new Flag(true))).be.true();

        });

    });

});
