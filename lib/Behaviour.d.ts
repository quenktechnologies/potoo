import { Case } from './Case';
/**
 * Behaviour of an actor
 */
export interface Behaviour {
    willConsume<M>(m: M): boolean;
    consume<M>(m: M): void;
}
/**
 * MatchAny accepts any value.
 */
export declare class MatchAny<M> implements Behaviour {
    f: (m: M) => void;
    constructor(f: (m: M) => void);
    static create<M>(f: (m: M) => void): MatchAny<M>;
    willConsume(_: M): boolean;
    consume(m: M): void;
}
/**
 * MatchCase
 */
export declare class MatchCase<T> implements Behaviour {
    cases: Case<T>[];
    constructor(cases: Case<T>[]);
    willConsume<M>(m: M): boolean;
    consume(m: T): void;
}
