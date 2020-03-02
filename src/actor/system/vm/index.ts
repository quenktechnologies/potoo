import { Configuration } from '../configuration';
import { State } from '../state';
import { Instance } from '../../';
import { System } from '../';
import { Runtime } from './runtime';
import { Script } from './script';

/**
 * PVM is the Potoo Virtual Machine.
 */
export class PVM<S extends System> {

    constructor(
        public system: S,
        public config: Configuration) { }

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        contexts: {},

        routers: {},

        groups: {}

    };

    /**
     * pending scripts to execute.
     */
    pending: Runtime[] = [];

    exec(_actor: Instance, _s: Script): void {


    }

}
