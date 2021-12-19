import * as base from '../../../../../../lib/actor/system/vm/runtime/op/base';

import { assert } from '@quenk/test/lib/assert';
import { right } from '@quenk/noni/lib/data/either';

import { newThread } from '../../fixtures/thread';
import { newFrame } from '../../fixtures/frame';

describe('base', () => {

    describe('nop', () => {

        it('should do nothing', () => {

            let f = newFrame();

            let r = newThread();

            base.nop(r, f, 0);

            assert(f.data.length).equal(0);

        })

    })

    describe('pushui8', function() {

        it('should call Frame#pushUInt8', () => {

            let f = newFrame();

            let r = newThread();

            base.pushui8(r, f, 12);

            assert(f.mock.getCalledList()).equate(['pushUInt8']);

        })

    })

    describe('pushui16', function() {

        it('should call Frame#pushUInt16', () => {

            let f = newFrame();

            let r = newThread();

            base.pushui16(r, f, 0xffff);

            assert(f.mock.getCalledList()).equate(['pushUInt16']);

        })

    })

    describe('pushui32', function() {

        it('should call Frame#pushUInt32', () => {

            let f = newFrame();

            let r = newThread();

            base.pushui32(r, f, 0xffffffff);

            assert(f.mock.getCalledList()).equate(['pushUInt32']);

        })

    })

    describe('lds', function() {

        it('should call Frame#pushString', () => {

            let f = newFrame();

            let r = newThread();

            base.lds(r, f, 1);

            assert(f.mock.getCalledList()).equate(['pushString']);

        })

    })

    describe('ldn', function() {

        it('should call Frame#pushName', () => {

            let f = newFrame();

            let r = newThread();

            base.ldn(r, f, 1);

            assert(f.mock.getCalledList()).equate(['pushName']);

        })

    })

    describe('dup', function() {

        it('should call Frame#duplicate', () => {

            let f = newFrame();

            let r = newThread();

            base.dup(r, f, 1);

            assert(f.mock.getCalledList()).equate(['duplicate']);

        })

    })

    describe('store', function() {

        it('should store in locals', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('pop', 2);

            base.store(r, f, 1);

            assert(f.locals[1]).equal(2);

        })

    })

    describe('load', function() {

        it('should load from locals', () => {

            let f = newFrame();

            let r = newThread();

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

            let r = newThread();

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

            let r = newThread();

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

        it('should add the top two stack members', () => {

            let f = newFrame();

            let r = newThread();

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

            let r = newThread();

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

            let r = newThread();

            let finfo = {
                type: 0,
                builtin: false,
                name: 'main',
                foreign: true,
                argc: 1,
                code: [],
                exec: (_: any, str: string) => `${str} main`
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

    describe('raise', () => {

        it('should raise exceptions', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnCallback('popString', () => right('err'));

            base.raise(r, f, 0);

            assert(r.mock.getCalledArgs('raise')[0].message).equate('err');

        });

    })

    describe('jmp', () => {

        it('should adjust the ip', () => {

            let f = newFrame();

            let r = newThread();

            base.jmp(r, f, 6);

            assert(f.mock.wasCalledWith('seek', [6])).true();

        });

    });

    describe('ifzjmp', () => {

        it('should jump if TOS is 0', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popValue', right(0));

            base.ifzjmp(r, f, 12);

            assert(f.mock.wasCalledWith('seek', [12])).true();

        });

        it('should not jump if TOS is not 0', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popValue', right(1));

            base.ifzjmp(r, f, 12);

            assert(f.mock.wasCalled('seek')).false();

        })

    });

    describe('ifnzjmp', () => {

        it('should not jump if TOS is 0', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popValue', right(0));

            base.ifnzjmp(r, f, 12);

            assert(f.mock.wasCalled('seek')).false();

        });

        it('should jump if TOS is not 0', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popValue', right(1));

            base.ifnzjmp(r, f, 12);

            assert(f.mock.wasCalledWith('seek', [12])).true();

        })

    });

    describe('ifeqjmp', () => {

        it('should jump if top 2 items are strictly equal', () => {

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnValue('popValue', right(1));

            base.ifeqjmp(r, f, 12);

            assert(f.mock.wasCalledWith('seek', [12])).true();

        });

        it('should not jump if top 2 items are not strictly equal', () => {

            let items = [1, '1'];

            let f = newFrame();

            let r = newThread();

            f.mock.setReturnCallback('popValue', () => right(items.pop()));

            base.ifeqjmp(r, f, 12);

            assert(f.mock.wasCalled('seek')).false();

        })

    });

    describe('ifneqjmp', () => {

        it('should jump if top 2 items are not strictly equal', () => {

            let items = [1, '1'];
            let f = newFrame();
            let r = newThread();

            f.mock.setReturnCallback('popValue', () => right(items.pop()));

            base.ifneqjmp(r, f, 12);

            assert(f.mock.wasCalledWith('seek', [12])).true();

        });

        it('should not jump if top 2 items are strictly equal', () => {


            let f = newFrame();
            let r = newThread();

            f.mock.setReturnCallback('popValue', () => right(1));

            base.ifneqjmp(r, f, 12);

            assert(f.mock.wasCalled('seek')).false();

        })

    });

})
