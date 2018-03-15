import 'mocha';
import * as must from 'must/register';
import * as local from '../lib/actor/local';
import * as system from '../lib/system';
import * as log from '../lib/system/log';

export interface Block {

    sender: string,
    message: string

}

const block = { sender: String, message: String }

class ServerA extends local.Immutable<Block> {

    receive = [
        new local.Case(block, ({ sender, message }: Block) =>
            this.tell(sender, `${message}->A`))
    ]

}

class ServerB extends local.Immutable<Block> {

    receive = [
        new local.Case(block, ({ sender, message }: Block) =>
            setTimeout(() => this.tell(sender, `${message}->B`), 1000)),

    ]

}

class Client extends local.Mutable<string> {

    constructor(s: system.System, public done: () => void) {

        super(s);

    }

    run() {

        this
            .ask('serverA', { sender: 'client', message: 'start' })
            .then(message => this.ask('serverB', { sender: 'client', message }))
            .then(msg => must(msg).be('start->A->B'))
            .then(() => this
                .ask('serverB', { sender: 'client', message: 'meh' }, 100)
                .then(() => { throw new Error('Did not timeout!'); })
                .catch(e => { must(e.message).not.eql('Did not timeout!'); }))
            .then(this.done);

        return this;

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
