import { Behaviour } from './Behaviour';
/**
 * Receiver
 */
export interface Receiver {
    willReceive<M>(m: M): boolean;
    receive<M>(m: M): any;
}
/**
 * AnyReceiver accepts any value.
 */
export declare class AnyReceiver {
    behaviour: Behaviour;
    constructor(behaviour: Behaviour);
    willReceive(_: any): boolean;
    receive(m: any): void;
}
