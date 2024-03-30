import { Type } from '@quenk/noni/lib/data/type';

import { PTObject } from '.';

/**
 * PTForeign contains an opaque value whose type is external to the VM.
 */
export class PTForeign implements PTObject {
    constructor(public value: Type) {}
}
