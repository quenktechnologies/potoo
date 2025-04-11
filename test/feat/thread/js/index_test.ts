import { expect } from '@jest/globals';

import { wait } from '@quenk/noni/lib/control/monad/future';

import { PVM } from '../../../../lib/actor/system/vm';
import { MapAllocator } from '../../../../lib/actor/system/vm/allocator/map';
import { THREAD_STATE_INVALID } from '../../../../lib/actor/system/vm/thread/shared';

describe('js', () => {
    let vm: PVM;

    beforeEach(() => {
        vm = PVM.create();
    });

    afterEach(async () => {
        await vm.stop();
    });

    it('should be able to talk to itself', async () => {
        let success = false;
        await vm.spawn(async actor => {
            await actor.tell(actor.self, 'hello');
            expect(await actor.receive()).toBe('hello');
            success = true;
        });

        await wait(100);
        expect(success).toBe(true);
    });

    it('should not mark itself invalid when killing children', async () => {
        await vm.spawn({
            id: 'parent',
            run: async parent => {
                await parent.spawn({
                    id: 'child',
                    run: async child => {
                        while (child.isValid()) await child.receive();
                    }
                });

                await parent.kill('parent/child');

                while (parent.isValid()) await parent.receive();
            }
        });

        await wait(200);
        let actors = (<MapAllocator>vm.allocator).actors;
        expect(actors.get('parent')).toBeDefined();
        expect(actors.get('parent').thread.state).not.toBe(
            THREAD_STATE_INVALID
        );
        expect(actors.get('parent/child')).not.toBeDefined();
    });
});
