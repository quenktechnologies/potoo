import { Address } from '../../../address';
import { PushStr } from '../op/push';
import { Stop } from '../op/stop';
import { Restart } from '../op/restart';
import { Run } from '../op/run';
import { Op } from '../op';
import { Constants, Script } from '../script';

const restartCode: Op[] = [
    new Restart(),
    new Run()
];

const stopCode: Op[] = [

    new PushStr(0),
    new Stop()

];

/**
 * StopScript for stopping actors.
 */
export class StopScript
    extends Script {

    constructor(public addr: Address) {

        super(<Constants>[[], [addr], [], [], [], []],
            <Op[]>stopCode);

    }

}

/**
 * RestartScript for restarting actors.
 */
export class RestartScript extends Script {

    constructor() {

        super(
            <Constants>[[], [], [], [], [], []],
            <Op[]>restartCode);

    }

}
