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
import { exists, getAddress, put, runInstance } from '../state';
import { Context } from '../state/context';
import { Address, isRestricted, make } from '../../address';
import { SystemError } from '../error';
import { Raise } from './raise';
import { Run } from './run';
import { Op, OP_SPAWN, Executor } from './';

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

    exec<C extends Context>(s: Executor<C>): void {

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
export const execSpawn = <C extends Context>(s: Executor<C>, { parent, template }: Spawn) =>
    getAddress(s.state, parent)
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

const checkAddress = <C extends Context>(s: Executor<C>, addr: Address) =>
    fromBoolean(!exists(s.state, addr));

const generate =
    <C extends Context>(s: Executor<C>, template: Template) => (addr: Address) =>
        fromNullable(s.allocate(template))
            .map(f => {

                s.state = put(s.state, addr, f);

                s.exec(new Run(RUN_START_TAG, addr, template.delay || 0,
                    () => runInstance(s.state, addr)));

                return f.actor;

            });

const spawnChildren =
    <C extends Context>(s: Executor<C>, t: Template) => (parent: Actor) =>
        fromNullable(<Template[]>t.children)
            .map(children => children.forEach(c => s.exec(new Spawn(parent, c))));

const raiseInvalidIdError =
    <C extends Context>(s: Executor<C>, id: string, parent: Address) => () => {

        s.exec(new Raise(new InvalidIdError(id), parent, parent));
        return nothing();

    }

const raiseDuplicateAddressError =
    <C extends Context>(s: Executor<C>, parent: Address, addr: Address) => () => {

        s.exec(new Raise(
            new DuplicateAddressError(addr), parent, parent));

        return nothing();

    }
