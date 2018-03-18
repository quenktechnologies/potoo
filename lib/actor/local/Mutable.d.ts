import { Envelope } from '../../system';
import { Cases } from '.';
import { Resident, SelectiveLocalActor, Behaviour } from '.';
/**
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
export declare abstract class Mutable extends Resident implements SelectiveLocalActor {
    mailbox: Envelope[];
    behaviour: Behaviour;
    /**
     * @private
     */
    consume(): void;
    select<T>(c: Cases<T>): Mutable;
    receive<T>(c: Cases<T>): Mutable;
    accept(e: Envelope): Mutable;
    run(): Mutable;
}
