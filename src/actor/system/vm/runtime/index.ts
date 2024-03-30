import { Err } from '@quenk/noni/lib/control/err';
import { Future, Task } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Platform } from '..';
import { Address } from '../../../address';
import { Template } from '../../../template';
import { Data } from '../frame';

/**
 * AsyncTask is an operation that will be executed asynchronously.
 */
export type AsyncTask<T> = Future<T> | Task<T>;

/**
 * Runtime is the interface used by the outside world (JS) to execute code
 * in the VM.
 */
export interface Runtime {
    /**
     * vm the Runtime belongs to.
     */
    vm: Platform;

    /**
     * self is the address of the actor this Runtime is associated with.
     */
    self: Address;

    /**
     * spawn a child actor from the provided template.
     */
    spawn(target: Template): Future<Address>;

    /**
     * tell a message to an actor using its address to route the message.
     */
    tell<M>(addr: Address, msg: M): Future<void>;

    /**
     * raise an error or error like object in the VM.
     */
    raise(err: Err): void;

    /**
     * watch an asynchronous task feeding any errors into the VM's
     * error handling machinery.
     *
     * This method does not block execution on the Thread.
     */
    watch<T>(task: AsyncTask<T>): void;

    /**
     * exit terminates the Runtime of the actor.
     */
    exit(): void;

    /**
     * kill sends a signal to another actor to terminate.
     *
     * Note: This can only be used on child actors and their descendants.
     */
    kill(addr: Address): Future<void>;

    /**
     * exec a function by name within the Runtime.
     *
     * A FunInfo with a corresponding name must already exist within the
     * actor's script. The results are provided wrapped in a Maybe with a
     * Nothing value meaning no value was returned.
     */
    exec<T>(name: string, args?: Data[]): Future<Maybe<T>>;
}
