import { System } from '../';

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
 * Op is an instruction executed by a System.
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
    public abstract exec(s: System): void;

}






