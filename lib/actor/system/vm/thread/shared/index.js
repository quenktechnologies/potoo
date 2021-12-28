"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedThread = void 0;
var errors = require("../../runtime/error");
var op = require("../../runtime/op");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var array_1 = require("@quenk/noni/lib/data/array");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var frame_1 = require("../../runtime/stack/frame");
var type_1 = require("../../type");
var __1 = require("../");
var runner_1 = require("./runner");
/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Actual code execution takes place in a SharedThreadRunner which queues up
 * ExecutionFrame on behalf every SharedThread in the system.
 */
var SharedThread = /** @class */ (function () {
    function SharedThread(vm, script, runner, context) {
        this.vm = vm;
        this.script = script;
        this.runner = runner;
        this.context = context;
        this.fstack = [];
        this.fsp = 0;
        this.rp = 0;
        this.state = __1.THREAD_STATE_IDLE;
    }
    /**
     * makeFrameName produces a suitable name for a Frame given its function
     * name.
     */
    SharedThread.prototype.makeFrameName = function (funName) {
        return array_1.empty(this.fstack) ?
            this.context.template.id + "@" + this.context.aid + "#" + funName :
            array_1.tail(this.fstack).name + "/" + funName;
    };
    SharedThread.prototype.invokeVM = function (p, f) {
        var frm = new frame_1.StackFrame(this.makeFrameName(f.name), p.script, this, maybe_1.just(p), f.code.slice());
        for (var i = 0; i < f.argc; i++)
            frm.push(p.pop());
        this.fstack.push(frm);
        this.fsp = this.fstack.length - 1;
        this.runner.run();
    };
    SharedThread.prototype.invokeForeign = function (frame, fun, args) {
        //TODO: Support async functions.   
        var val = fun.exec.apply(null, __spreadArrays([this], args));
        frame.push(this.vm.heap.intern(frame, val));
        this.runner.run();
    };
    SharedThread.prototype.wait = function (task) {
        var _this = this;
        this.state = __1.THREAD_STATE_WAIT;
        var onError = function (e) {
            _this.state = __1.THREAD_STATE_ERROR;
            _this.raise(e);
        };
        var onSuccess = function () {
            _this.state = __1.THREAD_STATE_IDLE;
            _this.runner.run(); // Continue execution.
        };
        task.fork(onError, onSuccess);
    };
    SharedThread.prototype.raise = function (e) {
        this.state = __1.THREAD_STATE_ERROR;
        this.vm.raise(this.context.actor, e);
    };
    SharedThread.prototype.die = function () {
        var that = this;
        this.runner.dequeue(this);
        return future_1.doFuture(function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ret = that.context.actor.stop();
                        if (!ret) return [3 /*break*/, 2];
                        return [4 /*yield*/, ret];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        that.vm.heap.threadExit(that);
                        return [2 /*return*/, future_1.pure(undefined)];
                }
            });
        });
    };
    SharedThread.prototype.restore = function (eframe) {
        this.fstack = eframe.fstack;
        this.fsp = eframe.fsp;
        this.rp = eframe.rp;
        this.state = __1.THREAD_STATE_RUN;
    };
    SharedThread.prototype.processNextFrame = function (rp) {
        this.vm.heap.frameExit(this.fstack.pop());
        this.fsp--;
        this.rp = rp;
        this.state = __1.THREAD_STATE_IDLE;
    };
    SharedThread.prototype.exec = function (name, args) {
        var _this = this;
        if (args === void 0) { args = []; }
        var script = this.script;
        var fun = script.info.find(function (info) {
            return (info.name === name) && info.descriptor === type_1.TYPE_FUN;
        });
        if (!fun)
            return this.raise(new errors.UnknownFunErr(name));
        var frame = new frame_1.StackFrame(this.makeFrameName(fun.name), script, this, maybe_1.nothing(), fun.foreign ?
            [op.LDN | this.script.info.indexOf(fun), op.CALL] :
            fun.code.slice());
        frame.data = args.map(function (arg) { return _this.vm.heap.intern(frame, arg); });
        this.runner.enqueue(new runner_1.ExecutionFrame(this, [frame]));
        this.runner.run();
    };
    return SharedThread;
}());
exports.SharedThread = SharedThread;
//# sourceMappingURL=index.js.map