import { Context } from '../system/vm/runtime/context';
import { FLAG_EXIT_AFTER_RUN } from '../flags';
import { AbstractResident } from './';

/**
 * Task executes its run method then exits.
 *
 * Use this actor to communicate with the system when not interested in
 * receiving messages.
 */
export abstract class Task extends AbstractResident {
    init(c: Context): Context {
        c.flags = c.flags | FLAG_EXIT_AFTER_RUN;

        return c;
    }
}
