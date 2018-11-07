import * as must from 'must/register';
import { nothing } from '@quenk/noni/lib/data/maybe';
import {
    State,
    getParent,
    getChildren,
    getAddress
} from '../../../../src/actor/system/state';
import { Context } from '../../../../src/actor/context';
import { Envelope } from '../../../../src/actor/mailbox';

class Act {

  init(c:Context): Context { return c; }

    accept(_: Envelope) { return this; }

    run() { }

    stop() { }

}

const context = (id: string): Context => ({

    mailbox: nothing(),

    actor: new Act(),

    behaviour: [],

    flags: { immutable: true, buffered: false },

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

    routes: {}
}

describe('state', () => {

    describe('getParent', () => {

        it('should return the correct parent', () => {

            getParent(state, '/path/to/context')
                .map(p => must(p.template.id).be('3'))
                .orJust(() => { throw new Error('404!'); })

        });

    });

    describe('getChildren', () => {

        it('should return the correct children', () => {

            let childs = getChildren(state, '/path/to')

            must(childs['/path/to/actor'].template.id).be('4');
            must(childs['/path/to/context'].template.id).be('5');

        });

        it('should work with /', () => {

            let childs = getChildren(state, '/');

            must(childs['/path'].template.id).be('2');
            must(childs['/path/to'].template.id).be('3');
            must(childs['/path/to/actor'].template.id).be('4');
            must(childs['/path/to/context'].template.id).be('5');
            must(childs['/pizza'].template.id).be('6');
            must(childs['nil']).be(undefined);

        });

    });

    describe('getAddress', () => {

        it('should return the correct address', () => {

            getAddress(state, state.contexts['/path/to'].actor)
                .map(addr => must(addr).be('/path/to'))
                .orJust(() => { throw new Error('failed'); });

        });

    });

});
