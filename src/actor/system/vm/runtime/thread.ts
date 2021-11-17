import { Err } from '@quenk/noni/lib/control/error';
import { empty } from '@quenk/noni/lib/data/array';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Future, pure } from '@quenk/noni/lib/control/monad/future';

import { Address } from '../../../address';
import { FunInfo, ForeignFunInfo } from '../script/info';
import { Script } from '../script';
import { Platform } from '../';
import { Frame, StackFrame, Data } from './stack/frame';
import { handlers } from './op';
import { Context } from './context';
import {
    Runtime,
    OPCODE_MASK,
    OPERAND_MASK
} from './';
import { PTValue } from '../type';

/**
 * Thread is the Runtime implementation for exactly one actor.
 */
export class Thread implements Runtime {

    constructor(
        public vm: Platform,
        public context: Context,
        public fstack: Frame[] = [],
        public sp = 0) { }


    /**
     * rp is the return pointer used to pass values between frames.
     */
    rp: Data = 0;

    raise(e: Err) {

        this.vm.raise(this.context.address, e);

    }

    invokeVM(p: Frame, f: FunInfo) {

        let frm = new StackFrame(f.name, p.script, this, f.code.slice());

        for (let i = 0; i < f.argc; i++)
            frm.push(p.pop());

        this.fstack.push(frm);

        this.sp = this.fstack.length - 1;

    }

    invokeForeign(p: Frame, f: ForeignFunInfo, args: PTValue[]) {

        //TODO: Support async functions.   

        let val = f.exec.apply(null, [this, ...args]);

        p.push(this.vm.heap.getAddress(val));

    }

    die(): Future<void> {

        return <Future<void>>pure(undefined)
            .chain(() => {

                let ret = this.context.actor.stop();

                return (ret != null) ?
                    <Future<void>>ret :
                    pure(<void>undefined);

            })
            .chain(() => {

                return pure(<void>undefined);

            });

    }

    kill(target: Address): void {

        this.vm.runTask(this.context.address,
            this.vm.kill(this.context.address, target));

    }

    exec(s: Script): Maybe<PTValue> {

        this.fstack.push(new StackFrame('main', s, this, s.code.slice()));

        return this.run();

    }

    runTask(ft: Future<void>) {

        return this.vm.runTask(this.context.address, ft);

    }

    run(): Maybe<PTValue> {

        let ret: Maybe<PTValue> = nothing();

        while (!empty(this.fstack)) {

            let sp = this.sp;
            let frame = <Frame>this.fstack[sp];

            if (this.rp != 0) {

                frame.data.push(this.rp);

                this.rp = 0;

            }

            while (!frame.isFinished()) {

                //execute frame instructions
                //TODO: Push return values unto next fstack

                let pos = frame.getPosition();
                let next = (frame.code[pos] >>> 0);
                let opcode = next & OPCODE_MASK;
                let operand = next & OPERAND_MASK;

                this.vm.logOp(this, frame, opcode, operand);

                // TODO: Error if the opcode is invalid, out of range etc.
                handlers[opcode](this, frame, operand);

                if (pos === frame.getPosition())
                    frame.advance();

                //pause execution to allow another frame to compute.
                if (sp !== this.sp) break;

            }

            if (sp === this.sp) {

                //frame complete, pop it, advance the sp and set the rp value.

                this.fstack.pop();
                this.sp--;
                this.rp = <Data>frame.data.pop() || 0;
                //this.vm.gc.frameRemoved(this, <StackFrame>frame);

                if (empty(this.fstack)) {

                    //provide the return pointer value to the caller.
                    ret = frame.resolve(this.rp).toMaybe();

                }

            }

        }

        this.sp = 0;

        this.vm.gc.reclaim();

        return ret;

    }

}
