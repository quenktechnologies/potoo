import { assert } from '@quenk/test/lib/assert';
import {
    State,
    getParent,
    getChildren,
    getAddress
} from '../../../../src/actor/system/state';
import { Context } from '../../../../src/actor/context';
import { Envelope } from '../../../../src/actor/mailbox';
import { newContext } from '../../../fixtures/mocks';

class Act {

    init(c: Context): Context { return c; }

    accept(_: Envelope) { return this; }

    notify() { return this; }

    run() { }

    stop() { }

}

const context = (id: string) => newContext({

    actor: new Act(),

    behaviour: [],

    template: { id, create: () => new Act() }

});

let state: State<Context> = {

    contexts: {

        '/': context('1'),

        '/path': context('2'),

        '/path/to': context('3'),

        '/path/to/actor': context('4'),

        '/path/to/context': context('5'),

        '/pizza': context('6'),

        'nil': context('6')

    },

    routers: {},

    groups: {}

}

describe('state', () => {

    describe('getParent', () => {

        it('should return the correct parent', () => {

            getParent(state, '/path/to/context')
                .map(p => assert(p.template.id).equal('3'))
                .orJust(() => { throw new Error('404!'); })

        });

    });

    describe('getChildren', () => {

        it('should return the correct children', () => {

            let childs = getChildren(state, '/path/to')

            assert(childs['/path/to/actor'].template.id).equal('4');
            assert(childs['/path/to/context'].template.id).equal('5');

        });

        it('should work with /', () => {

            let childs = getChildren(state, '/');

            assert(childs['/path'].template.id).equal('2');
            assert(childs['/path/to'].template.id).equal('3');
            assert(childs['/path/to/actor'].template.id).equal('4');
            assert(childs['/path/to/context'].template.id).equal('5');
            assert(childs['/pizza'].template.id).equal('6');
            assert(childs['nil']).equal(undefined);

        });

    });

    describe('getAddress', () => {

        it('should return the correct address', () => {

            getAddress(state, state.contexts['/path/to'].actor)
                .map(addr => assert(addr).equal('/path/to'))
                .orJust(() => { throw new Error('failed'); });

        });

    });

});
