/**
 * Opcode
 */
export declare type Opcode = number;
/**
 * Operand
 */
export declare type Operand = number;
/**
 * Instruction
 */
export declare type Instruction = number;
export declare const OPCODE_MASK = 4278190080;
export declare const OPERAND_MASK = 16777215;
export declare const OPCODE_RANGE_START = 16777216;
export declare const OPCODE_RANGE_END = 4278190080;
export declare const OPERAND_RANGE_START = 0;
export declare const OPERAND_RANGE_END = 16777215;
export declare const MAX_INSTRUCTION = 4294967295;
