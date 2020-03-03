import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
export const pushui8 = (_: Runtime, f: Frame, args: Operand) => {

    f.pushUInt8(args);

}

/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
export const pushui16 = (_: Runtime, f: Frame, args: Operand) => {

    f.pushUInt16(args);

}

/**
 * pushstr pushes a string onto the stack.
 *
 * Stack:
 *  -> <string>
 */
export const pushstr = (_: Runtime, f: Frame, args: Operand) => {

    f.pushString(args);

}

/**
 * pushTmpl pushes a template onto the stack.
 *
 * Stack:
 *  -> <template>
 */
export const pushtmpl = (_: Runtime, f: Frame, args: Operand) => {

    f.pushTemplate(args);

}

/**
 * pushmsg pushes a message onto the stack.
 *
 * Stack:
 *  -> <message>
 */
export const pushmsg = (_: Runtime, f: Frame, args: Operand) => {

    f.pushMessage(args);

}
