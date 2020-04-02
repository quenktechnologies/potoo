import { empty } from '@quenk/noni/lib/data/array';
import { Err } from '@quenk/noni/lib/control/error';

import { Context } from '../../../context';
import { Address } from '../../../address';
import { Frame, StackFrame } from './stack/frame';
import { FunInfo } from '../script/info';
import { PVM_Value } from '../script';
import { Platform } from '../';
import { handlers } from './op';
import { Heap, HeapEntry } from './heap';
import { Runtime, OPCODE_MASK, OPERAND_MASK } from './';

/**
 * Proc is a Runtime implementation for exactly one actor.
 */
export class Proc implements Runtime {

    constructor(
        public vm: Platform,
        public heap: Heap,
        public context: Context,
        public self: Address,
        public stack: Frame[] = [],
        public sp = 0) { }

    raise(_: Err) {


    }

    call(c: Frame, f: FunInfo, args: PVM_Value[]) {

        if (f.foreign) {

            //Todo: Note the type of the heap entry is the function type.
            //We should add some plumbing for strings, numbers etc.
            c.push(this.heap.add(new HeapEntry(
                f.type,
                f.builtin,
                <object>(<Function>f.exec).apply(null, args))));

        } else {

            this.stack.push(new StackFrame(
                f.name,
                c.script,
                this.context,
                this.heap,
                f.code.slice()));

            this.sp = this.stack.length - 1;

        }

    }

    run() {

        while (!empty(this.stack)) {

            let sp = this.sp;
            let frame = <Frame>this.stack[sp];

            while (frame.ip < frame.code.length) {

                //execute frame instructions
                //TODO: Push return values unto next stack

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

                //frame complete, pop it, advance the sp and pass any return
                //value to the previous frame.

                this.stack.pop();
                this.sp--;

                if (frame.rdata.length > 0)
                    if (this.stack[this.sp])
                        this.stack[this.sp].data.push(<number>frame.rdata.pop());

            }

        }

    }

}