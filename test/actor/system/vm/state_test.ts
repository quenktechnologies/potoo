import { assert } from '@quenk/test/lib/assert';

import {
    State,
    getParent,
    getChildren,
    getAddress
} from '../../../../lib/actor/system/vm/state';
import { newThread } from './fixtures/thread';
import { newContext } from './fixtures/context';
import { ADDRESS_SYSTEM } from '../../../../lib/actor/address';

const state: State = {

    threads: {

        '$': newThread(newContext({ address: '0' })),

        '/': newThread(newContext({ address: '1' })),

        '/path': newThread(newContext({ address: '2' })),

        '/path/to': newThread(),

        '/path/to/actor': newThread(newContext({ address: '4' })),

        '/path/to/runtime': newThread(),

        '/pizza': newThread(newContext({ address: '6' })),

        'nil': newThread(newContext({ address: '7' }))

    },

    routers: {},

    groups: {},

  pendingMessages: {}

}

describe('state', () => {

    describe('getParent', () => {

        it('should return the correct parent', () => {

            assert(getParent(state, '/path/to/runtime').get())
                .equal(state.threads['/path/to']);

        });

    });

    describe('getChildren', () => {

        it('should return the correct children', () => {

            let childs = getChildren(state, '/path/to')

            assert(childs['/path/to/actor'])
                .equal(state.threads['/path/to/actor']);

            assert(childs['/path/to/runtime'])
                .equal(state.threads['/path/to/runtime']);

        });

        it('should work with /', () => {

            let childs = getChildren(state, '/');

            assert(childs['/path'])
                .equate(state.threads['/path']);

            assert(childs['/path/to'])
                .equate(state.threads['/path/to']);

            assert(childs['/path/to/actor'])
                .equate(state.threads['/path/to/actor']);

            assert(childs['/path/to/context'])
                .equate(state.threads['/path/to/context']);

            assert(childs['/pizza'])
                .equate(state.threads['/pizza']);

            assert(childs['nil'])
                .equal(undefined);

        });

        it(`should not treat ${ADDRESS_SYSTEM} as a child of itself`, () => {

            let childs = getChildren(state, ADDRESS_SYSTEM);

            assert(childs[ADDRESS_SYSTEM]).undefined();

        });

    });

    describe('getAddress', () => {

        it('should return the correct address', () => {

            getAddress(state, state.threads['/path/to'].context.actor)
                .map(addr => assert(addr).equal('/path/to'))
                .orJust(() => { throw new Error('failed'); });

        });

    });

});
