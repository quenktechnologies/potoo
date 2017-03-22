import { IO } from './monad';

/**
 * MVar
 */
export class MVar {

    constructor(value = []) {

        this.value = value;

    }

    put(v) {

        this.value.push(v);

    }

    take() {

        return IO.of(() => this.value.shift());

    }

}

/**
 * makeMVar
 */
export const makeMVar = v => new IO.of(new MVar(v));
