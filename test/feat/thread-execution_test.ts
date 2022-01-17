import * as op from '../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { Immutable } from '../../lib/actor/resident/immutable';
import { NewForeignFunInfo, NewFunInfo } from '../../lib/actor/system/vm/script/info';
import { Thread } from '../../lib/actor/system/vm/thread';
import { SharedThread } from '../../lib/actor/system/vm/thread/shared';
import { system } from '../actor/resident/fixtures/system';
import { Job } from '../../lib/actor/system/vm/thread/shared';

describe('thread execution', function() {

    it('should stop when the thread is dying', () => {

        class TestActor extends Immutable<string> { }

        let sys = system();

        let actor = new TestActor(sys);

        sys.spawn({ id: 'test', create: () => actor })

        let counter = 0;

        let func = new NewForeignFunInfo('test', 0, (thr: Thread) => {

            counter++;

            if (counter === 2)
                thr.die();

            return counter;

        });

        let thread: SharedThread = <SharedThread>sys.vm.state.threads['test'];

        thread.script.info.push(func);

        let idx = thread.script.info.length - 1;

        let main = new NewFunInfo('main', 0, [

            op.LDN | idx,
            op.CALL,
            op.LDN | idx,
            op.CALL,
            op.LDN | idx,
            op.CALL

        ]);

        thread.scheduler.postJob(new Job(thread, main, []));

        assert(counter).equal(2);

    });

});
