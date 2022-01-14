import { assert } from '@quenk/test/lib/assert';

import { count } from '@quenk/noni/lib/data/record';

import { system, TestSystem } from './fixtures/system';
import {
    ImmutableSelfTalk,
    ImmutableCrossTalk,
    AsyncReceiverImmutable,
    Parent
} from './fixtures/actors';
import { Case } from '../../../lib/actor/resident/case';
import { Immutable } from '../../../lib/actor/resident/immutable';

describe('resident', () => {

    describe('Immutable', () => {

        it('should be able to talk to itself', done => {

            system()
                .spawn({
                    id: 'selector',
                    create: s => new ImmutableSelfTalk(<TestSystem>s, done)
                });

        });

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new ImmutableCrossTalk(<TestSystem>s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new ImmutableCrossTalk(<TestSystem>s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverImmutable(<TestSystem>sys, done)

            });

        });

        it('should allow a child to talk to its parent in the run method',
            done => {

                // This is really about a issue #43

                let sys = system();

                sys.spawn({

                    id: 'parent',

                    create: s => new Parent(<TestSystem>s, () => {

                        assert(count(sys.vm.heap.objects)).equal(0);

                        assert(count(sys.vm.heap.owners)).equal(0);

                        done();

                    })

                });

            });

        it('should not preempt when exiting', done => {

            class TellTellExit extends Immutable<void> {

                constructor(public s: TestSystem) { super(s); }

                run() {

                    this.tell('telltellitcanexit', 'one');
                    this.tell('telltellitcanexit', 'two');
                    this.tell('telltellitcanexit', 'three');
                    this.tell('telltellitcanexit', 'done');
                    this.exit();

                }

            }

            class TellTellItCanExit extends Immutable<string> {

                constructor(
                    public s: TestSystem,
                    public done: (received: string[]) => void) { super(s); }

                received: string[] = [];

                receive() {

                    return [new Case(String, (str: string) => {

                        if (str === 'done')
                            this.done(this.received);
                        else
                            this.received.push(str);

                    })]

                }

            }

            let sys = system();

            sys.spawn({

                id: 'telltellitcanexit',

                create: () => new TellTellItCanExit(sys, received => {

                    setTimeout(() => {

                        assert(received).equate(['one', 'two', 'three']);

                        assert(sys.vm.state.threads['telltellexit']).undefined();

                        done();

                    }, 100);

                })

            });

            sys.spawn({

                id: 'telltellexit',

                create: () => new TellTellExit(sys)

            });

        });

    })

})
