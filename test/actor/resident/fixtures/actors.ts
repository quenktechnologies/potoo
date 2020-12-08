import {
    fromCallback,
    Future,
    delay
} from '@quenk/noni/lib/control/monad/future';
import { assert } from '@quenk/test/lib/assert';

import { Context } from '../../../../lib/actor/system/vm/runtime/context';
import { Case } from '../../../../lib/actor/resident/case';
import { FLAG_IMMUTABLE, FLAG_BUFFERED } from '../../../../lib/actor/flags';
import {
    AbstractResident,
    Mutable,
    Immutable
} from '../../../../lib/actor/resident';
import { TestSystem } from './system';

export class Killer extends AbstractResident {

    constructor(
        public s: TestSystem,
        public done: (k: Killer) => void) { super(s); }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): Killer {

        return this;

    }

    run() {

        this.spawn({ id: 'targets', create: s => new Killable(<TestSystem>s) });

        this.done(this);

    }

}

export class DelayOnRun extends AbstractResident {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): DelayOnRun {

        return this;

    }

    run(): Future<void> {

        return fromCallback(cb => setTimeout(() => {

            this.done();
            cb(null);

        }, 200));

    }

}

export class Killable extends Mutable {

    receive = [];

    select<T>(_: Case<T>[]): Killable {

        return this;

    }

    run() {

        this.spawn({ id: 'a', create: s => new Victim(<TestSystem>s) });

    }

}

export class Victim extends Immutable<void> {

    receive = []

    run() { }

}

export class Group extends AbstractResident {

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): Group {

        return this;

    }

    run() {

        this.spawnGroup('test', {

            b: { id: 'b', create: s => new Killable(<TestSystem>s) },

            c: { id: 'c', create: s => new Killable(<TestSystem>s) },

            d: { id: 'd', create: s => new Killable(<TestSystem>s) }

        });

    }

}

export class Exiter extends AbstractResident {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): Exiter {

        return this;

    }

    run() {

        setTimeout(() => {

            this.exit();

        }, 200);

        this.done();

    }

}

export class Raiser extends AbstractResident {

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): Raiser {

        return this;

    }

    run() {

        this.raise(new Error('risen'));

    }

}

export class Spawner extends AbstractResident {

    constructor(
        public s: TestSystem,
        public done: () => void) {

        super(s);

    }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): Spawner {

        return this;

    }

    run() {

        this.done();

    }

}

export class AssertSpawnReturnsAddress extends AbstractResident {

    constructor(public s: TestSystem, public addr: string) {

        super(s);

    }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;
        return c;

    }

    select<T>(_: Case<T>[]): AssertSpawnReturnsAddress {

        return this;

    }

    run() {

        assert(this.spawn({

            id: 'child',

            create: s => new Spawner(<TestSystem>s, () => { })

        })).equate(`${this.addr}/child`);

    }

}

export class ShouldWork extends Mutable {

    constructor(
        public s: TestSystem,
        public done: () => void) {

        super(s);

    }

    run() {

        let bucket: any = [];

        let cases: Case<string>[] = [

            new Case('one', () => { (bucket.push(1), this.select(cases)) }),
            new Case('two', () => { (bucket.push(2), this.select(cases)) }),
            new Case('three', () => { (bucket.push(3), this.select(cases)) }),
            new Case('done', () => {
                assert(bucket.join(',')).equate('1,2,3'); this.done();
            })

        ];

        this
            .select(cases)
            .tell('selector', 'one')
            .tell('selector', 'two')
            .tell('selector', 'three')
            .tell('selector', 'done');

    }

}

export class MutableSelfTalk extends Mutable {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    count = 0;

    blocks = [

        new Case('ping', () => {

            this.tell(this.self(), 'pong');
            this.select(this.blocks);

        }),

        new Case('pong', () => {

            if (this.count === 3) {

                this.tell(this.self(), 'end');
                this.select(this.blocks);

            } else {

                this.tell(this.self(), 'ping');
                this.count = this.count + 1;
                this.select(this.blocks);

            }

        }),

        new Case('end', () => { assert(this.count).equate(3); this.done(); })

    ]

    run() {

        this.select(this.blocks);
        this.tell(this.self(), 'ping');

    }

}

export class ImmutableSelfTalk extends Immutable<string> {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    count = 0;

    receive = [

        new Case('ping', () => { this.tell(this.self(), 'pong'); }),

        new Case('pong', () => {

            if (this.count === 3) {

                this.tell(this.self(), 'end');

            } else {

                this.tell(this.self(), 'ping');
                this.count = this.count + 1;

            }

        }),

        new Case('end', () => { assert(this.count).equal(3); this.done(); })

    ]

    run() {

        this.tell(this.self(), 'ping');

    }

}

export class ImmutableCrossTalk extends Immutable<string> {

    constructor(
        public s: TestSystem,
        public partner: string,
        public done?: () => void) { super(s); }

    receive = [

        new Case('syn', () => { this.tell(this.partner, 'ack'); }),

        new Case('ack', () => {

            if (this.done)
                this.done()

        })

    ]

    run() {

        if (this.done)
            this.tell(this.partner, 'syn');

    }

}

export class AsyncReceiverImmutable extends Immutable<string> {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    receive = [

        new Case('start', () =>
            delay(() => this.tell(this.self(), 'stop'), 100)),

        new Case('stop', () => {

            this.done();

        })

    ];

    run() {

        this.tell(this.self(), 'start');

    }

}

export class MutableCrossTalk extends Mutable {

    constructor(
        public s: TestSystem,
        public partner: string,
        public done?: () => void) { super(s); }

    run() {

        this.select([

            new Case('syn', () => { this.tell(this.partner, 'ack'); }),

            new Case('ack', () => {

                if (this.done)
                    this.done()

            })

        ]);

        if (this.done)
            this.tell(this.partner, 'syn');

    }

}

export class AsyncReceiverMutable extends Mutable {

    constructor(
        public s: TestSystem,
        public done: () => void) { super(s); }

    run() {

        this.select([
            new Case('start', () => {

                this.select([new Case('stop', () => { this.done(); })]);

                return delay(() => this.tell(this.self(), 'stop'), 100);

            })
        ]);

        this.tell(this.self(), 'start');

    }

}
