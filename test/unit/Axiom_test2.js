import must from 'must';
import * as Axiom from 'potoo-lib/Axiom';
import * as Actor from 'potoo-lib/Actor';
import * as Instruction from 'potoo-lib/Instruction';
import * as Free from 'potoo-lib/fpl/monad/Free';
import * as State from 'potoo-lib/fpl/monad/State';
import { partial } from 'potoo-lib/fpl/util';
import { Log } from 'potoo-lib/Log';
import { match } from 'potoo-lib/fpl/control/Match';
import { mapTest, apiTest } from './helpers';

const id = x => x;
const actor = new Actor.ActorL({
    id: 'x',
    parent: '',
    path: '/',
    template: new Actor.LocalT({ id: 'x' })
});

describe('map', function() {

    it('should work properly', function() {

        mapTest(144, new Axiom.Spawn({ template: new Actor.LocalT({ id: 'x' }), next: 12 }));
        mapTest(144, new Axiom.Tell({ to: '.', message: 'hi', next: 12 }));
        mapTest(12, new Axiom.Receive({ behaviour: id, next: 12 }));

    });

});

describe('api', function() {

    it('spawn :: Template →  Free<Spawn, null>', function() {

        apiTest(Axiom.spawn(new Actor.LocalT({ id: 'y' })), Axiom.Spawn);

    });

    it('tell :: (string, *) →  Free<Tell, null>', function() {

        apiTest(Axiom.tell('/', 'nothing'), Axiom.Tell);

    });

    it('receive :: (* →  Free) →  Free<Receive, null>', function() {

        apiTest(Axiom.receive(() => Free.of()), Axiom.Receive);

    });

});

describe('auditAxiom', function() {

    it('auditAxiom :: Axiom →  Free<Log,null>', function() {

        let fr = Axiom.auditAxiom(new Axiom.Spawn({ template: new Actor.LocalT({ id: 'y' }) }));

        must(fr).be.instanceOf(Free.Free);

        fr
            .go(ftor => {
                must(ftor).be.instanceOf(Log);
                return ftor.next;
            });

    });

});

describe('execAxiom', function() {

    it('execAxiom :: Axiom →  Free<Instruction, A>', function() {

        let fr = Axiom.execAxiom(new Axiom.Spawn({
            template: new Actor.LocalT({ id: 'y' })
        }));

        let inter = x => match(x)
            .caseOf(Instruction.Self, ({ next }) => next(actor))
            .caseOf(Instruction.Create, ({ next }) => next)
            .end();

        must(fr).be.instanceOf(Free.Free)

        fr
            .go(ftor => {

                must(ftor).be.instanceOf(Instruction.Instruction);
                return inter(ftor);

            });

    });

});

describe('execAxiomWithAuditing', function() {

    it('execAxiomWithAuditing :: Axiom →  Free<CoProduct<Log, Instruction>', function() {

        let fr = Axiom.execAxiomWithAuditing(new Axiom.Tell({ to: '/boo', message: 'hi' }));

        let interp = f => match(f)
    .caseOf(Instruction.Self, ({ next }) =>
            State.modify(b=>b.concat('self')).chain(()=>State.of(next)))
    .caseOf(Instruction.Deliver, ({ next, to, from }) =>
            State.modify(b=>b.concat('deliver', to, from))
        .chain(()=>State.of(next)))
.caseOf(Log.Log, ({  level, next  }) =>
                State.modify(b=>b.concat('log', level)).chain(()=>State.of(next)))
        .end();

        let logInter = (box, fr) => match(fr)
            .caseOf(Free.Suspend, ({ f: { level, next } }) =>
                logInter(box.concat(level), next))
            .caseOf(Free.Return, ({ a }) => run(box, a))
            .end();

        let intInter = (box, fr) => match(fr)
            .caseOf(Free.Suspend, ({ f }) => match(f)
                .caseOf(Instruction.Self, ({ next }) => intInter(box.concat('self'), next(actor)))
                .caseOf(Instruction.Deliver, ({ next, to, from }) => intInter(box.concat(to, from), next))
                .end())
            .caseOf(Free.Return, ({ a }) => run(box, a))
            .end();

        let run = (box, fr) => match(fr)
            .caseOf(Free.Suspend, ({ f }) =>
                f.cata(partial(logInter, box), partial(intInter, box)))
            .caseOf(Free.Return, () => box)
            .end();

        must(fr).be.instanceOf(Free.Free);
        console.log(fr.fold(interp));
       // must(run([], fr)).eql([5, 'self', '/boo', '/']);

    });

});
