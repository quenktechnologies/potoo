import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour, Select, Receive } from '.';

/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export abstract class Dynamic extends Local {

    __mailbox: Envelope<any>[] = [];

    __behaviour: Behaviour;

    __consume(): void {

        if (this.__mailbox.length === 0) return;

        if (!this.__behaviour) return;

        let m = this.__mailbox.shift();

        this.__behaviour = this.__behaviour.consume(m);

        this.__consume();

    }

    select<T>(c: Cases<T>): Dynamic {

        let cases = Array.isArray(c) ? c : [c];

        this.__behaviour = new Select(cases, this.__system);
        this.__system.log().receiveStarted(this.__system.toAddress(this).get());
        this.__consume();
      return this;

    }

    receive<T>(c: Cases<T>) : Dynamic {

        let cases = Array.isArray(c) ? c : [c];

        this.__behaviour = new Receive(cases, this.__system);
        this.__system.log().receiveStarted(this.__system.toAddress(this).get());
        this.__consume();
      return this;

    }

    accept<M>(e: Envelope<M>): Dynamic {

        this.__system.log().messageAccepted(e);
        this.__mailbox.push(e);
        this.__consume();
      return this;

    }

    run() { return this; }

}
