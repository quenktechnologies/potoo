import { Type } from '@quenk/noni/lib/data/type';
import { empty } from '@quenk/noni/lib/data/array';
import {
    CaseFunction,
    Default,
    Case
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Address, ADDRESS_DISCARD } from '../address';
import { Message } from '../';

const messages: Message[] = [];

/**
 * init should be called as early as possible in the child process if using the
 * direct API (Process).
 *
 * It sets up a listener for incoming messages to the child_process that can
 * be read later via receive() or select().
 */
export const init = () => {
    if (!process.send)
        throw new Error(
            'process: direct API is meant to ' + 'be used in a child process!'
        );

    process.on('message', (m: Message) => {
        messages.unshift(m);
        drain();
    });

    process.on('uncaughtExceptionMonitor', err =>
        (<Function>process.send)(err)
    );
};

/**
 * self provides the address for this child actor.
 */
export const self = process.env.POTOO_ACTOR_ADDRESS || ADDRESS_DISCARD;

/**
 * tell sends a message to another actor in the system using the VM in the
 * parent process.
 */
export const tell = <M>(to: Address, message: M) =>
    (<Function>process.send)({ from: self, to, message });

type Handler = (value: Type) => Promise<void>;

const receivers: Handler[] = [];

const defaultCases = [new Default(identity)];

/**
 * receive the next message in the message queue.
 *
 * TODO: drop messages that do not match any cases.
 */
export const receive = async <T>(cases: Case<T>[] = defaultCases): Promise<T> =>
    new Promise(resolve => {
        let matcher = new CaseFunction(cases || defaultCases);
        let receiver = async (msg: Message) => {
            if (matcher.test(msg)) {
                resolve(await matcher.apply(msg));
            } else {
                receivers.push(receiver);
            }
        };
        receivers.push(receiver);
        drain();
    });

const drain = () => {
    if (!empty(messages) && !empty(receivers))
        (<Handler>receivers.pop())(messages.shift());
};

/**
 * exit the actor, ending the process as a result.
 *
 * This is simply a wrapper around process.exit();
 */
export const exit = () => process.exit();
