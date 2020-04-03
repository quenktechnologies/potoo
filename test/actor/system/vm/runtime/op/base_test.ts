import * as base from '../../../../../../lib/actor/system/vm/runtime/op/base';

import { assert } from '@quenk/test/lib/assert';
import { right } from '@quenk/noni/lib/data/either';

import { INFO_TYPE_FUNCTION } from '../../../../../../lib/actor/system/vm/script';
import { newRuntime } from '../../fixtures/runtime';
import { newFrame } from '../../fixtures/frame';

describe('base', () => {

    describe('nop', () => {

        it('should do nothing', () => {

            let f = newFrame();

            let r = newRuntime();

            base.nop(r, f, 0);

            assert(f.data.length).equal(0);

        })

    })

    describe('pushuint8', function() {

        it('should call Frame#pushUInt8', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushui8(r, f, 12);

            assert(f.mock.getCalledList()).equate(['pushUInt8']);

        })

    })

    describe('pushuint16', function() {

        it('should call Frame#pushUInt16', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushui16(r, f, 0xffff);

            assert(f.mock.getCalledList()).equate(['pushUInt16']);

        })

    })

    describe('pushuint32', function() {

        it('should call Frame#pushUInt32', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushui32(r, f, 0xffffffff);

            assert(f.mock.getCalledList()).equate(['pushUInt32']);

        })

    })

    describe('pushstr', function() {

        it('should call Frame#pushString', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushstr(r, f, 1);

            assert(f.mock.getCalledList()).equate(['pushString']);

        })

    })

    describe('pushsym', function() {

        it('should call Frame#pushSymbol', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushsym(r, f, 1);

            assert(f.mock.getCalledList()).equate(['pushSymbol']);

        })

    })

    describe('dup', function() {

        it('should call Frame#duplicate', () => {

            let f = newFrame();

            let r = newRuntime();

            base.pushsym(r, f, 1);

            assert(f.mock.getCalledList()).equate(['pushSymbol']);

        })

    })

    describe('store', function() {

        it('should store in locals', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnValue('pop', 2);

            base.store(r, f, 1);

            assert(f.locals[1]).equal(2);

        })

    })

    describe('load', function() {

        it('should load from locals', () => {

            let f = newFrame();

            let r = newRuntime();

            f.locals[0] = 1;

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            base.load(r, f, 0);

            assert(f.data).equate([1]);

        })

    })

    describe('ceq', function() {

        it('should push one on true', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnValue('popValue', right(12));

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            base.ceq(r, f, 0);

            assert(f.data).equate([1]);

        })

        it('should push zero on false', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnCallback('popValue', () =>
                right(Math.floor(Math.random() * 1000)));

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            base.ceq(r, f, 0);

            assert(f.data).equate([0]);

        })

    })

    describe('addui32', function() {

        it('should add the top two stack memebers', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnValue('pop', 12);

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            base.addui32(r, f, 0);

            assert(f.data).equate([24]);

        })

        it('should raise an error if the result is > 2^32', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnValue('pop', 0xffffffff2323);

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            base.addui32(r, f, 0);

            assert(f.data).equate([]);

            assert(r.mock.wasCalled('raise'));

        })

    })

    describe('call', () => {

        it('should invoke functions', () => {

            let f = newFrame();

            let r = newRuntime();

            let finfo = {
                infoType: INFO_TYPE_FUNCTION,
                type: 0,
                builtin: false,
                name: 'main',
                foreign: true,
                argc: 1,
                code: [],
                exec: (str: string) => `${str} main`
            };

            f.mock.setReturnValue('popValue', 'hai');

            f.mock.setReturnCallback('push', (v: number) => {

                f.data.push(v);

                return f;

            });

            f.mock.setReturnValue('popFunction', (v: number) => finfo);

            base.addui32(r, f, 0);

            assert(r.mock.wasCalled('call'));

        })

    })

    describe('ret', () => {

        it('should move the top of the stack to the return stack', () => {

            let f = newFrame();

            let r = newRuntime();

            f.mock.setReturnValue('pop', 12);

            f.code = [1, 2];

            base.ret(r, f, 0);

            assert(f.data).equate([]);

            assert(f.rdata).equate([12]);

            assert(f.ip).equal(2);

        })
    })

})
