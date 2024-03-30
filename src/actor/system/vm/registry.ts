import { Maybe } from '@quenk/noni/lib/data/maybe';

import { PTObject } from './object';
import {
    PTString,
    PTValue,
    TYPE_LIST,
    TYPE_MASK,
    TYPE_OBJECT,
    TYPE_STRING
} from './type';

/**
 * RegistryType indicates the type of the registry.
 */
export enum RegistryType {
    string = TYPE_STRING,
    object = TYPE_OBJECT
}

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
 * RegistrySet is a container for all the registries used by the VM.
 */
export class RegistrySet {
    constructor(
        public strings = new Registry<PTString>(RegistryType.string),
        public objects = new Registry<PTObject>(RegistryType.object)
    ) {}

    /**
     * isRegistryAddress tests whether a number is a valid registry address.
     *
     * This does not test whether the address can be dereferenced.
     */
    isRegistryAddress(addr: number): boolean {
        let type = addr & TYPE_MASK;
        return (
            type === TYPE_STRING || type === TYPE_OBJECT || type === TYPE_LIST
        );
    }

    /**
     * addString to the registry.
     */
    addString(value: PTString): RegistryAddress {
        return this.strings.add(value);
    }

    /**
     * addObject to the registry.
     */
    addObject(value: PTObject): RegistryAddress {
        return this.objects.add(value);
    }

    /**
     * getString returns a string from the registry given its address.
     */
    getString(addr: RegistryAddress): Maybe<PTString> {
        return this.strings.get(addr);
    }

    /**
     * getObject returns an object from the registry given its address.
     */
    getObject(addr: RegistryAddress): Maybe<PTObject> {
        return this.objects.get(addr);
    }

    /**
     * increment the ref count for a registry address.
     */
    increment(addr: RegistryAddress): void {
        switch (addr & TYPE_MASK) {
            case TYPE_STRING:
                this.strings.increment(addr);
                break;
            case TYPE_OBJECT:
            case TYPE_LIST:
                this.objects.increment(addr);
                break;
        }
    }

    /**
     * decrement the ref count for a registry address.
     */
    decrement(addr: RegistryAddress): void {
        switch (addr & TYPE_MASK) {
            case TYPE_STRING:
                this.strings.decrement(addr);
                break;
            case TYPE_OBJECT:
            case TYPE_LIST:
                this.objects.decrement(addr);
                break;
        }
    }

    /**
     * deref an object from the registry.
     *
     * This attempts to retrieve an object from the relevant registry given its
     * address.
     */
    deref(addr: RegistryAddress): Maybe<PTValue> {
        switch (addr & TYPE_MASK) {
            case TYPE_STRING:
                return this.strings.get(addr);
            case TYPE_OBJECT:
            case TYPE_LIST:
                return this.objects.get(addr);
            default:
                return Maybe.nothing();
        }
    }

    /**
     * flush all the internal registries.
     */
    flush(): void {
        this.strings.flush();
        this.objects.flush();
    }
}

/**
 * Registry serves as a container for objects used by the VM.
 *
 * This interface allows for a naive reference counting system for objects
 * created by the VM and foreign objects the VM is aware of. It does not yet
 * take cyclical references into account.
 *
 * The tracking here is needed so that we know when an object can be removed
 * from the container and allow the JS engine's own garbage collection to get
 * rid of it.
 *
 * Each instance handles one specific type of data indicated by the "type"
 * parameter. This value is used when generating the address of the object that
 * can be used for its retrieval.
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
     * Each time an object is added to the registry we initialize its counter
     * to 0. The idea is for the VM opcodes to increment/decrement this value
     * as needed.
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
     * This should be done anytime an object is used in a new Frame.
     */
    increment(addr: RegistryAddress): void {
        if (this.values.has(addr))
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
        if (!this.values.has(addr)) return;
        let oldCount = this.refCounts.get(addr) || 0;
        let newCount = oldCount <= 0 ? 0 : oldCount - 1;
        this.refCounts.set(addr, newCount);
        if (newCount === 0) this.deadValues.push(addr);
    }

    /**
     * flush all dead objects from the registry.
     *
     * When called, this method will remove all objects marked as dead from the
     * registry. Determining the right time to call this method is left up to the
     * VM.
     */
    flush(): void {
        this.deadValues.forEach(addr => {
            this.values.delete(addr);
            this.refCounts.delete(addr);
        });
        this.deadValues = [];
    }
}
