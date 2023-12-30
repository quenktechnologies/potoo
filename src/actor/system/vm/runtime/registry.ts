import { Maybe } from '@quenk/noni/lib/data/maybe';

import { DATA_TYPE_HEAP_OBJECT, DATA_TYPE_HEAP_STRING } from './stack/frame';

/**
 * RegistryType indicates the type of the registry.
 */
export type RegistryType =
    | typeof DATA_TYPE_HEAP_STRING
    | typeof DATA_TYPE_HEAP_OBJECT;

/**
 * JSString registerered with the VM.
 */
export type JSString = string;

/**
 * JSObject registered with the VM.
 */
export type JSObject = object;

/**
 * RefCount is a number indicating how many Frames are aware of an object.
 *
 * A zero value indicates the object is dead and can be removed from the
 * registry.
 */
export type RefCount = number;

/**
 * RegistryAddress is the address of an object in the registry.
 */
export type RegistryAddress = number;

/**
 * Registry serves as a container for objects used by the VM.
 *
 * This interface allows for a naive implementation of a reference counting
 * system of objects coming into the VM and created by the VM. These references
 * are intended to be used for garbage collection.
 *
 * Each Registry instance is meant to handle one type of data indicated by the
 * "type" parameter. This is also used to generate an address that can be used
 * to retrieve the object.
 */
export class Registry<T> {
    constructor(
        public type: RegistryType,
        public values: Map<RegistryAddress, T> = new Map(),
        public refCounts: Map<RegistryAddress, RefCount> = new Map(),
        public deadValues: RegistryAddress[] = []
    ) {}

    /**
     * add an object to the registry.
     *
     * Each time an object is added to the registry we initialize its ref counter
     * to 0. The intention is for the the VM opcodes to increment the ref counter
     * when approriate and for the VM to decrement at the appropriate time.
     */
    add(value: T): RegistryAddress {
        let addr = (this.values.size + 1) | this.type;
        this.values.set(addr, value);
        this.refCounts.set(addr, 0);
        return addr;
    }

    /**
     * get an object from the registry.
     */
    get(addr: RegistryAddress): Maybe<T> {
        return Maybe.fromNullable(this.values.get(addr));
    }

    /**
     * increment the ref count for an object.
     *
     * This should be done anyime an object is used in a new Frame.
     */
    increment(addr: RegistryAddress): void {
        this.refCounts.set(addr, (this.refCounts.get(addr) || 0) + 1);
    }

    /**
     * decrement the ref count for an object.
     *
     * This should be done whenever a frame that "knows" about the object is
     * popped off the stack. When the ref count reaches 0, the object is
     * considered dead and will be marked for removal.
     */
    decrement(addr: RegistryAddress): void {
        let oldCount = this.refCounts.get(addr) || 0;
        let newCount = oldCount <= 0 ? 0 : oldCount - 1;
        this.refCounts.set(addr, newCount);
        if (newCount === 0) this.deadValues.push(addr);
    }

    /**
     * purge all dead objects from the registry.
     *
     * When called, this method will remove all objects marked as dead from the
     * registry. Determining the right time to call this method is left up to the
     * VM.
     */
    purge(): void {
        this.deadValues.forEach(addr => {
            this.values.delete(addr);
            this.refCounts.delete(addr);
        });
        this.deadValues = [];
    }
}

/**
 * StringRegistry keeps track of JS strings used by the VM.
 */
export class StringRegistry extends Registry<string> {
    constructor() {
        super(DATA_TYPE_HEAP_STRING);
    }
}

/**
 * ObjectRegistry keeps track of JS objects used by the VM.
 */
export class ObjectRegistry extends Registry<object> {
    constructor() {
        super(DATA_TYPE_HEAP_OBJECT);
    }
}
