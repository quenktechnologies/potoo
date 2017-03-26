import { Left, Right } from '../monad/Either';

/**
 * CoProduct
 * @implements {Functor}
 */
export class CoProduct {

    constructor(either) {

        this.either = either;
        this.map = map(this);
        this.cata = cata(this);

    }

}

/**
 * map
 * @summary map F<A> →  (A →  B) →  F<B>
 */
export const map = ftor => f =>
    new CoProduct(ftor.cata(a => new Left(a.map(f)), a => new Right(a.map(f))));

/**
 * cata
 * @summary cata :: CoProduct <F,G,A> →  (F<A> →  B, G<A> → B) → B
 */
export const cata = ({ either }) => (f, g) => either.cata(f, g);

/**
 * left
 * @summary :: F<A> →  CoProduct<F,G,A>
 */
export const left = F => new CoProduct(new Left(F));

/**
 * right
 * @summary :: G<A> →  CoProduct<F,G,A>
 */
export const right = G => new CoProduct(new Right(G));
