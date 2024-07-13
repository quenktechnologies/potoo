import { expect } from '@jest/globals';

import { identity } from '@quenk/noni/lib/data/function';

import { fromSpawnable } from '../../../lib/actor/template';

describe('template', () => {
    describe('fromSpawnable', () => {
        it('should work with a template', () => {
            const template = { id: 'root', script: 'ping.js' };

            expect(fromSpawnable(template)).toEqual(template);
        });

        it('should infer functions', () => {
            const create = identity;
            expect(fromSpawnable(create)).toEqual({ create });

            const run = async () => {};
            expect(fromSpawnable(run)).toEqual({ run });
        });
    });
});
