import 'mocha';
import * as must from 'must/register';
import { LocalActor, LocalTemplate as Template, MatchAny, LocalContext, System } from 'potoo';

class A1 extends LocalActor { }
class A2 extends LocalActor { }

class A3A extends LocalActor {

    run() {

        this.receive(m => this.tell('a3', `You said : '${m}'`));
    }

}

class A3 extends LocalActor {

    run() {

        this.spawn(Template.from('a3a', ctx => new A3A(ctx)));
        this.tell('a3/a3a', 'Hello!');
        this.receive(m => must(m).be('You said : \'Hello!\''));

    }

}

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let s = System
            .create()
            .spawn(Template.from('a1', ctx => new A1(ctx)))
            .spawn(Template.from('a2', ctx => new A2(ctx)))
            .spawn(Template.from('a3', ctx => new A3(ctx)))

        must(s.actors['a1']).be.instanceOf(LocalContext);
        must(s.actors['a2']).be.instanceOf(LocalContext);
        must(s.actors['a3']).be.instanceOf(LocalContext);
        must(s.actors['a3/a3a']).be.instanceOf(LocalContext);

        setTimeout(done, 1000);

    });

});
