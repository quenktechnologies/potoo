import * as fs from 'fs';
import 'mocha';
import * as must from 'must/register';
import { System } from 'potoo/lib/System';
import { LocalActor, Template } from 'potoo/lib/LocalActor';
import { LocalContext } from 'potoo/lib/LocalContext';
import { Case } from 'potoo';

class Selector extends LocalActor {

    constructor(public ctx: LocalContext, public done: Function) {

        super(ctx);

    }

    run() {

        let bucket = [];

        let cases = [
            new Case('one', () => (bucket.push(1), this.select(cases))),
            new Case('two', () => (bucket.push(2), this.select(cases))),
            new Case('three', () => (bucket.push(3), this.select(cases))),
            new Case('done', () => { must(bucket.join(',')).eql('1,2,3'); this.done(); })
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

        System
            .create()
            .spawn(Template.from('selector', ctx => new Selector(ctx, done)));

    });

});
