import { Pattern } from '@quenk/kindof';
import { Handler } from '.';
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    type: Pattern;
    handler: Handler<T>;
    constructor(type: Pattern, handler: Handler<T>);
    _execute(m: any): void;
    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: any): boolean;
}