import * as op from '../system/vm/runtime/op';

import {
    ForeignFunInfo,
    NewForeignFunInfo,
    objectType,
    NewFunInfo,
    NewArrayTypeInfo,
    NewTypeInfo
} from '../system/vm/script/info';
import { ESObject } from '../system/vm/runtime/heap/object/es';
import { Script, Constants } from '../system/vm/script';
import { Runtime } from '../system/vm/runtime';
import { Template } from '../template';
import { System } from '../system';
import { Address } from '../address';
import { Message } from '../message';
import { isObject } from '@quenk/noni/lib/data/type';

//XXX: The following is declared here because we need the children section to
//be recursive. In the future we may support lazily getting properties by 
//using functions or some other mechanism.
const templateType = new NewTypeInfo('Template', 0, []);

const childrenInfo = new NewArrayTypeInfo('Children', templateType);

templateType.properties[0] = { name: 'children', type: childrenInfo };

/**
 * Spawn spawns a single child actor from a template.
 */
export class Spawn<S extends System> implements Script {

    constructor(public template: Template<S>) { }

    name = '<spawn>';

    constants = <Constants>[[], []];

    immediate = true;

    info = [

        templateType,

        new NewForeignFunInfo(
            'getTemp',
            0,
            (r: Runtime) => r.heap.addObject(
                new ESObject(r.heap, templateType, this.template))),

        new NewFunInfo('spawn', 2, [

            op.STORE | 0,     //0: set $0 to the template.
            op.STORE | 1,     //1: set $1 to the parent address.
            op.LOAD | 1,      //2: put the parent address back on the stack.
            op.LOAD | 0,      //3: put the template back onto the stack.
            op.ALLOC,         //4: allocate the context for the new actor.
            op.STORE | 2,     //5: set $2 to the created actor's address.
            op.LOAD | 2,      //6: put the address back on the stack.
            op.RUN,           //7: start the actor.
            op.LOAD | 0,      //8: Put $0 (the template) back on the stack.
            op.GETPROP | 0,   //9: Put the children array on the stack.
            op.DUP,           //10: Duplicate the top of the stack.
            op.IFZJMP | 32,   //11: If the child array is null jump to the end. 
            op.STORE | 3,     //12: Set $3 to the child array.
            op.LOAD | 3,      //13: Put the child array back on the stack.
            op.ARLENGTH,      //14: Count the number of child templates.
            op.STORE | 4,     //15: Set $4 to the count of child templates.
            op.PUSHUI32 | 0,  //16: Push 0 onto the stack.
            op.STORE | 5,     //17: Create a counter variable $5.
            op.LOAD | 4,      //18: Load child count back on to the stack.
            op.LOAD | 5,      //19: Load the counter back on to the stack.
            op.CEQ,           //20: Is the counter the same as the child count?
            op.IFNZJMP | 34,  //21: If true jump to the end of the routine.
            op.PUSHUI32 | 0,  //22: Push the uint 0 on to the stack.
            op.LOAD | 5,      //23: Put the counter back on the stack.
            op.LOAD | 3,      //24: Put the child array back on to the stack.
            op.ARELM,         //25: Put the child template @ $4 on the stack.
            op.LOAD | 2,      //26: Put the parent address on to the stack.
            op.LDN | 2,       //27: Load the "spawn" function on to the stack.
            op.CALL,          //28: Call the "spawn" function.
            op.LOAD | 5,      //29: Load the counter back on to the stack.
            op.PUSHUI32 | 1,  //30: Put the uint 1 on to the stack.
            op.ADDUI32,       //31: Increment.
            op.STORE | 5,     //32: Update the counter.
            op.JMP | 18,      //33: Continue from line 18.
            op.LOAD | 2       //34: Load the address of the first spawned.
        ])

    ];

    code = [

        op.LDN | 1,        // 0: Put getTemp on to the stack.
        op.CALL,           // 1: Call getTemp to get the template.
        op.SELF,           // 2: Get the current actor's address.
        op.LDN | 2,        // 3: Put spawn on to the stack.
        op.CALL            // 4: Call spawn, with parent and template.

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

    constructor(public f: ForeignFunInfo) { }

    constants = <Constants>[[], []];

    name = 'receive';

    info = [

        this.f

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
