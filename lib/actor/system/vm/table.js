"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorTable = void 0;
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const record_1 = require("@quenk/noni/lib/data/record");
const address_1 = require("../../address");
const map_1 = require("./map");
/**
 * ActorTable is a map for storing bookkeeping information about all actors
 * within the system.
 *
 * If an actor is not in this table then it is not part of the system!
 */
class ActorTable extends map_1.Map {
    /**
     * getThread provides the thread for an actor (if any).
     */
    getThread(addr) {
        return this.get(addr).chain(ate => ate.thread);
    }
    /**
     * getChildren provides the [[ActorTableEntry]]'s of all the children for
     * the actor with the target address.
     *
     * While the list is not sequential, actors that are children of other
     * actors in the list are guaranteed to appear after their parents.
     */
    getChildren(addr) {
        if (!this.has(addr))
            return [];
        let firstRun = true;
        let idx = 0;
        let maxRec = 0;
        let unsortedItems = [];
        let items = (0, record_1.values)(this.items);
        let init = [[], []];
        while (true) {
            let result = items.reduce((prev, curr) => ((0, address_1.isChild)(addr, curr.context.address) ?
                [prev[0], [...prev[1], curr]] :
                [[...prev[0], curr], prev[1]]), init);
            if (firstRun) {
                if ((0, record_1.empty)(result[1]))
                    return result[1];
                items = result[1];
                unsortedItems = items.slice();
                addr = items[0].context.address;
                maxRec = items.length;
                firstRun = false;
            }
            else {
                items = [...result[0], ...result[1]];
                idx++;
                if (idx >= maxRec)
                    break;
                addr = unsortedItems[idx].context.address;
            }
        }
        return items;
    }
    /**
     * addressFromActor will provide the address of an actor given its instance.
     */
    addressFromActor(actor) {
        return (0, record_1.reduce)(this.items, (0, maybe_1.nothing)(), (pre, items, k) => items.context.actor === actor ? (0, maybe_1.fromString)(k) : pre);
    }
}
exports.ActorTable = ActorTable;
//# sourceMappingURL=table.js.map