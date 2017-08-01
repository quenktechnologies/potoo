import 'mocha';
import * as must from 'must/register';
import { LocalActor, LocalConf as ActorConf, MatchAny, LocalContext, System } from 'potoo';

class A1<M> extends LocalActor<M> { }
class A2<M> extends LocalActor<M> { }

class A3A<M> extends LocalActor<M> {

    run() {

        this.receive(m => this.tell('a3', `You said : '${m}'`));
    }

}

class A3<M> extends LocalActor<M> {

    run() {

        this.spawn(ActorConf.from('a3a', ctx => new A3A(ctx)));
        this.tell('a3/a3a', 'Hello!');
        this.receive(m => must(m).be('You said : \'Hello!\''));

    }

}

describe('spawning three actors', function() {

    it('should be possible', function(done) {

        let s = System
            .create()
            .spawn(ActorConf.from('a1', ctx => new A1(ctx)))
            .spawn(ActorConf.from('a2', ctx => new A2(ctx)))
            .spawn(ActorConf.from('a3', ctx => new A3(ctx)))

        must(s.actors['a1']).be.instanceOf(LocalContext);
        must(s.actors['a2']).be.instanceOf(LocalContext);
        must(s.actors['a3']).be.instanceOf(LocalContext);
        must(s.actors['a3/a3a']).be.instanceOf(LocalContext);

        setTimeout(done, 1000);

    });

});
