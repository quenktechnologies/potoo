import { match } from '@quenk/noni/lib/control/match';
import { isString } from '@quenk/noni/lib/data/type';
import { rmerge } from '@quenk/noni/lib/data/record';
import { parse } from '@quenk/noni/lib/data/json';
import { noop } from '@quenk/noni/lib/data/function';
import { fromNullable } from '@quenk/noni/lib/data/maybe';

import { Template } from '../../template';
import { Conf } from '../../system/vm/conf';
import { PVM } from '../../system/vm';
import { Message } from '../../message';
import { Address } from '../../address';
import { Instance } from '../..';
import { Raise, Send, shapes } from '..';

const REMOTE_ADDRESS = <string>process.env.POTOO_ACTOR_ADDRESS;

/**
 * PPVM (Process PVM) is an implementation of PVM specific for child processes.
 */
export class PPVM extends PVM {

    static getInstance(conf: Partial<Conf> = {}) {

        let vm: PPVM = new PPVM({ getPlatform() { return vm; } },
            <Conf>rmerge(getConf(), conf));

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
            (<Function>process.send)(new Raise(REMOTE_ADDRESS, REMOTE_ADDRESS,
                e.message, e.stack)));

        let vm = PPVM.getInstance();

        //XXX: Envelope vs Send type needs to be sorted out.
        process.on('message', (m: Message) =>
            match(m)
                .caseOf(shapes.send,
                    (msg: { to: string, from: string, message: object }) => {
                        vm.tell(msg.to, msg.message);
                    })
                .orElse(noop)
                .end());

        let template = require(<string>process.env.POTOO_ACTOR_MODULE)(vm);

        template = Array.isArray(template) ? template : [template];

        template.forEach((tmpl: Template) => vm.spawn(vm, tmpl));

    }

    /**
     * identify overridden here to provide the address of the parent actor in the
     * main process for this VM.
     *
     * This will ensure all actors spawned here begin with that actor's address.
     */
    identify(ins: Instance) {

        if (ins === this)
            return fromNullable(<Address>process.env.POTOO_ACTOR_ADDRESS);

        return super.identify(ins);

    }

    /**
     * sendMessage overridden here to allow messages for actors not within this
     * system to sent upstream.
     */
    sendMessage(to: Address, from: Address, msg: Message): boolean {

        if (!to.startsWith(<Address>process.env.POTOO_ACTOR_ADDRESS)) {

            (<Function>process.send)(new Send(to, from, msg))
            //TODO: This is a blatant lie because we have no idea of knowing if 
            // the actor exists.
            return true;

        } else {

            return super.sendMessage(to, from, msg);

        }

    }

}

const getConf = (): Partial<Conf> => {

    if (isString(process.env.POTOO_PVM_CONF)) {

        let econf = parse(process.env.POTOO_PVM_CONF);

        if (econf.isRight()) return <Partial<Conf>>econf.takeRight();

    }

    return {};

}
