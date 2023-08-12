
import { Context } from '../../system/vm/runtime/context';
import { FLAG_IMMUTABLE, FLAG_BUFFERED, FLAG_VM_THREAD } from '../../flags';
import { CaseFunction } from '../case/function';
import { Case } from '../case';
import { AbstractResident } from '../';

/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
export abstract class Immutable<T> extends AbstractResident {

    get $receiver() {

        return new CaseFunction(this.receive());

    }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED | FLAG_VM_THREAD;

        return c;

    }

    /**
     * receive provides the list of Case classes that the actor will be used
     * to process incomming messages.
     */
    receive(): Case<T>[] {

        return [];

    }

}
