import { assert } from '@quenk/test/lib/assert';

import { system } from './fixtures/system';
import { SomeCallback } from './fixtures/actors';

describe('resident', () => {

    describe('Callback', () => {

        it('should exit after a successful message', done => {

            let s = system();

            let wasCalled = false;

            let cb = (msg: string) => {

                assert(msg).equal('done');

                wasCalled = true;

            }

            s.spawn({ id: 'cb', create: () => new SomeCallback(s, cb) });

            s.vm.tell('cb', 'done');

            setTimeout(() => {

                assert(wasCalled).true();

                assert(s.vm.actors.items['cb'], 'callback actor').undefined();

                done();

            }, 100);

        });

    });

})
