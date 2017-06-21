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
var LocalContext_1 = require("./LocalContext");
var Template_1 = require("./Template");
/**
 * Template is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
var Template = (function (_super) {
    __extends(Template, _super);
    function Template(id, actorFn) {
        var _this = _super.call(this, id) || this;
        _this.id = id;
        _this.actorFn = actorFn;
        return _this;
    }
    /**
     * from constructs a new Template using the specified parameters.
     */
    Template.from = function (id, fn) {
        return new Template(id, fn);
    };
    Template.prototype.create = function (path, s) {
        return new LocalContext_1.LocalContext(path, this.actorFn, s);
    };
    return Template;
}(Template_1.Template));
exports.Template = Template;
/**
 * LocalActor
 */
var LocalActor = (function () {
    function LocalActor(context) {
        this.context = context;
    }
    LocalActor.prototype.run = function () { };
    LocalActor.prototype.spawn = function (t) {
        return this.context.spawn(t);
    };
    LocalActor.prototype.tell = function (ref, m) {
        return this.context.tell(ref, m);
    };
    LocalActor.prototype.ask = function (ref, m) {
        return this.context.ask(ref, m);
    };
    LocalActor.prototype.receive = function (b) {
        return this.context.receive(b);
    };
    return LocalActor;
}());
exports.LocalActor = LocalActor;
//# sourceMappingURL=LocalActor.js.map