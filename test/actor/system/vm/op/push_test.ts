import * as push from '../../../../../src/actor/system/vm/op/push';
import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';

describe('push', () => {

    describe('PushNum', () => {

        describe('exec', () => {

            it('should push a number onto the stack', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script()));

                new push.PushNum(12).exec(e);

                assert(e.current.data).equate([Location.Literal, Type.Number, 12]);

            });

        });

    });

    describe('PushString', () => {

        describe('exec', () => {

            it('should push a string onto the stack', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(), 
                new Script(), ));

                new push.PushStr(12).exec(e);
                assert(e.current.data).equate([Location.Constants, Type.String, 12]);

            });

        });

    });

    describe('PushFunc', () => {

        describe('exec', () => {

            it('should push a function onto the stack', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script(), ));

                new push.PushFunc(12).exec(e);

                assert(e.current.data).equate([Location.Constants, Type.Function, 12]);

            });

        });

    });

    describe('PushTemp', () => {

        describe('exec', () => {

            it('should push a template onto the stack', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script(), ));

                new push.PushTemp(12).exec(e);

                assert(e.current.data).equate([Location.Constants, Type.Template, 12]);

            });

        });

    });

    describe('PushMsg', () => {

        describe('exec', () => {

            it('should push a message onto the stack', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script()));

                new push.PushMsg(12).exec(e);

                assert(e.current.data).equate([Location.Constants, Type.Message, 12]);

            });

        });

    });

});
