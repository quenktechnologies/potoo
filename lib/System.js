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
var Promise = require("bluebird");
exports.INFO = 6;
exports.WARN = 5;
exports.ERROR = 1;
/**
 * DuplicateActorPathError
 */
function DuplicateActorPathError(path) {
    this.message = "The path '" + path + "' is already in use!";
    this.path = path;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;
    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);
}
exports.DuplicateActorPathError = DuplicateActorPathError;
DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;
/**
 * Message is an envelope for user messages.
 */
var Message = (function () {
    function Message(to, from, message) {
        this.to = to;
        this.from = from;
        this.message = message;
    }
    return Message;
}());
exports.Message = Message;
/**
 * makeChildPath creates a child path given an actor and a child id
 */
exports.makeChildPath = function (id, parent) {
    return ((parent === '/') || (parent === '')) ? "" + parent + id : parent + "/" + id;
};
/**
 * Template represents the minimum amount of information required to create
 * a new actor instance.
 */
var Template = (function () {
    function Template(id) {
        this.id = id;
    }
    return Template;
}());
exports.Template = Template;
;
/**
 * Context represents an actor's context within the system.
 *
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
var Context = (function () {
    function Context(path) {
        this.path = path;
    }
    return Context;
}());
exports.Context = Context;
/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
var PendingContext = (function (_super) {
    __extends(PendingContext, _super);
    function PendingContext(askee, original, resolve, system) {
        var _this = _super.call(this, original.path) || this;
        _this.askee = askee;
        _this.original = original;
        _this.resolve = resolve;
        _this.system = system;
        return _this;
    }
    PendingContext.prototype.feed = function (m) {
        if (m.from !== this.askee) {
            this.system.dropMessage(m);
        }
        else {
            this.system.putContext(this.original.path, this.original);
            this.resolve(m.message);
        }
    };
    PendingContext.prototype.start = function () { };
    return PendingContext;
}(Context));
exports.PendingContext = PendingContext;
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
var LocalContext = (function (_super) {
    __extends(LocalContext, _super);
    function LocalContext(path, actorFn, system, behaviour, mailbox, isClearing) {
        if (behaviour === void 0) { behaviour = null; }
        if (mailbox === void 0) { mailbox = []; }
        if (isClearing === void 0) { isClearing = false; }
        var _this = _super.call(this, path) || this;
        _this.path = path;
        _this.actorFn = actorFn;
        _this.system = system;
        _this.behaviour = behaviour;
        _this.mailbox = mailbox;
        _this.isClearing = isClearing;
        return _this;
    }
    LocalContext.prototype._clear = function () {
        if ((!this.isClearing) &&
            (this.behaviour !== null) &&
            (this.mailbox.length > 0) &&
            (this.behaviour.willConsume(this.mailbox[0].message))) {
            var b = this.behaviour;
            var m = this.mailbox.shift();
            this.isClearing = true;
            this.behaviour = null;
            b.consume(m.message);
            this.system.logging.messageReceived(m);
            this.isClearing = false;
            return true;
        }
        else {
            return false;
        }
    };
    LocalContext.prototype._set = function (b) {
        if (this.behaviour != null)
            throw new Error(this.path + " is already receiveing/selecting!");
        this.behaviour = b;
        return this;
    };
    LocalContext.prototype.discard = function (m) {
        this.system.dropMessage(m);
    };
    LocalContext.prototype.spawn = function (t) {
        return this.system.putChild(t, this.path);
    };
    LocalContext.prototype.tell = function (ref, m) {
        this.system.putMessage(ref, this.path, m);
    };
    LocalContext.prototype.ask = function (ref, m) {
        return this.system.askMessage(ref, this.path, m);
    };
    LocalContext.prototype.select = function (c) {
        this._set(new MatchCase(c));
        this.system.logging.selectStarted(this.path);
        this._clear();
    };
    LocalContext.prototype.receive = function (f) {
        this._set(new MatchAny(f));
        this.system.logging.receiveStarted(this.path);
        this._clear();
    };
    LocalContext.prototype.feed = function (m) {
        var _this = this;
        setTimeout(function () { return (_this.mailbox.unshift(m), _this._clear()); }, 0);
    };
    LocalContext.prototype.start = function () {
        this.actorFn(this).run();
    };
    return LocalContext;
}(Context));
exports.LocalContext = LocalContext;
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = (function () {
    function Case(t, h) {
        this.t = t;
        this.h = h;
    }
    /**
     * matches checks if the supplied type satisfies this Case
     */
    Case.prototype.matches = function (m) {
        switch (typeof this.t) {
            case 'function':
                return m instanceof this.t;
            default:
                return this.t === m;
        }
    };
    /**
     * apply the function of this Case to a message
     */
    Case.prototype.apply = function (m) {
        this.h(m);
    };
    return Case;
}());
exports.Case = Case;
/**
 * MatchAny accepts any value.
 */
