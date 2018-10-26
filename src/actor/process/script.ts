import { match } from '@quenk/noni/lib/control/match';
import { Any } from '@quenk/noni/lib/data/type';
import { system } from '../../';
import { Raise } from '../system/op/raise';
import { Tell } from '../system/op/tell';
import { Drop } from '../system/op/drop';
import { System } from '../system';
import { Message } from '../message';
import {Envelope} from '../system/mailbox';

const id = <string>process.env.POTOO_ACTOR_ID;

const address = <string>process.env.POTOO_ACTOR_ADDRESS;

const tellShape = {

    to: String,

    from: String,

    message: Any

}

const sys = system({
  
  hooks: { 
    
    drop: ({to,from,message}: Envelope) => 
    (<any>process).send(new Tell(to,from,message) )
  
  }

});

const filter = (s: System) => (m: Message) => match(m)
    .caseOf(tellShape, filterTell(s))
    .orElse((m: Message) => s.exec(new Drop(address, address, m)))
    .end();

const filterTell = (s: System) => ({ to, from, message }
    : { to: string, from: string, message: Message }) =>
    s.exec(new Tell(to, from, message));

process.on('uncaughtException', e =>
    (<any>process.send)(new Raise({ message: <string>e.stack }, address, address)));

sys.spawn({

    id,

    create: s => {

        process.on('message', filter(s));
        return require(<string>process.env.POTOO_ACTOR_MODULE).create(s);

    }

});
