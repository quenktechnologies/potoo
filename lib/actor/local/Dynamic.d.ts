import { Envelope } from '../../system';
import { Cases } from '.';
import { Local, Behaviour } from '.';
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export declare abstract class Dynamic extends Local {
    __mailbox: Envelope<any>[];
    __behaviour: Behaviour;
    __consume(): void;
    select<T>(c: Cases<T>): void;
    receive<T>(c: Cases<T>): void;
    accept<M>(e: Envelope<M>): void;
    run(): void;
}
