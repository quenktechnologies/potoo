import must from 'must';
import { LocalT, Actor } from 'potoo-lib/Actor';
import { System, exec } from 'potoo-lib/System';
import { noop, spawn } from 'potoo-lib/Op';

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

        must(exec(noop(), actor, sys)).be.instanceOf(System);

    });

    it('should run chained Ops', function() {

        let r = exec(
            noop()
            .chain(noop)
            .chain(() => spawn(new LocalT({ id: 'a', start: () => {} }))), actor, sys);

        must(r).be.instanceOf(System);
        must(r.a).be.instanceOf(Actor);

    });

});
