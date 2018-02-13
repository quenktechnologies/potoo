import { Pattern, kindOf } from '@quenk/kindof';
import { Handler } from '.';

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public type: Pattern, public handler: Handler<T>) { }

    _execute(m: any): void {

        setTimeout(() => this.handler(m), 0);

    }

    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: any): boolean {

        let r = kindOf(m, this.type);

        if (r)
            this._execute(m);

        return r;

    }

}

