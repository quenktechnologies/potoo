import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { System, LocalActor, LocalContext, LocalConf as ActorConf } from 'potoo';

class ServerA<M> extends LocalActor<M> {

    run() {

        this.receive(({ sender, message }) => this.tell(sender, `${message}->A`));

    }

}

class ServerB<M> extends LocalActor<M> {

    run() {

        this.receive(({ sender, message }) =>
            setTimeout(() => this.tell(sender, `${message}->B`), 1000));

    }

}

class Client<M> extends LocalActor<M> {

    constructor(c, public done) {

        super(c);

    }

    run() {

        this
            .ask('serverA', { sender: 'client', message: 'start' })
            .then(message => this.ask('serverB', { sender: 'client', message }))
            .then(msg => must(msg).be('start->A->B'))
            .then(this.done);

    }

}


describe('using ask semantics', function() {

    it('should be possible', function(done) {

        System
            .create()
            .spawn(ActorConf.from('serverA', ctx => new ServerA(ctx)))
            .spawn(ActorConf.from('serverB', ctx => new ServerB(ctx)))
            .spawn(ActorConf.from('client', ctx => new Client(ctx, done)))

    });

});
