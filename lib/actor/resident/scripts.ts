import * as op from '../system/vm/runtime/op';
import * as events from '../system/vm/event';
import * as errors from '../system/vm/runtime/error';

import { empty } from '@quenk/noni/lib/data/array';

import {
    NewForeignFunInfo,
    NewFunInfo
} from '../system/vm/script/info';
import { commonFunctions, BaseScript } from '../system/vm/scripts';
import { Thread } from '../system/vm/thread';
import { CaseFunction } from './case/function';
import { Message } from '../message';
import { Callback } from './immutable/callback';
import { Immutable } from './immutable';
import { Mutable } from './mutable';

const receiveIdx = commonFunctions.length + 1;

const residentCommonFunctions = [

    ...commonFunctions,

    new NewFunInfo('notify', 0, [
        op.MAILCOUNT,         // Get the count of messages in the mailbox.
        op.IFZJMP | 5,        // If none go to end.
        op.MAILDQ,            // Push the earliest message on to the stack.
        op.LDN | receiveIdx,  // Load the 'receive' function on to the stack.
        op.CALL | 1,          // Apply the handler for messages once.
        op.NOP                // End
    ])

];

/**
 * ImmutableActorScript used by Immutable actor instances.
 */
export class ImmutableActorScript<T> extends BaseScript {

    constructor(public actor: Immutable<T>) { super(); }

    info = [

        ...residentCommonFunctions,

        new NewForeignFunInfo('receive', 1, (thr: Thread, msg: Message) =>
            immutableExec(this.actor, thr, msg))

    ];

    code = [];

}

/**
 * CallbackActorScript used by Callback actor instances.
 */
export class CallbackActorScript<T> extends BaseScript {

    constructor(public actor: Callback<T>) { super(); }

    info = [

        ...residentCommonFunctions,

        new NewForeignFunInfo('receive', 1, (thr: Thread, msg: Message) => {

            let result = immutableExec(this.actor, thr, msg);

            this.actor.exit();

            return result;

        })

    ];

    code = [];

}


/**
 * MutableActorScript used by Mutable actor instances.
 */
export class MutableActorScript extends BaseScript {

    constructor(public actor: Mutable) { super(); }

    info = [

        ...residentCommonFunctions,

        new NewForeignFunInfo('receive', 1, (thr: Thread, msg: Message) => {

            let { actor } = this;

            let vm = actor.system.getPlatform();

            if (empty(actor.$receivers)) {

                thr.raise(new errors.NoReceiverErr(thr.context.address));

                return 0;

            }

            if (actor.$receivers[0].test(msg)) {

                let receiver = <CaseFunction<Message>>actor.$receivers.shift();

                let future = receiver.apply(msg);

                if (future) thr.wait(future);

                vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);

                return 1;

            } else {

                vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED,
                    msg);

                return 0;

            }

        }),

        new NewFunInfo('notify', 0, [
            op.MAILCOUNT,         // Get the count of messages in the mailbox.
            op.IFZJMP | 4,        // If none go to end.
            op.MAILDQ,            // Push the earliest message on to the stack.
            op.CALL | receiveIdx, // Apply the handler for messages once.
            op.NOP                // End
        ]),

    ];

    code = [];

}

/**
 * TaskActorScript used by the Task actor.
 */
export class TaskActorScript extends BaseScript {

    info = commonFunctions;

}

const immutableExec = <T>(actor: Immutable<T>, thr: Thread, msg: Message) => {

    let vm = actor.system.getPlatform();

    if (actor.$receiver.test(msg)) {

        let future = actor.$receiver.apply(msg);

        if (future)
            thr.wait(future);

        vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);

        return 1;

    } else {

        vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED,
            msg);

        return 0;

    }
}
