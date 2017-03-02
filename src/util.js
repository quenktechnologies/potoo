/**
 * merge two objects easily
 * @summary (Object, Object) →  Object
 */
export const merge = (o1, o2) => Object.assign({}, o1, o2);

/**
 * oreduce
 * @summary { (Object, (*,string,Object)→ *, * ) →  *}
 */
export const oreduce = (o, f, i) => Object.keys(o).reduce((p, k) => f(p, o[k], o), i);
