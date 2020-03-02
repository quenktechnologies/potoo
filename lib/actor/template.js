"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var record_1 = require("@quenk/noni/lib/data/record");
var address_1 = require("./address");
exports.ACTION_RAISE = -0x1;
exports.ACTION_IGNORE = 0x0;
exports.ACTION_RESTART = 0x1;
exports.ACTION_STOP = 0x2;
/**
 * normalize a Template so that its is easier to work with.
 */
exports.normalize = function (t) { return record_1.merge(t, {
    id: t.id ? t.id : address_1.randomID(),
    children: record_1.isRecord(t.children) ?
        record_1.mapTo(t.children, function (c, k) { return record_1.merge(c, { id: k }); }) : t.children
}); };
//# sourceMappingURL=template.js.map