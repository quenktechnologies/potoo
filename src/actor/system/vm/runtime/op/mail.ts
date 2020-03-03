import { Frame, DATA_LOCATION_MAILBOX, DATA_TYPE_MESSAGE } from '../stack/frame';
import { Runtime, Operand } from '../';

/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 * 
 * Stack:
 *  -> <uint32>
 */
export const mailcount = (r: Runtime, f: Frame, _: Operand) => {

    f.pushUInt32(r.context.mailbox.length);

}

/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
export const maildq = (r: Runtime, f: Frame, _: Operand) => {

    f.push((r.context.mailbox.length - 1) |
        DATA_LOCATION_MAILBOX |
        DATA_TYPE_MESSAGE);

}
