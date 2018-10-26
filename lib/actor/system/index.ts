import * as address from '../address';
import * as log from './log';
import * as hooks from './hooks';
import { Actor } from '../';
import { Template } from '../template';
import { Spawn } from './op/spawn';
import { Drop } from './op/drop';
import { Op } from './op';
import { Err } from '../err';
import { Envelope } from './mailbox';
import { State, Frame } from './state';

/**
 * System represents a dynamic collection of actors that 
 * share the JS event loop.
 */
export interface System extends Actor {

    /**
     * configuration
     */
    configuration: Configuration;

    /**
     * actors table.
     */
    actors: State;

    /**
     * spawn a new root level child actor.
     */
    spawn(t: Template): System;

    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op): System;

}

class SysT {

    public id = address.ADDRESS_SYSTEM;

    public create = () => { throw new Error('Illegal attempt to restart system!'); }

    public trap = (e: Err) => {

        if (e instanceof Error) { throw e; } else { throw new Error(e.message); }

    }

}

/**
 * Configuration values for an actor system.
 */
export interface Configuration {

    /**
     * log settings
     */
    log?: log.LogPolicy,

    /**
     * hooks defined by the user.
     */
    hooks?: hooks.Hooks;

}

/**
 * ActorSystem
 * @private
 */
export class ActorSystem implements System {

    constructor(
        public stack: Op[],
        public configuration: Configuration) { }

    actors: State = new State({ $: nullFrame(this) }, {});

    running: boolean = false;

    exec(code: Op): System {

        this.stack.push(code);
        this.run();
        return this;

    }

    accept({ to, from, message }: Envelope): System {

        return this.exec(new Drop(to, from, message));

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    /**
     * logOp
     *
     * @private
     */
    logOp(o: Op): Op {

        let { level, logger } = (<log.LogPolicy>this.configuration.log);

        if (o.level <= <number>level)
            switch (o.level) {
                case log.INFO:
                    (<log.Logger>logger).info(o);
                    break;
                case log.WARN:
                    (<log.Logger>logger).warn(o);
                    break;
                case log.ERROR:
                    (<log.Logger>logger).error(o);
                    break;
                default:
                    (<log.Logger>logger).log(o)
                    break;

            }

        return o;

    }

    spawn(t: Template): System {

        this.exec(new Spawn(this, t));
        return this;

    }

    run(): void {

        if (this.running) return;

        this.running = true;

        while (this.stack.length > 0)
            this.logOp(<Op>this.stack.pop()).exec(this);

        this.running = false;

    }

}

/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export class NullSystem implements System {

    actors: State = new State({ $: nullFrame(this) }, {});

  configuration = {};

    exec(_: Op): System {

        return this;

    }

    accept({ to, from, message }: Envelope): System {

        return this.exec(new Drop(to, from, message));

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    spawn(_: Template): System {

        return this;

    }

    run(): void {

    }

}

const nullFrame = (s: System) => new Frame([], s, [], {
    immutable: true,
    busy: true
}, new SysT())
