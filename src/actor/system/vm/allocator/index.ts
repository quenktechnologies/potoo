import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Address } from '../../../address';
import { Template } from '../../../template';
import { Thread } from '../thread';

/**
 * Allocator is the interface the VM delegates storage of actor threads and
 * associated information to.
 */
export interface Allocator {
    /**
     * getThread provides a Thread given an Address.
     */
    getThread(target: Address): Maybe<Thread>;

    /**
     * getThreads provides a list of all the Threads that are currently
     * allocated.
     *
     * If targets is supplied, only those Threads will be returned.
     */
    getThreads(targets?: Address[]): Thread[];

    /**
     * getTemplate provides a Template given an Address.
     */
    getTemplate(address: Address): Maybe<Template>;

    /**
     * getChildren returns the child threads of a parent thread.
     */
    getChildren(parent: Thread): Thread[];

    /**
     * allocate a new thread from a Template.
     */
    allocate(parent: Thread, tmpl: Template): Promise<Address>;

    /**
     * reallocate resources for a Thread.
     *
     * This essentially means the Thread has been restarted.
     */
    reallocate(target: Thread): Promise<void>;

    /**
     * deallocate resources for a Thread.
     */
    deallocate(target: Thread): Promise<void>;
}
