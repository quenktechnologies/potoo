import * as template from '../../../template';
import * as errors from '../runtime/error';

import { Err, toError } from '@quenk/noni/lib/control/err';

import { ADDRESS_SYSTEM, getParent } from '../../../address';
import { Thread } from '../thread';
import { Allocator } from '../allocator';
import { JSThread } from '../thread/shared/js';
import { ThreadState } from '../thread/shared';

/**
 * ErrorStrategy is the interface used by threads to communicate errors that
 * have occurred within the system.
 *
 * Error handling is mostly dictated by the result of the template's trap
 * function however, when that function is not specified, the strategy determines
 * what to do.
 */
export interface ErrorStrategy {
    /**
     * raise an error within the system.
     *
     * The error will be subject to the strategy's error handling algorithm.
     */
    raise(src: Thread, err: Err): Promise<void>;
}

/**
 * SupervisorErrorStrategy defaults to raising the error with the parent actor
 * if no trap function is specified.
 */
export class SupervisorErrorStrategy implements ErrorStrategy {
    constructor(public allocator: Allocator) {}

    async raise(src: Thread, error: Err) {
        let prevThread;

        let err = error;

        let currentThread = src;

        let allocator = this.allocator;

        while (true) {
            if (prevThread) {
                await allocator.deallocate(prevThread);
                let mcurrentThread = allocator.getThread(
                    getParent(prevThread.address)
                );

                //TODO: warn thread not found.
                if (mcurrentThread.isNothing()) break;

                currentThread = mcurrentThread.get();

                err = new errors.ActorTerminatedErr(
                    currentThread.address,
                    src.address,
                    error
                );
            }

            let tmpl = allocator.getTemplate(currentThread.address).get();

            let trap = tmpl.trap ?? defaultTrap;

            let action = trap(err);

            if (action === template.ACTION_IGNORE) {
                //TODO: figure this out correctly.
                if (currentThread instanceof JSThread) {
                    currentThread.state = ThreadState.IDLE;
                }
                return;
            } else if (action === template.ACTION_RESTART) {
                await allocator.reallocate(currentThread);
                return;
            } else if (action === template.ACTION_STOP) {
                await allocator.deallocate(currentThread);
                return;
            } else if (currentThread.address === ADDRESS_SYSTEM) {
                break;
            }

            prevThread = currentThread;
        }

        throw toError(err);
    }
}

const defaultTrap = () => template.ACTION_RAISE;
