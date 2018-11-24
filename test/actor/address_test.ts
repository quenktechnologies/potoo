import {must} from '@quenk/must';
import {
    isRestricted,
    make,
    getParent,
    getId
} from '../../src/actor/address';

describe('address', function() {

    describe('isRestricted', () => {

        it('should not allow path seperators', () => {

            must(isRestricted('/path/to/actor')).equal(true);

        })

        it('should allow a single /', () => {

            must(isRestricted('/')).equal(false);

        })

    });

    describe('make', () => {

        it('should be $ aware', () => {

            must(make('$', 'foobar')).equal('foobar');

        });

        it('should be / aware', () => {

            must(make('/', 'foobar')).equal('/foobar');

        })

    })

    describe('getParent', () => {

        it('should return $ in some cases', () => {

            must(getParent('')).equal('$');
            must(getParent('/')).equal('$');
            must(getParent('?')).equal('$');
            must(getParent('selector')).equal('$');

        })

        it('should not mess up paths with one seperator', () => {

            must(getParent('/path')).equal('/');

        });

    })

    describe('getId', () => {

        it('should recognize special addresses', () => {

            must(getId('')).equal('');
            must(getId('/')).equal('/');
            must(getId('?')).equal('?');
            must(getId('$')).equal('$')

        })

        it('should return the id part', () => {

            must(getId('path/to/id')).equal('id');

        })

    })

});
