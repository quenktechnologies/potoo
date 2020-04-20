"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../../type");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
var type_2 = require("../../../type");
/**
 * ESObject is a HeapObject for ECMAScript objects.
 */
var ESObject = /** @class */ (function () {
    function ESObject(heap, cons, value) {
        this.heap = heap;
        this.cons = cons;
        this.value = value;
    }
    ESObject.prototype.set = function (idx, value) {
        var key = this.cons.properties[idx];
        if (key != null)
            this.value[key.name] = value;
    };
    ESObject.prototype.get = function (idx) {
        var prop = this.cons.properties[idx];
        if (prop == null)
            return maybe_1.nothing();
        return marshal(this.heap, prop.type, this.value[prop.name]);
    };
    ESObject.prototype.getCount = function () {
        return record_1.count(this.value);
    };
    ESObject.prototype.toAddress = function () {
        return this.heap.getAddress(this);
    };
    ESObject.prototype.promote = function () {
        return record_1.merge({}, this.value);
    };
    return ESObject;
}());
exports.ESObject = ESObject;
/**
 * ESArray is a HeapObject for ECMAScript arrays.
 */
var ESArray = /** @class */ (function () {
    function ESArray(heap, cons, value) {
        this.heap = heap;
        this.cons = cons;
        this.value = value;
    }
    ESArray.prototype.set = function (key, value) {
        this.value[key] = value;
    };
    ESArray.prototype.get = function (idx) {
        return marshal(this.heap, this.cons.elements, this.value[idx]);
    };
    ESArray.prototype.getCount = function () {
        return this.value.length;
    };
    ESArray.prototype.toAddress = function () {
        return this.heap.getAddress(this);
    };
    ESArray.prototype.promote = function () {
        return this.value.slice();
    };
    return ESArray;
}());
exports.ESArray = ESArray;
var marshal = function (heap, typ, val) {
    if (val == null)
        return maybe_1.nothing();
    switch (type_2.getType(typ.descriptor)) {
        case types.TYPE_UINT8:
        case types.TYPE_UINT16:
        case types.TYPE_UINT32:
        case types.TYPE_INT8:
        case types.TYPE_INT16:
        case types.TYPE_INT32:
            return maybe_1.just(Number(val));
        case types.TYPE_BOOLEAN:
            return maybe_1.just(Boolean(val) === true ? 1 : 0);
        case types.TYPE_STRING:
            heap.addString(String(val));
            return maybe_1.just(val);
        //TODO: This will actually create a new ESArray/ESObject every time as
        // Heap#exists only checks whether the HeapObject is in the pool not
        // the underlying objects.
        //
        // This could be resolved by having Heap#exists delegate the check to
        // the actual objects however, I'm considering whether ES objects even
        // need to be in the heap in the first place?
        case types.TYPE_ARRAY:
            var ea = new ESArray(heap, typ, Array.isArray(val) ? val : []);
            if (!heap.exists(ea))
                heap.addObject(ea);
            return maybe_1.just(ea);
        case types.TYPE_OBJECT:
            var eo = new ESObject(heap, typ, type_1.isObject(val) ?
                val : {});
            if (!heap.exists(eo))
                heap.addObject(eo);
            return maybe_1.just(eo);
        default:
            return maybe_1.nothing();
            break;
    }
};
//# sourceMappingURL=es.js.map