import { Behaviour } from './Behaviour';

/**
 * Receiver 
 */
export interface Receiver {

    willReceive<M>(m: M): boolean;
    receive<M>(m: M);
}


/**
 * AnyReceiver accepts any value.
 */
export class AnyReceiver {

    constructor(public behaviour: Behaviour) { }

    willReceive(_: any) {

        return true;

    }

    receive(m: any) {

        this.behaviour(m);

    }

}

