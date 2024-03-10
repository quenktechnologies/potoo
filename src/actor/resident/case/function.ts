import { Eff } from '../..';
import { Message } from '../../message';
import { Case } from './';

/**
 * CaseFunction is a composite object for Case classes.
 *
 * It combines mutliple Case classes into one serving effectively as a pattern
 * matching function.
 */
export class CaseFunction<T> {
    constructor(public cases: Case<T>[]) {}

    /**
     * test whether at least one of the underlying Case classes will handle the
     * Message.
     */
    test(msg: Message): boolean {
        return this.cases.some(kase => kase.test(msg));
    }

    /**
     * apply the first Case class that will handle the provided Message.
     *
     * Throws if none of them will.
     */
    apply(msg: Message): Eff {
        let kase = this.cases.find(kase => kase.test(msg));

        if (!kase) throw new Error(`CaseFunction: No Case patterns match!`);

        return kase.apply(msg);
    }
}
