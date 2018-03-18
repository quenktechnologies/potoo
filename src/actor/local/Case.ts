import { Pattern, kindOf } from '@quenk/kindof';
import {Message} from '../../system';
import { Handler } from '.';

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public type: Pattern, public handler: Handler<T>) { }

    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: Message): boolean {

        let r = kindOf(m, this.type);

        if (r)
        setTimeout(() => this.handler(m), 0);

        return r;

    }

}

