/**
 * Identity
 */
export class Identity {

    constructor(a) {

        this.a = a;
        this.map = map(this);
        this.chain = chain(this);
        this.ap = ap(this);
        this.get = ()=>get(this);

    }

}

/**
 * of
 * @summary of :: A →  Identity<A>
 */
export const of = v => new Identity(v);

/**
 * map
 * @summary map :: Identity<A> →  (A →  B) Identity<B>
 */
export const map = i => f => new Identity(f(i.a));

/**
 * chain
 * @summary chain :: Identity<A> →  (A → Identity<B>) →  Identity<B>
 */
export const chain = i => f => f(i.a);

/**
 * ap
 * @summary ap :: Identity<A> →  Identity<A → B> >  Identity<B>
 */
export const ap = i => i2 => i2.map(i.a);

/**
 * get the value of an Identity
 * @summary get :: Identity<A> →  A
 */
export const get = ({ a }) => a;
