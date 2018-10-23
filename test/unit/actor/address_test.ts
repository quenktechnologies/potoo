import * as must from 'must/register';
import { isRestricted } from '../../../src/actor/address';

describe('address', function() {

    describe('isRestricted', () => {

        it('should not allow path seperators', () => {

            must(isRestricted('/path/to/actor')).be(true);

        })

        it('should allow a single /', () => {

            must(isRestricted('/')).be(false);

        })

    });

});
