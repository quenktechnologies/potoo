import 'mocha';
import * as must from 'must/register';
import * as potoo from 'potoo';

class A1 extends potoo.Actor.Dynamic { }

class A2 extends potoo.Actor.Dynamic { }

class A3 extends potoo.Actor.Static<String> {

    receive = new potoo.Case(String, (m: string) => must(m).be('You said : \'Hello!\''));

    run() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');

    }

}

class A3A extends potoo.Actor.Static<String> {

    receive = new potoo.Case(String, (m: string) => this.tell('a3', `You said : '${m}'`));

}

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let s = potoo
            .System
            .create()
            .spawn({ id: 'a1', create: s => new A1(s) })
            .spawn({ id: 'a2', create: s => new A2(s) })
            .spawn({ id: 'a3', create: s => new A3(s) });

        must(s.actors['a1']).be.instanceOf(potoo.Actor.Local);
        must(s.actors['a2']).be.instanceOf(potoo.Actor.Local);
        must(s.actors['a3']).be.instanceOf(potoo.Actor.Local);

        setTimeout(() => {
            must(s.actors['a3/a3a']).be.instanceOf(potoo.Actor.Local);
            done();
        }, 100);

    });

});
