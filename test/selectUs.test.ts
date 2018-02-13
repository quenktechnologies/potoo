import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import * as potoo from 'potoo';
import * as local from 'potoo/actor/local';
import * as system from 'potoo/system';
import * as log from 'potoo/system/log';

class Selector extends local.Dynamic {

    constructor(public s: system.System, public done: () => void) {

        super(s);

    }

    run() {

        let bucket = [];

        let cases = [
            new local.Case('one', () => (bucket.push(1), this.select(cases))),
            new local.Case('two', () => (bucket.push(2), this.select(cases))),
            new local.Case('three', () => (bucket.push(3), this.select(cases))),
            new local.Case('done', () => { must(bucket.join(',')).eql('1,2,3'); this.done(); })
        ];

        this.select(cases);
        this.tell('selector', 'one');
        this.tell('selector', 'seven');
        this.tell('selector', 'two');
        this.tell('selector', 'three');
        this.tell('selector', 6);
        this.tell('selector', 'done');

    }

}

describe('select', function() {

    it('should be possible', function(done) {

        system
        .ActorSystem
            .create({ log: { level: log.INFO, logger: console } })
            .spawn({ id: 'selector', create: s => new Selector(s, done) });

    });

});
