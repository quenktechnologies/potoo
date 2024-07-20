import { expect } from '@jest/globals';

import { mockDeep } from 'jest-mock-extended';
import { LogSink } from '../../../../../../lib/actor/system/vm/log/sink';

import {
    LogWriter,
    LogLevel
} from '../../../../../../lib/actor/system/vm/log/writer';

const getLevelString = (level: LogLevel) => {
    let entry = Object.entries(LogLevel).find(([, v]) => v === level);
    return entry ? entry[0] : '<void>';
};

describe('LogWriter', () => {
    describe('write', () => {
        let debugs = [LogLevel.DEBUG, LogLevel.TRACE];

        let infos = [LogLevel.INFO];

        let warns = [LogLevel.NOTICE, LogLevel.WARN];

        let errors = [LogLevel.ERROR];

        for (let level of [
            LogLevel.TRACE,
            LogLevel.DEBUG,
            LogLevel.INFO,
            LogLevel.NOTICE,
            LogLevel.WARN,
            LogLevel.WARN
        ]) {
            it(`should call the correct method for ${getLevelString(level)}`, () => {
                let sink = mockDeep<LogSink>();

                let writer = new LogWriter(sink, LogLevel.TRACE);

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

                let writer = new LogWriter(sink, LogLevel.ERROR);

                for (let level of [
                    LogLevel.TRACE,
                    LogLevel.DEBUG,
                    LogLevel.INFO,
                    LogLevel.NOTICE,
                    LogLevel.WARN,
                    LogLevel.ERROR
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

          let writer = new LogWriter(sink, LogLevel.TRACE, {
              'test': { level: LogLevel.DEBUG, message: '{type} message' }
          });

          writer.writeEvent({ type: 'test', source:'/' });

          expect(sink.debug).toHaveBeenCalledWith('test message');
          
        });
      
    });
});
