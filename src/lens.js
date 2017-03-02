import property from 'property-seek';

export const HEAD = 'haifha;kf';
export const TAIL = 'agfshshs';

/**
 * index
 */
export const index = i => (value, list) => (list === undefined) ?
    value[i === HEAD ? 0 : i === TAIL ? value.length - 1 : i] :
    replaceIndex(i, list, value);

const replaceIndex = (i, l, v) => {

    if (!Array.isArray(l))
        throw new TypeError(`replaceIndex(): ` +
            `Second argument must be an array! ` +
            `Got '${(typeof l === 'object')?l.constructor.name : typeof l}'`);

    let x = l.slice();

    if (i === TAIL)
        return l.concat(v);

    if (i === HEAD)
        return l.slice().reverse().concat(v).reverse();

    if (i > x.length)
        throw new RangeError(`Index ${i} is more than array length ${l.length}`);

    x[i] = v;

    return x;
}

/**
 * path
 */
export const path = p => (v, o) => property(p, v, o);

/**
 * view
 * @summary (Lens, Object) →  *
 */
export const view = (l, o) => l(o);

/**
 * set
 * @summary (Lens, *, Object) →  *
 */
export const set = (l, v, o) => l(v, o);

/**
 * over
 * @summary (Lens, Functor, Object) →  Object
 */
export const over = (l, f, o) => l(f(l(o)), o);

const omap = (o, f) => Object.keys(o).map(k => f(o[k], k, o));

/**
 * mapOver
 * @summary { (Lens, Functor, Object) →  Object }
 */
export const mapOver = (l, f, o) => {

    let list = l(o);

    if (typeof f !== 'function')
        throw new TypeError('mapOver(): f must be a function!');

    if ((!Array.isArray(l(o))) && (typeof list !== 'object') && (list !== null))
        throw new TypeError(`mapOver(): Cannot map over '${list}'!`);

    return l(!Array.isArray(list) ? omap(list, f) : list.map(f), o);

};
