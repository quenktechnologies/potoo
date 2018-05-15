import { Maybe } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Result } from '..';
import { Cases, Receiver, Resident, LocalActor, Behaviour } from '.';
/**
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
export declare abstract class Mutable extends Resident implements LocalActor {
    system: System;
    mailbox: Envelope[];
    behaviour: Maybe<Behaviour>;
    constructor(system: System, mailbox?: Envelope[], behaviour?: Maybe<Behaviour>);
    /**
     * @private
     */
    consume(): void;
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<T>(cases: Cases<T>): Mutable;
    /**
     * receive is deperecated
     * @deprecated
     */
    receive<T>(fn: Receiver<T>): Mutable;
    accept(e: Envelope): Result;
    run(): void;
}
