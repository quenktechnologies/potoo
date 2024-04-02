import { TypeCase } from '@quenk/noni/lib/control/match/case';
import { Future, Task } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Platform } from '.';

import { Api } from '../../api';
import { Data } from './frame';

/**
 * AsyncTask is an operation that will be executed asynchronously.
 */
export type AsyncTask<T> = Future<T> | Task<T>;

/**
 * Runtime is the interface used by the outside world (JS) to execute code
 * in the VM.
 */
export interface Runtime extends Api {
    /**
     * vm the Runtime belongs to.
     */
    vm: Platform;

    /**
     * isValid indicates whether the Runtime is still valid.
     *
     * A Runtime is invalid if it has encountered an error or is no longer
     * part of the system.
     */
    isValid(): boolean;

    /**
     * receive a message from the actor's mailbox.
     *
     * If TypeCases are provided, the message will be matched against them
     * first and the result provided.
     */
    receive<T>(cases?: TypeCase<T>[]): Future<T>;

    /**
     * exec a function by name within the Runtime.
     *
     * A FunInfo with a corresponding name must already exist within the
     * actor's script. The results are provided wrapped in a Maybe with a
     * Nothing value meaning no value was returned.
     */
    exec<T>(name: string, args?: Data[]): Future<Maybe<T>>;
}
