import { Context } from '../../../context';
import { Address } from '../../../address';
import { PushStr } from '../op/push';
import { Stop } from '../op/stop';
import { Restart } from '../op/restart';
import { Run } from '../op/run';
import { Op } from '../op';
import { Constants, Script } from '../script';
import { System } from '../../';

const restartCode: Op<Context, System<Context>>[] = [
    new Restart(),
    new Run()
];

const stopCode: Op<Context, System<Context>>[] = [

    new PushStr(0),
    new Stop()

];

/**
 * StopScript for stopping actors.
 */
export class StopScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public addr: Address) {

        super(<Constants<C, S>>[[], [addr], [], [], [], []],
            <Op<C, S>[]>stopCode);

    }

}

/**
 * RestartScript for restarting actors.
 */
export class RestartScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor() {

        super(
            <Constants<C, S>>[[], [], [], [], [], []],
            <Op<C, S>[]>restartCode);

    }

}
