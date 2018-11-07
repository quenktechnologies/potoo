import * as must from 'must/register';
import { Immutable, Mutable, Case } from '../../../src/actor/resident';
import {Context} from '../../../src/actor/context';
import { system } from '../../../src/';

class A1 extends Mutable<void,Context> {

    receive = [];

    run() { }

}

class A2 extends Mutable<void,Context> {

    receive = [];

    run() { }

}

class A3 extends Immutable<String,Context> {

    receive = [

        new Case(String, (m: string) => { must(m).be('You said : \'Hello!\'') })

    ]

    run() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');

    }

}

class A3A extends Immutable<any,Context> {

    receive = [

        new Case(String, (m: string) => { this.tell('a3', `You said : '${m}'`) })

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

                must(s.state.contexts['a1'].actor).be.instanceOf(Mutable);
                must(s.state.contexts['a2'].actor).be.instanceOf(Mutable);
                must(s.state.contexts['a3'].actor).be.instanceOf(Immutable);

                setTimeout(() => {
                    must(s.state.contexts['a3/a3a'].actor).be.instanceOf(Immutable);
                    done();
                }, 200);

            })

        })

    })

})
