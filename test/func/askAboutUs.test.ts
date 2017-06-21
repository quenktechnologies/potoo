import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { System } from 'potoo/lib/System';
import { LocalActor, Template } from 'potoo/lib/LocalActor';
import { LocalContext } from 'potoo/lib/LocalContext';

class ServerA extends LocalActor {

    run() {

        this.receive(({ sender, message }) =>
            this.tell(sender, `${message}->A`));

    }

}

class ServerB extends LocalActor {

    run() {

        this.receive(({ sender, message }) =>
            setTimeout(() => this.tell(sender, `${message}->B`), 1000));

    }

}

class Client extends LocalActor {

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
            .spawn(Template.from('serverA', ctx => new ServerA(ctx)))
            .spawn(Template.from('serverB', ctx => new ServerB(ctx)))
            .spawn(Template.from('client', ctx => new Client(ctx, done)))

    });

});
