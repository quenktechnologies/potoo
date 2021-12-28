import { Eff } from '../..';
import { Message } from '../../message';
import { Case } from './';
/**
 * CaseFunction is a composite object for Case classes.
 *
 * It combines mutliple Case classes into one serving effectively as a pattern
 * matching function.
 */
export declare class CaseFunction<T> {
    cases: Case<T>[];
    constructor(cases: Case<T>[]);
    /**
     * test whether at least one of the underlying Case classes will handle the
     * Message.
     */
    test(msg: Message): boolean;
    /**
     * apply the first Case class that will handle the provided Message.
     *
     * Throws if none of them will.
     */
    apply(msg: Message): Eff;
}
