import { Address } from '../address';
import { System } from '../system';
import { Template } from '../template';
import { Context } from '../context';
import { Case } from './case';
/**
 * Api describes the api for implementing an actor independant
 * of the system level methods.
 */
export interface Api<C extends Context, S extends System> {
    /**
     * self retrieves the path of this actor from the system.
     */
    self(): string;
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
