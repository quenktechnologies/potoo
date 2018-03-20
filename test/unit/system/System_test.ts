import * as must from 'must/register';
import { Left, Right } from 'afpl/lib/monad/Either';
import { validateId } from '../../../lib/system';

describe('validateId', function() {

    it('should not allow path seperators', () => {

        must(validateId('/')('/path/to/actor')).be.instanceOf(Left);

    })

    it('should allow a single /', () => {

        must(validateId('/')('/')).be.instanceOf(Right);

    })

});
