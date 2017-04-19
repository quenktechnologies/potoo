"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
require("mocha");
var must = require("must/register");
var fluture_1 = require("fluture");
var src_1 = require("../../src");
var src_2 = require("../../src");
describe('using futures', function () {
    it('should be possible', function (done) {
        var a = new src_1.LocalT({ id: 'A' });
        var b = new src_1.LocalT({ id: 'B' });
        var c = new src_1.LocalT({
            id: 'C',
            start: function () {
                return src_2.task(fluture_1.Future.node(function (done) { return fs.readFile(__dirname + "/afile.txt", done); }), 'A');
            }
        });
        return src_1.system({
            start: function () {
                return src_2.spawn(a)
                    .chain(function () { return src_2.spawn(b); })
                    .chain(function () { return src_2.spawn(c); });
            }
        })
            .start()
            .map(function (s) {
            setTimeout(function () {
                must(String(s.actors['A'].mailbox.value[0])).be('davis\n');
                done();
            }, 1000);
        })
            .run();
    });
});
//# sourceMappingURL=talkInTheFuture.js.map