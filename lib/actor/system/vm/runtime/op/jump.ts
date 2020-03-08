import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
export const jmp = (_: Runtime, f: Frame, args: Operand) => {

    f.ip = args;

}

/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> -> 
 */
export const ifzjmp = (_: Runtime, f: Frame, args: Operand) => {

    let eValue = f.popValue();

    if ((eValue.isLeft()) || (eValue.takeRight() === 0))
        f.ip = args;

}

/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
export const ifnzjmp = (_: Runtime, f: Frame, args: Operand) => {

    let eValue = f.popValue();

    if ((eValue.isRight()) && (eValue.takeRight() !== 0))
        f.ip = args;

}

/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export const ifeqjmp = (r: Runtime, f: Frame, args: Operand) => {

    let eLhs = f.popValue();
    let eRhs = f.popValue();

    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() === eRhs.takeRight())
        f.ip = args;

}

/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export const ifneqjmp = (r: Runtime, f: Frame, args: Operand) => {

    let eLhs = f.popValue();
    let eRhs = f.popValue();

    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() !== eRhs.takeRight())
        f.ip = args;

}
