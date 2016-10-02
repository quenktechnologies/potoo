/**
 * MockMailbox
 */
class MockMailbox {

    constructor() {

        this.queue = [];

    }

    enqueue(message) {

        this.queue.push( message);

    }

    dequeue() {

        return this.queue.unshift();

    }

}
export default MockMailbox
