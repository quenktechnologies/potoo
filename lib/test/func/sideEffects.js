"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var must = require("must/register");
var src_1 = require("../../src");
var src_2 = require("../../src");
describe('using side effects', function () {
    it('should be possible', function (done) {
        var a = new src_1.LocalT({
            id: 'A',
            start: function () { return src_2.spawn(new src_1.LocalT({
                id: 'C',
                start: function () {
                    return src_2.effect(function () { console.info('ok'); return 22; })
                        .chain(function (n) { return src_2.tell('A', n); });
                }
            })); }
        });
        return src_1.system({
            start: function () { return src_2.spawn(a); }
        })
            .start()
            .map(function (s) {
            must(s.actors['A'].mailbox.value).eql([22]);
            done();
        })
            .run();
    });
});
//# sourceMappingURL=sideEffects.js.map