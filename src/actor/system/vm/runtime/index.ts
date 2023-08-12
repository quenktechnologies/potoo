//TODO: Relocate some of these types.

/**
 * Opcode
 */
export type Opcode = number;

/**
 * Operand
 */
export type Operand = number;

/**
 * Instruction
 */
export type Instruction = number;

export const OPCODE_MASK = 0xff000000;

export const OPERAND_MASK = 0x00ffffff;

export const OPCODE_RANGE_START = 0x1000000;

export const OPCODE_RANGE_END = 0xff000000;

export const OPERAND_RANGE_START = 0x0;

export const OPERAND_RANGE_END = 0xffffff;

export const MAX_INSTRUCTION = 0xffffffff;
