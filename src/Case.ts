
export interface Handler<T> {

    (t: T): void

}

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public t: T, public h: Handler<T>) { }

    /**
     * matches checks if the supplied type satisfies this Case
     */
    matches<M>(m: M): boolean {

        switch (typeof this.t) {

            case 'function':
                return m instanceof <Function><any>this.t
                break;

            default:
                return <any>this.t === <any>m;

        }

    }

    /**
     * apply the function of this Case to a message
     */
    apply(m: T) {

        this.h(m);

    }

}

