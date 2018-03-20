import { Envelope } from '../../system';
import { Resident, Cases } from '.';
import { Result } from '..';
/**
 * Immutable actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Immutable<T> extends Resident {
    abstract receive: Cases<T>;
    accept(e: Envelope): Result;
    run(): void;
}
