import { match } from '@quenk/noni/lib/control/match';
import { Any } from '@quenk/noni/lib/data/type';
import { OP_CODE_TELL, OP_CODE_RAISE } from '../system/vm/op';
import { system } from '../system/framework/default';
import { System } from '../system';
import { DropScript, TellScript } from '../resident/scripts';
import { Message } from '../message';
import { Envelope } from '../mailbox';

const id = <string>process.env.POTOO_ACTOR_ID;

const address = <string>process.env.POTOO_ACTOR_ADDRESS;

const tellShape = {

    to: String,

    from: String,

    message: Any

}

const sys = system({

    hooks: {

        drop: ({ to, from, message }: Envelope) => (<Function>process.send)({

            code: OP_CODE_TELL,
            to,
            from,
            message

        })

    }

});

const filter = (s: System) => (m: Message) =>
    match(m)
        .caseOf(tellShape, filterTell(s))
        .orElse(fitlerDrop(s))
        .end();

const filterTell = (s: System) =>
    ({ to, message }: { to: string, from: string, message: Message }) =>
        s.exec(s, new TellScript(to, message));

const fitlerDrop = (s: System) => (m: Message) =>
    s.exec(s, new DropScript(m));

process.on('uncaughtException', e =>
    (<Function>process.send)({

        code: OP_CODE_RAISE,
        error: e.stack,
        src: address,
        dest: address

    }));

sys.spawn({

    id,

    create: s => {

        process.on('message', filter(s));

        return require(<string>process.env.POTOO_ACTOR_MODULE).create(s);

    }

});
