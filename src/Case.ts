
export type Candidate<T>
    = string
    | number
    | boolean
    | object
    | { new (...args: any[]): T }
    ;

export type Matched<T>
    = string
    | number
    | boolean
    | T
    ;

export interface Handler<T> {

    (t: Matched<T>): void

}

export const kinda = (o1: any, o2: any): boolean => {

    if ((typeof o1 === 'object') && (typeof o2 !== 'object')) {

        return false;

    } else {

        return Object
            .keys(o1)
            .every(k => {

                if (o2.hasOwnProperty(k)) {

                    switch (typeof o1[k]) {

                        case 'string':
                        case 'number':
                        case 'boolean':
                            return o1[k] === o2[k];

                        case 'function':
                            if (o1[k] === String)
                                return (typeof o2[k] === 'string')
                            else if (o1[k] === Number)
                                return (typeof o2[k] === 'number')
                            else if (o1[k] === Boolean)
                                return (typeof o2[k] === 'boolean')
                            else
                                return (o2[k] instanceof o1[k])

                        case 'object':
                            return kinda(o1[k], o2[k]);

                    }

                } else {

                    return false;

                }

            })


    }

}

/**
 * Cases means either one Case or an array of them.
 */
export type Cases<T>
    = Case<T>
    | Case<T>[]
    ;

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public type: Candidate<T>, public handler: Handler<T>) { }

    _execute(m: any): void {

        setTimeout(() => this.handler(m), 0);

    }

    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: any): boolean {

        switch (typeof this.type) {

            case 'number':
            case 'boolean':
            case 'string':
                if (m === this.type) {
                    this._execute(m);
                    return true;
                } else {
                    return false;
                }
            case 'function':
                if (m instanceof <Function>this.type) {
                    this._execute(m);
                    return true;

                } else if ((this.type === String) && (typeof m === 'string')) {
                    this._execute(m);
                    return true;

                } else if ((this.type === Number) && (typeof m === 'number')) {
                    this._execute(m);
                    return true;

                } else if ((this.type === Boolean) && (typeof m === 'boolean')) {
                    this._execute(m);
                    return true;
                } else {

                    this._execute(m);
                    return false;

                }
            case 'object':
                if (kinda(this.type, m)) {
                    this._execute(m);
                    return true;
                }

            default:
                return false;

        }

    }


}

