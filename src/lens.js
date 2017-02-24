import property from 'property-seek';

/**
 * path provides a lens for keys on and Object
 * @summary string →  Lens
 */
export const path = s => () => (arguments.length === 1) ?
    property(s, arguments[0]) : property.set(s, arguments[0], arguments[1]);

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
