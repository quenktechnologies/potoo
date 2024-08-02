import { expect } from '@jest/globals';

import { TypeCase } from '@quenk/noni/lib/control/match/case';
import { wait } from '@quenk/noni/lib/control/monad/future';

import { PVM } from '../../../../lib/actor/system/vm';

describe('process', () => {
    it('should work', async () => {
        let vm = PVM.create({ log: { level: 'error' } });

        let success = false;

        await vm.spawn(async actor => {
            let process = await vm.spawn({
                id: 'process',
                script: `${__dirname}/ping.js`
            });

            await actor.tell(process, actor.self);

            while (actor.isValid()) {
                await actor.receive([
                    new TypeCase('started', async () => {
                        await actor.tell(process, 'ping');
                    }),

                    new TypeCase('pong', async () => {
                        await actor.tell(process, 'self');
                    }),

                    new TypeCase(process, async () => {
                        await actor.tell(process, 'parent');
                    }),

                    new TypeCase(actor.self, async () => {
                        await actor.tell(process, 'exit');
                    }),

                    new TypeCase('exiting', async () => {
                        await actor.kill(actor.self);
                        success = true;
                    })
                ]);
            }
        });

        await wait(100);

        expect(success).toBe(true);
    });
});
