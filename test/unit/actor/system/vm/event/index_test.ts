import { expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import {
    EVENT_MESSAGE_BOUNCE,
    EVENT_MESSGAE_SEND,
    MessageBounceEvent,
    MessageSendEvent
} from '../../../../../../lib/actor/system/vm/event';

import { EventDispatcher } from '../../../../../../lib/actor/system/vm/event/dispatcher';
import { LogWriter } from '../../../../../../lib/actor/system/vm/log/writer';

describe('EventDispatcher', () => {
    const log = mockDeep<LogWriter>();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('addEventListener', () => {
        it('should add to the correct Map', () => {
            let handler = jest.fn();

            let dispatcher = new EventDispatcher(log);

            dispatcher.addEventListener('test', handler);

            expect(dispatcher.handlers.get('test')).toBeDefined();

            expect(dispatcher.handlers.get('test')).toContain(handler);
        });
    });

    describe('dispatchMessageEvent', () => {
        it('should dispatch bounce events', () => {
            let handler = jest.fn();

            let dispatcher = new EventDispatcher(log);

            dispatcher.addEventListener(EVENT_MESSAGE_BOUNCE, handler);

            dispatcher.dispatchMessageEvent(
                EVENT_MESSAGE_BOUNCE,
                'a',
                'b',
                'c'
            );

            expect(handler).toHaveBeenCalledWith(
                new MessageBounceEvent('a', 'b', 'c')
            );
        });

        it('should dispatch send events', () => {
            let handler = jest.fn();

            let dispatcher = new EventDispatcher(log);

            dispatcher.addEventListener(EVENT_MESSGAE_SEND, handler);

            dispatcher.dispatchMessageEvent(EVENT_MESSGAE_SEND, 'a', 'b', 'c');

            expect(handler).toHaveBeenCalledWith(
                new MessageSendEvent('a', 'b', 'c')
            );
        });
    });

    describe('dispatch', () => {
        it('should dispatch events', () => {
            let handler = jest.fn();

            let otherHandler = jest.fn();

            let dispatcher = new EventDispatcher(log);

            dispatcher.addEventListener('test', handler);

            let event = { type: 'test', level: 1, source: 'a' };

            dispatcher.dispatch(event);

            expect(handler).toHaveBeenCalledWith(event);

            expect(otherHandler).not.toHaveBeenCalled();
        });
    });
});
