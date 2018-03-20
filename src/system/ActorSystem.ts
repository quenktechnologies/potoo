import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as local from '../actor/local';
import * as log from './log';
import { match } from '@quenk/match';
import { Either, left, right } from 'afpl/lib/monad/Either';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { reduce } from 'afpl/lib/util';
import {
    Configuration,
    ActorTable,
    Envelope,
    System,
    SEPERATOR,
    DEAD_ADDRESS,
    mkChildPath,
    validateId
} from '.';

//defaults configuration
const defaults = {
    log: { level: log.WARN, logger: console }
};

const _rejectDeadAddress = (addr: actor.Address) => match<Maybe<actor.Address>>(addr)
    .caseOf(DEAD_ADDRESS, () => Maybe.fromAny(null))
    .orElse(() => Maybe.fromAny(addr))
    .end();

const _checkExists = (actors: ActorTable) => (path: string): Maybe<Either<Error, string>> =>
    Maybe
        .fromAny(actors[path])
        .map(() => left<Error, actor.Address>(new Error(`Duplicate actor "${path}" deteced!`)))
        .orJust(() => right<Error, actor.Address>(path));

/**
 * ActorSystem.
 *
 * The system treats all actors equally ignoring implementation details
 * instead leaving that to the `create` function of their Templates.
 * 
 * Actors are stored in the internal actors table and should never
 * be modified directly. This class provides all the methods needed for
 * actor implementations to interact with the system.
 *
 * Each implementation could be seen as a sort of "driver" that hooks into
 * a "kernel" implementation to provide functionality to an application.
 */
export class ActorSystem implements System, actor.Actor {

    /**
     * path is the static path of the system.
     *
     * Messages can be sent to this address and will be processed
     * by the system if supported.
     */
    path: actor.Address = '';

    /**
     * actors is the ActorTable where all known actor's are stored.
     */
    actors: ActorTable = { '': this };

    constructor(
        public config: Configuration = defaults,
        public logging: log.LogLogic = log.LogLogic.createFrom(config.log)) { }

    /**
     * create a new system
     */
    static create(c: Configuration = defaults): ActorSystem {

        return new ActorSystem(c);

    }

    /**
     * parentActor returns the immediate parent for an actor from the ActorTable, given
     * its address.
     */
    parentActor(addr: actor.Address): Maybe<actor.Actor> {

        return Maybe
            .fromAny(this.actors[addr.split(SEPERATOR).slice(0, -1).join(SEPERATOR)])
            .orElse(() => {

                this.logging.error(new Error(`parentActor(): Address "${addr}" has no valid parent!`));
                return Maybe.fromAny(null);

            });

    }

    /**
     * toAddress turns an actor instance into an address.
     *
     * Unknown actors result in an error returning the invalid address.
     */
    toAddress(a: actor.Actor): Maybe<string> {

        return Maybe
            .fromAny(reduce(this.actors, (p, c, k) =>
                (p != null) ? p : (c === a) ? k : null, <string>null))
            .orElse(() => {

                this
                    .logging
                    .error(new Error(`Actor "${a.constructor}" was not found in the actor table!`));

                return Maybe.fromAny(DEAD_ADDRESS);

            });

    }

    /**
     * spawn a new top level actor within the system.
     *
     * Actors spawned at this level are not prefixed system
     * path and can be seen as 'root' actors.
     */
    spawn(t: actor.Template): ActorSystem {

        this.putChild(this, t);
        return this;

    }

    putChild(parent: actor.Actor, t: actor.Template): actor.Address {

        return (validateId(SEPERATOR)(t.id))
            .chain(id =>
                this
                    .toAddress(parent)
                    .chain(_rejectDeadAddress)
                    .map(mkChildPath(SEPERATOR)(id))
                    .chain(_checkExists(this.actors))
                    .get())
            .map((path: actor.Address) => {

                let child = t.create(this);

                this.actors[path] = child;
                this.logging.childSpawned(path);

                child.run(path);

                return path;

            })
            .mapLeft(e => {

                this.logging.error(e);
                return DEAD_ADDRESS;

            }).takeRight();

    }

    discard(e: Envelope): ActorSystem {

        this.logging.messageDropped(e);
        return this;

    }

    putActor(path: string, actor: actor.Actor): ActorSystem {

        this.actors[path] = actor;
        return this;

    }

    putMessage(e: Envelope): ActorSystem {

        this.logging.messageSent(e);

        setTimeout(() => {

            Maybe
                .fromAny(this.actors[e.to])
                .map(actor =>
                    actor
                        .accept(e)
                        .map(() => this.logging.messageAccepted(e))
                        .orRight(() => this.logging.messageRejected(e)))
                .orJust(() => this.discard(e)) //?
        }, 0);

        return this;

    }

    putError(_src: actor.Actor, e: Error): System {

        this.logging.error(e);
        return this;

    }

    askMessage<R>(m: Envelope, time = Infinity): Promise<R> {

        //See https://github.com/petkaantonov/bluebird/issues/1200 about Promise.timeout.

        let p = new Promise<R>((resolve, _) => {

            this.actors[m.from] = new local.Pending<R>(m.to, this.actors[m.from], resolve, this);
            this.putMessage(m);

        });

        return (time !== Infinity) ? p.timeout(time) : p;

    }

    removeActor(parent: actor.Actor, addr: actor.Address): ActorSystem {

        this
            .toAddress(parent)
            .chain(paddr => Maybe.fromBoolean((addr).startsWith(paddr)))
            .orElse(() => {

                this.logging.error(new Error(`removeActor(): Actor "${parent}" is not a parent of "${addr}"!`));
                return Maybe.fromAny(null);

            })
            .map(() => {

                this.actors = reduce(this.actors, (p, _, k) => {

                    if (k === addr) {

                        this.actors[addr].terminate();
                        this.logging.actorRemoved(k);

                    } else {

                        p[k] = this.actors[k];

                    }

                    return p;

                }, <ActorTable>{});

            });

        return this;

    }

    log(): log.LogLogic {

        return this.logging;

    }

    /**
     * accept a message bound for the system.
     *
     * It will be discarded.
     */
    accept(e: Envelope): actor.Result {

        return actor.rejected(e);

    }

    /**
     * run does nothing.
     */
    run(): ActorSystem { return this; }

    terminate(): void { }

}
