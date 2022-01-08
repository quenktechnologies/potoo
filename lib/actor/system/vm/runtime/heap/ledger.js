"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHeapAddress = exports.DefaultHeapLedger = void 0;
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
var info_1 = require("../../script/info");
var frame_1 = require("../stack/frame");
/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
var DefaultHeapLedger = /** @class */ (function () {
    function DefaultHeapLedger(objects, owners) {
        if (objects === void 0) { objects = {}; }
        if (owners === void 0) { owners = {}; }
        this.objects = objects;
        this.owners = owners;
        this.counter = 0;
    }
    DefaultHeapLedger.prototype._addItem = function (name, value, flag) {
        var addr = (this.counter++) | flag;
        this.objects[addr] = value;
        if (name !== '')
            this.owners[addr] = name;
        return addr;
    };
    DefaultHeapLedger.prototype.string = function (value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_STRING);
    };
    DefaultHeapLedger.prototype.object = function (value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_OBJECT);
    };
    DefaultHeapLedger.prototype.fun = function (value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_FUN);
    };
    DefaultHeapLedger.prototype.addString = function (frame, value) {
        return this._addItem(frame.name, value, frame_1.DATA_TYPE_HEAP_STRING);
    };
    DefaultHeapLedger.prototype.addObject = function (frame, obj) {
        return this._addItem(frame.name, obj, frame_1.DATA_TYPE_HEAP_OBJECT);
    };
    DefaultHeapLedger.prototype.addFun = function (frame, obj) {
        return this._addItem(frame.name, obj, frame_1.DATA_TYPE_HEAP_FUN);
    };
    DefaultHeapLedger.prototype.getString = function (ref) {
        var value = this.objects[ref];
        return (value != null) ? value : '';
    };
    DefaultHeapLedger.prototype.getObject = function (ref) {
        return maybe_1.fromNullable(this.objects[ref]);
    };
    DefaultHeapLedger.prototype.getFrameRefs = function (frame) {
        return record_1.mapTo(record_1.filter(this.owners, function (owner) { return owner === frame.name; }), function (_, k) { return Number(k); });
    };
    DefaultHeapLedger.prototype.getThreadRefs = function (thread) {
        return record_1.mapTo(record_1.filter(this.owners, function (owner) {
            return threadId(owner) === thread.context.aid;
        }), function (_, k) { return Number(k); });
    };
    DefaultHeapLedger.prototype.intern = function (frame, value) {
        var maddr = record_1.pickKey(this.objects, function (val) { return val === value; });
        if (maddr.isJust())
            return Number(maddr.get());
        if (type_1.isNumber(value))
            return value;
        else if (type_1.isString(value))
            return this.addString(frame, value);
        else if (type_1.isObject(value))
            return ((value instanceof info_1.NewFunInfo) ||
                (value instanceof info_1.NewForeignFunInfo)) ?
                this.addFun(frame, value) : this.addObject(frame, value);
        else
            return 0;
    };
    DefaultHeapLedger.prototype.move = function (ref, newOwner) {
        this.owners[ref] = newOwner;
        return ref;
    };
    DefaultHeapLedger.prototype.frameExit = function (frame) {
        var _this = this;
        if (frame.parent.isJust() && exports.isHeapAddress(frame.thread.rp))
            this.move(frame.thread.rp, frame.parent.get().name);
        this.getFrameRefs(frame).forEach(function (ref) {
            if (ref !== frame.thread.rp) {
                delete _this.objects[ref];
                delete _this.owners[ref];
            }
        });
    };
    DefaultHeapLedger.prototype.threadExit = function (thread) {
        var _this = this;
        this.getThreadRefs(thread).forEach(function (ref) {
            delete _this.objects[ref];
            delete _this.owners[ref];
        });
    };
    return DefaultHeapLedger;
}());
exports.DefaultHeapLedger = DefaultHeapLedger;
exports.isHeapAddress = function (ref) {
    var kind = ref & frame_1.DATA_MASK_TYPE;
    return (kind === frame_1.DATA_TYPE_HEAP_STRING) || (kind === frame_1.DATA_TYPE_HEAP_OBJECT);
};
var threadId = function (name) { return Number((name.split('@')[1]).split('#')[0]); };
//# sourceMappingURL=ledger.js.map