"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMap = void 0;
const array_1 = require("@quenk/noni/lib/data/array");
const map_1 = require("./map");
/**
 * GroupMap is a mapping of group names to the addresses that form part of the
 * group.
 */
class GroupMap extends map_1.Map {
    /**
     * put the address of an actor into a group.
     */
    put(key, value) {
        let group = this.get(key).orJust(() => []).get();
        if (!(0, array_1.contains)(group, value))
            group.push(value);
        this.set(key, group);
        return this;
    }
}
exports.GroupMap = GroupMap;
//# sourceMappingURL=groups.js.map