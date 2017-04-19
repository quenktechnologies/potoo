"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var must = require("must/register");
var src_1 = require("../../src");
var src_2 = require("../../src");
describe('spawning three actors', function () {
    it('should be possible', function (done) {
        var a1 = new src_1.LocalT({ id: 'a1' });
        var a2 = new src_1.LocalT({ id: 'a2' });
        var a3 = new src_1.LocalT({
            id: 'a3',
            start: function () {
                return src_2.spawn(new src_1.LocalT({
                    id: 'a3a', start: function () {
                        return src_2.receive(function (m) { return src_2.tell('a3', "You said : '" + m + "'"); });
                    }
                }))
                    .chain(function () { return src_2.tell('a3/a3a', 'Hello!'); })
                    .chain(function () { return src_2.finalReceive(function (m) {
                    must(m).be('You said : \'Hello!\'');
                    done();
                }); });
            }
        });
        return src_1.system({
            start: function () {
                return src_2.spawn(a1)
                    .chain(function () { return src_2.spawn(a2); })
                    .chain(function () { return src_2.spawn(a3); });
            }
        })
            .start()
            .map(function (s) {
            must(s.actors['a1']).be.instanceOf(src_1.ActorL);
            must(s.actors['a2']).be.instanceOf(src_1.ActorL);
            must(s.actors['a3']).be.instanceOf(src_1.ActorL);
            must(s.actors['a3/a3a']).be.instanceOf(src_1.ActorL);
            return s;
        })
            .run();
    });
});
//# sourceMappingURL=spawnThreeActors.js.map