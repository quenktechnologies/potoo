import { assert } from '@quenk/test/lib/assert';
import { merge } from '@quenk/noni/lib/data/record';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { Constants, SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Stop } from '../../../../../src/actor/system/vm/op/stop';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

describe('stop', () => {

    describe('Stop', () => {

        describe('exec', () => {

            it('should stop the actor', () => {

                let c: Constants = [[], ['/'], [], [], [], []];

                let one = newContext();

                let f = new Frame('/', one, new Script(c),
                    [], [Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('/', one);

                new Stop().exec(e);

                assert((<any>one.actor).MOCK.called()).equate(['stop']);

                assert(Object.keys(e.system.state.contexts).length).equal(0);

            })

            it('should not stop actors outside its branch', () => {

                let c: Constants = [[], ['/bar'], [], [], [], []];
                let slash = newContext();
                let foo = newContext();
                let bar = newContext();

                let f = new Frame('/foo', foo,
                    new Script(c), [], [Location.Constants, Type.String, 0]);

                let e = new This('/foo', new SystemImpl(), [f]);

                e.putContext('/', slash);
                e.putContext('/foo', foo);
                e.putContext('/bar', bar);

                assert(Object.keys(e.system.state.contexts).length).equal(3);

                new Stop().exec(e);

                assert((<any>bar.actor).MOCK.called()).equate([]);

                // Actor /foo will die because of the error.
                assert(Object.keys(e.system.state.contexts).length).equal(2);

            })

            it('should stop children first', () => {

                let c: Constants = [[], ['/'], [], [], [], []];

                let one = newContext();
                let two = newContext();
                let three = newContext();

                let f = new Frame('/', one,
                    new Script(c), [], [Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('/', one);
                e.putContext('/two', two);
                e.putContext('/three', three);

                new Stop().exec(e);

                assert((<any>one.actor).MOCK.called()).equate(['stop']);
                assert((<any>two.actor).MOCK.called()).equate(['stop']);
                assert((<any>three.actor).MOCK.called()).equate(['stop']);
                assert(Object.keys(e.system.state.contexts).length).equal(0);

            });

            it('should not stop the executing actor if not the target', () => {

                let c: Constants = [[], ['/bar'], [], [], [], []];
                let slash = newContext();
                let foo = newContext();
                let bar = newContext();

                let f = new Frame('/', slash,
                    new Script(c), [], [Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('/', slash);
                e.putContext('/foo', foo);
                e.putContext('/bar', bar);

                assert(Object.keys(e.system.state.contexts).length).equal(3);

                new Stop().exec(e);

                assert((<any>slash.actor).MOCK.called()).equate([]);

                assert(Object.keys(e.system.state.contexts)).equate([
                    '/', '/foo'
                ]);

            })

            it('should stop groups', () => {

                let c: Constants = [[], ['$group'], [], [], [], []];
                let one = newContext();
                let two = newContext();
                let three = newContext();
                let four = newContext();
                let five = newContext();

                let f = new Frame('/', one,
                    new Script(c), [], [Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.system.state.groups = { group: ['/two', '/three'] };

                e.putContext('/', one);
                e.putContext('/two', two);
                e.putContext('/three', three);
                e.putContext('/four', four);
                e.putContext('/five', five);

                assert(Object.keys(e.system.state.contexts)).equate([
                    '/', '/two', '/three', '/four', '/five'
                ]);
                new Stop().exec(e);

                assert(Object.keys(e.system.state.contexts)).equate([
                    '/', '/four', '/five'
                ]);

            })

        });

    });

});