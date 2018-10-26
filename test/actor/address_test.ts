import * as must from 'must/register';
import {
    isRestricted,
    make,
    getParent,
    getId
} from '../../src/actor/address';

describe('address', function() {

    describe('isRestricted', () => {

        it('should not allow path seperators', () => {

            must(isRestricted('/path/to/actor')).be(true);

        })

        it('should allow a single /', () => {

            must(isRestricted('/')).be(false);

        })

    });

    describe('make', () => {

        it('should be $ aware', () => {

            must(make('$', 'foobar')).be('foobar');

        });

        it('should be / aware', () => {

            must(make('/', 'foobar')).be('/foobar');

        })

    })

    describe('getParent', () => {

        it('should return $ in some cases', () => {

            must(getParent('')).be('$');
            must(getParent('/')).be('$');
            must(getParent('?')).be('$');
            must(getParent('selector')).be('$');

        })

    })

    describe('getId', () => {

        it('should recognize special addresses', () => {

            must(getId('')).be('');
            must(getId('/')).be('/');
            must(getId('?')).be('?');
            must(getId('$')).be('$')

        })

        it('should return the id part', () => {

            must(getId('path/to/id')).be('id');

        })

    })

});
