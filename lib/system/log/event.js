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
var level = require("../log");
/**
 * SystemEvent
 */
var SystemEvent = /** @class */ (function () {
    function SystemEvent() {
        this.timestamp = Date.now() / 1000;
    }
    return SystemEvent;
}());
exports.SystemEvent = SystemEvent;
/**
 * ErrorEvent is generated when an error occurs that does not
 * stop the system from operating.
 *
 * This is typically incorrect actor id names or duplicate actor addresses etc.
 */
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(error) {
        var _this = _super.call(this) || this;
        _this.error = error;
        _this.level = level.ERROR;
        return _this;
    }
    return ErrorEvent;
}(SystemEvent));
exports.ErrorEvent = ErrorEvent;
/**
 * ChildSpawnedEvent indicating a child actor has been spawned.
 */
var ChildSpawnedEvent = /** @class */ (function (_super) {
    __extends(ChildSpawnedEvent, _super);
    function ChildSpawnedEvent(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.level = level.INFO;
        return _this;
    }
    return ChildSpawnedEvent;
}(SystemEvent));
exports.ChildSpawnedEvent = ChildSpawnedEvent;
/**
 * MessageSentEvent indicating a message has been sent from one actor to another.
 */
var MessageSentEvent = /** @class */ (function (_super) {
    __extends(MessageSentEvent, _super);
    function MessageSentEvent(to, from, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.message = message;
        _this.level = level.INFO;
        return _this;
    }
    return MessageSentEvent;
}(SystemEvent));
exports.MessageSentEvent = MessageSentEvent;
/**
 * MessageDroppedEvent indicating a message was discarded.
 */
var MessageDroppedEvent = /** @class */ (function (_super) {
    __extends(MessageDroppedEvent, _super);
    function MessageDroppedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = level.WARN;
        return _this;
    }
    return MessageDroppedEvent;
}(MessageSentEvent));
exports.MessageDroppedEvent = MessageDroppedEvent;
/**
 * MessageAcceptedEvent indicating a message was accepted into a mailbox.
 */
var MessageAcceptedEvent = /** @class */ (function (_super) {
    __extends(MessageAcceptedEvent, _super);
    function MessageAcceptedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = level.INFO;
        return _this;
    }
    return MessageAcceptedEvent;
}(MessageSentEvent));
exports.MessageAcceptedEvent = MessageAcceptedEvent;
/**
 * MessageReceivedEvent indicating a message has been processed.
 */
var MessageReceivedEvent = /** @class */ (function (_super) {
    __extends(MessageReceivedEvent, _super);
    function MessageReceivedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = level.INFO;
        return _this;
    }
    return MessageReceivedEvent;
}(MessageSentEvent));
exports.MessageReceivedEvent = MessageReceivedEvent;
/**
 * MessageRejectedEvent indicating an actor will not receive
 * this or any other messages from the source right now.
 */
var MessageRejectedEvent = /** @class */ (function (_super) {
    __extends(MessageRejectedEvent, _super);
    function MessageRejectedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = level.WARN;
        return _this;
    }
    return MessageRejectedEvent;
}(MessageSentEvent));
exports.MessageRejectedEvent = MessageRejectedEvent;
/**
 * ReceiveStartedEvent indicates an actor is ready to process messages.
 */
var ReceiveStartedEvent = /** @class */ (function (_super) {
    __extends(ReceiveStartedEvent, _super);
    function ReceiveStartedEvent(path) {
        var _this = _super.call(this) || this;
        _this.path = path;
        _this.level = level.INFO;
        return _this;
    }
    return ReceiveStartedEvent;
}(SystemEvent));
exports.ReceiveStartedEvent = ReceiveStartedEvent;
/**
 * SelectStartedEvent indicates an actor is ready to selectively receive messages.
 */
var SelectStartedEvent = /** @class */ (function (_super) {
    __extends(SelectStartedEvent, _super);
    function SelectStartedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = level.INFO;
        return _this;
    }
    return SelectStartedEvent;
}(ReceiveStartedEvent));
exports.SelectStartedEvent = SelectStartedEvent;
/**
 * ActorRemovedEvent indicates an actor was removed from the system.
 */
var ActorRemovedEvent = /** @class */ (function (_super) {
    __extends(ActorRemovedEvent, _super);
    function ActorRemovedEvent(path) {
        var _this = _super.call(this) || this;
        _this.path = path;
        _this.level = level.INFO;
        return _this;
    }
    return ActorRemovedEvent;
}(SystemEvent));
exports.ActorRemovedEvent = ActorRemovedEvent;
//# sourceMappingURL=event.js.map