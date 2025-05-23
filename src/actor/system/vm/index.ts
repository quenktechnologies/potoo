import * as template from '../../template';
import * as errors from './runtime/error';
import * as events from './event';

import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { diff, empty } from '@quenk/noni/lib/data/array';
import { merge } from '@quenk/noni/lib/data/record';

import {
    Address,
    ADDRESS_SYSTEM,
    isChild,
    isGroup,
    isRootLevel
} from '../../address';
import { fromSpawnable } from '../../template';
import { Actor, Message } from '../../';
import { MapAllocator } from './allocator/map';
import { ErrorStrategy, SupervisorErrorStrategy } from './strategy/error';
import { Thread } from './thread';
import { GroupMap } from './group';
import { Scheduler } from './scheduler';
import { Allocator } from './allocator';
import { Api } from '../../api';
import { LogWritable, LogWriter } from './log/writer';
import { EventDispatcher } from './event/dispatcher';
import { ThreadRunner } from './thread/runner';
import { Conf, PartialConf } from './conf';
import { toLogLevelValue } from './log';
import { ThreadCollector } from './thread/collector';

/**
 * VM is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface VM extends Actor, Thread, Api {
    /**
     * allocator used to manage thread resources for an actor.
     */
    allocator: Allocator;

    /**
     * runner used to start up threads.
     */
    runner: ThreadRunner;

    /**
     * scheduler used for co-ordinating actor thread execution.
     */
    scheduler: Scheduler;

    /**
     * collector used to remove dead actor threads.
     */
    collector: ThreadCollector;

    /**
     * errors strategy used to handle errors that occur within the system.
     */
    errors: ErrorStrategy;

    /**
     * log service for the VM.
     *
     * Used to access the internal logging API.
     */
    log: LogWritable;

    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    events: EventDispatcher;

    /**
     * groups holds the mapping of group names to actor addresses.
     */
    groups: GroupMap;

    /**
     * sendMessage to the actor act the destination address.
     *
     * This is used by the threads to communicate.
     */
    sendMessage(from: Thread, to: Address, msg: Message): Promise<void>;

    /**
     * sendKillSignal initiates the deallocation of the actor at the
     * specified address.
     *
     * Actual deallocation only occurs if the source thread is allowed to.
     */
    sendKillSignal(src: Thread, target: Address): Promise<void>;

    /**
     * runTask allows an async function to be executed on behalf of a Thread.
     *
     * If the Promise rejects, the error is raised with the Thread.
     */
    runTask(thread: Thread, task: () => Promise<void>): Promise<void>;
}

/**
 * PVM (Potoo Virtual Machine) is a JavaScript implemented virtual machine that
 * functions as a message delivery system between target actors.
 *
 * Actors known to the VM are considered to be part of a system and may or may
 * not reside on the same process/worker/thread depending on the underlying
 * platform and individual actor implementations.
 */
export class PVM implements VM {
    constructor(
        public allocator: Allocator = new MapAllocator(() => this),
        public scheduler: Scheduler = new Scheduler(),
        public collector: ThreadCollector = new ThreadCollector(() => this),
        public errors: ErrorStrategy = new SupervisorErrorStrategy(allocator),
        public log: LogWritable = new LogWriter(console),
        public events = new EventDispatcher(log),
        public runner: ThreadRunner = new ThreadRunner(() => this),
        public groups: GroupMap = new GroupMap(),
        public address = ADDRESS_SYSTEM,
        public self = ADDRESS_SYSTEM,
        public template: template.Template = { create: () => this }
    ) {}

    /**
     * create a new PVM instance using the provided configuration.
     */
    static create(conf: PartialConf = {}): PVM {
        let config: Conf = {
            log: merge({ level: 'info', sink: console }, conf.log ?? {})
        };

        let vm: PVM;

        let allocator = new MapAllocator(() => vm);
        let log = new LogWriter(
            config.log.sink,
            toLogLevelValue(config.log.level)
        );

        vm = new PVM(
            allocator,
            new Scheduler(),
            new ThreadCollector(() => vm),
            new SupervisorErrorStrategy(allocator, conf.trap),
            log,
            new EventDispatcher(log),
            new ThreadRunner(() => vm),
            new GroupMap()
        );
        return vm;
    }

    // Actor

    async start() {}

    async notify(msg: Message) {
        await this.events.dispatchMessageEvent(
            this.address,
            events.EVENT_MESSAGE_CONSUMED,
            this.address,
            msg
        );
    }

    async stop() {
        let threads = this.allocator.getThreads();
        for (let thread of threads) {
            if (isRootLevel(thread.address))
                await this.allocator.deallocate(thread);
        }
    }

    // Api

    get vm() {
        return this;
    }

    async spawn(tmpl: template.Spawnable): Promise<Address> {
        return this.allocator.allocate(this, fromSpawnable(tmpl));
    }

    async tell(to: Address, msg: Message) {
        this.sendMessage(this, to, msg);
    }

    async raise(err: Err) {
        await this.errors.raise(this, err);
    }

    async kill(addr: Address) {
        await this.sendKillSignal(this, addr);
    }

    async receive<T>() {
        return <Promise<T>>Future.raise(new Error('Not implemented'));
    }

    // Platform

    async sendMessage(from: Thread, to: Address, msg: Message) {
        let targets = isGroup(to) ? this.groups.getMembers(to) : [to];

        let threads = this.allocator.getThreads(targets);

        let missing = diff(
            targets,
            threads.map(t => t.address)
        );

        if (!empty(missing)) {
            for (let address of missing)
                await this.events.dispatchMessageEvent(
                    from.address,
                    events.EVENT_MESSAGE_BOUNCE,
                    address,
                    msg
                );
        }

        for (let thread of threads) {
            await this.events.dispatchMessageEvent(
                from.address,
                events.EVENT_MESSGAE_SEND,
                to,
                msg
            );
            thread.notify(msg).catch(err => thread.raise(err));
        }
    }

    async sendKillSignal(src: Thread, target: Address): Promise<void> {
        if (src.address !== target && !isChild(src.address, target)) {
            return Future.raise(new errors.IllegalStopErr(src.address, target));
        }

        let mtargetThread = this.allocator.getThread(target);

        if (mtargetThread.isNothing()) {
            return;
        }

        await this.allocator.deallocate(mtargetThread.get());
    }

    runTask(thread: Thread, task: () => Promise<void>): Promise<void> {
        return Future.do(task).catch(err => thread.raise(err));
    }
}
