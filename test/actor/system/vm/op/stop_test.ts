import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { Constants, ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Stop } from '../../../../../src/actor/system/vm/op/stop';

describe('stop', () => {

    describe('Stop', () => {

        describe('exec', () => {

            it('should stop the actor', () => {

                let c: Constants = [[], ['/'], [], [], [], []];

              let e = new ExecutorImpl(new Frame('/', newContext(),
                    new Script(c), [], [Location.Constants, Type.String, 0]));

                let one = newContext();

                e.putContext('/', one);

                new Stop().exec(e);

                assert((<any>one.actor).MOCK.called()).equate(['stop']);
                assert(Object.keys(e.contexts).length).equal(0);

            })

            it('should not stop actors outside its branch', () => {

              let c: Constants = [[], ['/bar'], [], [], [], []];
                let slash = newContext();
                let foo = newContext();
                let bar = newContext();

              let e = new ExecutorImpl(new Frame('/foo', foo,
                    new Script(c), [], [Location.Constants, Type.String, 0]));

                e.putContext('/', slash);
                e.putContext('/foo', foo);
              e.putContext('/bar', bar);

                new Stop().exec(e);

                assert((<any>bar.actor).MOCK.called()).equate([]);
                assert(Object.keys(e.contexts).length).equal(3);

            })

            it('should stop children first', () => {

                let c: Constants = [[], ['/'], [], [], [], []];


              let e = new ExecutorImpl(new Frame('/', newContext(),
                    new Script(c), [], [Location.Constants, Type.String, 0]));

                let one = newContext();
                let two = newContext();
                let three = newContext();

                e.putContext('/', one);
                e.putContext('/two', two);
                e.putContext('/three', three);

                new Stop().exec(e);

                assert((<any>one.actor).MOCK.called()).equate(['stop']);
                assert((<any>two.actor).MOCK.called()).equate(['stop']);
                assert((<any>three.actor).MOCK.called()).equate(['stop']);
                assert(Object.keys(e.contexts).length).equal(0);

            });

        });

    });

});
