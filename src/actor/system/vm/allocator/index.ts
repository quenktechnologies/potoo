import { Future } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Platform } from '..';
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
    getThread(address: Address): Maybe<Thread>;

    /**
     * getTemplate provides a Template given an Address.
     */
    getTemplate(address: Address): Maybe<Template>;

    /**
     * allocate a new thread from a Template.
     */
    allocate(vm: Platform, parent: Thread, tmpl: Template): Future<Address>;

    /**
     * deallocate resources for a Thread.
     */
    deallocate(target: Thread): Future<void>;
}
