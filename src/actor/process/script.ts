import { match } from '@quenk/noni/lib/control/match';
import { isString, Any } from '@quenk/noni/lib/data/type';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { rmerge } from '@quenk/noni/lib/data/record';
import { parse } from '@quenk/noni/lib/data/json';

import { Tell } from '../resident/scripts';
import { RAISE, SEND } from '../system/vm/runtime/op';
import { EVENT_SEND_FAILED } from '../system/vm/event';
import { PTValue } from '../system/vm/type';
import { Script } from '../system/vm/script';
import { Conf } from '../system/vm/conf';
import { PVM } from '../system/vm';
import { Message } from '../message';
import { Address } from '../address';
import { Instance } from '../';

//ENV vars:
//POTOO_ACTOR_ID
//POTOO_ACTOR_ADDRESS
//POTOO_PVM_CONF

class Sys {

    vm = PVM.create(this, rmerge(getConf(), {

        on: {

            [EVENT_SEND_FAILED]: (
                from: Address,
                _: string,
                to: Address,
                message: Message) => (<Function>process.send)({

                    code: SEND,
                    to,
                    from,
                    message

                })

        }

    }));

    exec(i: Instance, s: Script) {

        this.vm.exec(i, s);

    }

    execNow(i: Instance, s: Script): Maybe<PTValue> {

        return this.vm.execNow(i, s);

    }

}

const id = <string>process.env.POTOO_ACTOR_ID;

const address = <string>process.env.POTOO_ACTOR_ADDRESS;

const tellShape = {

    to: String,

    from: String,

    message: Any

}

const defaultConf = {};

const getConf = (): Partial<Conf> => {

    if (isString(process.env.POTOO_PVM_CONF)) {

        let econf = parse(process.env.POTOO_PVM_CONF);

        if (econf.isRight()) return <Partial<Conf>>econf.takeRight();

    }

    return defaultConf;

}

const main = () => {

    let sys = new Sys();

    process.on('uncaughtException', e => {

        (<Function>process.send)({

            code: RAISE,
            error: e.stack,
            src: address,
            dest: address

        })

        process.exit(-1);

    });

    sys.vm.spawn({

        id,

        create: s => {

            //TODO: Handle invalid messages?
            process.on('message', (m: Message) =>
                match(m)
                    .caseOf(tellShape, filterTell(sys.vm))
                    .orElse(() => { })
                    .end());

            return require(<string>process.env.POTOO_ACTOR_MODULE).create(s);

        }

    });

}

const filterTell = (vm: PVM) =>
    ({ to, message }: { to: string, from: string, message: Message }) =>
        vm.exec(vm, new Tell(to, message));

main();
