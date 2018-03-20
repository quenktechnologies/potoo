import { match } from '@quenk/match';
import { Maybe, fromArray } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Result, accepted } from '..';
import { Cases, Receiver, Resident, LocalActor, Behaviour, Select, Receive } from '.';

/**
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
export abstract class Mutable extends Resident implements LocalActor {

    constructor(
        public system: System,
        public mailbox: Envelope[] = [],
        public behaviour: Maybe<Behaviour> = Maybe.fromAny(null)) { super(system); }

    /**
     * @private
     */
    consume(): void {

        this.behaviour =
            this
                .behaviour
                .chain(b =>
                    fromArray(this.mailbox)
                        .map(mbox => mbox.shift())
                        .chain(m => b.apply(m))
                        .map(b => { this.consume(); return b; })
                        .orJust(() => b));

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<T>(cases: Cases<T>): Mutable {

        this.behaviour =
            this
                .behaviour
                .map(b => match<Behaviour>(b)
                    .caseOf(Select, (b: Select<T>) => b.merge(cases))
                    .orElse(() => b) //TODO: this should probably generate an error.
                    .end())
                .orJust(() => new Select(cases, this.system));

        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();

        return this;

    }

    /**
     * receive is deperecated
     * @deprecated
     */
    receive<T>(fn: Receiver<T>): Mutable {

        console.warn(`Mutable#receive: this method is deprecated!`);

        this.behaviour =
            this
                .behaviour
                .orJust(() => new Receive(fn, this.system))

        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;

    }

    accept(e: Envelope): Result {

        this.mailbox.push(<Envelope>e);
        this.consume();
        return accepted(e);

    }

    run() { }

}
