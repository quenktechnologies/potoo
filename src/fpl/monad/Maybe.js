import { match } from '../control/Match';

/**
 * Maybe
 */
export class Maybe {

    constructor() {

        this.orJust = orJust(this);
        this.map = map(this);
        this.chain = chain(this);
        this.get = get(this);
        this.orElse = orElse(this);
        this.cata = cata(this);

    }


}

/**
 * Nothing
 */
export class Nothing extends Maybe {}

/**
 * Just
 */
export class Just extends Maybe {

    constructor(value) {

        super();
        this.value = value;

    }

}

/**
 * fromAny constructs a Maybe from a value that may be null.
 * @summary fromAny :: * →  Maybe<*>
 */
export const fromAny = v => v == null ? new Nothing() : new Just(v);

/**
 * of wraps the passed value in a Maybe
 * @summary of :: * →  Maybe<*>
 */
export const of = v => new Just(v);

/**
 * orJust will turn Nothing into Just, wrapping the value specified.
 * @summary orJust :: Maybe<A> → (()→ A) →  Maybe<A>
 */
export const orJust = m => f => match(m)
    .caseOf(Nothing, () => of(f()))
    .caseOf(Just, m => m)
    .end();

/**
 * map
 * @summary Maybe<A> →  (A →  B) →  Maybe<B>
 */
export const map = m => f => match(m)
    .caseOf(Nothing, m => m)
    .caseOf(Just, ({ value }) => of(f(value)))
    .end();

/**
 * chain
 * @summary Maybe<A> →  (A →  Maybe<B>) →  Maybe<B>
 */
export const chain = m => f => match(m)
    .caseOf(Nothing, m => m)
    .caseOf(Just, ({ value }) => f(value))
    .end();

/**
 * get the value wrapped by the Maybe
 * @throws {TypeError} if the Maybe is Nothing
 * @summary Maybe<A> →  () →  A
 */
export const get = m => () => match(m)
    .caseOf(Nothing, () => { throw new TypeError('Cannot get anything from Nothing!'); })
    .caseOf(Just, ({ value }) => value)
    .end();

/**
 * orElse applies a function for transforming Nothing into a Just
 * @summary orElse :: Maybe →  (() →  Maybe<B>) →  Maybe<B>
 */
export const orElse = m => f => match(m)
    .caseOf(Nothing, f)
    .caseOf(Just, m => m)
    .end();

/**
 * cata applies the corresponding function to the Maybe
 * @summary cata :: Maybe →  (()→ B, A →  B) →  B
 */
export const cata = m => (f, g) => match(m)
    .caseOf(Nothing, f)
    .caseOf(Just, g)
    .end();
