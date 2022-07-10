import { Type } from '@quenk/noni/lib/data/type';
import { Address } from '../../address';
import { Operand } from './runtime';
import { Opcode } from './runtime/op';
import { Frame } from './runtime/stack/frame';
import { VMThread } from './thread';
export declare const LOG_LEVEL_TRACE = 8;
export declare const LOG_LEVEL_DEBUG = 7;
export declare const LOG_LEVEL_INFO = 6;
export declare const LOG_LEVEL_NOTICE = 5;
export declare const LOG_LEVEL_WARN = 4;
export declare const LOG_LEVEL_ERROR = 3;
/**
 * LogLevel
 */
export declare type LogLevel = number;
/**
 * LogSink is the interface expected for log message destinations.
 *
 * This is based on the JS console API and as a result `console` is a valid
 * LogSink.
 */
export interface LogSink {
    /**
     * debug level.
     */
    debug(...e: Type[]): void;
    /**
     * info level.
     */
    info(...e: Type[]): void;
    /**
     * warn level.
     */
    warn(...e: Type[]): void;
    /**
     * error level.
     */
    error(...e: Type[]): void;
    /**
     * log level.
     */
    log(...e: Type[]): void;
}
/**
 * LogWritable is the interface used by the VM for logging.
 *
 * It provides convenience methods for writing various types of messages to the
 * log sink.
 */
export interface LogWritable {
    /**
     * level below which we log messages for.
     */
    level: LogLevel;
    /**
     * opcode logs the execution of an opcode once the log level is >=
     * [[LOG_LEVEL_TRACE]].
     */
    opcode(thr: VMThread, frame: Frame, op: Opcode, operand: Operand): void;
    /**
     * event outputs a system event to the log if predefined [[LogLevel]] for
     * the event is less than or equal to the current log level.
     */
    event(addr: Address, evt: string, ...args: Type[]): void;
}
/**
 * LogWriter provides an implementation of [[LogWritable]] for the VM.
 */
export declare class LogWriter implements LogWritable {
    sink: LogSink;
    level: LogLevel;
    constructor(sink: LogSink, level: LogLevel);
    opcode(thr: VMThread, frame: Frame, op: Opcode, operand: Operand): void;
    event(addr: Address, evt: string, ...args: Type[]): void;
}
