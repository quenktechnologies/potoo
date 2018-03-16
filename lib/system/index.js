"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("@quenk/match");
var Either_1 = require("afpl/lib/monad/Either");
exports._Left = Either_1.Left;
exports._Right = Either_1.Right;
var Envelope_1 = require("./Envelope");
exports.Envelope = Envelope_1.Envelope;
var ActorSystem_1 = require("./ActorSystem");
exports.ActorSystem = ActorSystem_1.ActorSystem;
var PsuedoSystem_1 = require("./PsuedoSystem");
exports.PsuedoSystem = PsuedoSystem_1.PsuedoSystem;
/**
 * SEPERATOR used to seperate parent addresses from children.
 */
exports.SEPERATOR = '/';
/**
 * DEAD_ADDRESS
 */
exports.DEAD_ADDRESS = '<null>';
/**
 * mkChildPath produces the path for a child actor given its parent's path.
 *
 * This takes into account the fact that the parent path may be '/' and
 * should therefore no SEPERATOR should be added.
 */
exports.mkChildPath = function (seperator) { return function (id) { return function (parent) {
    return ((parent === seperator) || (parent === '')) ?
        "" + parent + id :
        "" + parent + seperator + id;
}; }; };
/**
 * validateId validates the id to be used for an actor.
 *
 * Current rules require the id to not contain slashes
 * or be '$'.
 */
exports.validateId = function (seperator) { return function (id) { return match_1.match(id)
    .caseOf('$', function () { return Either_1.left(new Error("Actors cannot use '$' as their id!")); })
    .caseOf(/[\w]+\//, function () { return Either_1.left(new Error("Actors cannot use '" + seperator + "' in their id!")); })
    .caseOf(String, function () { return Either_1.right(id); })
    .orElse(function () { return Either_1.left(new Error("Invalid value  \"" + id + "\" supplied for actor id!")); })
    .end(); }; };
//# sourceMappingURL=index.js.map