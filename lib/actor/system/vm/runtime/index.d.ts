import * as template from '../../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Contexts, Context, ErrorHandler } from '../../../context';
import { Message } from '../../../message';
import { Address } from '../../../address';
import { Configuration } from '../../configuration';
import { Frame } from './stack/frame';
import { Script, PVM_Value } from '../script';
import { PVM } from '../';
import { System } from '../../';
/**
 * Opcode
 */
export declare type Opcode = number;
/**
 * Operand
 */
export declare type Operand = OperandU8 | OperandU16;
/**
 * OperandU8
 */
export declare type OperandU8 = number;
/**
 * OperandU16
 */
export declare type OperandU16 = number;
/**
 * Instruction
 */
export declare type Instruction = number;
export declare const OPCODE_MASK = 4278190080;
export declare const OPERAND_MASK = 16777215;
export declare const OPCODE_RANGE_START = 16777216;
export declare const OPCODE_RANGE_END = 2130706432;
export declare const OPERAND_RANGE_START = 0;
export declare const OPERAND_RANGE_END = 16777215;
export declare const MAX_INSTRUCTION = 2147483647;
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
    allocate(self: Address, t: template.Template<System>): Context;
    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>;
    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Runtime;
    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime;
    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Runtime;
}
export interface Runtimex extends ErrorHandler {
    /**
     * self is the address of the actor.
     */
    self: Address;
    /**
     * config provides the system configuration.
     */
    config(): Configuration;
    /**
     * exec a Script on behalf of the actor.
     */
    exec(s: Script): Maybe<PVM_Value>;
    /**
     * current provides the Frame currently being executed (if any).
     */
    current(): Maybe<Frame>;
    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<System>): Context;
    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>;
    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>;
    /**
     * getGroup attemps to retreive all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>;
    /**
     * getChildren provides the children context's for an address.
     */
    getChildren(addr: Address): Maybe<Contexts>;
    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Runtime;
    /**
     * removeContext from the system.
     */
    removeContext(addr: Address): Runtime;
    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime;
    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Runtime;
    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Runtime;
    /**
     * removeMember from a group.
     */
    removeMember(group: string, addr: Address): Runtime;
    /**
     * push a new Frame onto the stack, triggering
     * its execution.
     */
    push(f: Frame): Runtime;
    /**
     * clear all Frames from the stack, thus ending
     * current execution.
     */
    clear(): Runtime;
    /**
     * drop a Message
     */
    drop(m: Message): Runtime;
}
/**
 * This is a Runtime implementation for exactly one actor.
 */
export declare class This<S extends System> implements Runtime {
    vm: PVM<S>;
    self: Address;
    stack: Frame[];
    constructor(vm: PVM<S>, self: Address, stack?: Frame[]);
    raise(_: Err): void;
    allocate(addr: Address, t: template.Template<System>): Context;
    getContext(addr: Address): Maybe<Context>;
    putContext(addr: Address, ctx: Context): This<S>;
    putRoute(target: Address, router: Address): This<S>;
    putMember(group: string, addr: Address): This<S>;
    run(): void;
}
