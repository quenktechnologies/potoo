import must from 'must';
import * as Ops from 'potoo-lib/Ops';
import { match } from 'potoo-lib/Match';
import { Free, IO } from 'potoo-lib/monad';
import { ActorT, Actor } from 'potoo-lib/Actor';

const id = x => x;
const reverse = x => x.split('').reverse().join('');

const inter = f => f.resume().cata(op => match(op)
    .caseOf(Ops.Self, ({ next }) => inter(next(new FakeActor('self'))))
    .caseOf(Ops.Get, ({ id, next }) => inter(next(id === 'new' ? null : new FakeActor())))
    .caseOf(Ops.Put, ({ next }) => inter(next))
    .end(), id);

class FakeT extends ActorT {

    constructor(id = 'fake') {

        super({});
        this.id = id;

    }

}

class FakeActor extends Actor {

    constructor(id, mailbox = []) {

        super({});
        this.id = id;
        this.mailbox = mailbox;

    }

}

describe('map', function() {

    it('Self', function() {

        let self = new Ops.Self({ next: id });
        let _self = self.map(reverse);

        must(_self).be.instanceOf(Ops.Self);
        must(_self.next('actor')).be('rotca');

    });

    it('Get', function() {

        let get = new Ops.Get({ id: 'actor', next: id });
        let _get = get.map(reverse);

        must(_get).be.instanceOf(Ops.Get);
        must(_get.next(_get.id)).be('rotca');

    });

    it('Raise', function() {

        let raise = new Ops.Raise({ error: new TypeError('JS types are ducks!') });
        let _raise = raise.map(x => { throw x; });

        must(_raise).be(raise);

    });

    it('Put', function() {

        let put = new Ops.Put({ actor: new FakeActor(), next: id });
        let _put = put.map(x => x * x);

        must(_put).be.instanceOf(Ops.Put);
        must(_put.next(12)).be(144);

    });

    it('Select', function() {

        let select = new Ops.Select({ path: 'foo', next: id });
        let _select = select.map(reverse);

        must(_select).be.instanceOf(Ops.Select);
        must(_select.next('actor')).be('rotca');

    });

    it('Accept', function() {

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

        let input = new Ops.Input({ iof: () => IO.of('actor'), next: id });
        let _input = input.map(reverse);

        must(_input).be.instanceOf(Ops.Input);
        must(_input.next('actor')).be('rotca');

    });

});

describe('api', function() {

    it('spawn :: ActorT →  Free<Create, null>', function() {

        let f = Ops.spawn(new FakeT('new'));

        must(f).be.instanceOf(Free);
        //must(inter(f)).be.instanceOf(Actor);

    });

    it('self :: () →  Free<F,Actor>', function() {

        let f = Ops.self();

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Self);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    it('get :: string →  Free<F,Actor>', function() {

        let f = Ops.get('abc');

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Get);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);


    });

    it('raise :: Error →  Free<null, Error>', function() {

        let f = Ops.raise(new RangeError());

        f.chain(() => { throw new SyntaxError('not enough syntax') });

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Raise);
        must(f.resume().left().next == null).be(true);

    });

    it('put :: Actor →  Free<F,null>', function() {

        let f = Ops.put(new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Put);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    it('select :: string →  Free<F,Actor>', function() {

        let f = Ops.select('a1');

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Select);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    it('accept :: (Actor,*) →  Free<F,Actor>', function() {

        let f = Ops.accept('hi', new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Accept);
        must(f.resume().left().next(new FakeActor()).resume().right()).be.instanceOf(FakeActor);

    });

    it('replace :: Actor →  Free<F,null>', function() {

        let f = Ops.replace(new FakeActor());

        must(f).be.instanceOf(Free);
        must(f.resume().left()).be.instanceOf(Ops.Replace);
        must(f.resume().left().next.resume().right() == null).be.true();

    });

});
