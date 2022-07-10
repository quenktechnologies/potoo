"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterMap = void 0;
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const record_1 = require("@quenk/noni/lib/data/record");
const map_1 = require("./map");
/**
 * RouterMap is a mapping of address prefixes to the address of an actor that
 * serves as a router for any address beneath the prefix.
 */
class RouterMap extends map_1.Map {
    /**
     * getFor attempts to find a router for the specified address.
     */
    getFor(addr) {
        return (0, record_1.reduce)(this.items, (0, maybe_1.nothing)(), (prev, curr) => addr.startsWith(curr) ?
            (0, maybe_1.just)(curr) : prev);
    }
}
exports.RouterMap = RouterMap;
//# sourceMappingURL=routers.js.map