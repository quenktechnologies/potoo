import { System } from './System';
import { Context } from './Context';
import { Message } from './Message';

/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export class PendingContext extends Context {

    constructor(
        public askee: string,
        public original: Context,
        public resolve: Function,
        public system: System) { super(original.path); }

    feed<M>(m: Message<M>) {

        if (m.from !== this.askee) {

            this.system.dropMessage(m);

        } else {

            this.system.putContext(this.original.path, this.original);
            this.resolve(m.message);

        }

    }

    start() { }

}
