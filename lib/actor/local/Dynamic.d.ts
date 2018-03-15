import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour } from '.';
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export declare abstract class Dynamic extends Local {
    mailbox: Envelope<any>[];
    behaviour: Behaviour;
    /**
     * @private
     */
    consume(): void;
    select<T>(c: Cases<T>): Dynamic;
    receive<T>(c: Cases<T>): Dynamic;
    accept<M>(e: Envelope<M>): Dynamic;
    run(): this;
}
