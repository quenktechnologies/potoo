import * as event from '../../system/log/event';
import { Maybe, fromAny, fromArray } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Result, accepted } from '..';
import { Cases, Receiver, Resident, LocalActor, Behaviour, Select, Receive } from '.';

const _selectErr = (addr: string) =>
    new event.ErrorEvent(
        new Error(`${addr}: called select while multiple times!`));
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

        this
            .behaviour
            .chain(b =>
                fromArray(this.mailbox)
                    .map(mbox => mbox.shift())
                    .map(m => { this.behaviour = b.apply(m); })
                    .map(() => this.consume()))

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<T>(cases: Cases<T>): this {

        this
            .behaviour
            .map(() => this.system.log(_selectErr(this.self())))
            .orJust(() => this.behaviour = fromAny<Behaviour>(new Select(cases, this.system)))
            .map(() => this.system.log(new event.ReceiveStartedEvent(this.self())))
            .map(() => this.consume())
            .map(() => this)
            .get();

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

        this.system.log(new event.ReceiveStartedEvent(this.system.toAddress(this).get()));
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
