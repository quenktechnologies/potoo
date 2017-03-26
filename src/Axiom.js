import { type, any } from './be';
import { Type } from './fpl/data/Type';
import { Template } from './Actor';
import { match } from './fpl/control/Match';
import { merge, partial, compose } from './fpl/util';
import { liftF } from './fpl/monad/Free';
import { left, right } from './fpl/data/CoProduct';
import { getChild, DuplicateActorIdError } from './Actor';
import { self, create, raise, deliver, dequeue, become } from './Instruction';
import { info } from './Log';

/**
 * Axiom represents a member of the userland DSL.
 *
 * Typically corresponds to one of the actor model axioms.
 * @abstract
 */
export class Axiom extends Type {

    constructor(props, checks) {

        super(props, merge(checks, { next: any }));

        this.map = map(this);

    }

}

/**
 * Spawn
 * @property {Actor.Template} template
 */
export class Spawn extends Axiom {

    constructor(props) {

        super(props, { template: type(Template), next: any });

    }

}

/**
 * Tell
 */
export class Tell extends Axiom {

    constructor(props) {

        super(props, { to: type(String), message: any });

    }

}

/**
 * Receive
 */
export class Receive extends Axiom {

    constructor(props) {

        super(props, { behaviour: type(Function) });

    }

}

/**
 * map
 * @summary map :: Axiom →  (* →  *) →  Axiom
 */
export const map = ax => f => match(ax)
    .caseOf(Receive, r => r)
    .caseOf(Axiom, ({ next }) => ax.copy({ next: f(next) }))
    .end();

/* User apis */

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
export const tell = (to, message) => liftF(new Tell({ to, message }));

/**
 * spawn a new actor
 * @summary {Template →  Free<F, *>}
 */
export const spawn = template => liftF(new Spawn({ template }));

/**
 * receive the next message with the passed behaviour
 * @summary receive :: (* → Free<F,*>) →  Free<_,null>
 */
export const receive = behaviour => liftF(new Receive({ behaviour }));

/**
 * execAxiom expands a user api to the primitive DSL.
 * @summary execAxiom :: Axiom →  Free<Instruction, A>
 */
export const execAxiom = ax => match(ax)
    .caseOf(Spawn, ({ template: { id } }) =>
        self()
        .chain(a =>
            getChild(id, a)
            .map(() => raise(new DuplicateActorIdError(a.path, id)))
            .orJust(() => create(a.path, ax.template))
            .get()))
    .caseOf(Tell, ({ to, message }) =>
        self()
        .chain(a => deliver(to, a.path, message)))
    .caseOf(Receive, ({ behaviour }) =>
        self()
        .chain(partial(dequeue, behaviour))
        .chain(become))
    .end();

/**
 * auditAxiom
 * @summary auditAxiom :: Axiom →  Free<Log,null>
 */
export const auditAxiom = ax => match(ax)
    .caseOf(Spawn, ({ template }) =>
        info(`Spawn child '${template.id}'`))
    .caseOf(Tell, ({ to, message }) =>
        info(`Tell '${to}' message ${message}`))
    .caseOf(Receive, () =>
        info(`Started receiving.`))
    .end();

const _audit = compose(liftF, left, auditAxiom);
const _exec = compose(liftF, right, execAxiom);

/**
 * execAxiomWithAuditing tags on a command to log the op so
 * we can keep track of what is going on at the user level.
 * @summary execAxiomWithAuditing :: Axiom →  Free<CoProduct<Log, Instruction>
 */
export const execAxiomWithAuditing = ax => _audit(ax).chain(() => _exec(ax));
