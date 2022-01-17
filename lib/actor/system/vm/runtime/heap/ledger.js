"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHeapAddress = exports.DefaultHeapLedger = void 0;
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const record_1 = require("@quenk/noni/lib/data/record");
const type_1 = require("@quenk/noni/lib/data/type");
const info_1 = require("../../script/info");
const frame_1 = require("../stack/frame");
/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
class DefaultHeapLedger {
    constructor(objects = {}, owners = {}) {
        this.objects = objects;
        this.owners = owners;
        this.counter = 0;
    }
    _addItem(name, value, flag) {
        let addr = (this.counter++) | flag;
        this.objects[addr] = value;
        if (name !== '')
            this.owners[addr] = name;
        return addr;
    }
    string(value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_STRING);
    }
    object(value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_OBJECT);
    }
    fun(value) {
        return this._addItem('', value, frame_1.DATA_TYPE_HEAP_FUN);
    }
    addString(frame, value) {
        return this._addItem(frame.name, value, frame_1.DATA_TYPE_HEAP_STRING);
    }
    addObject(frame, obj) {
        return this._addItem(frame.name, obj, frame_1.DATA_TYPE_HEAP_OBJECT);
    }
    addFun(frame, obj) {
        return this._addItem(frame.name, obj, frame_1.DATA_TYPE_HEAP_FUN);
    }
    getString(ref) {
        let value = this.objects[ref];
        return (value != null) ? value : '';
    }
    getObject(ref) {
        return (0, maybe_1.fromNullable)(this.objects[ref]);
    }
    getFrameRefs(frame) {
        return (0, record_1.mapTo)((0, record_1.filter)(this.owners, owner => owner === frame.name), (_, k) => Number(k));
    }
    getThreadRefs(thread) {
        return (0, record_1.mapTo)((0, record_1.filter)(this.owners, owner => threadId(owner) === thread.context.aid), (_, k) => Number(k));
    }
    intern(frame, value) {
        let maddr = (0, record_1.pickKey)(this.objects, val => val === value);
        if (maddr.isJust())
            return Number(maddr.get());
        if ((0, type_1.isNumber)(value))
            return value;
        else if ((0, type_1.isString)(value))
            return this.addString(frame, value);
        else if ((0, type_1.isObject)(value))
            return ((value instanceof info_1.NewFunInfo) ||
                (value instanceof info_1.NewForeignFunInfo)) ?
                this.addFun(frame, value) : this.addObject(frame, value);
        else
            return 0;
    }
    move(ref, newOwner) {
        this.owners[ref] = newOwner;
        return ref;
    }
    frameExit(frame) {
        if (frame.parent.isJust() && (0, exports.isHeapAddress)(frame.thread.rp))
            this.move(frame.thread.rp, frame.parent.get().name);
        this.getFrameRefs(frame).forEach(ref => {
            if (ref !== frame.thread.rp) {
                delete this.objects[ref];
                delete this.owners[ref];
            }
        });
    }
    threadExit(thread) {
        this.getThreadRefs(thread).forEach(ref => {
            delete this.objects[ref];
            delete this.owners[ref];
        });
    }
}
exports.DefaultHeapLedger = DefaultHeapLedger;
const isHeapAddress = (ref) => {
    let kind = ref & frame_1.DATA_MASK_TYPE;
    return (kind === frame_1.DATA_TYPE_HEAP_STRING) || (kind === frame_1.DATA_TYPE_HEAP_OBJECT);
};
exports.isHeapAddress = isHeapAddress;
const threadId = (name) => Number((name.split('@')[1]).split('#')[0]);
//# sourceMappingURL=ledger.js.map