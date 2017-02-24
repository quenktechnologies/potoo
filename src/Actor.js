import beof from 'beof';
import { System } from './System';
import { Spawn, Tell, Receive } from './Message';
import { Message } from './Message';
import {merge} from './util';

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
export class ActorT extends Message {}

/**
 * Actor
 */
export class Actor {

    constructor(path, tasks = []) {

        this.path = path;
        this.tasks = tasks;

    }

    /**
     * spawn
     */
    spawn(template) {

        beof({ template }).instance(ActorT);

        return new Actor(this.path,
            this.tasks.concat(new Spawn({ parent: this.path, template })));

    }

    /**
     * tell sends a message to another actor within the system.
     * @summary (string,*) →  Actor
     */
    tell(s, m) {

        beof({ s }).string();

        return new Actor(this.path, this.tasks.concat(new Tell(s, m)));

    }

    /**
     * schedule tasks within a System
     * @summary {System} →  {System}
     */
    schedule(s) {

        beof({ s }).instance(System);

        return new System(
            merge(s.actors, {
                [this.path]: new Actor(this.path, [])
            }),
            s.mailboxes,
            s.tasks.concat(this.tasks),
            s.io);

    }

}
