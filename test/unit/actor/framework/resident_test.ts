import { TypeCase } from '@quenk/noni/lib/control/match/case';
import { mockDeep } from 'jest-mock-extended';

import {
    AbstractResident,
    Immutable
} from '../../../../lib/actor/framework/resident';
import { Runtime } from '../../../../lib/actor/system/vm/runtime';

describe('resident', () => {
    class Act extends AbstractResident {
        isRunning = false;

        async run() {
            this.isRunning = true;
        }
    }

    let runtime = mockDeep<Runtime>();
    let resident: Act;

    describe('AbstractResident', () => {
        beforeEach(() => {
            resident = new Act(runtime);
        });

        describe('notify', () => {
            it('should call runtime.notify', async () => {
                await resident.notify('msg');

                expect(runtime.notify).toBeCalledWith('msg');
            });
        });

        describe('spawn', () => {
            it('should call runtime.spawn', async () => {
                let child = jest.fn();

                await resident.spawn(child);

                expect(runtime.spawn).toHaveBeenCalledWith(child);
            });
        });

        describe('tell', () => {
            it('should call runtime.tell', async () => {
                await resident.tell('target', 'msg');

                expect(runtime.tell).toHaveBeenCalledWith('target', 'msg');
            });
        });

        describe('raise', () => {
            it('should call runtime.raise', async () => {
                let err = new Error('fail');

                await resident.raise(err);

                expect(runtime.raise).toHaveBeenCalledWith(err);
            });
        });

        describe('kill', () => {
            it('should call runtime.kill', async () => {
                await resident.kill('target');

                expect(runtime.kill).toHaveBeenCalledWith('target');
            });
        });

        describe('exit', () => {
            it('should call runtime.kill', async () => {
                resident.self = '/';

                await resident.exit();

                expect(runtime.kill).toHaveBeenCalledWith('/');
            });
        });

        describe('receive', () => {
            it('should call runtime.receive', async () => {
                let cases = [new TypeCase('test', () => 'test')];

                await resident.receive(cases);

                expect(runtime.receive).toHaveBeenCalledWith(cases);
            });
        });

        describe('start', () => {
            it('should call the run method', async () => {
                await resident.start();

                expect(resident.isRunning).toBe(true);
            });
        });
    });

    class ImAct extends Immutable<Number> {
        isRunning = false;

        selectors = jest.fn(() => [new TypeCase(Number, () => {})]);

        async run() {
            this.isRunning = true;
        }
    }

    describe('Immutable', () => {
        describe('start', () => {
            it('should start receiving', async () => {
                let resident = new ImAct(runtime);

                runtime.isValid.mockReturnValueOnce(true);

                runtime.receive.mockImplementation(
                    () => new Promise(resolve => setTimeout(resolve, 100))
                );

                setTimeout(() => {
                    runtime.isValid.mockReturnValue(false);
                }, 500);

                await resident.start();

                expect(runtime.isValid).toHaveBeenCalled();

                expect(resident.isRunning).toBe(true);

                expect(resident.selectors).toHaveBeenCalled();
            });
        });
    });
});
