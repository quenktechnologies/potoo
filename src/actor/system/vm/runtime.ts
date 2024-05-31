import { Api } from '../../api';
import { Actor } from '../..';
import { Platform } from '.';

/**
 * Runtime is the interface used by the outside world (JS) to execute code
 * in the VM.
 */
export interface Runtime extends Actor, Api {
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
     * watch an asynchronous task, feeding any errors into the VM's
     * error handling machinery.
     *
     * This method exists to allow async operations to trigger the error
     * handling machinery built into the VM.
     */
    watch<T>(task: () => Promise<T>): void;
}
