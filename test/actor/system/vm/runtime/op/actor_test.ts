import * as actor from '../../../../../../lib/actor/system/vm/runtime/op/actor';

import { assert } from '@quenk/test/lib/assert';
import { right, left } from '@quenk/noni/lib/data/either';

import {
    DATA_TYPE_HEAP_STRING
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import { newThread } from '../../fixtures/thread';
import { newFrame } from '../../fixtures/frame';
import { newInstance } from '../../fixtures/instance';
import { NewForeignFunInfo } from '../../../../../../lib/actor/system/vm/script/info';
import { newHeapObject } from '../../type/fixtures/object';

describe('actor', () => {

    describe('alloc', () => {

        it('should push the new address at top of stack', () => {

            let f = newFrame();

            let r = newThread();

            let tmp = { id: 'n95', create: newInstance() }

            let ho = newHeapObject();

            ho.mock.setReturnValue('promote', tmp);

            f.mock.setReturnValue('popString', right('self'));

            f.mock.setReturnValue('popObject', right(ho));

            r.vm.mock.setReturnValue('allocate', right('self'));

            actor.alloc(r, f, 0);

            assert(r.vm.mock.getCalledArgs('allocate')).equate(['self', tmp]);

            assert(f.mock.getCalledArgs('push')).equate([
                DATA_TYPE_HEAP_STRING | 0
            ]);

        })

    })

    describe('self', () => {

        it('should push the current address', () => {

            let f = newFrame();
            let r = newThread();

            actor.self(r, f, 0);

            assert(f.mock.getCalledList()).equate(['pushSelf']);

        });

    });

    describe('send', () => {

        it('should push true when message was sent', () => {

            let f = newFrame();
            let r = newThread();

            f.mock.setReturnValue('popString', right('self'));
            f.mock.setReturnValue('popValue', right('msg'));

            r.vm.mock.setReturnValue('sendMessage', true);

            actor.send(r, f, 0);

            assert(r.vm.mock.getCalledArgs('sendMessage'))
                .equate(['self', '?', 'msg']);

            assert(f.mock.getCalledArgs('pushUInt8')).equate([1]);

        });

        it('should push false when message cannot be sent', () => {

            let f = newFrame();
            let r = newThread();

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
            let r = newThread();

            let info = { foreign: true, exec: () => false };

            f.mock.setReturnValue('popFunction', right(info));

            actor.recv(r, f, 0);

            assert(r.context.receivers).equate([info]);

        });

    });

    describe('recvcount', () => {

        it('should push the number of pending receive', () => {

            let f = newFrame();
            let r = newThread();

            r.context.receivers.push(new NewForeignFunInfo('foo', 0, () => 1));

            actor.recvcount(r, f, 0);

            assert(f.mock.getCalledArgs('push')).equate([1]);

        });

    });

    describe('mailcount', () => {

        it('should push the number of pending messages', () => {

            let f = newFrame();
            let r = newThread();

            r.context.mailbox = [1, 2, 3];

            actor.mailcount(r, f, 0);

            assert(f.mock.getCalledArgs('push')).equate([3]);

        });

    });

    describe('maildq', () => {

        it('should push the most recent message', () => {

            let f = newFrame();
            let r = newThread();

            actor.maildq(r, f, 0);

            assert(f.mock.wasCalled('pushMessage')).true();

        });

    });

    describe('stop', () => {

        it('should stop the target', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popString', right('self'));

            actor.stop(r, f, 0);

            assert(r.vm.mock.wasCalled('kill')).true();

        });

        it('should raise if stopping failed', () => {

            let f = newFrame();

            let r = newThread();

            let e = new Error('no self');

            f.mock.setReturnValue('popString', left(e));

            actor.stop(r, f, 0);

            assert(r.mock.getCalledArgs('raise')).equate([e]);

        });

    });

})
