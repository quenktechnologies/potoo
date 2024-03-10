import { Context } from '../../system/vm/runtime/context';
import { Message } from '../../message';
import { FLAG_BUFFERED, FLAG_VM_THREAD } from '../../flags';
import { AbstractResident } from '../';
import { CaseFunction } from '../case/function';
import { Case } from '../case';

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable extends AbstractResident {
    $receivers: CaseFunction<Message>[] = [];

    init(c: Context): Context {
        c.flags = c.flags | FLAG_BUFFERED | FLAG_VM_THREAD;

        return c;
    }

    /**
     * select the next message in the mailbox using the provided case classes.
     *
     * If the message cannot be handled by any of them, it will be dropped.
     */
    select<T>(cases: Case<T>[]): Mutable {
        this.$receivers.push(new CaseFunction(cases));

        this.notify();

        return this;
    }
}
