import { Constants, Script } from '../system/vm/script';
import { Context } from '../context';
import { PushStr } from '../system/vm/op/push';
import { Raise } from '../system/vm/op/raise';
import { Op } from '../system/vm/op';
import { System } from '../system';

const raiseCode: Op<Context, System<Context>>[] = [

    new PushStr(0),
    new Raise()

];

/**
 * RaiseScript
 */
export class RaiseScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public emsg: string) {

        super(<Constants<C, S>>[[], [emsg], [], [], [], []],
            raiseCode);

    }

}
