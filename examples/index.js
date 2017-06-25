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
exports.__esModule = true;
var System_1 = require("potoo/lib/System");
var LocalActor_1 = require("potoo/lib/LocalActor");
var Behaviour_1 = require("potoo/lib/Behaviour");
var PACE = 5;
var MAX_PACE = '90%';
var MIN_PACE = '0%';
/* helper functions */
var left = function (handle) { return handle.style.left; };
var per2num = function (v) { return Number(v.split('%')[0]); };
var num2per = function (v) { return v + "%"; };
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(id, ctx) {
        var _this = _super.call(this, ctx) || this;
        _this.id = id;
        _this.ctx = ctx;
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
    Player.prototype.monitorKeys = function (e) {
        var _this = this;
        if (e.keyCode === 37)
            this.getPlayer().style.left = this.moveLeft(e);
        else if (e.keyCode === 39)
            this.getPlayer().style.left = this.moveRight(e);
        else
            console.log("ignored key code " + e.keyCode);
        this.receive(Behaviour_1.MatchAny.create(function (m) { return _this.monitorKeys(m); }));
    };
    Player.prototype.run = function () {
        var _this = this;
        window.onkeydown = function (e) { return _this.tell(_this.id, e); };
        this.receive(Behaviour_1.MatchAny.create(function (m) { return _this.monitorKeys(m); }));
    };
    return Player;
}(LocalActor_1.LocalActor));
System_1.System
    .create()
    .spawn(LocalActor_1.Template.from('player', function (ctx) { return new Player('player', ctx); }))
    .spawn(LocalActor_1.Template.from('clone', function (ctx) { return new Player('clone', ctx); }));
