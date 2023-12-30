import { assert as expect } from '@quenk/test/lib/assert';

import { Registry } from '../../../../../src/actor/system/vm/runtime/registry';

describe('Registry', () => {
    describe('add', () => {
        it('should create an address using the type', () => {
            let reg = new Registry(100);
            let addr = reg.add('test');
            expect(addr).equal(101);
            expect(reg.values.get(addr)).equal('test');
            expect(reg.refCounts.get(addr)).equal(0);
            expect(reg.deadValues.length).equal(0);
        });
    });

    describe('get', () => {
        it('should provide the value stored in the registry', () => {
            let reg = new Registry(100);
            let value = { n: 1 };
            let addr = reg.add(value);
            expect(reg.get(addr).get()).equal(value);
        });

        it('should not provide non-existant values', () => {
            let reg = new Registry(100);
            expect(reg.get(100).isNothing()).true();
        });
    });

    describe('increment', () => {
        it('should increment the ref count', () => {
            let reg = new Registry(100);
            let value = { n: 1 };
            let addr = reg.add(value);
            expect(reg.refCounts.get(addr)).equal(0);
            reg.increment(addr);
            expect(reg.refCounts.get(addr)).equal(1);
        });
    });

    describe('decrement', () => {
        it('should decrease the ref count', () => {
            let reg = new Registry(100);
            let value = { n: 1 };
            let addr = reg.add(value);
            reg.increment(addr);
            reg.increment(addr);
            reg.decrement(addr);
            expect(reg.refCounts.get(addr)).equal(1);
        });

        it('should mark dead objects', () => {
            let reg = new Registry(100);
            let addr = reg.add({ n: 1 });
            reg.increment(addr);
            reg.increment(addr);
            reg.increment(addr);
            reg.decrement(addr);
            reg.decrement(addr);
            reg.decrement(addr);
            expect(reg.refCounts.get(addr)).equal(0);
            expect(reg.deadValues.length).equal(1);
            expect(reg.deadValues[0]).equal(addr);
        });

        it('should not decrease past zero', () => {
            let reg = new Registry(100);
            let addr = reg.add('test');
            reg.decrement(addr);
            expect(reg.refCounts.get(addr)).equal(0);
        });
    });

    describe('purge', () => {
        it('should remove dead objects', () => {
            let reg = new Registry(100);

            let addr1 = reg.add({ n: 1 });
            reg.increment(addr1);

            let addr2 = reg.add({ n: 2 });

            let addr3 = reg.add({ n: 3 });
            reg.increment(addr3);

            reg.decrement(addr1);

            reg.purge();
            expect(reg.values.size).equal(2);
            expect(reg.refCounts.size).equal(2);
            expect(reg.deadValues.length).equal(0);
            expect(reg.values.get(addr1)).undefined();
            expect(reg.refCounts.get(addr1)).undefined();
            expect(reg.values.get(addr2)).equate({ n: 2 });
            expect(reg.refCounts.get(addr2)).equal(0);
            expect(reg.values.get(addr3)).equate({ n: 3 });
            expect(reg.refCounts.get(addr3)).equal(1);
        });
    });
});
