import * as op from '../system/vm/runtime/op';

import {
    ForeignFunInfo,
    TYPE_TEMPLATE,
    TYPE_OBJECT,
    TYPE_STRING
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

    name = '<spawn>';

    constants = <Constants>[[], []];

    immediate = true;

    info = [

        new ForeignFunInfo(
            'getTemp',
            0,
            TYPE_TEMPLATE,
            false,
            () => this.template)

    ];

    code = [

        op.LDN | 0,
        op.CALL,
        op.SELF,
        op.ALLOC,
        op.DUP,
        op.RUN

    ];

}

/**
 * Self provides the address of the current instance.
 */
export class Self implements Script {

    constants = <Constants>[[], []];

    name = '<self>';

    immediate = true;

    info = [];

    code = [

        op.SELF

    ];

}

/**
 * Tell used to deliver messages to other actors.
 */
export class Tell implements Script {

    constructor(public to: Address, public msg: Message) { }

    constants = <Constants>[[], []];

    name = '<tell>';

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

        op.LDN | 0,
        op.CALL,
        op.LDN | 1,
        op.CALL,
        op.ALLOC

    ];

}

/**
 * Receive schedules a receiver for the actor.
 */
export class Receive implements Script {

    constructor(public f: (m: Message) => boolean) { }

    constants = <Constants>[[], []];

    name = 'receive';

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

    name = '<notify>';

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

/**
 * Raise an exception triggering the systems error handling mechanism.
 * TODO: implement
 */
export class Raise implements Script {

    constructor(public msg: string) { }

    name = '<raise>';

    constants = <Constants>[[], []];

    info = [

        new ForeignFunInfo(
            'getMessage',
            0,
            TYPE_STRING,
            false,
            () => this.msg)

    ];

    code = [

        op.LDN | 0,
        op.CALL,
        op.RAISE

    ];

}

/**
 * Kill stops an actor within the executing actor's process tree (inclusive).
 * TODO: implement.
 */
export class Kill implements Script {

    constructor(public addr: string) { }

    name = '<kill>';

    constants = <Constants>[[], []];

    info = [

        new ForeignFunInfo(
            'getAddress',
            0,
            TYPE_STRING,
            false,
            () => this.addr)

    ];

    code = [

        op.LDN | 0,
        op.CALL,
        op.STOP

    ];

}
