import 'mocha';
import * as must from 'must/register';
import * as local from '../lib/actor/local';
import * as system from '../lib/system';
import * as log from '../lib/system/log';

class A1 extends local.Dynamic { }

class A2 extends local.Dynamic { }

class A3 extends local.Static<String> {

    receive = new local.Case(String, (m: string) => must(m).be('You said : \'Hello!\''));

    run() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');

    }

}

class A3A extends local.Static<String> {

    receive = new local.Case(String, (m: string) => this.tell('a3', `You said : '${m}'`));

}

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let s = system
            .ActorSystem
            .create()
            .spawn({ id: 'a1', create: s => new A1(s) })
            .spawn({ id: 'a2', create: s => new A2(s) })
            .spawn({ id: 'a3', create: s => new A3(s) });

        must(s.actors['a1']).be.instanceOf(local.Local);
        must(s.actors['a2']).be.instanceOf(local.Local);
        must(s.actors['a3']).be.instanceOf(local.Local);

        setTimeout(() => {
            must(s.actors['a3/a3a']).be.instanceOf(local.Local);
            done();
        }, 100);

    });

});