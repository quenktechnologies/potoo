import { Maybe } from '../monad/Maybe';
import { IO } from '../monad/IO';
/**
 * SharedBuffer is an abstraction for collecting values safely
 * from async paths of execution.
 *
 * The reasoning here is that our side-effect free code will only take
 * the value when it's ready, in the meantime we store whatever values
 * returned here.
 */
export declare class SharedBuffer<A> {
    value: Array<A>;
    put(v: A): IO<null>;
    take(): IO<A>;
    maybeTake(): IO<Maybe<A>>;
}
