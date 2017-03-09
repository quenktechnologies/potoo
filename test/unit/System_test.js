import must from 'must';
import { LocalT, Actor, ActorL } from 'potoo-lib/Actor';
import { System, exec, execSpawn, execSend, execReceive } from 'potoo-lib/System';
import * as Op from 'potoo-lib/Op';

let sys;
let actor;
let r;

describe('exec', function() {

    beforeEach(function() {

        sys = new System();
        actor = { path: '', parent: '' };
        r = null;

    });

    it('should return a new System', function() {

        must(exec(Op.noopF(), actor, sys)).be.instanceOf(System);

    });

    it('should run chained Ops', function() {

        let r = exec(
            Op.noopF()
            .chain(Op.noopF)
            .chain(() => Op.spawnF(new LocalT({ id: 'a', start: () => {} }))), actor, sys);

        must(r).be.instanceOf(System);
        must(r.actors.a).be.instanceOf(Actor);

    });

});

describe('execSpawn', function() {

    it('LocalT →  ActorL', function() {

        let r = execSpawn(actor, sys)(new Op.Spawn({
            template: new LocalT({ id: 'a', start: () => {} })
        }));

        must(r).be.instanceOf(ActorL);

    });


});

describe('execSend', function() {

    it('(Actor, System) →  Actor', function() {

        sys = new System({
            actors: {
                a: new ActorL({
                    parent: '',
                    path: 'a',
                    template: new LocalT({ id: 'a', start: () => {} })
                })
            }
        });

        r = execSend(actor, sys)(new Op.send('a', '',  'hi'));
        must(r).be.instanceOf(ActorL);
        must(r.mailbox[0]).be('hi');

    });

    it('should drop messages there are no actors for', function() {

        sys = new System({
            actors: {
                a: new ActorL({
                    parent: '',
                    path: 'a',
                    template: new LocalT({ id: 'a', start: () => {} })
                })
            }
        });

        r = execSend(actor, sys)(new Op.send('a1', '', 'hi'));
        must(r).be.instanceOf(Op.Drop);

    });

});

describe('execReceive', function() {

    it('should receive messages', function() {

        let a = new ActorL({
            parent: '',
            path: 'a',
            mailbox: ['hi'],
            template: new LocalT({ id: 'a', start: () => {} })
        });

        sys = new System({
            actors: { a }
        });

        r = execReceive(a, sys)(Op.receive(Op.noopF));
        must(r).be.instanceOf(ActorL);
        r.ops.resume().cata(x => must(x).be.instanceOf(Op.NOOP), () => {})

    });

});
