"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sys = require("../lib/system");
var local = require("../lib/actor/local");
var PACE = 5;
var MAX_PACE = '90%';
var MIN_PACE = '0%';
/* helper functions */
var left = function (handle) { return handle.style.left; };
var per2num = function (v) { return Number(v.split('%')[0]); };
var num2per = function (v) { return v + "%"; };
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(s, id) {
        var _this = _super.call(this, s) || this;
        _this.id = id;
        _this.receive = [
            new local.Case(KeyboardEvent, function (e) {
                if (e.keyCode === 37)
                    _this.getPlayer().style.left = _this.moveLeft(e.target);
                else if (e.keyCode === 39)
                    _this.getPlayer().style.left = _this.moveRight(e.target);
                else
                    console.log("ignored key code " + e.keyCode);
            })
        ];
        return _this;
    }
    Player.prototype.getEntity = function (id) {
        return document.getElementById(id);
    };
    Player.prototype.getPlayer = function () {
        return this.getEntity(this.id);
    };
    Player.prototype.moveRight = function (handle) {
        return (left(handle) !== MAX_PACE) ?
            handle.style.left = num2per(per2num(left(handle)) + PACE) : null;
    };
    Player.prototype.moveLeft = function (handle) {
        return (left(handle) !== MIN_PACE) ?
            handle.style.left = num2per(per2num(left(handle)) - PACE) : null;
    };
    Player.prototype.run = function () {
        var _this = this;
        window.onkeydown = function (e) { return _this.tell(_this.id, e); };
    };
    return Player;
}(local.Immutable));
sys
    .ActorSystem
    .create()
    .spawn({ id: 'player', create: function (s) { return new Player(s, 'player'); } })
    .spawn({ id: 'clone', create: function (s) { return new Player(s, 'clone'); } });
//# sourceMappingURL=index.js.map