"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.ACTION_STOP = exports.ACTION_RESTART = exports.ACTION_IGNORE = exports.ACTION_RAISE = void 0;
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
        record_1.mapTo(t.children, function (c, k) { return record_1.merge(c, { id: k }); }) :
        t.children ? t.children : []
}); };
//# sourceMappingURL=template.js.map