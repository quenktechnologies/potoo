import { Context } from '../system/vm/runtime/context';
import { AbstractResident } from './';
/**
 * Task executes its run method then exits.
 *
 * Use this actor to communicate with the system when not interested in
 * receiving messages.
 */
export declare abstract class Task extends AbstractResident {
    init(c: Context): Context;
}
