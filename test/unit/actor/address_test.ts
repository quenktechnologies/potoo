import { assert } from '@quenk/test/lib/assert';
import {
    ADDRESS_SYSTEM,
    isRestricted,
    isChild,
    make,
    getParent,
    getId
} from '../../../lib/actor/address';

describe('address', function () {
    describe('isRestricted', () => {
        it('should not allow path seperators', () => {
            assert(isRestricted('/path/to/actor')).equal(true);
        });

        it('should allow a single /', () => {
            assert(isRestricted('/')).equal(false);
        });
    });

    describe('make', () => {
        it('should be $ aware', () => {
            assert(make('$', 'foobar')).equal('foobar');
        });

        it('should be / aware', () => {
            assert(make('/', 'foobar')).equal('/foobar');
        });
    });

    describe('getParent', () => {
        it('should return $ in some cases', () => {
            assert(getParent('')).equal('$');
            assert(getParent('/')).equal('$');
            assert(getParent('?')).equal('$');
            assert(getParent('selector')).equal('$');
        });

        it('should not mess up paths with one seperator', () => {
            assert(getParent('/path')).equal('/');
        });
    });

    describe('getId', () => {
        it('should recognize special addresses', () => {
            assert(getId('')).equal('');
            assert(getId('/')).equal('/');
            assert(getId('?')).equal('?');
            assert(getId('$')).equal('$');
        });

        it('should return the id part', () => {
            assert(getId('path/to/id')).equal('id');
        });
    });

    describe('isChild', () => {
        it('it must see the system as parent of all actors', () => {
            assert(isChild(ADDRESS_SYSTEM, 'foor bar')).true();
        });
    });
});
