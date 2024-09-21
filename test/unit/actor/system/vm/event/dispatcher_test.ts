import { expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import {
    ActorAllocatedEvent,
    ActorDeallocatedEvent,
    ActorStartedEvent,
    ActorStoppedEvent,
    EVENT_ACTOR_ALLOCATED,
    EVENT_ACTOR_DEALLOCATED,
    EVENT_ACTOR_STARTED,
    EVENT_ACTOR_STOPPED,
    EVENT_MESSAGE_BOUNCE,
    EVENT_MESSGAE_SEND,
    MessageBounceEvent,
    MessageSendEvent
} from '../../../../../../lib/actor/system/vm/event';
import {
    ADDRESS_WILDCARD,
    EventDispatcher,
    ListenerMap
} from '../../../../../../lib/actor/system/vm/event/dispatcher';
import { LogWriter } from '../../../../../../lib/actor/system/vm/log/writer';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';

const dispatchTests = {
    dispatchActorEvent: {
        'should dispatch ActorAllocatedEvent': {
            type: EVENT_ACTOR_ALLOCATED,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchActorEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_ACTOR_ALLOCATED
                );
            },

            event: new ActorAllocatedEvent('a')
        },

        'should dispatch ActorStartedEvent': {
            type: EVENT_ACTOR_STARTED,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchActorEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_ACTOR_STARTED
                );
            },

            event: new ActorStartedEvent('a')
        },
        'should dispatch ActorStoppedEvent': {
            type: EVENT_ACTOR_STOPPED,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchActorEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_ACTOR_STOPPED
                );
            },

            event: new ActorStoppedEvent('a')
        },

        'should dispatch ActorDeallocatedEvent': {
            type: EVENT_ACTOR_DEALLOCATED,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchActorEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_ACTOR_DEALLOCATED
                );
            },

            event: new ActorDeallocatedEvent('a')
        }
    },
    dispatchMessageEvent: {
        'should dispatch bounce events': {
            type: EVENT_MESSAGE_BOUNCE,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchMessageEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_MESSAGE_BOUNCE,
                    'b',
                    'message'
                );
            },

            event: new MessageBounceEvent('a', 'b', 'message')
        },
        'should dispatch send events': {
            type: EVENT_MESSGAE_SEND,

            dispatch: (dispatcher: EventDispatcher) => {
                dispatcher.dispatchMessageEvent(
                    mockDeep<Thread>({ address: 'a' }),
                    EVENT_MESSGAE_SEND,
                    'b',
                    'message'
                );
            },

            event: new MessageSendEvent('a', 'b', 'message')
        }
    }
};

describe('EventDispatcher', () => {
    const log = mockDeep<LogWriter>();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('addListener', () => {
        it('should store listeners actor addresses', () => {
            let listener = jest.fn();

            let dispatcher = new EventDispatcher(log);

            dispatcher.addListener('/', 'test', listener);

            let store = <ListenerMap>dispatcher.maps.get('/');

            expect(store).toBeDefined();

            expect(store.get('test')).toContain(listener);
        });
    });

    describe('monitor', () => {
        it('should block for the event', async () => {
            let dispatcher = new EventDispatcher(log);

            let event = { type: 'test', level: 1, source: '/' };

            setTimeout(() => {
                dispatcher.dispatch(mockDeep<Thread>({ address: '/' }), event);
            });

            let received = await dispatcher.monitor('/', 'test');

            expect(received).toBe(event);
        });

        it('should reject if the actor stopped', () => {
            let dispatcher = new EventDispatcher(log);

            let event = { type: 'test', level: 1, source: '/' };

            let thread = mockDeep<Thread>({ address: '/' });

            let promise = dispatcher.monitor(thread, 'test');

            expect(dispatcher.maps.entries()).toHaveLength(1);

            dispatcher.dispatchActorEvent(thread, EVENT_ACTOR_STOPPED);

            expect(dispatcher.maps.entries()).toHaveLength(0);

            expect(promise).rejects.toThrowError('ERR_ACTOR_STOPPED');
        });
    });

    describe('removeListener', () => {
        it('should remove the type listener', () => {
            let listener = jest.fn();

            let dispatcher = new EventDispatcher(
                log,
                new Map([
                    [
                        'a',
                        new Map([
                            ['test', [listener]],
                            ['test1', [listener]]
                        ])
                    ],
                    [
                        'b',
                        new Map([
                            ['test', [listener]],
                            ['test1', [listener]]
                        ])
                    ]
                ])
            );

            dispatcher.removeListener('a', 'test', listener);

            expect(
                (<ListenerMap>dispatcher.maps.get('a')).get('test')
            ).not.toContain(listener);
            expect(
                (<ListenerMap>dispatcher.maps.get('a')).get('test1')
            ).toContain(listener);
            expect(
                (<ListenerMap>dispatcher.maps.get('b')).get('test')
            ).toContain(listener);
            expect(
                (<ListenerMap>dispatcher.maps.get('b')).get('test1')
            ).toContain(listener);
        });
    });

    describe('dispatch', () => {
        it('should dispatch events for a thread', () => {
            let listener = jest.fn();

            let dispatcher = new EventDispatcher(
                log,
                new Map([['/', new Map([['test', [listener]]])]])
            );

            let event = { type: 'test', level: 1, source: '/' };

            let thread = mockDeep<Thread>({ address: '/' });

            dispatcher.dispatch(thread, event);

            expect(listener).toHaveBeenCalledWith(event);
        });

        it('should not dispatch events for other threads', () => {
            let listener = jest.fn();

            let listener2 = jest.fn();

            let dispatcher = new EventDispatcher(
                log,
                new Map([
                    ['a', new Map([['test', [listener]]])],
                    ['b', new Map([['test', [listener2]]])]
                ])
            );

            let event = { type: 'test', level: 1, source: 'a' };

            let thread = mockDeep<Thread>({ address: 'a' });

            dispatcher.dispatch(thread, event);

            expect(listener).toHaveBeenCalledWith(event);

            expect(listener2).not.toHaveBeenCalled();
        });

        it('should dispatch to wildcard address, listeners', () => {
            let listener = jest.fn();

            let listener2 = jest.fn();

            let listener3 = jest.fn();

            let dispatcher = new EventDispatcher(
                log,
                new Map([
                    [ADDRESS_WILDCARD, new Map([['test', [listener]]])],
                    ['a', new Map([['test', [listener2]]])],
                    ['b', new Map([['test', [listener3]]])]
                ])
            );

            let event = { type: 'test', level: 1, source: 'a' };

            let thread = mockDeep<Thread>({ address: 'a' });

            dispatcher.dispatch(thread, event);

            expect(listener).toHaveBeenCalledWith(event);

            expect(listener2).toHaveBeenCalledWith(event);

            expect(listener3).not.toHaveBeenCalled();
        });
    });

    for (let [suite, tests] of Object.entries(dispatchTests)) {
        describe(suite, () => {
            for (let [name, conf] of Object.entries(tests)) {
                it(name, () => {
                    let listener = jest.fn();

                    let dispatcher = new EventDispatcher(
                        log,
                        new Map([['a', new Map([[conf.type, [listener]]])]])
                    );

                    conf.dispatch(dispatcher);

                    expect(listener).toHaveBeenCalledWith(conf.event);
                });
            }
        });
    }
});