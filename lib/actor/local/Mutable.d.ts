import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour } from '.';
/**
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
export declare abstract class Mutable<A> extends Local {
    mailbox: Envelope<A>[];
    behaviour: Behaviour;
    /**
     * @private
     */
    consume(): void;
    select<T>(c: Cases<T>): Mutable<A>;
    receive<T>(c: Cases<T>): Mutable<A>;
    accept<M>(e: Envelope<A | M>): Mutable<A>;
    run(): this;
}
