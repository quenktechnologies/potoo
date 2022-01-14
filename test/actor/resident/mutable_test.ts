import { system, TestSystem } from './fixtures/system';
import {
    ShouldWork,
    MutableSelfTalk,
    MutableCrossTalk,
    AsyncReceiverMutable

} from './fixtures/actors';

describe('resident', () => {

    describe('Mutable', () => {

        describe('#select', () => {

            it('should work', done => {

                system()
                    .spawn({
                        id: 'selector',
                        create: s => new ShouldWork(<TestSystem>s, done)
                    });

            })

            it('should be able to talk to itself', done => {

                system()
                    .spawn({
                        id: 'MutableSelfTalk',
                        create: s => new MutableSelfTalk(<TestSystem>s, done)
                    });

            });

        })

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new MutableCrossTalk(<TestSystem>s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new MutableCrossTalk(<TestSystem>s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverMutable(<TestSystem>sys, done)

            });

        });

    })

})
