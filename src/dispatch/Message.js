/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
export class Message {

    constructor(src) {

        Object.keys(src).forEach(k => this[k] = src[k]);

    }

}

export default Message
