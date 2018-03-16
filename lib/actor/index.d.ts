import { Envelope, System } from '../system';
/**
 * Address used by the system to distinguish actors.
 *
 * Potoo actor addresses are just urls in order to make
 * working with the Web and existing infrastructure easier.
 */
export declare type Address = string;
/**
 * Instantiator is a function that given a System reference produces a new
 * instance of some actor.
 *
 * If you need to provide additional arguments, use partial application.
 */
export interface Instantiator {
    (s: System): Actor;
}
/**
 * Template of an actor.
 *
 * Actors are created using templates that describe how to spawn and manage them
 * to the system.represents the minimum amount of information required to create
 * a new actor instance.
 */
export interface Template {
    /**
     * id of the actor used when constructing its address.
     */
    id: string;
    /**
     * create function.
     */
    create: Instantiator;
}
/**
 * Actor common interface.
 *
 * The system expects all actors to satisfy this interface so they
 * can be managed.
 */
export interface Actor {
    /**
     * accept a Message destined for this actor.
     */
    accept<M>(e: Envelope<M>): Actor;
    /**
     * run this actor.
     */
    run(path: string): Actor;
    /**
     * terminate is called by the system when the actor is removed.
     */
    terminate(): void;
}
/**
 * AddressTable provides a mapping of keys to actor addresses.
 */
export interface AddressTable {
    [key: string]: Address;
}
