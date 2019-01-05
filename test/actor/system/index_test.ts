import {must} from '@quenk/must';
import { CaseClass } from '../../../src/actor/resident/case';
import { Immutable, Mutable  } from '../../../src/actor/resident';
import {Context} from '../../../src/actor/context';
import {ActorSystem, system } from '../../../src/';

class A1 extends Mutable<Context,ActorSystem> {

    receive = [];

    run() { }

}

class A2 extends Mutable<Context, ActorSystem> {

    receive = [];

    run() { }

}

class A3 extends Immutable<String,Context,ActorSystem> {

    receive = [

        new CaseClass(String, (m: string) => { must(m).equal('You said : \'Hello!\'') })

    ]

    run() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');

    }

}

class A3A extends Immutable<any,Context,ActorSystem> {

    receive = [

        new CaseClass(String, (m: string) => { this.tell('a3', `You said : '${m}'`) })

    ]

    run() { }

}

describe('system', function() {

    describe('ActorSystem', () => {

        describe('spawn', () => {

            it('should spawn actors', done => {

                let s = system({})
                    .spawn({ id: 'a1', create: s => new A1(s) })
                    .spawn({ id: 'a2', create: s => new A2(s) })
                    .spawn({ id: 'a3', create: s => new A3(s) });

              must(s.state.contexts['a1'].actor).be.instance.of(Mutable);
                must(s.state.contexts['a2'].actor).be.instance.of(Mutable);
                must(s.state.contexts['a3'].actor).be.instance.of(Immutable);

                setTimeout(() => {
                    must(s.state.contexts['a3/a3a'].actor).be.instance.of(Immutable);
                    done();
                }, 200);

            })

        })

    })

})