var MatchAny = (function () {
    function MatchAny(f) {
        this.f = f;
    }
    MatchAny.create = function (f) {
        return new MatchAny(f);
    };
    MatchAny.prototype.willConsume = function (_) {
        return true;
    };
    MatchAny.prototype.consume = function (m) {
        this.f(m);
    };
    return MatchAny;
}());
exports.MatchAny = MatchAny;
/**
 * MatchCase
 */
var MatchCase = (function () {
    function MatchCase(cases) {
        this.cases = cases;
    }
    MatchCase.prototype.willConsume = function (m) {
        return this.cases.some(function (c) { return c.matches(m); });
    };
    MatchCase.prototype.consume = function (m) {
        this.cases.some(function (c) { return c.matches(m) ? (c.apply(m), true) : false; });
    };
    return MatchCase;
}());
exports.MatchCase = MatchCase;
/**
 * LocalTemplate is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
var LocalTemplate = (function (_super) {
    __extends(LocalTemplate, _super);
    function LocalTemplate(id, actorFn) {
        var _this = _super.call(this, id) || this;
        _this.id = id;
        _this.actorFn = actorFn;
        return _this;
    }
    /**
     * from constructs a new Template using the specified parameters.
     */
    LocalTemplate.from = function (id, fn) {
        return new LocalTemplate(id, fn);
    };
    LocalTemplate.prototype.create = function (path, s) {
        return new LocalContext(path, this.actorFn, s);
    };
    return LocalTemplate;
}(Template));
exports.LocalTemplate = LocalTemplate;
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
/**
 * ASEvent is the superclass of all events generated by
 * the system.
 */
var ASEvent = (function () {
    function ASEvent() {
    }
    return ASEvent;
}());
exports.ASEvent = ASEvent;
/**
 * ChildSpawnedEvent
 */
var ChildSpawnedEvent = (function (_super) {
    __extends(ChildSpawnedEvent, _super);
    function ChildSpawnedEvent(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        return _this;
    }
    return ChildSpawnedEvent;
}(ASEvent));
exports.ChildSpawnedEvent = ChildSpawnedEvent;
/**
 * MessageSentEvent
 */
var MessageSentEvent = (function (_super) {
    __extends(MessageSentEvent, _super);
    function MessageSentEvent(to, from, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.message = message;
        return _this;
    }
    return MessageSentEvent;
}(ASEvent));
exports.MessageSentEvent = MessageSentEvent;
/**
 * MessageDroppedEvent
 */
var MessageDroppedEvent = (function (_super) {
    __extends(MessageDroppedEvent, _super);
    function MessageDroppedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MessageDroppedEvent;
}(MessageSentEvent));
exports.MessageDroppedEvent = MessageDroppedEvent;
/**
 * MessageReceivedEvent
 */
var MessageReceivedEvent = (function (_super) {
    __extends(MessageReceivedEvent, _super);
    function MessageReceivedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MessageReceivedEvent;
}(MessageSentEvent));
exports.MessageReceivedEvent = MessageReceivedEvent;
/**
 * ReceiveStartedEvent
 */
