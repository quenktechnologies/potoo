import 'mocha';
import * as must from 'must/register';
import * as local from '../lib/actor/local';
import * as system from '../lib/system';

class A1 extends local.Mutable<void> { }

class A2 extends local.Mutable<void> { }

class A3 extends local.Immutable<String> {

    receive = [
        new local.Case(String, (m: string) => must(m).be('You said : \'Hello!\''))
    ]

    run() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');
        return this;

    }

}

class A3A extends local.Immutable<String> {

    receive = [
        new local.Case(String, (m: string) => this.tell('a3', `You said : '${m}'`))
    ]

}

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let s = system
            .ActorSystem
            .create()
            .spawn({ id: 'a1', create: s => new A1(s) })
            .spawn({ id: 'a2', create: s => new A2(s) })
            .spawn({ id: 'a3', create: s => new A3(s) });

        must(s.actors['a1']).be.instanceOf(local.Resident);
        must(s.actors['a2']).be.instanceOf(local.Resident);
        must(s.actors['a3']).be.instanceOf(local.Resident);

        setTimeout(() => {
            must(s.actors['a3/a3a']).be.instanceOf(local.Resident);
            done();
        }, 100);

    });

});
