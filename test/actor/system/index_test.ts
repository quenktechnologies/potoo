import * as must from 'must/register';
import { Immutable, Mutable, Case } from '../../../src/actor/resident';
import { system } from '../../../src/';

class A1 extends Mutable<void> {

    receive = [];

}

class A2 extends Mutable<void> {

    receive = [];

}

class A3 extends Immutable<String> {

    receive = [

        new Case(String, (m: string) => { must(m).be('You said : \'Hello!\'') })

    ]

    onRun() {

        this.spawn({ id: 'a3a', create: s => new A3A(s) });
        this.tell('a3/a3a', 'Hello!');

    }

}

class A3A extends Immutable<any> {

    receive = [

        new Case(String, (m: string) => { this.tell('a3', `You said : '${m}'`) })

    ]

}

describe('system', function() {

    describe('ActorSystem', () => {

        describe('spawn', () => {

            it('should spawn actors', (done) => {

                let s = system()
                    .spawn({ id: 'a1', create: s => new A1(s) })
                    .spawn({ id: 'a2', create: s => new A2(s) })
                    .spawn({ id: 'a3', create: s => new A3(s) });

                must(s.actors.frames['a1'].actor).be.instanceOf(Mutable);
                must(s.actors.frames['a2'].actor).be.instanceOf(Mutable);
                must(s.actors.frames['a3'].actor).be.instanceOf(Immutable);

                setTimeout(() => {
                    must(s.actors.frames['a3/a3a'].actor).be.instanceOf(Immutable);
                    done();
                }, 200);

            })

        })

    })

})
