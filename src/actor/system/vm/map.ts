import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record, set } from '@quenk/noni/lib/data/record';
import { get } from '@quenk/noni/lib/data/record/path';

/**
 * Key is a unique identifier for items in a Map.
 */
export type Key = string;

/**
 * Map is a generic collection of key value pairs serving as an alternative to
 * directly using JS objects as maps.
 */
export class Map<T> {
    constructor(public items: Record<T> = {}) {}

    /**
     * set the specified key to the value provided.
     */
    set(key: Key, value: T): Map<T> {
        this.items = set(this.items, key, value);
        return this;
    }

    /**
     * get the value at specified key (if it exists).
     */
    get(key: Key): Maybe<T> {
        return get(key, this.items);
    }

    /**
     * has indicates whether the specified key exists.
     */
    has(key: Key): boolean {
        return get(key, this.items).isJust();
    }

    /**
     * remove the value at the specified key.
     */
    remove(key: Key): Map<T> {
        delete this.items[key];
        return this;
    }
}
