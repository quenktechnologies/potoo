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
/**
 * Message is an envelope for user messages.
 */
var Message = (function () {
    function Message(to, from, value) {
        this.to = to;
        this.from = from;
        this.value = value;
    }
    return Message;
}());
exports.Message = Message;
/**
 * Receive
 */
var Receive = (function () {
    function Receive(cases, system) {
        this.cases = cases;
        this.system = system;
    }
    Receive.prototype.consume = function (m) {
        if (this.cases.some(function (c) { return c.match(m.value); })) {
            this.system.logging.messageReceived(m);
        }
        else {
            this.system.logging.messageDropped(m);
        }
        return this;
    };
    return Receive;
}());
exports.Receive = Receive;
/**
 * Select is for selective receives.
 */
var Select = (function () {
    function Select(cases, system) {
        this.cases = cases;
        this.system = system;
    }
    Select.prototype.consume = function (m) {
        if (this.cases.some(function (c) { return c.match(m.value); })) {
            this.system.logging.messageReceived(m);
            return null;
        }
        else {
            this.system.logging.messageDropped(m);
            return this;
        }
    };
    return Select;
}());
exports.Select = Select;
/**
 * Local are actors that directly exists in current memory.
 */
var Local = (function () {
    function Local(__system) {
        this.__system = __system;
    }
    /**
     * self retrieves the path of this actor from the system.
     */
    Local.prototype.self = function () {
        return this.__system.getPath(this);
    };
    /**
     * spawn a new child actor.
     */
    Local.prototype.spawn = function (t, args) {
        this.__system.putChild(t, this, args);
    };
    /**
     * tell a message to an actor address.
     */
    Local.prototype.tell = function (ref, m) {
        this.__system.putMessage(new Message(ref, this.self(), m));
    };
    /**
     * ask for a reply from a message sent to an address.
     */
    Local.prototype.ask = function (ref, m) {
        return this.__system.askMessage(new Message(ref, this.self(), m));
    };
    return Local;
}());
exports.Local = Local;
/**
 * Static actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
var Static = (function (_super) {
    __extends(Static, _super);
    function Static() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Static.prototype.run = function (_path) { };
    Static.prototype.accept = function (m) {
        var r = Array.isArray(this.receive) ? this.receive : [this.receive];
        r.some(function (c) { return c.match(m.value); });
    };
    return Static;
}(Local));
exports.Static = Static;
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
var Dynamic = (function (_super) {
    __extends(Dynamic, _super);
    function Dynamic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__mailbox = [];
        return _this;
    }
    Dynamic.prototype.__consume = function () {
        if (this.__mailbox.length === 0)
            return;
        if (!this.__behaviour)
            return;
        var m = this.__mailbox.shift();
        this.__behaviour = this.__behaviour.consume(m);
        this.__consume();
    };
    Dynamic.prototype.select = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.__behaviour = new Select(cases, this.__system);
        this.__system.logging.receiveStarted(this.__system.getPath(this));
        this.__consume();
    };
    Dynamic.prototype.receive = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.__behaviour = new Receive(cases, this.__system);
        this.__system.logging.receiveStarted(this.__system.getPath(this));
        this.__consume();
    };
    Dynamic.prototype.accept = function (m) {
        this.__mailbox.push(m);
        this.__consume();
    };
    Dynamic.prototype.run = function (_path) { };
    return Dynamic;
}(Local));
exports.Dynamic = Dynamic;
/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
var Pending = (function () {
    function Pending(askee, original, resolve, system) {
        this.askee = askee;
        this.original = original;
        this.resolve = resolve;
        this.system = system;
    }
    Pending.prototype.accept = function (m) {
        if (m.from !== this.askee) {
            this.system.dropMessage(m);
        }
        else {
            this.system.putActor(this.system.getPath(this), this.original);
            this.resolve(m.value);
        }
    };
    Pending.prototype.run = function () { };
    return Pending;
}());
exports.Pending = Pending;
var Parent = (function (_super) {
    __extends(Parent, _super);
    function Parent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parent.prototype.accept = function (m) {
        this.__system.dropMessage(m);
    };
    Parent.prototype.run = function () { };
    return Parent;
}(Local));
exports.Parent = Parent;
//# sourceMappingURL=Actor.js.map