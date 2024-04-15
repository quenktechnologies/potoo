import { match } from '@quenk/noni/lib/control/match';
import { noop } from '@quenk/noni/lib/data/function';

import { Template } from '../../template';
import { PVM } from '../../system/vm';
import { Message } from '../../message';
import { Address } from '../../address';
import { Raise, Send, shapes } from '..';
import { Thread } from '../../system/vm/thread';

const REMOTE_ADDRESS = <string>process.env.POTOO_ACTOR_ADDRESS;

/**
 * PPVM (Process PVM) is an implementation of PVM specific for child processes.
 *
 * @deprecated - Will be replaced by peering in the future.
 */
export class PPVM extends PVM {
    static getInstance() {
        let vm: PPVM = new PPVM();

        return vm;
    }

    /**
     * main method invoked by the default script.
     *
     * This installs handlers for "uncaughtExceptionMonitor" and "message",
     * forwading uncaught errors to the parent VM and inbound messages to the
     * correct actors.
     */
    static main() {
        process.on('uncaughtExceptionMonitor', e =>
            (<Function>process.send)(
                new Raise(REMOTE_ADDRESS, REMOTE_ADDRESS, e.message, e.stack)
            )
        );

        let vm = PPVM.getInstance();

        //XXX: Envelope vs Send type needs to be sorted out.
        process.on('message', (m: Message) =>
            match(m)
                .caseOf(
                    shapes.send,
                    (msg: { to: string; from: string; message: object }) => {
                        vm.tell(msg.to, msg.message);
                    }
                )
                .orElse(noop)
                .end()
        );

        let template = require(<string>process.env.POTOO_ACTOR_MODULE)(vm);

        template = Array.isArray(template) ? template : [template];

        template.forEach((tmpl: Template) => vm.spawn(tmpl));
    }

    /**
     * sendMessage overridden here to allow messages for actors not within this
     * system to sent upstream.
     */
    sendMessage(to: Thread, from: Address, msg: Message) {
        if (
            !to.address.startsWith(
                <Address>process.env.POTOO_ACTOR_ADDRESS
            )
        ) {
            (<Function>process.send)(new Send(to.address, from, msg));
            //TODO: This is a blatant lie because we have no idea of knowing if
            // the actor exists.
            return true;
        } else {
            return super.sendMessage(to, from, msg);
        }
    }
}
