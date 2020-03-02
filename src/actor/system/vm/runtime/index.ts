import * as template from '../../../template';

import { Err } from '@quenk/noni/lib/control/error';
import { empty } from '@quenk/noni/lib/data/array';
import { Maybe } from '@quenk/noni/lib/data/maybe'

import { Contexts, Context, ErrorHandler, newContext } from '../../../context';
import { Message } from '../../../message';
import { Address } from '../../../address';
import {
    get,
    put,
    putRoute,
    putMember,
} from '../../state';
import { Configuration } from '../../configuration';
import { Frame } from './stack/frame';
import { Script, PVM_Value } from '../script';
import { PVM } from '../';
import { System } from '../../';
import { opcodeHandlers } from './op';

/**
 * Opcode
 */
export type Opcode = number;

/**
 * Operand
 */
export type Operand = OperandU8 | OperandU16;

/**
 * OperandU8
 */
export type OperandU8 = number;

/**
 * OperandU16
 */
export type OperandU16 = number;

/**
 * Instruction
 */
export type Instruction = number;

export const OPCODE_MASK = 0xFF000000;
export const OPERAND_MASK = 0x00FFFFFF;
export const OPCODE_RANGE_START = 0x1000000;
export const OPCODE_RANGE_END = 0x7F000000;
export const OPERAND_RANGE_START = 0x0;
export const OPERAND_RANGE_END = 0xffffff;
export const MAX_INSTRUCTION = 0x7FFFFFFF;

/**
 * Runtime is responsible for executing the instructions an actor's script
 * requests.
 *
 * It also allows for appropriate access to the rest of the system.
 */
export interface Runtime extends ErrorHandler {

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<System>): Context

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>

    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Runtime

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime

    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Runtime

}

export interface Runtimex extends ErrorHandler {

    /**
     * self is the address of the actor.
     */
    self: Address

    /**
     * config provides the system configuration.
     */
    config(): Configuration

    /**
     * exec a Script on behalf of the actor.
     */
    exec(s: Script): Maybe<PVM_Value>

    /**
     * current provides the Frame currently being executed (if any).
     */
    current(): Maybe<Frame>

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<System>): Context

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>

    /**
     * getGroup attemps to retreive all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>

    /**
     * getChildren provides the children context's for an address.
     */
    getChildren(addr: Address): Maybe<Contexts>

    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Runtime

    /**
     * removeContext from the system.
     */
    removeContext(addr: Address): Runtime

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime

    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Runtime

    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Runtime

    /**
     * removeMember from a group.
     */
    removeMember(group: string, addr: Address): Runtime;

    /**
     * push a new Frame onto the stack, triggering
     * its execution.
     */
    push(f: Frame): Runtime

    /**
     * clear all Frames from the stack, thus ending
     * current execution.
     */
    clear(): Runtime

    /**
     * drop a Message
     */
    drop(m: Message): Runtime

}

/**
 * This is a Runtime implementation for exactly one actor.
 */
export class This<S extends System> implements Runtime {

    constructor(
        public vm: PVM<S>,
        public self: Address,
        public stack: Frame[] = []) { }

    raise(_: Err): void {

        //TODO: implement

    }

    allocate(addr: Address, t: template.Template<System>): Context {

        let h = new This(this.vm, addr);
        let args = Array.isArray(t.args) ? t.args : [];
        let act = t.create(this.vm.system, ...args);

        //TODO: review instance init.
        return newContext(h, act, t);

    }

    getContext(addr: Address): Maybe<Context> {

        return get(this.vm.state, addr);

    }

    putContext(addr: Address, ctx: Context): This<S> {

        this.vm.state = put(this.vm.state, addr, ctx);
        return this;

    }

    putRoute(target: Address, router: Address): This<S> {

        putRoute(this.vm.state, target, router);
        return this;

    }

    putMember(group: string, addr: Address): This<S> {

        putMember(this.vm.state, group, addr);
        return this;

    }

    run(): void {

        while (!empty(this.stack)) {

            let frame = <Frame>this.stack.pop();

            while (frame.ip !== frame.code.length) {

                //execute frame instructions
                //TODO: Push return values unto next stack

                let next = frame.code[frame.ip];
                let opcode = next & OPCODE_MASK;
                let operand = next & OPERAND_MASK;

                // TODO: Error if the opcode is invalid, out of rangeetc.
                opcodeHandlers[opcode](this, frame, operand);

                frame.ip++;

            }

        }

    }

}
