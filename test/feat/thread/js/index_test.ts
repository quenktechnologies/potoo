import { expect } from '@jest/globals';

import { wait } from '@quenk/noni/lib/control/monad/future';

import { PVM } from '../../../../lib/actor/system/vm';

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
});
