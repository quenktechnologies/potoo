import {  Address   } from '../address';
import { Message } from '../message';
import { System } from '../system';
import { Template } from '../template';
import { Context } from '../context';
import { Case } from './case';

/**
 * Ref function type.
 */
export type Ref = (addr: Address) => Reference;

/**
 * Self function type.
 */
export type Self = () => Address;

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Api describes the api for implementing an actor independant
 * of the system level methods.
 */
export interface Api<C extends Context, S extends System<C>> {

    /**
     * ref provides a handle for sending mesages to an address.
     */
    ref: Ref;

    /**
     * self retrieves the path of this actor from the system.
     */
    self: Self;

    /**
     * spawn a new child actor.
     */
    spawn(t: Template<C, S>): Address;

    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Api<C, S>;

    /**
     * select the next message to be processed, applying each Case 
     * until one matches.
     */
    select<T>(c: Case<T>[]): Api<C, S>;

    /**
     * kill a child actor.
     */
    kill(addr: Address): Api<C, S>;

    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;

}
