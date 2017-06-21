import { System } from './System';
import { Message } from './Message';
import { Template } from './Template';
import { Context } from './Context';
import { Behaviour } from './Behaviour';
import { Receiver, AnyReceiver } from './Receiver';
import { LocalActor } from './LocalActor';

/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export class LocalContext extends Context {

    constructor(
        public path: string,
        public actorFn: (c: LocalContext) => LocalActor,
        public system: System,
        public receiver: Receiver = null,
        public mailbox: any[] = []) { super(path); }

    spawn(t: Template) {

        return this.system.putChild(t, this.path);

    }

    tell<M>(ref: string, m: M) {

        this.system.putMessage(ref, this.path, m);

    }

    ask<M, A>(ref: string, m: M): Promise<A> {

        return this.system.askMessage(ref, this.path, m);

    }

    receive(b: Behaviour) {

        if (this.receiver)
            throw new Error(`${this.path} is already receiving!`);

        this.receiver = new AnyReceiver(b);
        this.system.logging.receiveStarted(this.path);

    }

    feed<M>(m: Message<M>) {

        setTimeout(() => {

            if (this.receiver)
                if (this.receiver.willReceive(m.message)) {
                    this.receiver.receive(m.message)
                    this.system.logging.messageReceived(m);
                    return this.receiver = null;
                }

            this.mailbox.push(m.message);

        }, 0);

    }

    start() {

        this.actorFn(this).run();

    }

}

