import { assert } from '@quenk/test/lib/assert';
import { Context } from '../../../src/actor/context';
import {
    AbstractResident,
    Mutable,
    Immutable,
} from '../../../src/actor/resident';
import { Case } from '../../../src/actor/resident/case';
import { ActorSystem, system } from '../../../src/actor/system/framework/default';

class Killer extends AbstractResident<Context, ActorSystem> {

    constructor(
        public s: ActorSystem,
        public done: (k: Killer) => void) { super(s); }

    init(c: Context): Context {

        c.flags.immutable = true;
        c.flags.buffered = true;
        return c;

    }

    select<T>(_: Case<T>[]): Killer {

        return this;

    }

    run() {

        this.spawn({ id: 'targets', create: s => new Killable(s) });
        this.done(this);

    }

}

class Group extends AbstractResident<Context, ActorSystem> {

    init(c: Context): Context {

        c.flags.immutable = true;
        c.flags.buffered = true;
        return c;

    }

    select<T>(_: Case<T>[]): Group {

        return this;

    }

    run() {

        this.spawnGroup('test', {

            b: { id: 'b', create: s => new Killable(s) },

            c: { id: 'c', create: s => new Killable(s) },

            d: { id: 'd', create: s => new Killable(s) }

        });

    }

}


class Killable extends Mutable<Context, ActorSystem> {

    receive = [];

    select<T>(_: Case<T>[]): Killable {

        return this;

    }

    run() {

        this.spawn({ id: 'a', create: s => new Victim(s) });

    }

}

class Victim extends Immutable<void, Context, ActorSystem> {

    receive = []

    run() { }

}

class Exiter extends AbstractResident<Context, ActorSystem> {

    constructor(
        public s: ActorSystem,
        public done: () => void) { super(s); }

    init(c: Context): Context {

        c.flags.immutable = true;
        c.flags.buffered = true;
        return c;

    }

    select<T>(_: Case<T>[]): Killer {

        return this;

    }

    run() {

        this.done();

        setTimeout(() => {

            this.exit();


        }, 200);

    }

}

class ShouldWork extends Mutable<Context, ActorSystem> {

    constructor(
        public s: ActorSystem,
        public done: () => void) {

        super(s);

    }

    run() {

        let bucket: any = [];

        let cases: Case<string>[] = [

            new Case('one', () => (bucket.push(1), this.select(cases))),
            new Case('two', () => (bucket.push(2), this.select(cases))),
            new Case('three', () => (bucket.push(3), this.select(cases))),
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

class MutableSelfTalk extends Mutable<Context, ActorSystem> {

    constructor(
        public s: ActorSystem,
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

class ImmutableSelfTalk extends Immutable<string, Context, ActorSystem> {

    constructor(
        public s: ActorSystem,
        public done: () => void) { super(s); }

    count = 0;

    receive = [

        new Case('ping', () => this.tell(this.self(), 'pong')),

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

describe('resident', () => {

    describe('AbstractResident', () => {

        describe('kill', () => {

            it('should kill children', done => {

                let s = system({ log: { level: 1 } })
                    .spawn({

                        id: 'a',
                        create: sys => new Killer(sys, k => {

                            assert(s.state.contexts['a/targets']).not.equal(undefined);
                            setTimeout(() => k.kill('a/targets'), 100);

                        })
                    })

                setTimeout(() => {

                    assert(s.state.contexts['a/targets']).equal(undefined);
                    done();

                }, 200);
            })

            it('should kill grand children', done => {

                let s = system({ log: { level: 1 } })
                    .spawn({

                        id: 'a',
                        create: sys => new Killer(sys, k => {


                            setTimeout(() =>
                                assert(s.state.contexts['a/targets/a'])
                                    .not.equal(undefined), 200);

                            setTimeout(() => k.kill('a/targets/a'), 300);

                        })
                    })

                setTimeout(() => {

                    assert(s.state.contexts['a/targets/a']).equal(undefined);
                    done();

                }, 400);
            })

        })

        describe('exit', () => {

            it('should work', done => {

                let s = system({ log: { level: 1 } })
                    .spawn({

                        id: 'a',
                        create: sys => new Exiter(sys, () => {


                            setTimeout(() =>
                                assert(s.state.contexts['a']).not.equal(undefined), 100);

                            setTimeout(() => {

                                assert(s.state.contexts['a']).equal(undefined);
                                done();

                            }, 300);

                        })
                    })
            })

        })

        describe('group', () => {

            it('should assign actors to a group', done => {

                let s = system({ log: { level: 1 } })
                    .spawn({

                        id: 'a',
                        create: sys => new Group(sys)
                    })

                setTimeout(() => {

                    assert(s.state.groups['test']).equate(['a/b', 'a/c', 'a/d']);
                    done();

                }, 200)
            })

        })

    })

    describe('Mutable', () => {

        describe('#select', () => {

            it('should work', done => {

                system({ log: { level: 100 } })
                    .spawn({
                        id: 'selector',
                        create: s => new ShouldWork(s, done)
                    });

            })

            it('should be able to talk to itself', done => {

                system({ log: { level: 1 } })
                    .spawn({
                        id: 'MutableSelfTalk',
                        create: s => new MutableSelfTalk(s, done)
                    });


            });

        })

    })

    describe('Immutable', () => {

        it('should be able to talk to itself', done => {

            system({ log: { level: 1 } })
                .spawn({
                    id: 'selector',
                    create: s => new ImmutableSelfTalk(s, done)
                });

        });

    })

})
