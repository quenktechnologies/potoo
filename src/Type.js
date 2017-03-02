import { hope } from './be';
import { merge } from './util';

/**
 * Type is a helper class for simulating user type support
 * in JavaScript via classes.
 * @param {object} members This object's own enumerable properties are added to
 * the type.
 */
export class Type {

    constructor(members = {}, checks = {}) {

        Object
            .keys(checks)
            .forEach(k => {

                this[k] = hope(k, members[k], checks[k]);

            });

    }

    __CLONE__(f) {

        return new this.constructor(
            Object
            .keys(this)
            .reduce((o, k) => {
                o[k] = f(this[k]);
                return o;
            }, Object.create(null)));

    }

}

/**
 * copy the keys of a Type and assign them to a new instance.
 * @param {Type} type
 * @param {object} keys
 * @return {Type}
 * @summary { (Type,Object) →  Type }
 */
export const copy = (type, keys = {}) => {

    if (typeof type !== 'object')
        throw new TypeError(`copy(): type must be an instance got '${typeof type}'`);

    if (typeof keys !== 'object')
        throw new TypeError(`copy(): keys must be an object got '${typeof keys}'`)

    return new type.constructor(merge(type, keys));

}
