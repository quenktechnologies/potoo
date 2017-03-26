import * as Instruction from 'potoo-lib/Instruction';
import * as Actor from 'potoo-lib/Actor';
import { mapTest, mapTestGet, apiTest, apiTestGet } from './helpers';

describe('map', function() {

    it('should work properly', function() {

        mapTestGet(12, 144, new Instruction.Self({ next: x => x }));

        mapTest(144, new Instruction.Create({
            parent: '/',
            template: new Actor.LocalT({ id: 'x' }),
            next: 12
        }));

        mapTest(12, new Instruction.Raise({ error: new Error(), next: 12 }));

        mapTest(144, new Instruction.Deliver({to:'/', from:'/x', message:'hi', next:12}));

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
