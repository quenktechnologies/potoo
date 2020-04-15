import { assert } from '@quenk/test/lib/assert';

import {
    State,
    getParent,
    getChildren,
    getAddress
} from '../../../../lib/actor/system/vm/state';
import { newRuntime } from './fixtures/runtime';
import { newContext } from './fixtures/context';

const state: State = {

    runtimes: {

        '/': newRuntime(newContext({ address: '1' })),

        '/path': newRuntime(newContext({ address: '2' })),

        '/path/to': newRuntime(),

        '/path/to/actor': newRuntime(newContext({ address: '4' })),

        '/path/to/runtime': newRuntime(),

        '/pizza': newRuntime(newContext({ address: '6' })),

        'nil': newRuntime(newContext({ address: '7' }))

    },

    routers: {},

    groups: {}

}

describe('state', () => {

    describe('getParent', () => {

        it('should return the correct parent', () => {

            assert(getParent(state, '/path/to/runtime').get())
                .equal(state.runtimes['/path/to']);

        });

    });

    describe('getChildren', () => {

        it('should return the correct children', () => {

            let childs = getChildren(state, '/path/to')

            assert(childs['/path/to/actor'])
                .equal(state.runtimes['/path/to/actor']);

            assert(childs['/path/to/runtime'])
                .equal(state.runtimes['/path/to/runtime']);

        });

        it('should work with /', () => {

            let childs = getChildren(state, '/');

            assert(childs['/path'])
                .equate(state.runtimes['/path']);

            assert(childs['/path/to'])
                .equate(state.runtimes['/path/to']);

            assert(childs['/path/to/actor'])
                .equate(state.runtimes['/path/to/actor']);

            assert(childs['/path/to/context'])
                .equate(state.runtimes['/path/to/context']);

            assert(childs['/pizza'])
                .equate(state.runtimes['/pizza']);

            assert(childs['nil'])
                .equal(undefined);

        });

    });

    describe('getAddress', () => {

        it('should return the correct address', () => {

            getAddress(state, state.runtimes['/path/to'].context.actor)
                .map(addr => assert(addr).equal('/path/to'))
                .orJust(() => { throw new Error('failed'); });

        });

    });

});
