import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../src/actor/system/vm/script';
import { NullPointerErr, TypeErr } from '../../../../src/actor/system/vm/error';
import { Type, Location, Frame } from '../../../../src/actor/system/vm/frame';
import {
    Constants,
    SystemImpl,
    InstanceImpl,
    newContext
} from '../../../fixtures/mocks';

class Int {

    code = 1000;

    level = 7;

    exec(): void {


    }

    toLog() {

        return 'int';

    }

}

const frame = (c: Constants) =>
    new Frame('self', newContext(), new Script(c));

describe('frame', () => {

    describe('Frame', () => {

        describe('push', () => {

            it('should push values onto the stack', () => {

                let newF = () => new Frame('self', newContext(), new Script());

                assert(newF().push(1, Type.Number, Location.Literal).data)
                    .equate([
                        Location.Literal,
                        Type.Number,
                        1
                    ]);

                assert(newF().push(1, Type.String, Location.Constants).data)
                    .equate([
                        Location.Constants,
                        Type.String,
                        1
                    ]);

                assert(newF().push(1, Type.Function, Location.Constants).data)
                    .equate([
                        Location.Constants,
                        Type.Function,
                        1
                    ]);

                assert(newF().push(1, Type.Template, Location.Constants).data)
                    .equate([
                        Location.Constants,
                        Type.Template,
                        1
                    ]);

                assert(newF().push(1, Type.Message, Location.Constants).data)
                    .equate([
                        Location.Constants,
                        Type.Message,
                        1
                    ]);

            });

        });

        describe('resolve', () => {

            it('should return literals', () => {

                let f = new Frame('self', newContext(), new Script());
                assert(f.resolve([12, Type.Number, Location.Literal]).takeRight())
                    .equate(12);

            });

            it('should return constants', () => {

                let c: Constants = [[], ['hello'], [], [], [], []];
                let f = frame(c);

                assert(f.resolve([0, Type.String, Location.Constants]).takeRight())
                    .equate('hello');

            });

            it('should resolve locals', () => {

                let c: Constants = [
                    [], ['hello', 'world'], [], [], [], []
                ];

                let f = new Frame('self', newContext(), new Script(c), [], [
                    1, Type.String, Location.Local
                ]);

                assert(f.resolve([1, Type.String, Location.Constants]).takeRight())
                    .equal('world');

            });

            it('should resolve from the heap', () => {

                let f = new Frame('self', newContext(), new Script(), [], [], [], [
                    Date
                ]);

                assert(f.resolve([0, Type.Message, Location.Heap]).takeRight())
                    .equal(Date);

            });

            it('should return an error if the reference does not exist', () => {

                let f = new Frame('self', newContext(), new Script());
                assert(f.resolve([12, 1, 1]).takeLeft())
                    .be.instance.of(NullPointerErr);

            });

        });

        describe('resolveNumber', function() {

            it('should resolve numbers', () => {

                let f = frame(<Constants>[[], [], [], [], [], []]);

                assert(f.resolveNumber([12, Type.Number, Location.Literal])
                    .takeRight()).equal(12);

            });

            it('should raise otherwise', () => {

                let f = frame(<Constants>[[], [], [], [], [], []]);

                assert(f.resolveNumber([12, Type.String, Location.Literal])
                    .takeLeft()).be.instance.of(TypeErr);

            });

        });

        describe('resolveAddress', function() {

            const c: Constants = [[], ['q', 'b'], [], [], [], []];

            it('should resolve strings', () => {

                let f = frame(c);

                assert(f.resolveAddress([1, Type.String, Location.Constants])
                    .takeRight()).equal('b');

            });

            it('should raise otherwise', () => {

                let f = frame(c);;

                assert(f.resolveAddress([1, Type.Number, Location.Constants])
                    .takeLeft()).be.instance.of(TypeErr);

            });

        });

        describe('resolveFunction', function() {

            const c: Constants = [[], [], [() => [new Int()]], [], [], []];

            it('should resolve functions', () => {

                let f = frame(c);

                assert(f.resolveFunction([0, Type.Function, Location.Constants])
                    .takeRight()).equal(c[2][0]);

            });

            it('should raise otherwise', () => {

                let f = frame(c);;

                assert(f.resolveFunction([0, Type.Template, Location.Constants])
                    .takeLeft()).be.instance.of(TypeErr);

            });

        });

        describe('resolveTemplate', function() {

            const temp = { id: 'foo', create: (_: SystemImpl) => new InstanceImpl() };
            const c: Constants = [[], [], [], [temp], [], []];

            it('should resolve templates', () => {

                let f = frame(c);

                assert(f.resolveTemplate([0, Type.Template, Location.Constants])
                    .takeRight()).equal(c[3][0]);

            });

            it('should raise otherwise', () => {

                let f = frame(c);;

                assert(f.resolveTemplate([0, Type.Function, Location.Constants])
                    .takeLeft()).be.instance.of(TypeErr);

            });

        });

    });

});
