import { Context } from '../../system/vm/runtime/context';
import { Message } from '../../message';
import { AbstractResident } from '../';
import { CaseFunction } from '../case/function';
import { Case } from '../case';
/**
 * Mutable actors can change their behaviour after message processing.
 */
export declare abstract class Mutable extends AbstractResident {
    $receivers: CaseFunction<Message>[];
    init(c: Context): Context;
    /**
     * select the next message in the mailbox using the provided case classes.
     *
     * If the message cannot be handled by any of them, it will be dropped.
     */
    select<T>(cases: Case<T>[]): Mutable;
}
