import { assert } from '@quenk/test/lib/assert';
import { Err } from '@quenk/noni/lib/control/error';
import { just } from '@quenk/noni/lib/data/maybe';
import { This } from '../../../../../src/actor/system/vm/runtime/this';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame } from '../../../../../src/actor/system/vm/frame';
import { ACTION_RAISE, ACTION_IGNORE } from '../../../../../src/actor/template';
import { 
  Context,
  SystemImpl,
  InstanceImpl,
  newContext } from '../../../../fixtures/mocks';

describe('runtime', () => {

    describe('This', () => {

        describe('raise', () => {

            it('should throw unhandled errors', () => {

                let thrown = false;
                let r = new This('/', new SystemImpl(), [
                    new Frame('/', newContext(), new Script())
                ]);

                r.system.state.contexts['/'] = newContext();

                try {

                    r.raise(new Error('an error'));

                } catch (e) {

                    if (e.message === 'an error') {

                        thrown = true;

                    } else {

                        throw e;

                    }

                }

                assert(thrown).true();

            });

            it('should escalate when instructed', () => {

                let escalated = false;

                let s = new SystemImpl();

                let parent: Context = {

                    mailbox: just([]),

                    actor: new InstanceImpl(),

                    behaviour: [],

                    flags: { immutable: true, buffered: true },

                    handler: new This('/', s),

                    template: {

                        id: '/',

                        create: () => new InstanceImpl(),

                        trap: (e: Err) => {

                            if (e.message === 'an error')
                                escalated = true;

                            return ACTION_IGNORE;

                        }
                    }
                };

                let foo: Context = {

                    mailbox: just([]),

                    actor: new InstanceImpl(),

                    behaviour: [],

                    flags: { immutable: true, buffered: true },

                    handler: new This('/foo', s),

                    template: {

                        id: '/foo',

                        create: () => new InstanceImpl(),

                        trap: () => ACTION_RAISE

                    }

                };

                let bar: Context = {

                    mailbox: just([]),

                    actor: new InstanceImpl(),

                    behaviour: [],

                    flags: { immutable: true, buffered: true },

                    handler: new This('/foo/bar', s),

                    template: {

                        id: '/foo/bar',

                        create: () => new InstanceImpl(),

                        trap: () => ACTION_RAISE

                    }

                }

                let r = new This('/foo/bar', s, [
                    new Frame('/foo/bar', parent, new Script())
                ]);

                r.system.state.contexts['/'] = parent;
                r.system.state.contexts['/foo'] = foo;
                r.system.state.contexts['/foo/bar'] = bar;

                r.raise(new Error('an error'));

                assert(escalated).true();

            });

        });

    });

});
