import 'mocha';
import * as fs from 'fs';
import * as must from 'must/register';
import * as local from 'potoo/actor/local';
import * as system from 'potoo/system';
import * as log from 'potoo/system/log';

export interface Block {

    sender: string,
    message: string

}

const block = { sender: String, message: String }

class ServerA extends local.Static<Block> {

    receive = new local.Case(block, ({ sender, message }: Block) =>
        this.tell(sender, `${message}->A`))

}

class ServerB extends local.Static<Block> {

    receive = new local.Case(block, ({ sender, message }: Block) =>
        setTimeout(() => this.tell(sender, `${message}->B`), 1000))

}

class Client extends local.Dynamic {

    constructor(s: system.System, public done: () => void) {

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

        system
            .ActorSystem
            .create({ log: { level: log.INFO, logger: console } })
            .spawn({ id: 'serverA', create: s => new ServerA(s) })
            .spawn({ id: 'serverB', create: s => new ServerB(s) })
            .spawn({ id: 'client', create: s => new Client(s, done) })

    });

});
