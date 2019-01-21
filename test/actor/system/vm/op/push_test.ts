import * as push from '../../../../../src/actor/system/vm/op/push';
import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';

describe('push', () => {

    describe('PushNum', () => {

        describe('exec', () => {

            it('should push a number onto the stack', () => {

                let e = new ExecutorImpl(new Frame(new Script(), newContext()));

                new push.PushNum(12).exec(e);
                assert(e.current.data).equate([12, Type.Number, Location.Literal]);

            });

        });

    });

    describe('PushString', () => {

        describe('exec', () => {

            it('should push a string onto the stack', () => {

                let e = new ExecutorImpl(new Frame(new Script(), newContext()));

                new push.PushStr(1).exec(e);
                assert(e.current.data).equate([1, Type.String, Location.Constants]);

            });

        });

    });

    describe('PushTemp', () => {

        describe('exec', () => {

            it('should push a template onto the stack', () => {

                let e = new ExecutorImpl(new Frame(new Script(), newContext()));

                new push.PushTemp(1).exec(e);
                assert(e.current.data).equate([1, Type.Template, Location.Constants]);

            });

        });

    });

});
