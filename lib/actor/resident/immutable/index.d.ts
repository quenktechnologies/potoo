import { Context } from '../../system/vm/runtime/context';
import { CaseFunction } from '../case/function';
import { Case } from '../case';
import { AbstractResident } from '../';
/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
export declare abstract class Immutable<T> extends AbstractResident {
    get $receiver(): CaseFunction<T>;
    init(c: Context): Context;
    /**
     * receive provides the list of Case classes that the actor will be used
     * to process incomming messages.
     */
    receive(): Case<T>[];
}
