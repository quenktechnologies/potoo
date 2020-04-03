import * as op from '../system/vm/runtime/op';

import {
    ForeignFunInfo,
    TYPE_TEMPLATE,
    TYPE_OBJECT
} from '../system/vm/script/info';
import { Script, Constants } from '../system/vm/script';
import { Template } from '../template';
import { System } from '../system';
import { Address } from '../address';
import { Message } from '../message';

/**
 * Spawn spawns a single child actor from a template.
 */
export class Spawn implements Script {

    constructor(
        public template: Template<System>) { }

    constants = <Constants>[[], []];

    info = [

        new ForeignFunInfo(
            'getTemp',
            0,
            TYPE_TEMPLATE,
            false,
            () => this.template)

    ];

    code = [

        op.SELF,
        op.CALL | 1,
        op.ALLOC,
        op.DUP,
        op.RUN

    ];

}

/**
 * Tell used to deliver messages to other actors.
 */
export class Tell implements Script {

    constructor(public to: Address, public msg: Message) { }

    constants = <Constants>[[], []];

    info = [

        new ForeignFunInfo(
            'getAddress',
            0,
            TYPE_OBJECT,
            false,
            () => this.to),

        new ForeignFunInfo(
            'getMessage',
            0,
            TYPE_OBJECT,
            false,
            () => this.msg)

    ];

    code = [

        op.CALL | 0,
        op.CALL | 1,
        op.ALLOC

    ];

}

/**
 * Receive schedules a receiver for the actor.
 */
export class Receive implements Script {

    constructor(public f: Function) { }

    constants = <Constants>[[], []];

    info = [

        new ForeignFunInfo(
            'getAddress',
            0,
            TYPE_OBJECT,
            false,
            () => this.f),

    ];

    code = [

        op.RECV | 0,

    ];

}

/**
 * Notify attempts to consume the next available message in the mailbox.
 */
export class Notify implements Script {

    constants = <Constants>[[], []];

    info = [];

    code = [

        op.MAILCOUNT,         //Get the count of messages in the mailbox.
        op.IFZJMP | 6,        //If none go to end.
        op.RECVCOUNT,         //Get the count of pending receivers.      
        op.IFZJMP | 6,        //If none go to end.
        op.MAILDQ,            //Push the earliest message on to the stack.
        op.READ,              //Apply the earliest receiver to the message.
        op.NOP                //End

    ];

}
