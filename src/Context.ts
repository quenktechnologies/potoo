import { Message } from './Message';

/**
 * Context represents an actor's context within the system.
 * 
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
export abstract class Context {

    constructor(public path: string) { }

    abstract feed<M>(m: Message<M>);

    abstract start();

}


