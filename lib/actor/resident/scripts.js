"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskActorScript = exports.MutableActorScript = exports.CallbackActorScript = exports.ImmutableActorScript = exports.GenericResidentScript = void 0;
const op = require("../system/vm/runtime/op");
const events = require("../system/vm/event");
const errors = require("../system/vm/runtime/error");
const array_1 = require("@quenk/noni/lib/data/array");
const info_1 = require("../system/vm/script/info");
const scripts_1 = require("../system/vm/scripts");
// XXX: This needs to be updated when new functions are added to 
// residentCommonFunctions.
const receiveIdx = scripts_1.commonFunctions.length + 2;
const residentCommonFunctions = [
    ...scripts_1.commonFunctions,
    new info_1.NewFunInfo('notify', 0, [
        op.MAILCOUNT,
        op.IFZJMP | 5,
        op.MAILDQ,
        op.LDN | receiveIdx,
        op.CALL | 1,
        op.NOP // End
    ]),
    new info_1.NewForeignFunInfo('kill', 1, (thr, addr) => {
        thr.wait(thr.vm.kill(thr.context.actor, addr));
        return 0;
    })
];
/**
 * GenericResidentScript used by resident actors not declared here.
 */
class GenericResidentScript extends scripts_1.BaseScript {
    constructor() {
        super(...arguments);
        this.info = residentCommonFunctions;
    }
}
exports.GenericResidentScript = GenericResidentScript;
/**
 * ImmutableActorScript used by Immutable actor instances.
 */
class ImmutableActorScript extends scripts_1.BaseScript {
    constructor(actor) {
        super();
        this.actor = actor;
        this.info = [
            ...residentCommonFunctions,
            new info_1.NewForeignFunInfo('receive', 1, (thr, msg) => immutableExec(this.actor, thr, msg))
        ];
        this.code = [];
    }
}
exports.ImmutableActorScript = ImmutableActorScript;
/**
 * CallbackActorScript used by Callback actor instances.
 */
class CallbackActorScript extends scripts_1.BaseScript {
    constructor(actor) {
        super();
        this.actor = actor;
        this.info = [
            ...residentCommonFunctions,
            new info_1.NewForeignFunInfo('receive', 1, (thr, msg) => {
                let result = immutableExec(this.actor, thr, msg);
                this.actor.exit();
                return result;
            })
        ];
        this.code = [];
    }
}
exports.CallbackActorScript = CallbackActorScript;
/**
 * MutableActorScript used by Mutable actor instances.
 */
class MutableActorScript extends scripts_1.BaseScript {
    constructor(actor) {
        super();
        this.actor = actor;
        this.info = [
            ...residentCommonFunctions,
            new info_1.NewForeignFunInfo('receive', 1, (thr, msg) => {
                let { actor } = this;
                let vm = actor.system.getPlatform();
                if ((0, array_1.empty)(actor.$receivers)) {
                    thr.raise(new errors.NoReceiverErr(thr.context.address));
                    return 0;
                }
                if (actor.$receivers[0].test(msg)) {
                    let receiver = actor.$receivers.shift();
                    let future = receiver.apply(msg);
                    if (future)
                        thr.wait(future);
                    vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);
                    return 1;
                }
                else {
                    vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED, msg);
                    return 0;
                }
            }),
            new info_1.NewFunInfo('notify', 0, [
                op.MAILCOUNT,
                op.IFZJMP | 4,
                op.MAILDQ,
                op.CALL | receiveIdx,
                op.NOP // End
            ]),
        ];
        this.code = [];
    }
}
exports.MutableActorScript = MutableActorScript;
/**
 * TaskActorScript used by the Task actor.
 */
class TaskActorScript extends scripts_1.BaseScript {
    constructor() {
        super(...arguments);
        this.info = scripts_1.commonFunctions;
    }
}
exports.TaskActorScript = TaskActorScript;
const immutableExec = (actor, thr, msg) => {
    let vm = actor.system.getPlatform();
    if (actor.$receiver.test(msg)) {
        let future = actor.$receiver.apply(msg);
        if (future)
            thr.wait(future);
        vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);
        return 1;
    }
    else {
        vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED, msg);
        return 0;
    }
};
//# sourceMappingURL=scripts.js.map