import MockReference from './MockReference';
/**
 * MockSystem comment
 */
class MockSystem {

    constructor() {

        this.deadLetterCount = [];
        this.Guardian = new MockReference();
        this.DeadLetters = {
            tell: (message, from) => {
                this.deadLetterCount.push({ message, from });
            }
        };

    }

    select(path) {

        return this.Guardian.select(path);

    }

    concernOf(factory, path) {

        return this.Guardian.concernOf(factory, path);

    }

    deadLetters() {

        return this.DeadLetters;

    }

    on() {}

    emit() {}
}

export default MockSystem
