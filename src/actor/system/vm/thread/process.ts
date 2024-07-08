import { resolve } from 'path';
import { ChildProcess, fork } from 'child_process';

import { Err } from '@quenk/noni/lib/control/err';
import { Path } from '@quenk/noni/lib/data/record/path';
import { Any, test } from '@quenk/noni/lib/data/type';

import { Address } from '../../../address';
import { Message } from '../../..';
import { Platform } from '../';
import { Thread } from '.';

export const CTRL_MSG_RAISE = 9;
export const CTRL_MSG_SEND = 1;
export const CTRL_MSG_DROP = 3;

const shapes = {
    raise: {
        code: CTRL_MSG_RAISE,

        src: String,

        dest: String,

        message: String,

        stack: String
    },

    send: {
        to: String,

        from: String,

        message: Any
    },

    drop: {
        code: CTRL_MSG_DROP,

        from: String,

        to: String,

        message: Any
    }
};

/**
 * ProcessThread is used for actors created via ChildProcess instances.
 *
 * The child process script is treated as a single actor as far as the VM is
 * concerned.
 */
export class ProcessThread implements Thread {
    constructor(
        public vm: Platform,
        public process: ChildProcess,
        public address: Address
    ) {}

    /**
     * create a new ProcessThread instance using the provided script path for
     * the ChildProcess creation.
     *
     * The child process will have access to the following environment variables:
     *
     * 1. POTOO_ACTOR_ADDRESS   The full address of the actor in the parent VM.
     */
    static create(vm: Platform, address: Address, script: Path): ProcessThread {
        let cp = fork(resolve(script), {
            env: { POTOO_ACTOR_ADDRESS: address }
        });

        let thread = new ProcessThread(vm, cp, address);

        return thread;
    }

    async notify(msg: Message) {
        this.process.send(msg);
    }

    async raise(err: Err) {
        await this.vm.errors.raise(this, err);
    }

    /**
     * start the ProcessThread.
     *
     * The following event handlers are installed on the child process:
     *
     * 1. "error"   - will raise through the error handling machinery.
     * 2. "message  - will forward messages in the correct format from the child
     *                process to other actors in the system.
     * 3. "exit"    - will signal to the VM to kill this actor.
     */
    async start() {
        let { vm, address } = this;

        let cp = this.process;

        cp.on('error', (err: Error) => this.raise(err));

        if (cp.stderr)
            cp.stderr.on('data', data => console.error(`${address}: ${data}`));

        if (cp.stdout)
            cp.stdout.on('data', data => console.log(`${address}: ${data}`));

        cp.on('message', async (m: Message) => {
            if (test(shapes.raise, m)) {
                let { message, stack } = m;
                let err = new Error(message);

                err.stack = stack;
                this.raise(err);
            } else if (test(shapes.send, m)) {
                let { to, message } = m;
                await vm.sendMessage(this, to, message);
            } else {
                //TODO: Publish drop event.
            }
        });

        cp.on('exit', () => {
            vm.sendKillSignal(this, address);
        });
    }

    async stop() {
        this.process.kill();
    }
}
