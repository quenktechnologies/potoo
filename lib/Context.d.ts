import { Message } from './Message';
/**
 * Context represents an actor's context within the system.
 *
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
export declare abstract class Context {
    path: string;
    constructor(path: string);
    abstract feed<M>(m: Message<M>): any;
    abstract start(): any;
}
