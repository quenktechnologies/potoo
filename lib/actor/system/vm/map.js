"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const path_1 = require("@quenk/noni/lib/data/record/path");
/**
 * Map is a generic collection of key value pairs serving as an alternative to
 * directly using JS objects as maps.
 */
class Map {
    constructor(items = {}) {
        this.items = items;
    }
    /**
     * set the specified key to the value provided.
     */
    set(key, value) {
        this.items = (0, record_1.set)(this.items, key, value);
        return this;
    }
    /**
     * get the value at specified key (if it exists).
     */
    get(key) {
        return (0, path_1.get)(key, this.items);
    }
    /**
     * has indicates whether the specified key exists.
     */
    has(key) {
        return (0, path_1.get)(key, this.items).isJust();
    }
    /**
     * remove the value at the specified key.
     */
    remove(key) {
        delete this.items[key];
        return this;
    }
}
exports.Map = Map;
//# sourceMappingURL=map.js.map