import * as log from '../log';
import {
    fromString,
    fromBoolean,
    fromNullable,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { cons, noop } from '@quenk/noni/lib/data/function';
import { Instance } from '../../';
import { Template } from '../../template';
import { exists, getAddress, put, runInstance } from '../state';
import { Context } from '../../context';
import { Address, isRestricted, make } from '../../address';
import { SystemError } from '../error';
import { Raise } from './raise';
import { Run } from './run';
import { System } from '../';
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
 *
 * Enters a child actor in the system.
 *
 * We first ensure the parent is still in the system then validate
 * the child id. After that we check for dupicated ids then finally
 * setup the new child.
 */
export class Spawn<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(
        public parent: Instance,
        public template: Template<C, S>) { super(); }

    public code = OP_SPAWN;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execSpawn(s, <Spawn<C, S>>this);

    }

}

 const execSpawn = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { parent, template }: Spawn<C, S>) =>
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

const makeAddress = <C extends Context, S extends System<C>>
    (parent: Address) => (template: Template<C, S>) =>
        fromString(make(parent, template.id))

const checkAddress = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, addr: Address) =>
    fromBoolean(!exists(s.state, addr));

const generate = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, template: Template<C, S>) => (addr: Address) =>
        fromNullable(s.allocate(template))
            .map(f => {

                s.state = put(s.state, addr, f);

                s.exec(new Run(RUN_START_TAG, addr, template.delay || 0,
                    () => runInstance(s.state, addr)));

                return f.actor;

            });

const spawnChildren = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, t: Template<C, S>) => (parent: Instance) =>
        fromNullable(<Template<C, S>[]>t.children)
            .map(children => children.forEach(c => s.exec(new Spawn(parent, c))));

const raiseInvalidIdError = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, id: string, parent: Address) => () => {

        s.exec(new Raise(new InvalidIdError(id), parent, parent));
        return nothing();

    }

const raiseDuplicateAddressError = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, parent: Address, addr: Address) => () => {

        s.exec(new Raise(
            new DuplicateAddressError(addr), parent, parent));

        return nothing();

    }
