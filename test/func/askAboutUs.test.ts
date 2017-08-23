import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import * as potoo from 'potoo';

export interface Block {

    sender: string,
    message: string

}

const block = { sender: String, message: String }

class ServerA extends potoo.Actor.Static<Block> {

    receive = new potoo.Case(block, ({ sender, message }: Block) =>
        this.tell(sender, `${message}->A`))

}

class ServerB extends potoo.Actor.Static<Block> {

    receive = new potoo.Case(block, ({ sender, message }: Block) =>
        setTimeout(() => this.tell(sender, `${message}->B`), 1000))

}

class Client extends potoo.Actor.Dynamic {

    constructor(s: potoo.System, public done: () => void) {

        super(s);

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

        potoo
            .System
            .create({ log: { level: potoo.INFO, logger: console } })
            .spawn({ id: 'serverA', create: s => new ServerA(s) })
            .spawn({ id: 'serverB', create: s => new ServerB(s) })
            .spawn({ id: 'client', create: s => new Client(s, done) })

    });

});
