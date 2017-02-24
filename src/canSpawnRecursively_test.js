import must from 'must';
import { System, ActorT } from 'potoo-lib';
import { IO } from 'potoo-lib/monad';

const parent = child => ctx => ctx.spawn(new ActorT('child', child));
const identity = ctx => ctx;
//const chatty = ctx => ctx.tell('nobody', 'blah,blah,blah');

let a1 = new ActorT(1, parent(parent(identity)));

let check = s => {

    console.log(s);

    return IO.of(null);

};

new System()
    .spawn(a1)
    .tick()
    .tock(s => s.tick().tock(check));
