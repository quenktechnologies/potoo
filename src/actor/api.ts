import { Err } from '@quenk/noni/lib/control/error';

import { Address } from './address';
import { Spawnable } from './template';
import { Message } from '.';
import { Case } from '@quenk/noni/lib/control/match/case';

/**
 * Parent is any object capable of spawning a child actor.
 */
export interface Parent {
    /**
     * spawn an actor give its template.
     */
    spawn(t: Spawnable): Promise<Address>;
}

/**
 * Api is the interface provided by objects that can send/receive messages to
 * actors within the system.
 *
 * This interface is separate from the Actor interface because the system is
 * not directly concerned with their implementation. Instead, they exist to
 * provide a way for user land code to interact with other actors within the
 * system.
 */
export interface Api extends Parent {
    /*
     * self is the address for the actor within the system
     */
    self: Address;

    /**
     * raise an error triggering the system's error handling machinery.
     */
    raise(e: Err): Promise<void>;

    /**
     * kill sends a stop signal to a child actor.
     *
     * An actor can only specify itself or a child as the target.
     */
    kill(target: Address): Promise<void>;

    /**
     * tell a message to an actor address.
     */
    tell(ref: string, msg: Message): Promise<void>;

    /**
     * receive a message from the actor's mailbox.
     *
     * If TypeCases are provided, the message will be matched against them
     * first and the result provided.
     */
    receive<T>(cases?: Case<Message, T>[]): Promise<T>;
}
