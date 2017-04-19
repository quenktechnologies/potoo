
/**
 * liftM promotes a function a Monad
 * @summary ((A →  B), Monad<A>) →  Monad<B>
 */
export const liftM = (f, m) => m.chain(a=>m.constructor.of(f(a)));

