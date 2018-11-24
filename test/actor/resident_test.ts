import { must } from '@quenk/must';
import { system } from '../../src';
import { Context } from '../../src/actor/context';
import { System } from '../../src/actor/system';
import {
    AbstractResident,
    Mutable,
    Immutable,
    Case
} from '../../src/actor/resident';

class Killer extends AbstractResident<Context> {

    constructor(public s: System<Context>, public done: (k: Killer) => void) { super(s); }

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

class Killable extends Mutable<void, Context> {

    receive = [];

    select<T>(_: Case<T>[]): Killable {

        return this;

    }

    run() {

        this.spawn({ id: 'a', create: s => new Victim(s) });

    }

}

class Victim extends Immutable<void, Context> {

    receive = []

    run() { }

}

class Exiter extends AbstractResident<Context> {

    constructor(public s: System<Context>, public done: () => void) { super(s); }

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

class ShouldWork extends Mutable<void, Context> {

    constructor(public s: System<Context>, public done: () => void) {

        super(s);

    }

    receive = [];

    run() {

        let bucket: any = [];

        let cases: Case<string>[] = [

            new Case('one', () => (bucket.push(1), this.select(cases))),
            new Case('two', () => (bucket.push(2), this.select(cases))),
            new Case('three', () => (bucket.push(3), this.select(cases))),
            new Case('done', () => { must(bucket.join(',')).equate('1,2,3'); this.done(); })

        ];

        this
            .select(cases)
            .tell('selector', 'one')
            .tell('selector', 'two')
            .tell('selector', 'three')
            .tell('selector', 'done');

    }

}

class MutableSelfTalk extends Mutable<string, Context> {

    constructor(public s: System<Context>, public done: () => void) { super(s); }

    count = 0;

    receive = [

        new Case('ping', () => {

            this.tell(this.self(), 'pong');
            this.select(this.receive);

        }),

        new Case('pong', () => {

            if (this.count === 3) {

                this.tell(this.self(), 'end');
                this.select(this.receive);

            } else {

                this.tell(this.self(), 'ping');
                this.count = this.count + 1;
                this.select(this.receive);

            }

        }),

        new Case('end', () => { must(this.count).equate(3); this.done(); })

    ]

    run() {

        this.tell(this.self(), 'ping');

    }

}

class ImmutableSelfTalk extends Immutable<string, Context> {

    constructor(public s: System<Context>, public done: () => void) { super(s); }

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

        new Case('end', () => { must(this.count).equal(3); this.done(); })

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

                            must(s.state.contexts['a/targets']).not.equal(undefined);
                            setTimeout(() => k.kill('a/targets'), 100);

                        })
                    })

                setTimeout(() => {

                    must(s.state.contexts['a/targets']).equal(undefined);
                    done();

                }, 200);
            })

            it('should kill grand children', done => {

                let s = system({ log: { level: 1 } })
                    .spawn({

                        id: 'a',
                        create: sys => new Killer(sys, k => {


                            setTimeout(() =>
                                must(s.state.contexts['a/targets/a'])
                                    .not.equal(undefined), 200);

                            setTimeout(() => k.kill('a/targets/a'), 300);

                        })
                    })

                setTimeout(() => {

                    must(s.state.contexts['a/targets/a']).equal(undefined);
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
                                must(s.state.contexts['a']).not.equal(undefined), 100);

                            setTimeout(() => {

                                must(s.state.contexts['a']).equal(undefined);
                                done();

                            }, 300);

                        })
                    })
            })

        })

    })

    describe('Mutable', () => {

        describe('#select', () => {

            it('should work', done => {

                system({ log: { level: 1 } })
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
