import { merge } from '../util';

/**
 * hope a value passes its test, throws an error if not returns the value otherwise.
 * @summary hope :: (string, * , * → Either<Error,*>) →  Either<Error,*>
 */
export const hope = (t, k, v, test) => test(v).cata(e => {
    throw new TypeError(`${t}.${k}: \n ${e.stack}`);
}, x => x);


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
            .forEach(k =>
                this[k] = hope(this.constructor.name, k, members[k], checks[k]));

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

    /**
     * copy this Type, optionally replacing specified keys.
     * @param {object} [keys]
     * @return {Type}
     */
    copy(keys) {

        return copy(this, keys);

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
