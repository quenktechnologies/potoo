"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var record_1 = require("@quenk/noni/lib/data/record");
var json_1 = require("@quenk/noni/lib/data/json");
var scripts_1 = require("../resident/scripts");
var op_1 = require("../system/vm/runtime/op");
var event_1 = require("../system/vm/event");
var vm_1 = require("../system/vm");
//ENV vars:
//POTOO_ACTOR_ID
//POTOO_ACTOR_ADDRESS
//POTOO_PVM_CONF
var Sys = /** @class */ (function () {
    function Sys() {
        var _a;
        this.vm = vm_1.PVM.create(this, record_1.rmerge(getConf(), {
            on: (_a = {},
                _a[event_1.EVENT_SEND_FAILED] = function (from, _, to, message) { return process.send({
                    code: op_1.SEND,
                    to: to,
                    from: from,
                    message: message
                }); },
                _a)
        }));
    }
    Sys.prototype.exec = function (i, s) {
        this.vm.exec(i, s);
    };
    return Sys;
}());
var id = process.env.POTOO_ACTOR_ID;
var address = process.env.POTOO_ACTOR_ADDRESS;
var tellShape = {
    to: String,
    from: String,
    message: type_1.Any
};
var defaultConf = {};
var getConf = function () {
    if (type_1.isString(process.env.POTOO_PVM_CONF)) {
        var econf = json_1.parse(process.env.POTOO_PVM_CONF);
        if (econf.isRight())
            return econf.takeRight();
    }
    return defaultConf;
};
var main = function () {
    var sys = new Sys();
    process.on('uncaughtException', function (e) { return process.send({
        code: op_1.RAISE,
        error: e.stack,
        src: address,
        dest: address
    }); });
    sys.vm.spawn({
        id: id,
        create: function (s) {
            //TODO: Handle invalid messages?
            process.on('message', function (m) {
                return match_1.match(m)
                    .caseOf(tellShape, filterTell(sys.vm))
                    .orElse(function () { })
                    .end();
            });
            return require(process.env.POTOO_ACTOR_MODULE).create(s);
        }
    });
};
var filterTell = function (vm) {
    return function (_a) {
        var to = _a.to, message = _a.message;
        return vm.exec(vm, new scripts_1.Tell(to, message));
    };
};
main();
//# sourceMappingURL=script.js.map