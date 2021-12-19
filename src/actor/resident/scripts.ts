import * as op from '../system/vm/runtime/op';

import {
    NewFunInfo
} from '../system/vm/script/info';
import { Script, Constants } from '../system/vm/script';

/**
 * ResidentActorScript is the script used to allow resident actors to execute
 * functions in the VM.
 *
 * The script has functions for sending messages, setting a receiver and 
 * reacting to a notice of mailbox messages. The spawning and termination of new
 * actors is handled via the vm directly.
 */
export class ResidentActorScript implements Script {

    constants = <Constants>[[], []];

    name = '<main>';

    info = [

        // 0: Message 1: Address
        new NewFunInfo('tell', 2, [op.SEND]),

        // 0: Function
        new NewFunInfo('receive', 1, [op.RECV]),

        new NewFunInfo('notify', 0, [
            op.MAILCOUNT,         //Get the count of messages in the mailbox.
            op.IFZJMP | 6,        //If none go to end.
            op.RECVCOUNT,         //Get the count of pending receivers.      
            op.IFZJMP | 6,        //If none go to end.
            op.MAILDQ,            //Push the earliest message on to the stack.
            op.READ,              //Apply the earliest receiver to the message.
            op.NOP                //End
        ]),

      // 0: String
      new NewFunInfo('raise', 1, [op.RAISE]),
        
        // 0: Address
        new NewFunInfo('kill', 1, [op.STOP])

    ]

    code = [];

}
