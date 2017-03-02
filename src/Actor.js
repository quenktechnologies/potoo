import { type, force, or } from './be';
import { Type, copy } from './Type';
import { Free } from './monad';
import { Spawn, Send, Receive } from './System';

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
export class ActorT extends Type {}

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
export class LocalT extends ActorT {

    constructor(props) {

        super(props, {

            id: type(String),
            start: type(Function)

        });

    }

}

/**
 * Actor
 */
export class Actor extends Type {}

/**
 * ActorL
 */
export class ActorL extends Actor {

    constructor(props) {

        super(props, {

            parent: type(String),
            path: type(String),
            mailbox: or(type(Array), force([])),
            ops: or(type(Free), force(null)),
            template: type(ActorT)

        });

    }

    accept(message) {

        return copy(this, { mailbox: this.mailbox.concat(message.message) });

    }

}

/**
 * ActorContext
 */
export class ActorContext extends Type {

    constructor(props) {

        super(props, {

            parent: type(String),
            self: type(String)

        });

    }

    /**
     * spawn a new child actor
     * @param {ActorT} template
     * @return {Free}
     */
    spawn(template) {

        return Free.liftF(new Spawn({ template, parent: this.self }));

    }

    /**
     * tell another actor something
     * @param {string} to
     * @param {*} message
     * @summary { (string, *) →  Free}
     */
    tell(to, message) {

        return Free.liftF(new Send({ from: this.self, to, message }));

    }

    /**
     * receive the next message, optionally filtering unwanted
     * messages.
     * @summary { (* →  Free | null ) →  Free }
     */
    receive(behaviour) {

        return Free.liftF(new Receive({path:this.self, behaviour}));

    }


}
