import * as opcodes from '../../../../lib/actor/system/vm/runtime/op';

import { Type } from '@quenk/noni/lib/data/type';

import { assert } from '@quenk/test/lib/assert';
import { Mock } from '@quenk/test/lib/mock';

import { EVENT_ACTOR_CREATED } from '../../../../lib/actor/system/vm/event';
import { LogWriter } from '../../../../lib/actor/system/vm/log';
import { ThreadImpl } from './fixtures/thread';
import { FrameImpl } from './fixtures/frame';

class Sink {

    mock = new Mock();

    debug(...e: Type[]) {

        this.mock.invoke('debug', [...e], undefined);

    }

    info(...e: Type[]) {

        this.mock.invoke('info', [...e], undefined);

    }

    warn(...e: Type[]) {

        this.mock.invoke('warn', [...e], undefined);

    }

    error(...e: Type[]) {

        this.mock.invoke('error', [...e], undefined);

    }

    log(...e: Type[]) {

        this.mock.invoke('log', [...e], undefined);

    }

}

let thread = new ThreadImpl();

let frame = new FrameImpl();

describe('LogWriter', () => {

    describe('opcode', () => {

        it('should log opcodes', () => {

            let sink = new Sink();

            let log = new LogWriter(sink, 8);

            log.opcode(thread, frame, opcodes.ALLOC, 0);

            assert(sink.mock.wasCalledWith('debug',
                ['[?]', '(test#main)', 'alloc'])).true();

        });

        it('should not log if log level is < LOG_LEVEL_TRACE', () => {

            let sink = new Sink();

            let log = new LogWriter(sink, 1);

            log.opcode(thread, frame, opcodes.ALLOC, 0);

            assert(sink.mock.getCalledCount('debug')).equal(0);

        })

    });

    describe('event', () => {

        it('should log to console', () => {

            let sink = new Sink();

            let log = new LogWriter(sink, 7);

            log.event('?', EVENT_ACTOR_CREATED, { id: 'x' });

            assert(sink.mock.wasCalledWithDeep('info',
                ['?', EVENT_ACTOR_CREATED, [{ id: 'x' }]])).true();

        });

    });

});
