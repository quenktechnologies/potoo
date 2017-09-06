import 'mocha';
import * as must from 'must/register';
import * as potoo from 'potoo';

class A1 extends potoo.Actor.Dynamic {

    run() {

        setTimeout(() => {
            this.tell('a2', 'ready?');
            this.tell('a2', 'exit');
        }, 120);

    }

}

class A2 extends potoo.Actor.Static<String> {

    receive = new potoo.Case(String, (m: string) => (m === 'exit') ?
        this.exit() : null);

}

describe('exit()', function() {

    it('should work', function(done) {

        let s = potoo
            .System
            .create()
            .spawn({ id: 'a1', create: s => new A1(s) })
            .spawn({ id: 'a2', create: s => new A2(s) })

        must(s.actors['a1']).be.instanceOf(potoo.Actor.Local);
        must(s.actors['a2']).be.instanceOf(potoo.Actor.Local);

        setTimeout(() => {

            must(s.actors['a2']).eql(undefined);
            done();

        }, 300);

    });

});
