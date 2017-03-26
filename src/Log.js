import { type, any } from './be';
import { merge } from './util';
import { Type } from './fpl/data/Type';
import { liftF } from './fpl/monad/Free';

export const DEBUG = 7;
export const INFO = 5;
export const WARN = 2;
export const ERROR = 1;

/**
 * Log
 */
export class Log extends Type {

    constructor(props, checks) {

        super(props, merge(checks, { level: type(Number), message: type(String), next: any }));

        this.map = map(this);

    }

}

/**
 * map
 * @summary map :: Log<A> →  (A→ B) →  Log<B>
 */
export const map = l => f => l.copy({ next: f(l.next) });

/**
 * debug logs a message at the debug level
 * @summary debug :: string →  Free<Log, null>
 */
export const debug = message => liftF(new Log({ level: DEBUG, message }));

/**
 * info logs a message at the info level to the system log.
 * @summary info :: string →  Free<Log, null>
 */
export const info = message => liftF(new Log({ level: INFO, message }));

/**
 * warn logs a message at the warn level
 * @summary warn :: string →  Free<Log, null>
 */
export const warn = message => liftF(new Log({ level: WARN, message }));

/**
 * error logs a message at the error level
 * @summary error :: string →  Free<Log, null>
 */
export const error = message => liftF(new Log({ level: ERROR, message }));
