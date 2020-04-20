"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var type_1 = require("@quenk/noni/lib/data/type");
var frame_1 = require("../stack/frame");
/**
 * Heap stores objects in use by the script.
 */
var Heap = /** @class */ (function () {
    function Heap(objects, strings) {
        if (objects === void 0) { objects = []; }
        if (strings === void 0) { strings = []; }
        this.objects = objects;
        this.strings = strings;
    }
    /**
     * addObject to the heap
     */
    Heap.prototype.addObject = function (h) {
        //TODO: what if heap size is > 24bits?
        return (this.objects.push(h) - 1) | frame_1.DATA_TYPE_HEAP_OBJECT;
    };
    /**
     * addString to the heap.
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
     * getObject an object from the heap.
     */
    Heap.prototype.getObject = function (r) {
        return maybe_1.fromNullable(this.objects[r & frame_1.DATA_MASK_VALUE24]);
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
     * getAddress of an PTValue that may be on the heap.
     *
     * For objects that are not on the heap a null reference is returned.
     * Strings are automatically added while numbers and booleans simply return
     * themselves.
     *
     * TODO: In the future it may be more appropriate to represent ALL PTValues
     * as objects with their own toAddress() style method.
     */
    Heap.prototype.getAddress = function (v) {
        if (type_1.isString(v)) {
            return this.addString(v);
        }
        else if (type_1.isObject(v)) {
            return v.toAddress();
        }
        else if (type_1.isNumber(v)) {
            return v;
        }
        else {
            return 0;
        }
    };
    /**
     * exists tests whether an object exists in the heap.
     */
    Heap.prototype.exists = function (o) {
        return this.objects.some(function (eo) { return o === eo; });
    };
    /**
     * release all objects and strings in the heap.
     */
    Heap.prototype.release = function () {
        this.objects = [];
        this.strings = [];
    };
    return Heap;
}());
exports.Heap = Heap;
//# sourceMappingURL=index.js.map