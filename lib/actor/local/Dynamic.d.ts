import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour } from '.';
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export declare abstract class Dynamic<A> extends Local {
    mailbox: Envelope<A>[];
    behaviour: Behaviour;
    /**
     * @private
     */
    consume(): void;
    select<T>(c: Cases<T>): Dynamic<A>;
    receive<T>(c: Cases<T>): Dynamic<A>;
    accept<M>(e: Envelope<A | M>): Dynamic<A>;
    run(): this;
}
