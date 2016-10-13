import beof from 'beof';
import url from 'url';

function startsWith(string, searchString, position) {
    position = position || 0;
    return string.substr(position, searchString.length) === searchString;
}

/**
 * Address represents the absolute url to a Concern.
 * @param {object} uri
 */
class Address {

    constructor(uri) {

        beof({ uri }).object();
        this.uri = uri;

    }

    static fromString(uri = '') {

        uri = beof({ uri }).string().value;

        return new this(url.parse(uri));

    }

    /**
     * is checks if the passed uri is equal to this address.
     * @param {string} uri
     */
    is(uri = '') {

        beof({ uri }).string();
        return (url.parse(uri).href === this.uri.href);

    }

    /**
     * isBelow tells if the Address is below this uri.
     * @param {string} uri
     */
    isBelow(uri = '') {

        beof({ uri }).string();
        return startsWith(this.uri.href, uri);

    }

    /**
     * isAbove tells if the Address is above this uri.
     * @param {string} uri
     */
    isAbove(uri = '') {

        beof({ uri }).string();
        return startsWith(uri, this.uri.href);

    }

    /**
     * isRemote tells if this is indeed a remote address
     * @returns {boolean}
     */
    isRemote() {

        return (this.uri.protocol);

    }

    toString() {

        return this.uri.href;

    }

}

export default Address
