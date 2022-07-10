"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PPVM = void 0;
const match_1 = require("@quenk/noni/lib/control/match");
const type_1 = require("@quenk/noni/lib/data/type");
const record_1 = require("@quenk/noni/lib/data/record");
const json_1 = require("@quenk/noni/lib/data/json");
const function_1 = require("@quenk/noni/lib/data/function");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const vm_1 = require("../../system/vm");
const __1 = require("..");
const REMOTE_ADDRESS = process.env.POTOO_ACTOR_ADDRESS;
/**
 * PPVM (Process PVM) is an implementation of PVM specific for child processes.
 */
class PPVM extends vm_1.PVM {
    static getInstance(conf = {}) {
        let vm = new PPVM({ getPlatform() { return vm; } }, (0, record_1.rmerge)(getConf(), conf));
        return vm;
    }
    /**
     * main method invoked by the default script.
     *
     * This installs handlers for "uncaughtExceptionMonitor" and "message",
     * forwading uncaught errors to the parent VM and inbound messages to the
     * correct actors.
     */
    static main() {
        process.on('uncaughtExceptionMonitor', e => process.send(new __1.Raise(REMOTE_ADDRESS, REMOTE_ADDRESS, e.message, e.stack)));
        let vm = PPVM.getInstance();
        //XXX: Envelope vs Send type needs to be sorted out.
        process.on('message', (m) => (0, match_1.match)(m)
            .caseOf(__1.shapes.send, (msg) => {
            vm.tell(msg.to, msg.message);
        })
            .orElse(function_1.noop)
            .end());
        let template = require(process.env.POTOO_ACTOR_MODULE)(vm);
        template = Array.isArray(template) ? template : [template];
        template.forEach((tmpl) => vm.spawn(vm, tmpl));
    }
    /**
     * identify overridden here to provide the address of the parent actor in the
     * main process for this VM.
     *
     * This will ensure all actors spawned here begin with that actor's address.
     */
    identify(ins) {
        if (ins === this)
            return (0, maybe_1.fromNullable)(process.env.POTOO_ACTOR_ADDRESS);
        return super.identify(ins);
    }
    /**
     * sendMessage overridden here to allow messages for actors not within this
     * system to sent upstream.
     */
    sendMessage(to, from, msg) {
        if (!to.startsWith(process.env.POTOO_ACTOR_ADDRESS)) {
            process.send(new __1.Send(to, from, msg));
            //TODO: This is a blatant lie because we have no idea of knowing if 
            // the actor exists.
            return true;
        }
        else {
            return super.sendMessage(to, from, msg);
        }
    }
}
exports.PPVM = PPVM;
const getConf = () => {
    if ((0, type_1.isString)(process.env.POTOO_PVM_CONF)) {
        let econf = (0, json_1.parse)(process.env.POTOO_PVM_CONF);
        if (econf.isRight())
            return econf.takeRight();
    }
    return {};
};
//# sourceMappingURL=vm.js.map