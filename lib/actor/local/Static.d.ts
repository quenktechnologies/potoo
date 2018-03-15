import { Envelope } from '../../system';
import { Local, Cases } from '.';
/**
 * Static actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Static<T> extends Local {
    abstract receive: Cases<T>;
    run(): Static<T>;
    accept<M>(e: Envelope<M>): Static<T>;
}
