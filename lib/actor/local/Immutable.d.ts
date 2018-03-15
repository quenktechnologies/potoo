import { Envelope } from '../../system';
import { Local, Cases } from '.';
/**
 * Immutable actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Immutable<T> extends Local {
    abstract receive: Cases<T>;
    run(): Immutable<T>;
    accept<M>(e: Envelope<M | T>): Immutable<T>;
}