var ReceiveStartedEvent = (function (_super) {
    __extends(ReceiveStartedEvent, _super);
    function ReceiveStartedEvent(path) {
        var _this = _super.call(this) || this;
        _this.path = path;
        return _this;
    }
    return ReceiveStartedEvent;
}(ASEvent));
exports.ReceiveStartedEvent = ReceiveStartedEvent;
/**
 * SelectStartedEvent
 */
var SelectStartedEvent = (function (_super) {
    __extends(SelectStartedEvent, _super);
    function SelectStartedEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelectStartedEvent;
}(ReceiveStartedEvent));
exports.SelectStartedEvent = SelectStartedEvent;
/**
 * LoggingLogic contains the logic for system logging.
 */
var LoggingLogic = (function () {
    function LoggingLogic(policy) {
        this.policy = policy;
    }
    LoggingLogic.createFrom = function (p) {
        return new LoggingLogic(p);
    };
    /**
     * childSpawned
     */
    LoggingLogic.prototype.childSpawned = function (ref) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new ChildSpawnedEvent(ref));
    };
    /**
     * messageDropped
     */
    LoggingLogic.prototype.messageDropped = function (m) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new MessageDroppedEvent(m.to, m.from, m.message));
    };
    /**
     * messageSent
     */
    LoggingLogic.prototype.messageSent = function (m) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new MessageSentEvent(m.to, m.from, m.message));
    };
    /**
     * messageReceived
     */
    LoggingLogic.prototype.messageReceived = function (m) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new MessageReceivedEvent(m.to, m.from, m.message));
    };
    /**
     * receiveStarted
     */
    LoggingLogic.prototype.receiveStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new ReceiveStartedEvent(path));
    };
    /**
     * selectStarted
     */
    LoggingLogic.prototype.selectStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new SelectStartedEvent(path));
    };
    return LoggingLogic;
}());
exports.LoggingLogic = LoggingLogic;
var defaults = {
    log: { level: exports.WARN, logger: console }
};
/**
 * System is a system of actors.
 */
var System = (function () {
    function System(config, actors, logging, path) {
        if (config === void 0) { config = defaults; }
        if (actors === void 0) { actors = {}; }
        if (logging === void 0) { logging = LoggingLogic.createFrom(config.log); }
        if (path === void 0) { path = ''; }
        this.config = config;
        this.actors = actors;
        this.logging = logging;
        this.path = path;
    }
    /**
     * create a new system
     */
    System.create = function (c) {
        return new System(c);
    };
    /**
     * spawn a new top level actor within the system.
     */
    System.prototype.spawn = function (t) {
        this.putChild(t, this.path);
        return this;
    };
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    System.prototype.putChild = function (t, parent) {
        var path = exports.makeChildPath(t.id, parent); //@todo validate actor ids
        var child = t.create(path, this);
        if (this.actors.hasOwnProperty(path))
            throw new DuplicateActorPathError(path); //@todo use supervision instead
        this.actors[path] = child;
        this.logging.childSpawned(path);
        child.start();
        return path;
    };
    /**
     * dropMessage drops a message.
     */
    System.prototype.dropMessage = function (m) {
        this.logging.messageDropped(m);
    };
    /**
     * putContext replaces an actor's context within the system.
     */
    System.prototype.putContext = function (path, context) {
        this.actors[path] = context;
    };
    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of
     * communication. The message may be processed or stored
     * depending on the target actor's state at the time.
     * If the target actor does not exist, the message is dropped.
     */
    System.prototype.putMessage = function (to, from, message) {
        var actor = this.actors[to];
        var m = new Message(to, from, message);
        if (!actor) {
            this.dropMessage(m);
        }
        else {
            this.logging.messageSent(m);
            actor.feed(m);
        }
    };
    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    System.prototype.askMessage = function (to, from, m) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.actors[from] = new PendingContext(to, _this.actors[from], resolve, _this);
            _this.putMessage(to, from, m);
        });
    };
    return System;
}());
exports.System = System;
exports.system = function (c) { return System.create(c); };
//# sourceMappingURL=System.js.map