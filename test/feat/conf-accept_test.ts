import { assert } from '@quenk/test/lib/assert';

import { Callback } from '../../lib/actor/resident/immutable/callback';
import { TestSystem } from '../actor/resident/fixtures/system';
import { Message } from '../../lib/actor/message';

class RootTeller extends Callback<void> {

    receive() {

      return  [];

    }

    run() {

        this.tell('$', 'hello!');

    }

}

describe('conf-accept', () => {

    it('should be invoked when the system receives a message', () => {

        let msgs = <string[]>[];

        let vm = new TestSystem({

            accept: (m: Message) => { msgs.push(m); }

        });

        vm.spawn({ id: '/', create: s => new RootTeller(s) });

        assert(msgs).equate(['hello!']);

    });

});
