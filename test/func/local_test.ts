import * as must from 'must/register';
import * as local from '../../lib/actor/local';
import * as system from '../../lib/system';

class A1 extends local.Mutable<string> {

    run() {

        setTimeout(() => {
            this.tell('a2', 'ready?');
            this.tell('a2', 'exit');
        }, 120);

        return this;

    }

}

class A2 extends local.Immutable<String> {

    receive = [
        new local.Case('exit', (_: string) => this.exit()),
        new local.Case('kill', (_: string) => this.kill('a2/a2b'))
    ];

    run() {

        this.spawn({ id: 'a2b', create: s => new A2B(s) });
        return this;

    }

}

class A2B extends local.Immutable<String> {

    receive = [
        new local.Case('exit', (_: string) => { })
    ]

    run() {

        this.tell('a2', 'kill');
        return this;

    }

}

describe('exit()', function() {

    it('should work', function(done) {

        let s = system
            .ActorSystem
            .create()
            .spawn({ id: 'a1', create: s => new A1(s) })
            .spawn({ id: 'a2', create: s => new A2(s) })

        must(s.actors['a1']).be.instanceOf(local.Resident);
        must(s.actors['a2']).be.instanceOf(local.Resident);

        setTimeout(() => {

            must(s.actors['a2']).eql(undefined);
            done();

        }, 300);

    });

});

describe('kill()', function() {

    it('should work', function(done) {

        let s = system
            .ActorSystem
            .create()
            .spawn({ id: 'a2', create: s => new A2(s) });

        must(s.actors['a2']).be.instanceOf(local.Resident);
        must(s.actors['a2/a2b']).be.instanceOf(local.Resident);

        setTimeout(() => {

            must(s.actors['a2']).be.instanceOf(local.Resident);
            must(s.actors['a2/a2b']).eql(undefined);
            done();

        }, 300);

    });

});
