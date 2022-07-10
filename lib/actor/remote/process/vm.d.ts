import { Conf } from '../../system/vm/conf';
import { PVM } from '../../system/vm';
import { Message } from '../../message';
import { Address } from '../../address';
import { Instance } from '../..';
/**
 * PPVM (Process PVM) is an implementation of PVM specific for child processes.
 */
export declare class PPVM extends PVM {
    static getInstance(conf?: Partial<Conf>): PPVM;
    /**
     * main method invoked by the default script.
     *
     * This installs handlers for "uncaughtExceptionMonitor" and "message",
     * forwading uncaught errors to the parent VM and inbound messages to the
     * correct actors.
     */
    static main(): void;
    /**
     * identify overridden here to provide the address of the parent actor in the
     * main process for this VM.
     *
     * This will ensure all actors spawned here begin with that actor's address.
     */
    identify(ins: Instance): import("@quenk/noni/lib/data/maybe").Maybe<string>;
    /**
     * sendMessage overridden here to allow messages for actors not within this
     * system to sent upstream.
     */
    sendMessage(to: Address, from: Address, msg: Message): boolean;
}
