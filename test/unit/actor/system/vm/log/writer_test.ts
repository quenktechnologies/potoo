import { expect } from '@jest/globals';

import { mockDeep } from 'jest-mock-extended';
import {
    LogLevelValue,
    toLogLevel
} from '../../../../../../lib/actor/system/vm/log';
import { LogSink } from '../../../../../../lib/actor/system/vm/log';
import { LogWriter } from '../../../../../../lib/actor/system/vm/log/writer';

describe('LogWriter', () => {
    describe('write', () => {
        let debugs = [LogLevelValue.debug, LogLevelValue.trace];

        let infos = [LogLevelValue.info];

        let warns = [LogLevelValue.notice, LogLevelValue.warn];

        let errors = [LogLevelValue.error];

        for (let level of [
            LogLevelValue.trace,
            LogLevelValue.debug,
            LogLevelValue.info,
            LogLevelValue.notice,
            LogLevelValue.warn,
            LogLevelValue.warn
        ]) {
            it(`should call the correct method for ${toLogLevel(
                level
            )}`, () => {
                let sink = mockDeep<LogSink>();

                let writer = new LogWriter(sink, LogLevelValue.trace);

                writer.write(level, 'test');

                if (debugs.includes(level)) {
                    expect(sink.debug).toBeCalledWith('test');
                } else if (infos.includes(level)) {
                    expect(sink.info).toBeCalledWith('test');
                } else if (warns.includes(level)) {
                    expect(sink.warn).toBeCalledWith('test');
                } else if (errors.includes(level)) {
                    expect(sink.error).toBeCalledWith('test');
                } else {
                    expect(sink.log).toBeCalledWith('test');
                }
            });

            it('should only log levels <= to the current level', () => {
                let sink = mockDeep<LogSink>();

                let writer = new LogWriter(sink, LogLevelValue.error);

                for (let level of [
                    LogLevelValue.trace,
                    LogLevelValue.debug,
                    LogLevelValue.info,
                    LogLevelValue.notice,
                    LogLevelValue.warn,
                    LogLevelValue.error
                ]) {
                    writer.write(level, 'test');
                }

                expect(sink.debug).not.toHaveBeenCalled();
                expect(sink.info).not.toHaveBeenCalled();
                expect(sink.warn).not.toHaveBeenCalled();
                expect(sink.error).toHaveBeenCalledWith('test');
            });
        }
    });

    describe('writeEvent', () => {
        it('should use templates', () => {
            let sink = mockDeep<LogSink>();

            let writer = new LogWriter(sink, LogLevelValue.trace, {
                test: '{type} message'
            });

            writer.writeEvent({
                type: 'test',
                level: LogLevelValue.debug,
                source: '/'
            });

            expect(sink.debug).toHaveBeenCalledWith('test message');
        });

        it('should default to info if no template found', () => {
            let sink = mockDeep<LogSink>();

            let writer = new LogWriter(sink, LogLevelValue.trace, {});

            let evt = { type: 'test', level: LogLevelValue.info, source: '/' };

            writer.writeEvent(evt);

            expect(sink.info).toHaveBeenCalledWith(evt);

            expect(sink.debug).not.toHaveBeenCalled();
        });
    });
});
