import { Err } from '@quenk/noni/lib/control/error';
import { Future, Task } from '@quenk/noni/lib/control/monad/future';

import { Address } from './address';
import { Spawnable } from './template';

/**
 * Parent is anything that can spawn an actor.
 */
export interface Parent {
    /**
     * spawn an actor give its template.
     */
    spawn(t: Spawnable): Future<Address>;
}

/**
 * AsyncTask is an operation that will be executed asynchronously.
 */
export type AsyncTask<T> = Future<T> | Task<T>;

/**
 * Api is the interface used by actors to interact with the rest of the system.
 *
 * The three main methods here are the spawn(), tell(), and receive()
 * methods that form the basis of message processing and communication.
 */
export interface Api extends Parent {
    /*
     * self is the address for the actor within the system
     */
    self: Address;

    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Future<void>;

    /**
     * watch an asynchronous task feeding any errors into the VM's
     * error handling machinery.
     *
     * This method exists to allow async operations to trigger the Thread's
     * error handling code. It does not block the execution of the Thread.
     */
    watch<T>(task: AsyncTask<T>): void;

    /**
     * raise an error triggering the systems error handling mechanism.
     */
    raise(e: Err): void;

    /**
     * kill sends a stop signal to a child actor.
     */
    kill(addr: Address): Future<void>;

    /**
     * exit the actor from the system.
     */
    exit(): void;
}
