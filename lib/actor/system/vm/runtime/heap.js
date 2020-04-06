"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var frame_1 = require("./stack/frame");
/**
 * HeapEntry contains info about an object on the heap and the object itself.
 * @param type    - type is a pointer to a function in the cons section that
 *                  produced the object.
 *
 * @param builtin - indicates whether the type is one of the builtin types.
 *
 * @param value - value of the entry.
 */
var HeapEntry = /** @class */ (function () {
    function HeapEntry(type, builtin, value) {
        this.type = type;
        this.builtin = builtin;
        this.value = value;
    }
    return HeapEntry;
}());
exports.HeapEntry = HeapEntry;
/**
 * Heap stores objects in use by the script.
 */
var Heap = /** @class */ (function () {
    function Heap(pool, strings) {
        if (pool === void 0) { pool = []; }
        if (strings === void 0) { strings = []; }
        this.pool = pool;
        this.strings = strings;
    }
    /**
     * add an entry to the heap
     */
    Heap.prototype.add = function (h) {
        //TODO: what if heap size is > 24bits?
        return (this.pool.push(h) - 1) | frame_1.DATA_TYPE_HEAP;
    };
    /**
     * addString value to the heap.
     *
     * Strings are stored in a separate pool/
     */
    Heap.prototype.addString = function (value) {
        var idx = this.strings.indexOf(value);
        if (idx === -1) {
            this.strings.push(value);
            idx = this.strings.length - 1;
        }
        return idx | frame_1.DATA_TYPE_HEAP_STRING;
    };
    /**
     * get an object from the heap.
     */
    Heap.prototype.get = function (r) {
        return maybe_1.fromNullable(this.pool[r & frame_1.DATA_MASK_VALUE24]);
    };
    /**
     * getString from the strings pool.
     *
     * If no string exists at the reference and empty string is provided.
     */
    Heap.prototype.getString = function (r) {
        var value = this.strings[r & frame_1.DATA_MASK_VALUE24];
        return (value != null) ? value : '';
    };
    /**
     * ref returns a reference for an entry in the pool.
     */
    Heap.prototype.ref = function (v) {
        return this.pool.reduce(function (p, e, i) {
            return (e.value === v) ? maybe_1.just(frame_1.DATA_TYPE_HEAP | i) : p;
        }, maybe_1.nothing());
    };
    /**
     * release old objects in the heap.
     */
    Heap.prototype.release = function () {
        this.pool = [];
    };
    return Heap;
}());
exports.Heap = Heap;
//# sourceMappingURL=heap.js.map