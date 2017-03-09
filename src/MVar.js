import { IO } from './monad';

/**
 * MVar
 */
export class MVar {

    constructor(value = null) {

        this.value = value;

    }

    put(v) {

        this.value = v;

    }

    take() {

        return IO.of(this.value);

    }

}


/**
 * makeEmptyMVar
 */
export const makeMVar = v => new IO.of(new MVar(v));


