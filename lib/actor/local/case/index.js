"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kindof_1 = require("@quenk/kindof");
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = /** @class */ (function () {
    function Case(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    /**
     * match checks if the supplied type satisfies this Case
     */
    Case.prototype.match = function (m) {
        var _this = this;
        var r = kindof_1.kindOf(m, this.type);
        //setTimeout is needed to keep things going.
        if (r)
            setTimeout(function () { return _this.handler(m); }, 0);
        return r;
    };
    return Case;
}());
exports.Case = Case;
/**
 * combine two or more CaseFunctions to produce a single function that when
 * given a value produces an array of Cases.
 */
exports.combine = function () {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (a) { return fs.map(function (f) { return f(a); }); };
};
/**
 * combineA combines two or more CaseListFunctions to produce a single function
 * that when given a value produces a combined array of Cases.
 */
exports.combineA = function () {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (a) { return fs.reduce(function (p, f) { return p.concat(f(a)); }, []); };
};
exports.combineA3 = function (f, g, h) {
    return function (a) { return f(a).concat(g(a), h(a)); };
};
//# sourceMappingURL=index.js.map