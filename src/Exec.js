import * as Ops from './Ops';
import { match } from './Match';
import { partial } from './util';
import { IO, Maybe } from './monad';
import {get, put, replace, select, accept } from './Actor';

const _execSelect = (a, ios) => ({ path, next }) => ios.chain(s =>
    exec(a, IO.of(s),
        next(Maybe
            .not(select(path, s))
            .orJust(get('?', s))
            .extract())))

const _execInput = (a, ios) => ({ next, iof }) =>
    ios.chain(s => iof().map(r => next(r)).chain(fr => exec(a, IO.of(s), fr)))

/**
 * exec translates an Op into IO
 * @summary exec :: (Actor,IO<System>,Free<F,V>) →  IO<System>
 */
export const exec = (a, ios, f = null) =>
    !f ? ios :
    f.resume()
    .cata(op => /*console.log('Actor : ', a.path, 'Op: ', op, '\n') || */ match(op)
        .caseOf(Ops.System, ({ next }) => ios.chain(s => exec(a, ios(s), next(s))))
        .caseOf(Ops.Self, ({ next }) => exec(a, ios, next(a)))
        .caseOf(Ops.Get, ({ id, next }) => exec(a, ios, next(get(id, a))))
        .caseOf(Ops.Put, ({ actor, next }) => exec(a, ios, next(put(actor, a))))
        .caseOf(Ops.Update, ({ actor, next }) => exec(actor, ios.map(partial(replace, actor)), next))
        .caseOf(Ops.Select, _execSelect(a, ios))
        .caseOf(Ops.Accept, ({ actor, message, next }) => exec(a, ios, next(accept(message, actor))))
        .caseOf(Ops.Replace, ({ actor, next }) => exec(a, ios.map(partial(replace, actor)), next))
        .caseOf(Ops.Output, ({ f, next }) => exec(a, ios.chain(s => f().map(() => s)), next))
        .caseOf(Ops.Input, _execInput(a, ios))
        .caseOf(Ops.Raise, ({ error }) => { throw error; })
        .end(), () => ios.map(partial(replace, a)));
