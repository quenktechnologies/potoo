import must from 'must';
import { right, left } from 'potoo-lib/monad';
import { Type, copy } from 'potoo-lib/Type';

class ST extends Type {

    constructor(props) {

        super(props, {

            name: v => typeof v !== 'string' ? left(new TypeError()) : right(v),
            id: v => right(v)

        });

    }

}

describe('Type', function() {

    it('should obey property checks', function() {

        must(() => new ST({ name: 1 })).throw(Error);

    });

});

describe('copy', function() {

    it('should retain the type', function() {

        let x = new ST({ name: 'value' });
        let y = copy(x, { id: 22 });
        let z = x.copy({ id: 22 });

        must(y).be.instanceOf(ST);
        must(y.name).be('value');
        must(y.id).be(22);
        must(z.name).be('value');
        must(z.id).be(22);

    });

});
