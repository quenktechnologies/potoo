import * as log from '../log';
import {
    fromString,
    fromBoolean,
    fromNullable,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { cons, noop } from '@quenk/noni/lib/data/function';
import { Actor } from '../../';
import { Template } from '../../template';
import { newFrame } from '../state';
import { Address, isRestricted, make } from '../../address';
import { System } from '../';
import { SystemError } from '../error';
import { Raise } from './raise';
import { Run } from './run';
import { Op, OP_SPAWN } from './';

export const RUN_START_TAG = 'start';

export class InvalidIdError extends SystemError {

    constructor(public id: string) {

        super(`Actor id "${id}" must not inclue "$", "?" or "/"!`);

    }

}

export class DuplicateAddressError extends SystemError {

    constructor(public address: Address) {

        super(`Unable to spawn actor "${address}": Duplicate address!`);

    }

}

/**
 * Spawn instruction.
 */
export class Spawn extends Op {

    constructor(
        public parent: Actor,
        public template: Template) { super(); }

    public code = OP_SPAWN;

    public level = log.INFO;

    exec(s: System): void {

        return execSpawn(s, this);

    }

}

/**
 * execSpawn instruction.
 *
 * Here we ensure the parent is still in the system then validate
 * the child id.
 *
 * If that is successfull we create and check for a duplicate id
 * then finally add the child to the system.
 */
export const execSpawn = (s: System, { parent, template }: Spawn) =>
    s
        .actors
        .getAddress(parent)
        .chain(path =>
            fromBoolean(!isRestricted(template.id))
                .orElse(raiseInvalidIdError(s, template.id, path))
                .map(() => template)
                .chain(makeAddress(path))
                .chain(addr =>
                    checkAddress(s, addr)
                        .orElse(raiseDuplicateAddressError(s, path, addr))
                        .map(cons(addr))
                        .chain(generate(s, template))
                        .chain(spawnChildren(s, template))
                        .map(() => { })))
        .map(noop)
        .orJust(noop)
        .get();

const makeAddress = (parent: Address) => (template: Template) =>
    fromString(make(parent, template.id))

const checkAddress = (s: System, addr: Address) =>
    fromBoolean(!s.actors.exists(addr));

const generate = (s: System, template: Template) => (addr: Address) =>
    fromNullable(newFrame(template.create(s), template))
        .map(f => {

            s.actors.put(addr, f);

            s.exec(new Run(RUN_START_TAG, addr, template.delay || 0,
                () => s.actors.runInstance(addr)));

            return f.actor;

        });

const spawnChildren = (s: System, t: Template) => (parent: Actor) =>
    fromNullable(<Template[]>t.children)
        .map(children => children.forEach(c => s.exec(new Spawn(parent, c))));

const raiseInvalidIdError =
    (s: System, id: string, parent: Address) => () => {

        s.exec(new Raise(new InvalidIdError(id), parent, parent));
        return nothing();

    }

const raiseDuplicateAddressError =
    (s: System, parent: Address, addr: Address) => () => {

        s.exec(new Raise(
            new DuplicateAddressError(addr), parent, parent));

        return nothing();

    }
