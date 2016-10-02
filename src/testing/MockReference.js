/**
 * MockReference
 */
class MockReference {

    constructor() {

        this.Path = '/';
        this.tells = [];
        this.forwards = [];
        this.watchers = [];
        this.RefState = null;

    }

setState(state) {

    this.RefState = state;

}

    path() {

        return this.Path;

    }

    watch(ref) {

        this.watchers.push(ref);

    }

    unwatch(ref) {

        this.watchers = this.watchers.filter(r => r !== ref);

    }

    forward(message, from, to) {

        this.forwards.push({message, from, to});

    }

    tell(message, from) {

        this.tells.push({ message, from });

    }

}

export default MockReference
