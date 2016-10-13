/**
 * InvalidMessage
 */
class InvalidMessage {

    constructor(message, url) {

        this._invalid = message;
        this._url = url;

    }

    toJSON() {

        return {

            name: 'InvalidMessage',
            message: this.toString(),
            invalid: this._invalid

        }

    }

    toString() {

        var invalid;

        try {

            JSON.stringify(this._invalid);

        } catch (e) {

            invalid = this._invalid;

        }

        return `Invalid message received from ${this._url}: "${invalid}"!`;

    }

}
export default InvalidMessage
