import { expect } from '@jest/globals';
import { Case } from '@quenk/noni/lib/control/match/case';

import { wait } from '@quenk/noni/lib/control/monad/future';

import { PVM } from '../../../../lib/actor/system/vm';

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
                    new Case('ack', () => {
                        success = true;
                    })
                ]);
            }
        });

        await vm.spawn({
            id: 'receiver',
            run: async actor => {
                await actor.receive([
                    new Case('syn', async () => {
                        await actor.tell('sender', 'ack');
                    })
                ]);
            }
        });

        await wait(100);
        expect(success).toBe(true);
    });

    it('should allow a child to talk to its parent in the run method', async () => {
        // This is really about a issue #43

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
                    new Case('hello', () => {
                        success = true;
                    })
                ]);
            }
        });

        await wait(100);

        expect(success).toBe(true);
    });
});
