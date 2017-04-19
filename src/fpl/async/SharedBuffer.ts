import { fromAny, Maybe } from '../monad/Maybe';
import { IO, safeIO } from '../monad/IO';

/**
 * SharedBuffer is an abstraction for collecting values safely
 * from async paths of execution.
 *
 * The reasoning here is that our side-effect free code will only take
 * the value when it's ready, in the meantime we store whatever values
 * returned here.
 */
export class SharedBuffer<A> {

    value: Array<A> = [];

    put(v: A): IO<null> {

        return safeIO(() => void this.value.push(v));

    }

    take(): IO<A> {

        return safeIO(() => this.value.shift());

    }

    maybeTake(): IO<Maybe<A>> {

        return this.take().map(fromAny);

    }

}
