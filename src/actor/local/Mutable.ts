import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour, Select, Receive } from '.';

/**
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
export abstract class Mutable<A> extends Local {

    mailbox: Envelope<A>[] = [];

    behaviour: Behaviour;

    /**
     * @private
     */
    consume(): void {

        if (this.mailbox.length === 0) return;

        if (!this.behaviour) return;

        let m = this.mailbox.shift();

        this.behaviour = this.behaviour.consume(m);

        this.consume();

    }

    select<T>(c: Cases<T>): Mutable<A> {

        let cases = Array.isArray(c) ? c : [c];

        this.behaviour = new Select(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;

    }

    receive<T>(c: Cases<T>): Mutable<A> {

        let cases = Array.isArray(c) ? c : [c];

        this.behaviour = new Receive(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;

    }

    accept<M>(e: Envelope<A | M>): Mutable<A> {

        this.system.log().messageAccepted(e);
        this.mailbox.push(<Envelope<A>>e);
        this.consume();
        return this;

    }

    run(): Mutable<A> {

        return this;

    }

}
