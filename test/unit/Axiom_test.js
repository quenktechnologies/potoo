import must from 'must';
import * as Axiom from 'potoo-lib/Axiom';
import * as Actor from 'potoo-lib/Actor';
import * as Instruction from 'potoo-lib/Instruction';
import * as Free from 'potoo-lib/fpl/monad/Free';
import * as State from 'potoo-lib/fpl/monad/State';
import { CoProduct } from 'potoo-lib/fpl/data/CoProduct';
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

        must(fr).be.instanceOf(Free.Free)

        fr.go(ftor => {

            must(ftor).be.instanceOf(Instruction.Instruction);
            return ftor.next;

        });

    });

});

describe('execAxiomWithAuditing', function() {

    it('execAxiomWithAuditing :: Axiom →  Free<CoProduct<Log, Instruction>', function() {

        let fr = Axiom.execAxiomWithAuditing(new Axiom.Tell({ to: '/boo', message: 'hi' }));

        let logInterp = ({ level, next }) =>
            State.modify(b => b.concat('log', level)).chain(() => State.of(next));

        let intInterp = f => match(f)
            .caseOf(Instruction.Self, ({ next }) =>
                State.modify(b => b.concat('self')).chain(() => State.of(next(actor))))
            .caseOf(Instruction.Deliver, ({ next, to, from }) =>
                State.modify(b => b.concat('deliver', to, from)).chain(() => State.of(next)))
            .end();

        let run = f => match(f)
            .caseOf(CoProduct, () => f.cata(logInterp, intInterp))
            .caseOf(Free.Return, ({ a }) => State.of(a))
            .end();

        must(fr).be.instanceOf(Free.Free);
        must(fr.fold(run).execute([])).eql(['self', 'deliver', '/boo', '/', 'log', 5])

    });

});