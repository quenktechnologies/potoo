import { Err } from '@quenk/noni/lib/control/error';

import { Message } from '../../../message';
import { Flags } from '../../../flags';
import { Address } from '../../../address';
import { Instance } from '../../../';
import { Template } from '../template';

/**
 * Receiver
 */
export type Receiver = (m: Message) => boolean;

/**
 * ErrorHandler processes errors that come up during an actor execution
 * or raised by a child.
 */
export interface ErrorHandler {

    /**
     * raise an error within an actor's context triggering 
     * the error handling machinery.
     */
    raise(e: Err): void;

}

/**
 * Contexts map.
 */
export interface Contexts {

    [key: string]: Context

}

/**
 * Context stores all the information a system needs about a spawned actor.
 */
export interface Context {

    /**
     * mailbox for the actor.
     *
     * Some actors may not use mailboxes and instead accept messages directly.
     */
    mailbox: Message[],

    /**
     * actor instance.
     */
    actor: Instance,

    /**
     * behaviour stack for the actor.
     */
    behaviour: Receiver[],

    /**
     * flags currently enabled for the actor.
     */
    flags: Flags,

    /**
     * address assigned to the actor.
     */
    address: Address,

    /**
     * template used to create new instances of the actor.
     */
    template: Template,

}

/**
 * newContext 
 */
export const newContext =
    (actor: Instance, address: Address, template: Template)
        : Context => ({

            mailbox: [],

            actor,

            behaviour: [],

            flags: 0,

            address,

            template: template

        });
