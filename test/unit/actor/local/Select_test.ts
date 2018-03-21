import * as must from 'must/register';
import { Select, Case } from '../../../../lib/actor/local';
import { Envelope } from '../../../../lib/system/Envelope';
import { MockSystem } from '../../../fixtures';

describe('Select', function() {

    describe('apply', function() {

        it('should disappear after processing a message', done => {

            let c = 0;
            let sel = new Select([new Case('msg', () => { c = c + 1; })], new MockSystem());
            let e = new Envelope('?', '?', 'msg');

            sel
                .apply(e)
                .chain(b => b.apply(e))

            setTimeout(() => { must(c).be(1); done(); }, 100);

        })


    });

});
