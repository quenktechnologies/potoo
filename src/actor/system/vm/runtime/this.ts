import * as template from '../../../template';
import * as logging from '../../log';
import * as config from '../../configuration';
import { Err, convert } from '@quenk/noni/lib/control/error';
import { tail } from '@quenk/noni/lib/data/array';
import { Maybe, just, nothing, fromNullable } from '@quenk/noni/lib/data/maybe'
import { Contexts, Context } from '../../../context';
import { Message } from '../../../message';
import { Address, getParent } from '../../../address';
import {
    get,
    getChildren,
    getRouter,
    put,
    putRoute,
    removeRoute,
    remove
} from '../../state';
import { System } from '../../';
import { Log, Op } from '../op';
import { Data, Frame } from '../frame';
import { Script } from '../script';
import { StopScript, RestartScript } from './scripts';
import { Runtime } from './';

/**
 * This is an implementation of Runtime for exactly one
 * actor.
 *
 * It has all the methods and properties expected for Op code execution.
 */
export class This<C extends Context, S extends System<C>>
    implements Runtime<C, S> {

    constructor(
        public self: Address,
        public system: System<C>,
        public stack: Frame<C, S>[] = [],
        public queue: Frame<C, S>[] = []) { }

    running = false;

    current(): Maybe<Frame<C, S>> {

        return (this.stack.length > 0) ?
            just(tail(this.stack)) :
            nothing();

    }

    allocate(addr: Address, t: template.Template<C, S>): C {

        let h = new This(addr, this.system);
        let act = t.create(h);

        return act.init(this.system.allocate(act, h, t));

    }

    getContext(addr: Address): Maybe<C> {

        return get(this.system.state, addr);

    }

    getRouter(addr: Address): Maybe<C> {

        return getRouter(this.system.state, addr);

    }

    getChildren(addr: Address): Maybe<Contexts<C>> {

        return fromNullable(getChildren(this.system.state, addr));

    }

    putContext(addr: Address, ctx: C): This<C, S> {

        this.system.state = put(this.system.state, addr, ctx);
        return this;

    }

    removeContext(addr: Address): This<C, S> {

        this.system.state = remove(this.system.state, addr);
        return this;

    }

    putRoute(target: Address, router: Address): This<C, S> {

        putRoute(this.system.state, target, router);
        return this;

    }

    removeRoute(target: Address): This<C, S> {

        removeRoute(this.system.state, target);
        return this;

    }

    push(f: Frame<C, S>): This<C, S> {

        this.stack.push(f);
        return this;

    }

    clear(): This<C, S> {

        this.stack = [];
        return this;

    }

    drop(m: Message): This<C, S> {

        let policy = <config.LogPolicy>(this.system.configuration.log || {});
        let level = policy.level || 0;
        let logger = policy.logger || console;

        if (level > logging.WARN) {

            logger.warn(`[${this.self}]: Dropped `, m);

        }

        return this;

    }

    raise(err: Err): void {

        let { self } = this;

        this
            .getContext(self)
            .chain(ctx =>
                fromNullable<template.TrapFunc>(ctx.template.trap)
                    .map(trap => {

                        switch (trap(err)) {

                            case template.ACTION_IGNORE:
                                break;

                            case template.ACTION_RESTART:
                                this.exec(new RestartScript());
                                break;

                            case template.ACTION_STOP:
                                this.exec(new StopScript(self));
                                break;

                            default:
                                this.exec(new StopScript(self));
                                escalate(this.system, self, err);
                                break;

                        }

                    }))
            .orJust(() => {

                this.exec(new StopScript(self));
                escalate(this.system, self, err);

            });

    }

    exec(s: Script<C, S>): void {

        let ctx = this.getContext(this.self).get();

        if (this.running) {

            this.queue.push(new Frame(this.self, ctx, s, s.code));

        } else {

            this.push(new Frame(this.self, ctx, s, s.code));

        }

        this.run();

    }

    run(): void {

        let policy = <config.LogPolicy>(this.system.configuration.log || {});

        if (this.running) return;

        this.running = true;

        while (true) {

            let cur = tail(this.stack);

            while (true) {

                if (tail(this.stack) !== cur) break;

                if (cur.ip === cur.code.length) {
                    //XXX: We should really always push the top most to the next
                    if ((this.stack.length > 1) && (cur.data.length > 0)) {

                        let [value, type, loc] = cur.pop();

                        this.stack[this.stack.length - 2].push(value, type, loc);

                    }

                    this.stack.pop();

                    break;

                }

                log(policy, cur, cur.code[cur.ip]).exec(this);

                cur.ip++;

            }

            if (this.stack.length === 0) {

                if (this.queue.length > 0) {

                    this.stack.push(<Frame<C, S>>this.queue.shift());

                } else {

                    break;

                }

            }

        }

        this.running = false;

    }

}

const escalate = <C extends Context>
    (env: System<C>, target: Address, err: Err) =>
    get(env.state, getParent(target))
        .map(ctx => ctx.handler.raise(err))
        .orJust(() => { throw convert(err); });

const log = <C extends Context, S extends System<C>>
    (policy: config.LogPolicy, f: Frame<C, S>, o: Op<C, S>): Op<C, S> => {

    let level = policy.level || 0;
    let logger = policy.logger || console;

    if (o.level <= <number>level) { }

    let ctx = `[${f.actor}]`;
    let msg = resolveLog(f, o.toLog(f));

    switch (o.level) {
        case logging.INFO:
            (<logging.Logger>logger).info(ctx, msg);
            break;
        case logging.WARN:
            (<logging.Logger>logger).warn(ctx, msg);
            break;
        case logging.ERROR:
            (<logging.Logger>logger).error(ctx, msg);
            break;
        default:
            (<logging.Logger>logger).log(ctx, msg)
            break;

    }

    //   }

    return o;

}

const resolveLog = <C extends Context, S extends System<C>>
    (f: Frame<C, S>, [op, rand, data]: Log) => {

    let operand = rand.length > 0 ?
        f
            .resolve(<Data>rand)
            .orRight(() => undefined)
            .takeRight() : undefined;

    let stack = data.length > 0 ?
        data.map(d =>
            f.resolve(d)
                .orRight(() => undefined)
                .takeRight()) : [];

    return [op, operand, stack];

}
