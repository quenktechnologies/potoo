import { Script } from '../system/vm/script';
import { PushStr } from '../system/vm/op/push';
import { Raise } from '../system/vm/op/raise';
import { Op } from '../system/vm/op';

const raiseCode: Op[] = [

    new PushStr(0),
    new Raise()

];

/**
 * RaiseScript
 */
export class RaiseScript extends Script {

    constructor(public emsg: string) {

        super([[], [emsg], [], [], [], []], raiseCode);

    }

}
