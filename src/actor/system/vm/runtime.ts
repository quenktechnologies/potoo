import { Case } from '@quenk/noni/lib/control/match/case';
import { Type } from '@quenk/noni/lib/data/type';

import { Forkable } from '../../../actor/template';
import { Api } from '../../api';
import { Actor, Message } from '../..';
import { VM } from '.';

/**
 * MessagePredicate is a function that tests whether a message satisfies a certain
 * condition.
 */
export type MessagePredicate = (msg: Message) => boolean | Case<Message>;

/**
 * Runtime is the interface used by the outside world (JS) to execute code
 * in the VM.
 */
export interface Runtime extends Actor, Api {
    /**
     * vm the Runtime belongs to.
     */
    vm: VM;

    /**
     * finalValue of the Runtime.
     *
     * This can be set so that the parent of the Runtime obtains a result
     * if the child has been forked instead of spawned.
     */
    finalValue?: Type;

    /**
     * isValid indicates whether the Runtime is still valid.
     *
     * A Runtime is invalid if it has encountered an error or is no longer
     * part of the system.
     */
    isValid(): boolean;

    /**
     * fork is like spawn but meant for returning the result of a child
     * actor instead of an address.
     *
     * The child actor only provides the result upon its exit.
     */
    fork<T>(t: Forkable<T>): Promise<T>;

    /**
     * receiveUntil continues invoking receive() until the result satisfies
     * the test function provided.
     *
     * Note that the function is applied to the result of case matching it
     * is therefore important to return a value in at least one of the cases
     * to the predicate can be satisfied.
     */
    receiveUntil<T>(cases: Case<T>[], f: MessagePredicate): Promise<T>;

    /**
     * watch an asynchronous task, feeding any errors into the VM's
     * error handling machinery.
     *
     * This method exists to allow async operations to trigger the error
     * handling machinery built into the VM.
     */
    watch<T>(task: () => Promise<T>): Promise<void>;
}
