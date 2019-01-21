import { assert } from '@quenk/test/lib/assert';
import { nothing } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../../src/actor/context';
import { Constants, Script } from '../../../../src/actor/system/vm/script';
import { NullPointerErr } from '../../../../src/actor/system/vm/error';
import { Type, Location, Frame } from '../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../fixtures/mocks';

describe('frame', () => {

    describe('Frame', () => {

        describe('push', () => {

            it('should push the right type onto the stack', () => {

                let newF = () => new Frame(new Script(), newContext());

                assert(newF().push(1, Type.Number, Location.Literal).data)
                    .equate([
                        1,
                        Type.Number,
                        Location.Literal
                    ]);

                assert(newF().push(1, Type.String, Location.Constants).data)
                    .equate([
                        1,
                        Type.String,
                        Location.Constants
                    ]);

                assert(newF().push(1, Type.Function, Location.Constants).data)
                    .equate([
                        1,
                        Type.Function,
                        Location.Constants
                    ]);

                assert(newF().push(1, Type.Template, Location.Constants).data)
                    .equate([
                        1,
                        Type.Template,
                        Location.Constants
                    ]);

                assert(newF().push(1, Type.Message, Location.Constants).data)
                    .equate([
                        1,
                        Type.Message,
                        Location.Constants
                    ]);

            });

        });

        describe('resolve', () => {

            it('should return literals', () => {

                let f = new Frame(new Script(), newContext());
                assert(f.resolve([12, Type.Number, Location.Literal]).takeRight())
                    .equate(12);

            });

            it('should return constants', () => {

                let c: Constants<Context, SystemImpl> = [[], ['hello'], [], [], []];
                let f = new Frame(new Script(c), newContext());

                assert(f.resolve([0, Type.String, Location.Constants]).takeRight())
                    .equate('hello');

            });

            it('should resolve locals', () => {

                let c: Constants<Context, SystemImpl> = [
                    [], ['hello', 'world'], [], [], []
                ];

                let f = new Frame(new Script(c), newContext(), [], [
                    1, Type.String, Location.Local
                ]);

                assert(f.resolve([1, Type.String, Location.Constants]).takeRight())
                    .equal('world');

            });

            it('should resolve from the heap', () => {

                let f = new Frame(new Script(), newContext(), [], [], [], [
                    Date
                ]);

                assert(f.resolve([0, Type.Message, Location.Heap]).takeRight())
                    .equal(Date);

            });

            it('should return an error if the reference does not exist', () => {

                let f = new Frame(new Script(), newContext());
                assert(f.resolve([12, 1, 1]).takeLeft())
                    .be.instance.of(NullPointerErr);

            });

        });

    });

});
