import { Frame } from '../stack/frame';
import { Operand } from '../';
import { VMThread } from '../../thread';
/**
 * alloc a VMThread for a new actor.
 *
 * The VMThread is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
export declare const alloc: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
export declare const self: (_: VMThread, f: Frame, __: Operand) => void;
/**
 * send a message to another actor.
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
export declare const send: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * recv schedules a receiver function for the next available message.
 *
 * Currently only supports foreign functions.
 * Will invoke the actor's notify() method if there are pending
 * messages.
 *
 * Stack:
 * <function> ->
 */
export declare const recv: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export declare const recvcount: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export declare const mailcount: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
export declare const maildq: (_: VMThread, f: Frame, __: Operand) => void;
/**
 * stop an actor in the system.
 *
 * The actor will be removed.
 *
 * Stack:
 *
 * <address> ->
 */
export declare const stop: (r: VMThread, f: Frame, _: Operand) => void;
