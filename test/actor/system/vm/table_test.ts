import { assert } from '@quenk/test/lib/assert';

import { nothing } from '@quenk/noni/lib/data/maybe';

import { ActorTable, ActorTableEntry } from '../../../../lib/actor/system/vm/table';
import { newContext } from './fixtures/context';
import { InstanceImpl } from './fixtures/instance';

const mkEntry = (address: string) => <ActorTableEntry>({

    actor: new InstanceImpl(),

    context: newContext({ address }),

    thread: nothing()

})

describe('ActorTable', () => {

    describe('getChildren', () => {

        it('should provide all acotrs when the address is the system', () => {

            let table = new ActorTable({

                $: mkEntry('$'),

                a: mkEntry('a'),

                b: mkEntry('b'),

                c: mkEntry('c')

            });

            let childs = table.getChildren('$');

            assert(childs.map(ate => ate.context.address))
                .equate(['a', 'b', 'c']);

        });

        it('should rank parents before children', () => {

            let table = new ActorTable({

                $: mkEntry('$'),

                a: mkEntry('a'),

                'a/b': mkEntry('a/b'),

                'a/c': mkEntry('a/c'),

                'a/b/c': mkEntry('a/b/c'),

                '/': mkEntry('/'),

                'a/c/d': mkEntry('a/c/d'),

                'a/cc': mkEntry('a/cc'),

                '': mkEntry(''),

                'aa': mkEntry('aa'),

                'ab': mkEntry('ab')

            });

            let childs = table.getChildren('a');

            assert(childs.map(ate => ate.context.address))
                .equate(['a/b', 'a/c', 'a/cc', 'a/b/c', 'a/c/d']);

        });

        it('should return an empty list if actor does not exist', () => {

            let table = new ActorTable({

                $: mkEntry('$'),

                a: mkEntry('a'),

                'a/b': mkEntry('a/b'),

                'a/c': mkEntry('a/c'),

            });

            let childs = table.getChildren('/');

            assert(childs.map(ate => ate.context.address)).equate([]);

        });

        it('should not return all when the address has no children', () => {

            let table = new ActorTable({

                $: mkEntry('$'),

                'self': mkEntry('self'),

                'self/1': mkEntry('self/1'),

                'self/2': mkEntry('self/2'),

            });

            let childs = table.getChildren('self/1');

            assert(childs.map(ate => ate.context.address)).equate([]);

        });

    });

});
