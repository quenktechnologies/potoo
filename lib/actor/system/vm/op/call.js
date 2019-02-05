"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("../frame");
var _1 = require("./");
/**
 * Call a function.
 *
 * Pops:
 * 1: The function reference from the top of the stack.
 * 2: N arguments to be pushed onto the new Frame's stack.
 */
var Call = /** @class */ (function () {
    function Call(args) {
        this.args = args;
        this.code = _1.OP_CODE_CALL;
        this.level = _1.Level.Control;
    }
    Call.prototype.exec = function (e) {
        var curr = e.current().get();
        var actor = curr.actor, context = curr.context, script = curr.script, heap = curr.heap;
        var eitherFunc = curr.resolveFunction(curr.pop());
        if (eitherFunc.isLeft())
            return e.raise(eitherFunc.takeLeft());
        var f = eitherFunc.takeRight();
        var frm = new frame_1.Frame(actor, context, script, f(), [], heap);
        for (var i = 0; i < this.args; i++) {
            var _a = curr.pop(), value = _a[0], type = _a[1], location_1 = _a[2];
            frm.push(value, type, location_1);
        }
        e.push(frm);
    };
    Call.prototype.toLog = function (f) {
        var data = [f.peek()];
        for (var i = 1; i <= this.args; i++)
            data.push((f.peek(i)));
        return ['call', [this.args, frame_1.Type.Number, frame_1.Location.Literal], data];
    };
    return Call;
}());
exports.Call = Call;
//# sourceMappingURL=call.js.map