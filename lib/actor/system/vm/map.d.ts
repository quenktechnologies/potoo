import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
/**
 * Key is a unique identifier for items in a Map.
 */
export declare type Key = string;
/**
 * Map is a generic collection of key value pairs serving as an alternative to
 * directly using JS objects as maps.
 */
export declare class Map<T> {
    items: Record<T>;
    constructor(items?: Record<T>);
    /**
     * set the specified key to the value provided.
     */
    set(key: Key, value: T): Map<T>;
    /**
     * get the value at specified key (if it exists).
     */
    get(key: Key): Maybe<T>;
    /**
     * has indicates whether the specified key exists.
     */
    has(key: Key): boolean;
    /**
     * remove the value at the specified key.
     */
    remove(key: Key): Map<T>;
}
