import { expect } from '@jest/globals';
import { TypeCase } from '@quenk/noni/lib/control/match/case';

import { wait } from '@quenk/noni/lib/control/monad/future';

import { PVM } from '../../../../lib/actor/system/vm';
import { SPAWN_CONCERN_STOPPED } from '../../../../lib/actor/template';

describe('js', () => {
    let vm: PVM;

    beforeEach(() => {
        vm = PVM.create();
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

    it('should allow send, receive, reply', async () => {
        let success = false;

        await vm.spawn({
            id: 'sender',
            run: async actor => {
                await actor.tell('receiver', 'syn');
                await actor.receive([
                    new TypeCase('ack', () => {
                        success = true;
                    })
                ]);
            }
        });

        await vm.spawn({
            id: 'receiver',
            run: async actor => {
                await actor.receive([
                    new TypeCase('syn', async () => {
                        await actor.tell('sender', 'ack');
                    })
                ]);
            }
        });

        await wait(100);
        expect(success).toBe(true);
    });

    it('should allow a child to talk to its parent in the run method', async () => {
        // This is really about issue #43

        let success = false;

        await vm.spawn({
            id: 'parent',
            run: async parent => {
                await parent.spawn({
                    id: 'child',
                    run: async child => {
                        await child.tell(parent.self, 'hello');
                    }
                });
                await parent.receive([
                    new TypeCase('hello', () => {
                        success = true;
                    })
                ]);
            }
        });

        await wait(100);

        expect(success).toBe(true);
    });

    it('should work with function actors', async () => {
        let packs: number[] = [];
        await vm.spawn({
            id: 'parent',
            spawnConcern: SPAWN_CONCERN_STOPPED,
            run: async thr0 => {
                packs.push(1);
                await thr0.spawn(async thr1 => {
                    packs.push(2);
                    await thr1.spawn(async () => {
                        packs.push(3);
                    });
                    await wait(100);
                });
                await wait(100); // waits needed to stop parent exit.
                packs.push(4);
            }
        });
        expect(packs).toEqual([1, 2, 3, 4]);
    });
});
