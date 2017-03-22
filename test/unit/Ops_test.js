import must from 'must';
import * as Ops from 'potoo-lib/Ops';
import { match } from 'potoo-lib/Match';
import { Free, IO } from 'potoo-lib/monad';
import * as Actor from 'potoo-lib/Actor';

class FakeT extends Actor.Template {

    constructor(id = 'fake') {

        super({});
        this.id = id;

    }

}

class FakeActor extends Actor.Actor {

    constructor(id, mailbox = []) {

        super({});
        this.id = id;
        this.mailbox = mailbox;

    }

}

const id = x => x;
const reverse = x => x.split('').reverse().join('');
const s = new Actor.System();
const a = new FakeActor('actor');

const interSelf = (a, io, f) => ({ next }) => f(a, io, next(a));
const interGet = (a, io, f) => ({ id, next }) => f(a, io, next(new FakeActor()));
const interPut = (a, io, f) => ({ actor, next }) => f(a, io, next(actor));
const interInput = (a, io, ex) => ({ f, next }) =>
    io.chain(s => f().map(next).chain(free => ex(a, IO.of(s), free)));

describe('expand', function() {

    it('expand :: Spawn →  Free<F,*>', function() {

        let r = Ops.expand(new Ops.Spawn({ template: new FakeT() }));
        must(r).be.instanceOf(Free);

    });

});

describe('map', function() {

    it('Self', function() {

        let self = new Ops.Self({ next: id });
        let _self = self.map(reverse);

        must(_self).be.instanceOf(Ops.Self);
        must(_self.next('actor')).be('rotca');

    });

    xit('Get', function() {

        let get = new Ops.Get({ id: 'actor', next: id });
        let _get = get.map(reverse);

        must(_get).be.instanceOf(Ops.Get);
        must(_get.next(_get.id)).be('rotca');

    });

    xit('Raise', function() {

        let raise = new Ops.Raise({ error: new TypeError('JS types are ducks!') });
        let _raise = raise.map(x => { throw x; });

        must(_raise).be(raise);

    });

    xit('Put', function() {

        let put = new Ops.Put({ actor: new FakeActor(), next: id });
        let _put = put.map(x => x * x);

        must(_put).be.instanceOf(Ops.Put);
        must(_put.next(12)).be(144);

    });

    xit('Select', function() {

        let select = new Ops.Select({ path: 'foo', next: id });
        let _select = select.map(reverse);

        must(_select).be.instanceOf(Ops.Select);
        must(_select.next('actor')).be('rotca');

    });

    xit('Accept', function() {

        let accept = new Ops.Accept({ actor: new FakeActor(), message: 'hi', next: id });
        let _accept = accept.map(reverse);

        must(_accept).be.instanceOf(Ops.Accept);
        must(_accept.next('actor')).be('rotca');

    });

    it('Replace', function() {

        let replace = new Ops.Replace({ actor: new FakeActor(), next: 12 });
        let _replace = replace.map(x => x * x);

        must(_replace).be.instanceOf(Ops.Replace);
        must(_replace.next).be(144);

    });

    it('Input', function() {

        let input = new Ops.Input({ f: () => IO.of('actor'), next: id });
        let _input = input.map(reverse);

        must(_input).be.instanceOf(Ops.Input);
        must(_input.next('actor')).be('rotca');

    });

});

describe('api', function() {

    xit('spawn :: ActorT →  Free<Create, null>', function() {

        let f = Ops.spawn(new FakeT('new'));

        must(f).be.instanceOf(Free);

    });

    xit('self :: () →  Free<F,Actor>', function() {

        let f = Ops.self();

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Self);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    xit('get :: string →  Free<F,Actor>', function() {

        let f = Ops.get('abc');

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Get);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);


    });

    xit('raise :: Error →  Free<null, Error>', function() {

        let f = Ops.raise(new RangeError());

        f.chain(() => { throw new SyntaxError('not enough syntax') });

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Raise);
        must(f.resume().left().next == null).be(true);

    });

    xit('put :: Actor →  Free<F,null>', function() {

        let f = Ops.put(new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Put);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    xit('select :: string →  Free<F,Actor>', function() {

        let f = Ops.select('a1');

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Select);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    xit('accept :: (Actor,*) →  Free<F,Actor>', function() {

        let f = Ops.accept('hi', new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Accept);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    xit('replace :: Actor →  Free<F,null>', function() {

        let f = Ops.replace(new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Replace);
        must(f.resume().left().next.resume().right() == null).be.true();

    });

});

describe('output', function() {

    it('output :: null →  IO →  Free<O,*>', function() {

        let F = Ops.output(() => IO.of('hi'));

        must(F).be.instanceOf(Free);

    });

    it('must be chainable', function(done) {

        let output = Ops.output;
        let list = [];
        let f = () => IO.of(() => list.push('hi'));

        let x = output(f)
            .chain(() => output(f))
            .chain(() => output(f))
            .chain(() => output(f));

        function inter(io, F) {
            return F
                .resume()
                .cata(({ f, next }) => inter(io.chain(f), next), () => io);
        }

        return inter(IO.of(), x)
            .map(()=>must(list).eql(['hi', 'hi', 'hi', 'hi']))
            .map( done)
            .run();

    });

});

describe('create', function() {

    xit('create :: (string, ChildT) →  Free<Op, ActorCP>', function(done) {

        let free = Ops.create('', new Actor.ChildT({}));

        function inter(a, io, f) {

            return !f ? io : f.resume().cata(op => match(op)
                    .caseOf(Ops.Self, interSelf(a, io, inter))
                    .caseOf(Ops.Get, interGet(a, io, inter))
                    .caseOf(Ops.Put, ({ actor, next }) => IO.of(actor))
                    .caseOf(Ops.Input, interInput(a, io, inter)))
                .end();

        }

        inter(a, IO.of(s), free)
            .map(r => {

                must(r).be.instanceOf(Actor.ActorCP);
                done();

            })
            .run();

    });

});
