import * as op from '../system/vm/runtime/op';

import {
    NewForeignFunInfo,
    objectType
} from '../system/vm/script/info';
import { ESObject } from '../system/vm/runtime/heap/object/es';
import { Script, Constants } from '../system/vm/script';
import { Runtime } from '../system/vm/runtime';
import { Template } from '../template';
import { System } from '../system';
import { Address } from '../address';
import { Message } from '../message';
import { isObject } from '@quenk/noni/lib/data/type';

/**
 * Spawn spawns a single child actor from a template.
 */
export class Spawn<S extends System> implements Script {

    constructor(public template: Template<S>) { }

    name = '<spawn>';

    constants = <Constants>[[], []];

    immediate = true;

    info = [

        new NewForeignFunInfo(
            'getTemp',
            0,
            (r: Runtime) => r.heap.addObject(
                new ESObject(r.heap, objectType, this.template)))

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

        new NewForeignFunInfo(
            'getAddress',
            0,
            () => this.to),

        new NewForeignFunInfo(
            'getMessage',
            0,
            (r: Runtime) => isObject(this.msg) ?
                r.heap.addObject(new ESObject(r.heap, objectType, this.msg)) :
                this.msg)
    ];

    code = [

        op.LDN | 0,
        op.CALL,
        op.LDN | 1,
        op.CALL,
        op.SEND

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

        new NewForeignFunInfo(
            'receiver',
            0,
            (_: Runtime, m: Message) => Number(this.f(m)))

    ];

    code = [

        op.LDN | 0,
        op.RECV

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

        new NewForeignFunInfo(
            'getMessage',
            0,
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

        new NewForeignFunInfo(
            'getAddress',
            0,
            () => this.addr)

    ];

    code = [

        op.LDN | 0,
        op.CALL,
        op.STOP

    ];

}
