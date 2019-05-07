import { PushMsg, PushStr, PushForeign } from '../system/vm/op/push';
import { Tell } from '../system/vm/op/tell';
import { Drop } from '../system/vm/op/drop';
import { Discard } from '../system/vm/op/discard';
import { JumpIfOne } from '../system/vm/op/jump';
import { Noop } from '../system/vm/op/noop';
import { Receive } from '../system/vm/op/receive';
import { Read } from '../system/vm/op/read';
import { Op } from '../system/vm/op';
import { Constants, Foreign, Script } from '../system/vm/script';
import { Address } from '../address';
import { Message } from '../message';

const acceptCode: Op[] = [
    new PushMsg(0),
    new Drop()
];

const tellcode: Op[] = [

    new PushMsg(0),    //0: Push the message onto the stack. 
    new PushStr(0),    //1: Push the address onto the stack.
    new Tell(),        //2: Tell the message to the address.
    new JumpIfOne(6),  //3: Jump to the end if sending was successful.
    new PushMsg(0),    //4: Put the message back on the stack.
    new Drop(),        //5: Drop the script.
    new Noop()         //6: Do nothing.

];

const receivecode: Op[] = [

    new PushForeign(0),
    new Receive()

];

const notifyCode: Op[] = [

    new Read(),
    new JumpIfOne(3),
    new Discard(),
    new Noop()

];

/**
 * AcceptScript for discarding messages.
 */
export class AcceptScript extends Script {

    constructor(public msg: Message) {

        super(<Constants>[[], [], [], [], [msg], []], acceptCode);

    }


}

export { AcceptScript as DropScript }

/**
 * TellScript for sending messages.
 */
export class TellScript extends Script {

    constructor(public to: Address, public msg: Message) {

        super(
            <Constants>[[], [to], [], [], [msg], []],
            <Op[]>tellcode);

    }

}

/**
 * ReceiveScript
 */
export class ReceiveScript extends Script {

    constructor(public func: Foreign) {

        super(<Constants>[[], [], [], [], [], [func]], receivecode);

    }

}

/**
 * NotifyScript
 */
export class NotifyScript extends Script {

    constructor() {

        super(<Constants>[[], [], [], [], [], []], notifyCode);

    }

}
