import beof from 'beof';

/**
 * Ticker provides an API for enscapulating the decrement of
 * a number based on a condition then finally an action when the number hits
 * 0.
 *
 * @param {number} number - An number that we will decrease on each tick.
 * @param {function} discriminator - A function that tests the arguments passed to tick to
 *                                   determine if we should decrement.
 * @param {function} eliminator - Called if the discriminator returns false.
 * @param {function} action - The action that will take place when the number equals 0.
 */
class Ticker {

    constructor(number, discriminator, eliminator, action) {

        beof({ number }).number();
        beof({ discriminator }).function();
        beof({ action }).function();

        this._number = number;
        this._discriminator = discriminator;
        this._eliminator = eliminator;
        this._action = action;

        this._alarm();

    }

    static create(number, discriminator, eliminator, action) {

        return new Ticker(number, discriminator, eliminator, action);

    }

    _alarm() {

        if (this._number === 0) {
            this._action.apply(null);
            return true;
        }

    }

    /**
     * tick conditionally decrements the number
     * @param {*} ..n
     */
    tick() {

        if (this._discriminator.apply(null, arguments)) {
            this._number = this._number - 1;
            return this._alarm();
        } else {
            this._eliminator.apply(null, arguments);
        }

    }

}

export default Ticker
