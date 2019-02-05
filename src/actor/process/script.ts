import { match } from '@quenk/noni/lib/control/match';
import { Any } from '@quenk/noni/lib/data/type';
import {OP_CODE_TELL,OP_CODE_RAISE} from '../system/vm/op';
import { system } from '../system/default';
import { Handle } from '../system/vm/handle';
import { System } from '../system';
import { DropScript, TellScript } from '../resident/scripts';
import { Message } from '../message';
import { Envelope } from '../mailbox';
import { Context } from '../context';

const id = <string>process.env.POTOO_ACTOR_ID;

const address = <string>process.env.POTOO_ACTOR_ADDRESS;

const tellShape = {

    to: String,

    from: String,

    message: Any

}

const sys = system({

    hooks: {

      drop: ({to,from,message}: Envelope) => (<any>process).send({

        code: OP_CODE_TELL,
        to,
        from,
        message
      
      })

    }

});

const filter = <C extends Context>(s: Handle<C, System<C>>) => (m: Message) =>
    match(m)
        .caseOf(tellShape, filterTell(s))
        .orElse(fitlerDrop(s))
        .end();

const filterTell = <C extends Context>(s: Handle<C, System<C>>) =>
    ({ to, message }: { to: string, from: string, message: Message }) =>
        s.exec(new TellScript(to, message));

const fitlerDrop = <C extends Context>(s: Handle<C, System<C>>) => (m: Message) =>
    s.exec(new DropScript(m));

process.on('uncaughtException', e =>
  (<any>process.send)({ 

    code:OP_CODE_RAISE,
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
