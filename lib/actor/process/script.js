"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var op_1 = require("../system/vm/op");
var default_1 = require("../system/default");
var scripts_1 = require("../resident/scripts");
var id = process.env.POTOO_ACTOR_ID;
var address = process.env.POTOO_ACTOR_ADDRESS;
var tellShape = {
    to: String,
    from: String,
    message: type_1.Any
};
var sys = default_1.system({
    hooks: {
        drop: function (_a) {
            var to = _a.to, from = _a.from, message = _a.message;
            return process.send({
                code: op_1.OP_CODE_TELL,
                to: to,
                from: from,
                message: message
            });
        }
    }
});
var filter = function (s) { return function (m) {
    return match_1.match(m)
        .caseOf(tellShape, filterTell(s))
        .orElse(fitlerDrop(s))
        .end();
}; };
var filterTell = function (s) {
    return function (_a) {
        var to = _a.to, message = _a.message;
        return s.exec(s, new scripts_1.TellScript(to, message));
    };
};
var fitlerDrop = function (s) { return function (m) {
    return s.exec(s, new scripts_1.DropScript(m));
}; };
process.on('uncaughtException', function (e) {
    return process.send({
        code: op_1.OP_CODE_RAISE,
        error: e.stack,
        src: address,
        dest: address
    });
});
sys.spawn({
    id: id,
    create: function (s) {
        process.on('message', filter(s));
        return require(process.env.POTOO_ACTOR_MODULE).create(s);
    }
});
//# sourceMappingURL=script.js.map