import * as actor from '../../../../../../lib/actor/system/vm/runtime/op/actor';

import { assert } from '@quenk/test/lib/assert';
import { right, left } from '@quenk/noni/lib/data/either';

import { INFO_TYPE_FUNCTION } from '../../../../../../lib/actor/system/vm/script';
import {
    DATA_TYPE_HEAP_STRING
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import { newRuntime } from '../../fixtures/runtime';
import { newFrame } from '../../fixtures/frame';
import { newInstance } from '../../fixtures/instance';
import { Message } from '../../../../../../lib/actor/message';

describe('actor', () => {

    describe('alloc', () => {

        it('should push the new address at top of stack', () => {

            let f = newFrame();
            let r = newRuntime();

            let tmp = { id: 'n95', create: newInstance() };

            f.mock.setReturnValue('popString', right('self'));

            f.mock.setReturnValue('popTemplate', right(tmp));

            r.vm.mock.setReturnValue('allocate', right('self'));

            actor.alloc(r, f, 0);

            assert(r.vm.mock.getCalledArgs('allocate')).equate(['self', tmp]);

            assert(f.mock.getCalledArgs('push')).equate([
                DATA_TYPE_HEAP_STRING | 0
            ]);

            assert(f.heap.strings).equate(['self']);

        })

    })

    describe('self', () => {

        it('should push the current address', () => {

            let f = newFrame();
            let r = newRuntime();

            actor.self(r, f, 0);

            assert(f.mock.getCalledList()).equate(['pushSelf']);

        });

    });

    describe('run', () => {

        it('should run the target actor', () => {

            let f = newFrame();
            let r = newRuntime();

            f.mock.setReturnValue('popString', right('self'));

            actor.run(r, f, 0);

            assert(r.vm.mock.getCalledList()).equate(['runActor']);

        });

    });

    describe('send', () => {

        it('should push true when message was sent', () => {

            let f = newFrame();
            let r = newRuntime();

            f.mock.setReturnValue('popString', right('self'));
            f.mock.setReturnValue('popValue', right('msg'));

            r.vm.mock.setReturnValue('sendMessage', true);

            actor.send(r, f, 0);

            assert(r.vm.mock.getCalledArgs('sendMessage')).equate(['self', 'msg']);

            assert(f.mock.getCalledArgs('pushUInt8')).equate([1]);

        });

        it('should push false when message cannot be sent', () => {

            let f = newFrame();
            let r = newRuntime();

            f.mock.setReturnValue('popString', right('self'));
            f.mock.setReturnValue('popValue', right('msg'));

            r.vm.mock.setReturnValue('sendMessage', false);

            actor.send(r, f, 0);

            assert(f.mock.getCalledArgs('pushUInt8')).equate([0]);

        });

    });

    describe('recv', () => {

        it('should schedule receivers', () => {

            let f = newFrame();
            let r = newRuntime();

            let info = { foreign: true, exec: () => false };

            f.mock.setReturnValue('popFunction', right(info));

            actor.recv(r, f, 0);

            assert(r.context.behaviour).equate([info.exec]);

        });

    });

    describe('recvcount', () => {

        it('should push the number of pending receive', () => {

            let f = newFrame();
            let r = newRuntime();

            r.context.behaviour.push(() => true);

            actor.recvcount(r, f, 0);

            assert(f.mock.getCalledArgs('push')).equate([1]);

        });

    });

    describe('mailcount', () => {

        it('should push the number of pending messages', () => {

            let f = newFrame();
            let r = newRuntime();

            r.context.mailbox = [1, 2, 3];

            actor.mailcount(r, f, 0);

            assert(f.mock.getCalledArgs('push')).equate([3]);

        });

    });

    describe('maildq', () => {

        it('should push the most recent message', () => {

            let f = newFrame();
            let r = newRuntime();

            actor.maildq(r, f, 0);

            assert(f.mock.wasCalled('pushMessage')).true();

        });

    });

    describe('read', () => {

        it('should consume the TOS', () => {

            let buf = <Message[]>[];
            let f = newFrame();
            let r = newRuntime();

            f.mock.setReturnValue('popValue', right('hi'));

            r.context.behaviour.push(m => { buf.push(m); return true });

            actor.read(r, f, 0);

            assert(buf).equate(['hi']);

            assert(f.mock.getCalledArgs('push')).equate([1]);

        });

    });

    describe('stop', () => {

        it('should stop the target', () => {

            let f = newFrame();
            let r = newRuntime();

            f.mock.setReturnValue('popString', right('self'));

            actor.stop(r, f, 0);

            assert(r.mock.getCalledArgs('kill')).equate(['self']);

        });

        it('should raise if stopping failed', () => {

            let f = newFrame();
            let r = newRuntime();
            let e = new Error('self')

            f.mock.setReturnValue('popString', left(e));

            actor.stop(r, f, 0);

            assert(r.mock.getCalledArgs('raise')).equate([e]);

        });

    });

})
