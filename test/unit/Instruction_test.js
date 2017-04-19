import must from 'must';
import * as Instruction from 'potoo-lib/Instruction';
import * as Actor from 'potoo-lib/Actor';
import { mapTest, mapTestGet, apiTest, apiTestGet } from './helpers';
import { Free, Return } from 'potoo-lib/fpl/monad/Free';
import * as IO from 'potoo-lib/fpl/monad/IO';
import { Log } from 'potoo-lib/Log';
import * as State from 'potoo-lib/fpl/monad/State';
import * as Sum from 'potoo-lib/fpl/data/Sum';
import { match } from 'potoo-lib/fpl/control/Match';

const actor = new Actor.ActorL({
    id: 'x',
    parent: '',
    path: '/',
    template: new Actor.LocalT({ id: 'x' })
});

describe('map', function() {

    it('should work properly', function() {

        mapTestGet(12, 144, new Instruction.Self({ next: x => x }));

        mapTest(144, new Instruction.Create({
            parent: '/',
            template: new Actor.LocalT({ id: 'x' }),
            next: 12
        }));

        mapTest(12, new Instruction.Raise({ error: new Error(), next: 12 }));

        mapTest(144, new Instruction.Deliver({ to: '/', from: '/x', message: 'hi', next: 12 }));

    });

});

describe('api', function() {

    it('self :: () →  Free<Self, *>', function() {

        apiTestGet(12, Instruction.self(), Instruction.Self);

    });

    it('create :: (string, Template) →  Free<Create, null>', function() {

        apiTest(Instruction.create('/', new Actor.LocalT({ id: 'x' })), Instruction.Create);

    });

    it('raise :: (Error) →  Free<Raise, null>', function() {

        apiTest(Instruction.raise(new Error()), Instruction.Raise);

    });

    it('deliver :: (string, string, *) →  Free<Deliver,null>', function() {

        apiTest(Instruction.deliver('/', '/x', 'hi'), Instruction.Deliver);

    });

});

describe('auditInstruction', function() {

    it('auditInstruction :: Self →  Free<Log,null>', function() {

        let fr = Instruction.auditInstruction(new Instruction.Self({ next: x => x }));

        must(fr).be.instanceOf(Free);

        fr.go(f => {
            must(f).be.instanceOf(Log);
            return f.next
        });

    });

});

describe('execInstruction', function() {

    it('execInstruction :: (IO<ActorContext>, Self) →  IO', function() {

        let context = IO.of({
            a: new Actor.ActorL({
                id: 'x',
                parent: '',
                path: '/',
                template: new Actor.LocalT({ id: 'x' })
            }),
            s: new Actor.System()
        });

        let i = Instruction.execInstruction(context, new Instruction.Self({ next: x => x }));

        must(i).be.instanceOf(IO.IO);

        i.map(v => {

            must(v).be.array();
            must(v[0]).be.instanceOf(IO.IO);
            must(v[1]).be.instanceOf(Actor.ActorL);

        }).run();

    });

});

describe('execInstructionWithAuditing', function() {

    it('execInstructionWithAuditing :: Instruction →  Free<Sum<Log, Instruction>', function() {

        let fr = Instruction.execInstructionWithAuditing(new Instruction.Self({ next: x => x }));

        let logInterp = ({ level, next }) =>
            State.modify(b => b.concat('log', level)).chain(() => State.of(next));

        let intInterp = f => match(f)
            .caseOf(Instruction.Self, ({ next }) =>
                State.modify(b => b.concat('self')).chain(() => State.of(next(actor))))
            .end();

        let run = f => match(f)
            .caseOf(Sum.Left, ({ x }) => logInterp(x))
            .caseOf(Sum.Right, ({ y }) => intInterp(y))
            .caseOf(Return, ({ a }) => State.of(a))
            .end();

        must(fr).be.instanceOf(Free);
        must(fr.fold(run).execute([])).eql(['self', 'log', 7])

    });

});
