import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import * as potoo from 'potoo';

class Selector extends potoo.Actor.Dynamic {

    constructor(public s: potoo.System, public done: () => void) {

        super(s);

    }

    run() {

        let bucket = [];

        let cases = [
            new potoo.Case('one', () => (bucket.push(1), this.select(cases))),
            new potoo.Case('two', () => (bucket.push(2), this.select(cases))),
            new potoo.Case('three', () => (bucket.push(3), this.select(cases))),
            new potoo.Case('done', () => { must(bucket.join(',')).eql('1,2,3'); this.done(); })
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

        potoo.System
            .create({ log: { level: potoo.INFO, logger: console } })
            .spawn({ id: 'selector', create: s => new Selector(s, done) });

    });

});
