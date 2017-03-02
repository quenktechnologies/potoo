import must from 'must';
import { right, left } from 'potoo-lib/monad';
import { Type, copy } from 'potoo-lib/Type';

class T extends Type {}

class ST extends Type {

    constructor(props) {

        super(props, {

            name: v => typeof v !== 'string' ? left(new TypeError()) : right(v)

        });

    }

}

describe('Type', function() {

    it('should obey property checks', function() {

        must(() => new ST({ name: 1 })).throw(TypeError);

    });

});


describe('copy', function() {

    it('should retain the type', function() {

        let x = new T({ key: 'value' });
        let y = copy(x, { id: 22 });

        must(y).be.instanceOf(T);
        must(y.key).be('value');
        must(y.id).be(22);

    });

});
