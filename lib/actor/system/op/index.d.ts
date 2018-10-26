import { System } from '../';
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
 * Op is an instruction executed by a System.
 */
export declare abstract class Op {
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
    abstract exec(s: System): void;
}
