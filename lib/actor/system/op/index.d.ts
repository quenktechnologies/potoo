import * as logging from '../log';
import { Context } from '../../context';
import { Template } from '../../template';
import { State } from '../state';
import { Configuration } from '../configuration';
export declare const OP_RAISE = 100;
export declare const OP_STOP = 0;
export declare const OP_RUN = 1;
export declare const OP_SPAWN = 2;
export declare const OP_RESTART = 3;
export declare const OP_TELL = 4;
export declare const OP_DROP = 5;
export declare const OP_RECEIVE = 6;
export declare const OP_CHECK = 7;
export declare const OP_READ = 8;
export declare const OP_KILL = 9;
export declare const OP_FLAGS = 10;
export declare const OP_ROUTE = 11;
export declare const OP_TRANSFER = 12;
/**
 * Executor interface.
 *
 * Has methods and properties needed for opcode execution.
 */
export interface Executor<C extends Context> {
    /**
     * configuration
     */
    configuration: Configuration;
    /**
     * state serves as a table of actors within the system.
     */
    state: State<C>;
    /**
     * allocate a new Context for an actor.
     */
    allocate(t: Template<C>): C;
    /**
     * exec an op code.
     */
    exec(code: Op<C>): Executor<C>;
}
/**
 * Op is an instruction executed by a System/Executor.
 */
export declare abstract class Op<C extends Context> {
    /**
     * code for the Op.
     */
    abstract code: number;
    /**
     * level of the instruction used for logging.
     */
    abstract level: number;
    /**
     * exec the instruction.
     */
    abstract exec(s: Executor<C>): void;
}
/**
 * log an Op to the Executor's logger.
 */
export declare const log: <C extends Context>(level: number, logger: logging.Logger, o: Op<C>) => Op<C>;
