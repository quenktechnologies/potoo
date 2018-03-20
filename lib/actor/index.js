"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("afpl/lib/monad/Either");
/**
 * rejected
 */
exports.rejected = function (_) { return Either_1.left('reject'); };
/**
 * accepted
 */
exports.accepted = function (_) { return Either_1.right('accept'); };
//# sourceMappingURL=index.js.map