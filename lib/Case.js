"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kinda = function (o1, o2) {
    if ((typeof o1 === 'object') && (typeof o2 !== 'object')) {
        return false;
    }
    else {
        return Object
            .keys(o1)
            .every(function (k) {
            if (o2.hasOwnProperty(k)) {
                switch (typeof o1[k]) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        return o1[k] === o2[k];
                    case 'function':
                        if (o1[k] === String)
                            return (typeof o2[k] === 'string');
                        else if (o1[k] === Number)
                            return (typeof o2[k] === 'number');
                        else if (o1[k] === Boolean)
                            return (typeof o2[k] === 'boolean');
                        else
                            return (o2[k] instanceof o1[k]);
                    case 'object':
                        return exports.kinda(o1[k], o2[k]);
                }
            }
            else {
                return false;
            }
        });
    }
};
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = (function () {
    function Case(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    Case.prototype._execute = function (m) {
        var _this = this;
        setTimeout(function () { return _this.handler(m); }, 0);
    };
    /**
     * match checks if the supplied type satisfies this Case
     */
    Case.prototype.match = function (m) {
        switch (typeof this.type) {
            case 'number':
            case 'boolean':
            case 'string':
                if (m === this.type) {
                    this._execute(m);
                    return true;
                }
                else {
                    return false;
                }
            case 'function':
                if (m instanceof this.type) {
                    this._execute(m);
                    return true;
                }
                else if ((this.type === String) && (typeof m === 'string')) {
                    this._execute(m);
                    return true;
                }
                else if ((this.type === Number) && (typeof m === 'number')) {
                    this._execute(m);
                    return true;
                }
                else if ((this.type === Boolean) && (typeof m === 'boolean')) {
                    this._execute(m);
                    return true;
                }
                else {
                    this._execute(m);
                    return false;
                }
            case 'object':
                if (exports.kinda(this.type, m)) {
                    this._execute(m);
                    return true;
                }
            default:
                return false;
        }
    };
    return Case;
}());
exports.Case = Case;
//# sourceMappingURL=Case.js.map