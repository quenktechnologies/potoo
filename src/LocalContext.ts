import { System } from './System';
import { Message } from './Message';
import { Template } from './Template';
import { Context } from './Context';
import { MatchAny, MatchCase, Behaviour } from './Behaviour';
import { LocalActor } from './LocalActor';
import { Case } from './Case';

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
        public behaviour: Behaviour = null,
        public mailbox: Message<any>[] = [],
        public isClearing: boolean = false) { super(path); }

    _clear(): boolean {

        if ((!this.isClearing) &&
            (this.behaviour !== null) &&
            (this.mailbox.length > 0) &&
            (this.behaviour.willConsume(this.mailbox[0].message))) {

            let b = this.behaviour;
            let m = this.mailbox.shift();

            this.isClearing = true;
            this.behaviour = null;

            b.consume(m.message);

            this.system.logging.messageReceived(m);
            this.isClearing = false;

            return true;

        } else {

            return false;

        }

    }

    _set(b: Behaviour): LocalContext {

        if (this.behaviour != null)
            throw new Error(`${this.path} is already receiveing/selecting!`);

        this.behaviour = b;

        return this;

    }

    discard<M>(m: Message<M>) {

        this.system.dropMessage(m);

    }

    spawn(t: Template) {

        return this.system.putChild(t, this.path);

    }

    tell<M>(ref: string, m: M) {

        this.system.putMessage(ref, this.path, m);

    }

    ask<M, A>(ref: string, m: M): Promise<A> {

        return this.system.askMessage(ref, this.path, m);

    }

    select<T>(c: Case<T>[]) {

        this._set(new MatchCase(c));
        this.system.logging.selectStarted(this.path);
        this._clear();

    }

    receive<M>(f: (m: M) => void) {

        this._set(new MatchAny(f));
        this.system.logging.receiveStarted(this.path);
        this._clear();

    }

    feed<M>(m: Message<M>) {

        setTimeout(() => (this.mailbox.unshift(m), this._clear()), 0);

    }

    start() {

        this.actorFn(this).run();

    }

}

