import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour, Select, Receive } from '.';

/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export abstract class Dynamic<A> extends Local {

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

    select<T>(c: Cases<T>): Dynamic<A> {

        let cases = Array.isArray(c) ? c : [c];

        this.behaviour = new Select(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;

    }

    receive<T>(c: Cases<T>): Dynamic<A> {

        let cases = Array.isArray(c) ? c : [c];

        this.behaviour = new Receive(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;

    }

    accept<M>(e: Envelope<A | M>): Dynamic<A> {

        this.system.log().messageAccepted(e);
        this.mailbox.push(<Envelope<A>>e);
        this.consume();
        return this;

    }

    run() { return this; }

}
