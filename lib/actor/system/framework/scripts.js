"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var push_1 = require("../vm/op/push");
var store_1 = require("../vm/op/store");
var load_1 = require("../vm/op/load");
var allocate_1 = require("../vm/op/allocate");
var run_1 = require("../vm/op/run");
var call_1 = require("../vm/op/call");
var tempcc_1 = require("../vm/op/tempcc");
var tempchild_1 = require("../vm/op/tempchild");
var cmp_1 = require("../vm/op/cmp");
var jump_1 = require("../vm/op/jump");
var add_1 = require("../vm/op/add");
var noop_1 = require("../vm/op/noop");
var script_1 = require("../vm/script");
var spawnCode = [
    new push_1.PushStr(0),
    new push_1.PushTemp(0),
    new push_1.PushFunc(0),
    new call_1.Call(2)
];
var spawnFuncCode = [
    new store_1.Store(0),
    new store_1.Store(1),
    new load_1.Load(1),
    new load_1.Load(0),
    new allocate_1.Allocate(),
    new store_1.Store(2),
    new load_1.Load(2),
    new run_1.Run(),
    new load_1.Load(1),
    new tempcc_1.TempCC(),
    new store_1.Store(3),
    new push_1.PushNum(0),
    new store_1.Store(4),
    new load_1.Load(3),
    new load_1.Load(4),
    new cmp_1.Cmp(),
    new jump_1.JumpIfOne(27),
    new load_1.Load(4),
    new load_1.Load(1),
    new tempchild_1.TempChild(),
    new load_1.Load(2),
    new call_1.Call(2),
    new load_1.Load(4),
    new push_1.PushNum(1),
    new add_1.Add(),
    new store_1.Store(4),
    new jump_1.Jump(13),
    new noop_1.Noop() // 27: do nothing (return)
];
/**
 * SpawnScript for spawning new actors and children from templates.
 */
var SpawnScript = /** @class */ (function (_super) {
    __extends(SpawnScript, _super);
    function SpawnScript(parent, tmp) {
        var _this = _super.call(this, [[], [parent], [function () { return spawnFuncCode; }], [tmp], [], []], spawnCode) || this;
        _this.parent = parent;
        _this.tmp = tmp;
        return _this;
    }
    return SpawnScript;
}(script_1.Script));
exports.SpawnScript = SpawnScript;
//# sourceMappingURL=scripts.js.map