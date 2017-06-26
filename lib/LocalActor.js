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
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
var LocalActor = (function () {
    function LocalActor(context) {
        this.context = context;
    }
    /**
     * run is called each time the actor is created.
     */
    LocalActor.prototype.run = function () { };
    /**
     * self returns the address of this actor.
     */
    LocalActor.prototype.self = function () {
        return this.context.path;
    };
    /**
     * spawn a new child actor using the passed template.
     */
    LocalActor.prototype.spawn = function (t) {
        return this.context.spawn(t);
    };
    /**
     * tell sends a message to another actor within the system.
     *
     * The message is sent in a fire and forget fashion.
     */
    LocalActor.prototype.tell = function (ref, m) {
        return this.context.tell(ref, m);
    };
    /**
     * ask is an alternative to tell that produces a Promise
     * that is only resolved when the destination sends us
     * a reply.
     */
    LocalActor.prototype.ask = function (ref, m) {
        return this.context.ask(ref, m);
    };
    /**
     * select selectively receives the next message in the mailbox.
     */
    LocalActor.prototype.select = function (c) {
        return this.context.select(c);
    };
    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    LocalActor.prototype.receive = function (f) {
        return this.context.receive(f);
    };
    return LocalActor;
}());
exports.LocalActor = LocalActor;
//# sourceMappingURL=LocalActor.js.map