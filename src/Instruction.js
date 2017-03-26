import { type, any } from './be';
import { Type } from './fpl/data/Type';
import { merge, compose } from './fpl/util';
import { match } from './fpl/control/Match';
import { Template } from './Actor';
import { liftF } from './fpl/monad/Free';

const id = x => x;

/**
 * Instruction
 * @property {Free<F<*>,A> | * →  Free<F<*>, A>} next
 */
export class Instruction extends Type {

    constructor(props, checks) {

        super(props, merge({ next: any }, checks));
        this.map = map(this);

    }

}

/**
 * Self
 */
export class Self extends Instruction {

    constructor(props) {

        super(props, { next: type(Function) });

    }

}

/**
 * Create
 * @property {string} parent
 * @property {Template} template
 */
export class Create extends Instruction {

    constructor(props) {

        super(props, { parent: type(String), template: (type(Template)) });

    }

}

/**
 * Raise
 * @property {Error} error
 */
export class Raise extends Instruction {

    constructor(props) {

        super(props, { error: type(Error) });

    }

}

/**
 * Deliver
 * @property {string} to
 * @property {string} from
 * @proeprty {*} message
 */
export class Deliver extends Instruction {

    constructor(props) {

        super(props, { to: type(String), from: type(String), message: any });

    }

}

/**
 * map
 * @summary map :: Instruction<A> →  (A →  B) →  Instruction<B>
 */
export const map = i => f => match(i)
    .caseOf(Self, ({ next }) => i.copy({ next: compose(f, next) }))
    .caseOf(Raise, i => i)
    .caseOf(Instruction, ({ next }) => i.copy({ next: f(next) }))
    .end();

/**
 * self provides the actor from the context
 * @summary {self :: () →  Free<F<*>, ActorL>
 */
export const self = () => liftF(new Self({ next: id }));

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, Template)  →  Free<F<*>, Actor>
 */
export const create = (parent, template) => liftF(new Create({ parent, template }));

/**
 * raise an error within the system.
 * @summary raise :: Error →  Free<null,Error>
 */
export const raise = error => liftF(new Raise({ error }));

/**
 * deliver a message to another actor
 * @summary deliver :: (string, string, *) →  Free<F,null>
 */
export const deliver = (to, from, message) => liftF(new Deliver({ to, from, message }));

/**
 * dequeue a message from an actor's mailbox
 * @summary dequeue :: (* →  Free<F,*>,  a) →  Free<F,F>
 */
export const dequeue = (behaviour, actor) => liftF(new Dequeue({ behaviour, actor }));

/**
 * become
 * @summary become :: Free<Axiom,*> →  Free<F,*>
 */
export const become = axiom => liftF(new Become({ axiom }));
