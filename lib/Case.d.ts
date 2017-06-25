export interface Handler<T> {
    (t: T): void;
}
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    t: T;
    h: Handler<T>;
    constructor(t: T, h: Handler<T>);
    /**
     * matches checks if the supplied type satisfies this Case
     */
    matches<M>(m: M): boolean;
    /**
     * apply the function of this Case to a message
     */
    apply(m: T): void;
}
