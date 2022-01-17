"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_1 = require("@quenk/noni/lib/control/match");
const type_1 = require("@quenk/noni/lib/data/type");
const record_1 = require("@quenk/noni/lib/data/record");
const json_1 = require("@quenk/noni/lib/data/json");
const op_1 = require("../system/vm/runtime/op");
const event_1 = require("../system/vm/event");
const vm_1 = require("../system/vm");
//ENV vars:
//POTOO_ACTOR_ID
//POTOO_ACTOR_ADDRESS
//POTOO_PVM_CONF
class Sys {
    constructor() {
        this.vm = vm_1.PVM.create(this, (0, record_1.rmerge)(getConf(), {
            on: {
                [event_1.EVENT_SEND_FAILED]: (from, _, to, message) => process.send({
                    code: op_1.SEND,
                    to,
                    from,
                    message
                })
            }
        }));
    }
    getPlatform() {
        return this.vm;
    }
}
const id = process.env.POTOO_ACTOR_ID;
const address = process.env.POTOO_ACTOR_ADDRESS;
const tellShape = {
    to: String,
    from: String,
    message: type_1.Any
};
const defaultConf = {};
const getConf = () => {
    if ((0, type_1.isString)(process.env.POTOO_PVM_CONF)) {
        let econf = (0, json_1.parse)(process.env.POTOO_PVM_CONF);
        if (econf.isRight())
            return econf.takeRight();
    }
    return defaultConf;
};
const main = () => {
    let sys = new Sys();
    process.on('uncaughtException', e => {
        process.send({
            code: op_1.RAISE,
            message: e.message,
            stack: e.stack,
            src: address,
            dest: address
        });
        process.exit(-1);
    });
    sys.vm.spawn(sys.vm, {
        id,
        create: (s) => {
            //TODO: Handle invalid messages?
            process.on('message', (m) => (0, match_1.match)(m)
                .caseOf(tellShape, filterTell(sys.vm))
                .orElse(() => { })
                .end());
            return require(process.env.POTOO_ACTOR_MODULE).create(s);
        }
    });
};
const filterTell = (vm) => ({ to, message }) => vm.tell(to, message);
main();
//# sourceMappingURL=script.js.map