import * as logging from '../log';
import { Context } from '../state/context';
import { Template } from '../../template';
import { State } from '../state';
import { Logger } from '../log';
import { Configuration } from '../configuration';

//Op codes.
export const OP_RAISE = 0x64;
export const OP_STOP = 0x0;
export const OP_RUN = 0x1;
export const OP_SPAWN = 0x2;
export const OP_RESTART = 0x3;
export const OP_TELL = 0x4;
export const OP_DROP = 0x5;
export const OP_RECEIVE = 0x6;
export const OP_CHECK = 0x7;
export const OP_READ = 0x8;
export const OP_KILL = 0x9;
export const OP_FLAGS = 0xa;
export const OP_ROUTE = 0xb;
export const OP_TRANSFER = 0xc;

/**
 * Executor interface.
 *
 * Has methods and properties needed for opcode execution.
 */
export interface Executor<F extends Context> {

    /**
     * configuration
     */
    configuration: Configuration;

    /**
     * state serves as a table of actors within the system.
     */
    state: State<F>;

    /**
     * allocate a new Context for an actor.
     */
    allocate(t: Template): F;

    /**
     * exec an op code.
     */
    exec(code: Op): Executor<F>;

}

/**
 * Op is an instruction executed by a System/Executor.
 */
export abstract class Op {

    /**
     * code for the Op.
     */
    public abstract code: number;

    /**
     * level of the instruction used for logging.
     */
    public abstract level: number;

    /**
     * exec the instruction.
     */
    public abstract exec<F extends Context>(s: Executor<F>): void;

}

/**
 * log an Op to the Executor's logger.
 */
export const log = (level: number, logger: Logger, o: Op): Op => {

    if (o.level <= <number>level)
        switch (o.level) {
            case logging.INFO:
                (<logging.Logger>logger).info(o);
                break;
            case logging.WARN:
                (<logging.Logger>logger).warn(o);
                break;
            case logging.ERROR:
                (<logging.Logger>logger).error(o);
                break;
            default:
                (<logging.Logger>logger).log(o)
                break;

        }

    return o;

}
