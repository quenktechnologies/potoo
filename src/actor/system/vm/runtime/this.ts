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
    getGroup,
    putMember,
    removeMember,
    remove
} from '../../state';
import { Configuration } from '../../configuration';
import { Log, Op } from '../op';
import { Data, Frame } from '../frame';
import { Value, Script } from '../script';
import { StopScript, RestartScript } from './scripts';
import { Platform } from '../';
import { System } from '../../';
import { Runtime } from './';

/**
 * This is an implementation of Runtime for exactly one
 * actor.
 *
 * It has all the methods and properties expected for Op code execution.
 */
export class This implements Runtime {

    constructor(
        public self: Address,
        public system: Platform,
        public stack: Frame[] = [],
        public queue: Frame[] = []) { }

    running = false;

    config(): Configuration {

        return this.system.configuration;

    }

    current(): Maybe<Frame> {

        return (this.stack.length > 0) ?
            just(tail(this.stack)) :
            nothing();

    }

    allocate(addr: Address, t: template.Template<Context, System<Context>>): Context {

        let h = new This(addr, this.system);
        let act = t.create(this.system);

        return act.init(this.system.allocate(act, h, t));

    }

    getContext(addr: Address): Maybe<Context> {

        return get(this.system.state, addr);

    }

    getRouter(addr: Address): Maybe<Context> {

        return getRouter(this.system.state, addr);

    }

    getGroup(name: string): Maybe<Address[]> {

        return getGroup(this.system.state, name.split('$').join(''));

    }

    getChildren(addr: Address): Maybe<Contexts<Context>> {

        return fromNullable(getChildren(this.system.state, addr));

    }

    putContext(addr: Address, ctx: Context): This {

        this.system.state = put(this.system.state, addr, ctx);
        return this;

    }

    removeContext(addr: Address): This {

        this.system.state = remove(this.system.state, addr);
        return this;

    }

    putRoute(target: Address, router: Address): This {

        putRoute(this.system.state, target, router);
        return this;

    }

    removeRoute(target: Address): This {

        removeRoute(this.system.state, target);
        return this;

    }

    putMember(group: string, addr: Address): This {

        putMember(this.system.state, group, addr);
        return this;

    }

    removeMember(group: string, addr: Address): This {

        removeMember(this.system.state, group, addr);
        return this;

    }

    push(f: Frame): This {

        this.stack.push(f);
        return this;

    }

    clear(): This {

        this.stack = [];
        return this;

    }

    drop(m: Message): This {

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

    exec(s: Script): Maybe<Value> {

        let ctx = this.getContext(this.self).get();

        if (this.running) {

            this.queue.push(new Frame(this.self, ctx, s, s.code));

        } else {

            this.push(new Frame(this.self, ctx, s, s.code));

        }

        return this.run();

    }

    run(): Maybe<Value> {

        let policy = <config.LogPolicy>(this.system.configuration.log || {});

        let ret: Maybe<Value> = nothing();

        if (this.running) return ret;

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

                    ret = cur.resolve(cur.pop()).toMaybe();

                    this.stack.pop();

                    break;

                }

                let next = log(policy, cur, cur.code[cur.ip]);

                cur.ip++; // increment here so jumps do not skip

                next.exec(this);

            }

            if (this.stack.length === 0) {

                if (this.queue.length > 0) {

                    this.stack.push(<Frame>this.queue.shift());

                } else {

                    break;

                }

            }

        }

        this.running = false;

        return ret;

    }

}

const escalate =
    (env: Platform, target: Address, err: Err) =>
        get(env.state, getParent(target))
            .map(ctx => ctx.runtime.raise(err))
            .orJust(() => { throw convert(err); });

const log =
    (policy: config.LogPolicy, f: Frame, o: Op): Op => {

        let level = policy.level || 0;
        let logger = policy.logger || console;

        if (o.level <= <number>level) {

            let ctx = `[${f.actor}]`;
            let msg = [ctx, ...resolveLog(f, o.toLog(f))];

            switch (o.level) {

                case logging.INFO:
                    (<logging.Logger>logger).info.apply(logger, msg);
                    break;
                case logging.WARN:
                    (<logging.Logger>logger).warn.apply(logger, msg);
                    break;
                case logging.ERROR:
                    (<logging.Logger>logger).error.apply(logger, msg);
                    break;
                default:
                    (<logging.Logger>logger).log.apply(logger, msg);
                    break;

            }

        }

        return o;

    }

const resolveLog =
    (f: Frame, [op, rand, data]: Log) => {

        let operand = rand.length > 0 ?
            f
                .resolve(<Data>rand)
                .orRight(() => undefined)
                .takeRight() : [];

        let stack = data.length > 0 ?
            data.map(d =>
                f.resolve(d)
                    .orRight(() => undefined)
                    .takeRight()) : [];

        return [op, operand].concat(stack);

    }
