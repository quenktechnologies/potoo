/**
 * @module Exec
 *
 * Provides functions for interpreting Ops.
 *
 */
import * as Ops from './Ops';
import { match } from './Match';
import { partial, constant } from './util';
import { IO, Maybe } from './monad';
import {get, put, replace, select, accept } from './Actor';

/**
 * exec translates an Op into IO
 * @summary exec :: (Actor,IO<System>,Free<O,*>) →  IO<System>
 */
export const exec = (a, ios, F) =>
    Maybe
    .not(F)
    .map(() =>
        F
        .resume()
        .cata(op => match(op)
            .caseOf(Ops.System, ({ next }) => ios.chain(s => exec(a, ios(s), next(s))))
            .caseOf(Ops.Self, ({ next }) => exec(a, ios, next(a)))
            .caseOf(Ops.Get, ({ id, next }) => exec(a, ios, next(get(id, a))))
            .caseOf(Ops.Put, ({ actor, next }) => exec(a, ios, next(put(actor, a))))
            .caseOf(Ops.Update, ({ actor, next }) => exec(actor, ios.map(partial(replace, actor)), next))
            .caseOf(Ops.Select, _execSelect(a, ios))
            .caseOf(Ops.Accept, ({ actor, message, next }) => exec(a, ios, next(accept(message, actor))))
            .caseOf(Ops.AcceptIO, _execIOAccept(a, ios))
            .caseOf(Ops.Replace, ({ actor, next }) => exec(a, ios.map(partial(replace, actor)), next))
            .caseOf(Ops.Output, ({ f, next }) => exec(a, ios.chain(s => f().map(() => s)), next))
            .caseOf(Ops.Input, _execInput(a, ios))
            .caseOf(Ops.Raise, ({ error }) => { throw error; })
            .caseOf(Ops.Log, _execLog(a, ios))
            .caseOf(Ops.NOOP, ({ next }) => exec(a, ios, next))
            .end(), () => ios.map(partial(replace, a))))
    .orJust(ios)
    .extract();

const _exec = (a, ios, op) =>
    match(op)
    .caseOf(Ops.System, ({ next }) => ios.chain(s => exec(a, ios(s), next(s))))
    .caseOf(Ops.Self, ({ next }) => exec(a, ios, next(a)))
    .caseOf(Ops.Get, ({ id, next }) => exec(a, ios, next(get(id, a))))
    .caseOf(Ops.Put, ({ actor, next }) => exec(a, ios, next(put(actor, a))))
    .caseOf(Ops.Update, ({ actor, next }) => exec(actor, ios.map(partial(replace, actor)), next))
    .caseOf(Ops.Select, _execSelect(a, ios))
    .caseOf(Ops.Accept, ({ actor, message, next }) => exec(a, ios, next(accept(message, actor))))
    .caseOf(Ops.AcceptIO, _execIOAccept(a, ios))
    .caseOf(Ops.Replace, ({ actor, next }) => exec(a, ios.map(partial(replace, actor)), next))
    .caseOf(Ops.Output, ({ f, next }) => exec(a, ios.chain(s => f().map(() => s)), next))
    .caseOf(Ops.Input, _execInput(a, ios))
    .caseOf(Ops.Raise, ({ error }) => { throw error; })
    .caseOf(Ops.Log, _execLog(a, ios))
    .caseOf(Ops.NOOP, ({ next }) => exec(a, ios, next))
    .end();


const _execSelect = (a, ios) => ({ path, next }) => ios.chain(s =>
    exec(a, IO.of(s),
        next(Maybe
            .not(select(path, s))
            .orJust(get('?', s))
            .extract())))

const _execInput = (a, ios) => ({ next, f }) =>
    ios.chain(s => f().map(r => next(r)).chain(fr => exec(a, IO.of(s), fr)))

const _execIOAccept = (a, ios) => ({ actor, message, next }) =>
    ios.chain(s => accept(message, actor).chain(b => exec(a, IO.of(s), next(b))));

const _execLog = (a, ios) => ({ op, next }) =>
    exec(a, ios.chain(s => s.log(op, a).map(constant(s))), next(op));
