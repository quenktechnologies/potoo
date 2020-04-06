import * as errors from './error';

import { Err } from '@quenk/noni/lib/control/error';
import { empty } from '@quenk/noni/lib/data/array';
import { map } from '@quenk/noni/lib/data/record';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';

import { Context } from './context';
import { FunInfo } from '../script/info';
import { PVM_Value, Script } from '../script';
import { Platform } from '../';
import { Frame, StackFrame, Data } from './stack/frame';
import { handlers } from './op';
import { Heap, HeapEntry } from './heap';
import { Runtime, OPCODE_MASK, OPERAND_MASK } from './';
import { isGroup, Address, isChild } from '../../../address';
import { Either, right, left } from '@quenk/noni/lib/data/either';

/**
 * Thread is the Runtime implementation for exactly one actor.
 */
export class Thread implements Runtime {

    constructor(
        public vm: Platform,
        public heap: Heap,
        public context: Context,
        public fstack: Frame[] = [],
        public rstack: Data[] = [],
        public sp = 0) { }

    raise(e: Err) {

        ///TODO: Supervision
        if (e instanceof Error) throw e;

        throw new Error(e.message);

    }

    invokeMain(s: Script) {

        this.fstack.push(new StackFrame('main', s, this.context, this.heap,
            s.code.slice()));

    }

    invokeVM(p: Frame, f: FunInfo) {

        let frm = new StackFrame(f.name, p.script, this.context,
            this.heap, f.code.slice());

        for (let i = 0; i <= f.argc; i++)
            frm.push(p.pop());

        this.fstack.push(frm);

        this.sp = this.fstack.length - 1;

    }

    invokeForeign(p: Frame, f: FunInfo, args: PVM_Value[]) {

        //TODO: 
        // 1) Note the type of the heap entry is the function type.
        //    We should add some plumbing for strings, numbers etc.
        // 2) Support async functions.   
        p.push(this.heap.add(new HeapEntry(
            f.type,
            f.builtin,
            <object>(<Function>f.exec).apply(null, args))));

    }

    terminate() {

        let current = this.context.address;

        let maybeChilds = this.vm.getChildren(current);

        if (maybeChilds.isJust()) {

            let childs = maybeChilds.get();

            map(childs, (c, k) => {

                //TODO: async support
                c.context.actor.stop();

                this.vm.remove(k);

            });

        }

        this.heap.release();

        //TODO: async support
        this.context.actor.stop();

        this.vm.remove(current);

    }

    kill(target: Address): Either<Err, void> {

        let self = this.context.address;

        let addrs = isGroup(target) ?
            this.vm.getGroup(target).orJust(() => []).get() : [target];

        let ret: Either<Err, void> = addrs.reduce((p, c) => {

            if (p.isLeft()) return p;

            if ((!isChild(self, c)) && (c !== self))
                return left(new errors.IllegalStopErr(target, c));

            this.vm.kill(c);

            return p;

        }, <Either<Err, void>>right(undefined));

        this.terminate();

        return ret;

    }

    run(): Maybe<PVM_Value> {

        let ret: Maybe<PVM_Value> = nothing();

        while (!empty(this.fstack)) {

            let sp = this.sp;
            let frame = <Frame>this.fstack[sp];

            if (!empty(this.rstack))
                frame.data.push(<Data>this.rstack.pop());

            while (frame.ip < frame.code.length) {

                //execute frame instructions
                //TODO: Push return values unto next fstack

                let next = (frame.code[frame.ip] >>> 0);
                let opcode = next & OPCODE_MASK;
                let operand = next & OPERAND_MASK;

                // TODO: Error if the opcode is invalid, out of range etc.
                handlers[opcode](this, frame, operand);

                frame.ip++;

                //pause execution to allow another frame to compute.
                if (sp !== this.sp) break;

            }

            if (sp === this.sp) {

                //frame complete, pop it, advance the sp and push the return
                //value onto the rstack.

                this.fstack.pop();
                this.sp--;

                this.rstack.push(<Data>frame.data.pop());

                if (empty(this.fstack)) {

                    //provide the TOS value from the rstack to the caller.
                    ret = frame.popValue().toMaybe();

                }

            }

        }

        this.heap.release();

        return ret;

    }

}
