"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var __1 = require("../../");
var raise_1 = require("../system/op/raise");
var tell_1 = require("../system/op/tell");
var discard_1 = require("../system/op/discard");
var id = process.env.POTOO_ACTOR_ID;
var address = process.env.POTOO_ACTOR_ADDRESS;
var tellShape = {
    to: String,
    from: String,
    message: type_1.Any
};
var sys = __1.system({
    hooks: {
        drop: function (_a) {
            var to = _a.to, from = _a.from, message = _a.message;
            return process.send(new tell_1.Tell(to, from, message));
        }
    }
});
var filter = function (s) { return function (m) { return match_1.match(m)
    .caseOf(tellShape, filterTell(s))
    .orElse(function (m) { return s.exec(new discard_1.Discard(address, address, m)); })
    .end(); }; };
var filterTell = function (s) { return function (_a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return s.exec(new tell_1.Tell(to, from, message));
}; };
process.on('uncaughtException', function (e) {
    return process.send(new raise_1.Raise({ message: e.stack }, address, address));
});
sys.spawn({
    id: id,
    create: function (s) {
        process.on('message', filter(s));
        return require(process.env.POTOO_ACTOR_MODULE).create(s);
    }
});
//# sourceMappingURL=script.js.map