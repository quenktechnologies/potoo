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
var Match_1 = require("./fpl/control/Match");
var Free_1 = require("./fpl/monad/Free");
var Maybe_1 = require("./fpl/monad/Maybe");
var IO_1 = require("./fpl/monad/IO");
var util_1 = require("./fpl/util");
var SharedBuffer_1 = require("./fpl/async/SharedBuffer");
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
var DroppedMessage = (function () {
    function DroppedMessage(message, to, from) {
        this.message = message;
        this.to = to;
        this.from = from;
    }
    return DroppedMessage;
}());
exports.DroppedMessage = DroppedMessage;
var StoredMessage = (function () {
    function StoredMessage(path, message) {
        this.path = path;
        this.message = message;
    }
    return StoredMessage;
}());
exports.StoredMessage = StoredMessage;
/* actors */
/**
 * Template
 */
var Template = (function () {
    function Template(id, start) {
        if (start === void 0) { start = exports.noop; }
        this.id = id;
        this.start = start;
    }
    return Template;
}());
exports.Template = Template;
;
/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
var LocalT = (function (_super) {
    __extends(LocalT, _super);
    function LocalT(_a) {
        var id = _a.id, start = _a.start;
        return _super.call(this, id, start) || this;
    }
    return LocalT;
}(Template));
exports.LocalT = LocalT;
/**
 * Actor
 */
var Actor = (function () {
    function Actor(id, path, behaviour, mailbox) {
        if (mailbox === void 0) { mailbox = new SharedBuffer_1.SharedBuffer(); }
        this.id = id;
        this.path = path;
        this.behaviour = behaviour;
        this.mailbox = mailbox;
    }
    return Actor;
}());
exports.Actor = Actor;
/**
 * ActorL
 */
var ActorL = (function (_super) {
    __extends(ActorL, _super);
    function ActorL() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActorL;
}(Actor));
exports.ActorL = ActorL;
/**
 * ActorDOA
 */
var ActorDOA = (function (_super) {
    __extends(ActorDOA, _super);
    function ActorDOA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActorDOA;
}(Actor));
exports.ActorDOA = ActorDOA;
;
/**
 * Signal
 */
var Signal = (function () {
    function Signal() {
    }
    return Signal;
}());
exports.Signal = Signal;
/**
 * Started is sent to an actor to signal it has been started.
 */
var Started = (function (_super) {
    __extends(Started, _super);
    function Started() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Started;
}(Signal));
exports.Started = Started;
/**
 * System acts as the root actor for any process.
 *
 * All actors are stored here except for ones that are children in seperate
 * process. In those cases, communication is passed through the local parent
 * reference.
 */
var System = (function (_super) {
    __extends(System, _super);
    function System(_a) {
        var start = _a.start, _b = _a.log, log = _b === void 0 ? function (m) { return IO_1.safeIO(function () { return console.log(m); }); } : _b;
        var _this = _super.call(this, '', '', start) || this;
        _this.actors = { '?': new ActorDOA('?', '?', exports.noop) };
        _this.log = log;
        return _this;
    }
    /**
     * start the system
     */
    System.prototype.start = function () {
        return exports.evalAxiomChain(this.behaviour(new Started()), this, this);
    };
    return System;
}(Actor));
exports.System = System;
/**
 * system create a new actor system filling in the defaults if not provided.
 * @summary SystemConf →  System
 */
exports.system = function (config) { return new System(config); };
/**
 * Axiom represents a member of the userland DSL.
 *
 * Typically corresponds to one of the actor model axioms.
 * @abstract
 */
var Axiom = (function () {
    function Axiom(next) {
        this.next = next;
    }
    /**
     * map
     */
    Axiom.prototype.map = function (f) {
        return Match_1.match(this)
            .caseOf(Receive, util_1.identity)
            .caseOf(Raise, util_1.identity)
            .caseOf(Spawn, function (_a) {
            var template = _a.template, next = _a.next;
            return new Spawn(template, f(next));
        })
            .caseOf(Task, function (_a) {
            var to = _a.to, forkable = _a.forkable, next = _a.next;
            return new Task(forkable, to, f(next));
        })
            .caseOf(Tell, function (_a) {
            var to = _a.to, message = _a.message, next = _a.next;
            return new Tell(to, message, f(next));
        })
            .caseOf(Effect, function (_a) {
            var runnable = _a.runnable, next = _a.next;
            return new Effect(runnable, util_1.compose(f, next));
        })
            .caseOf(Stream, function (_a) {
            var to = _a.to, source = _a.source, next = _a.next;
            return new Stream(to, source, f(next));
        })
            .caseOf(Noop, util_1.identity)
            .end();
    };
    return Axiom;
}());
exports.Axiom = Axiom;
/**
 * Spawn
 */
var Spawn = (function (_super) {
    __extends(Spawn, _super);
    function Spawn(template, next) {
        var _this = _super.call(this, next) || this;
        _this.template = template;
        _this.next = next;
        return _this;
    }
    return Spawn;
}(Axiom));
exports.Spawn = Spawn;
/**
 * Task
 */
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(forkable, to, next) {
        var _this = _super.call(this, next) || this;
        _this.forkable = forkable;
        _this.to = to;
        _this.next = next;
        return _this;
    }
    return Task;
}(Axiom));
exports.Task = Task;
/**
 * Tell
 */
var Tell = (function (_super) {
    __extends(Tell, _super);
    function Tell(to, message, next) {
        var _this = _super.call(this, next) || this;
        _this.to = to;
        _this.message = message;
        _this.next = next;
        return _this;
    }
    return Tell;
}(Axiom));
exports.Tell = Tell;
/**
 * Effect
 */
var Effect = (function (_super) {
    __extends(Effect, _super);
    function Effect(runnable, next) {
        if (next === void 0) { next = util_1.identity; }
        var _this = _super.call(this, next) || this;
        _this.runnable = runnable;
        _this.next = next;
        return _this;
    }
    return Effect;
}(Axiom));
exports.Effect = Effect;
/**
 * Stream
 */
var Stream = (function (_super) {
    __extends(Stream, _super);
    function Stream(to, source, next) {
        var _this = _super.call(this, next) || this;
        _this.to = to;
        _this.source = source;
        _this.next = next;
        return _this;
    }
    return Stream;
}(Axiom));
exports.Stream = Stream;
/**
 * Receive
 */
var Receive = (function (_super) {
    __extends(Receive, _super);
    function Receive(behaviour) {
        var _this = _super.call(this) || this;
        _this.behaviour = behaviour;
        return _this;
    }
    return Receive;
}(Axiom));
exports.Receive = Receive;
/**
 * Raise
 */
var Raise = (function (_super) {
    __extends(Raise, _super);
    function Raise(error) {
        var _this = _super.call(this) || this;
        _this.error = error;
        return _this;
    }
    return Raise;
}(Axiom));
exports.Raise = Raise;
/**
 * Noop
 */
var Noop = (function (_super) {
    __extends(Noop, _super);
    function Noop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Noop;
}(Axiom));
exports.Noop = Noop;
/**
 * runAxiomChain
 */
exports.runAxiomChain = function (i, a, s) {
    return exports.evalAxiomChain(i, a, s).run();
};
/**
 * evalAxiomChain translates a chain of axioms into the actual
 * work to be done by the system.
 */
exports.evalAxiomChain = function (ch, a, s) {
    return Match_1.match(ch)
        .caseOf(Free_1.Suspend, function (_a) {
        var f = _a.f;
        return Match_1.match(f)
            .caseOf(Spawn, function (f) { return s.log(f).chain(function () { return exports.evalSpawn(f, a, s); }); })
            .caseOf(Task, function (f) { return s.log(f).chain(function () { return exports.evalTask(f, a, s); }); })
            .caseOf(Tell, function (f) { return s.log(f).chain(function () { return exports.evalTell(f, a, s); }); })
            .caseOf(Effect, function (f) { return s.log(f).chain(function () { return exports.evalEffect(f, a, s); }); })
            .caseOf(Stream, function (f) { return s.log(f).chain(function () { return exports.evalStream(f, a, s); }); })
            .caseOf(Receive, function (f) { return s.log(f).chain(function () { return exports.evalReceive(f, a, s); }); })
            .caseOf(Raise, function (_a) {
            var error = _a.error;
            throw error;
        })
            .caseOf(Noop, function (f) { return s.log(f).chain(function () { return IO_1.wrapIO(s); }); })
            .end();
    })
        .caseOf(Free_1.Return, function () { return IO_1.wrapIO(s); })
        .end();
};
/**
 * evalSpawn
 */
exports.evalSpawn = function (_a, a, s) {
    var template = _a.template, next = _a.next;
    var p = exports.makeChildPath(template.id, a.path);
    return exports.getActorMaybe(p, s)
        .chain(function (mb) {
        return mb.map(function () { return exports.evalAxiomChain(exports.raiseDup(p), a, s); })
            .orJust(function () {
            return exports.allocateActor(p, template, s)
                .chain(function () { return exports.evalAxiomChain(next, a, s); });
        })
            .get();
    });
};
/**
 * evalTask
 */
exports.evalTask = function (_a, a, s) {
    var to = _a.to, forkable = _a.forkable, next = _a.next;
    return IO_1.safeIO(function () {
        forkable.fork(function (e) { return exports.evalAxiomChain(exports.raise(e), a, s).run(); }, function (m) { return exports.evalAxiomChain(exports.tell(to, m), a, s).run(); });
        return s;
    }).chain(function () { return exports.evalAxiomChain(next, a, s); });
};
/**
 * evalTell
 */
exports.evalTell = function (_a, a, s) {
    var to = _a.to, message = _a.message, next = _a.next;
    return exports.pathToActor(to === '.' ? a.path : to, s)
        .chain(function (t) { return exports.feedActor(message, t, a, s); })
        .chain(function () { return exports.evalAxiomChain(next, a, s); });
};
/**
 * evalEffect
 */
exports.evalEffect = function (_a, a, s) {
    var runnable = _a.runnable, next = _a.next;
    return runnable.chain(function (r) { return exports.evalAxiomChain(next(r), a, s); });
};
/**
 * evalStream
 */
exports.evalStream = function (_a, a, s) {
    var source = _a.source, to = _a.to, next = _a.next;
    return IO_1.safeIO(function () { return source(function (p) { return exports.runAxiomChain(exports.tell(to, p), a, s); }); })
        .chain(function () { return exports.evalAxiomChain(next, a, s); });
};
/**
 * evalReceive
 */
exports.evalReceive = function (_a, a, s) {
    var behaviour = _a.behaviour;
    return exports.takeMessage(a).chain(function (mb) { return exports.consumeOrStore(mb, behaviour, a, s); });
};
/**
* raiseDup
*/
exports.raiseDup = function (p) { return exports.raise(new DuplicateActorPathError(p)); };
/**
 * makeChildPath creates a child path given an actor and a child id
 */
exports.makeChildPath = function (id, parent) {
    return ((parent === '/') || (parent === '')) ? "" + parent + id : parent + "/" + id;
};
/**
 * allocateActor creates and puts an actor into the system.
 */
exports.allocateActor = function (p, t, s) {
    return exports.createActor(p, t, s).chain(function (c) { return exports.putActor(p, c, s).chain(function (s) { return exports.evalNewActor(c, s); }); });
};
/**
 * createActor
 */
exports.createActor = function (path, t, _s) { return Match_1.match(t)
    .caseOf(LocalT, function (t) { return IO_1.wrapIO(new ActorL(t.id, path, t.start)); })
    .end(); };
/**
 * evalNewActor evals the instructions of a freshly spawned actor.
 */
exports.evalNewActor = function (c, s) {
    return exports.takeBehaviour(c).chain(function (mb) {
        return mb.map(function (b) { return exports.evalAxiomChain(b(new Started()), c, s); })
            .orJust(function () { return IO_1.wrapIO(s); })
            .get();
    });
};
/**
 * putActor into the System
 */
exports.putActor = function (path, a, s) {
    return IO_1.safeIO(function () { s.actors[path] = a; return s; });
};
/**
 * pathToActor resolves an actor address from the system.
 * If the actor is not found the '?' actor is returned.
 * @param p The path of the actor
 * @param s The System.
 */
exports.pathToActor = function (p, s) {
    return exports.getActorMaybe(p, s).map(function (mb) { return mb.orJust(function () { return s.actors['?']; }).get(); });
};
/**
 * getActorMaybe is like getActor but wraps the actor in a Maybe.
 * @param p The path of the actor
 * @param s The System.
 */
exports.getActorMaybe = function (p, s) {
    return exports.getActor(p, s).map(Maybe_1.fromAny);
};
/**
 * getActor retrieves an actor from the system.
 * @param p The path to the actor.
 * @param s The System.
 */
exports.getActor = function (p, s) { return IO_1.safeIO(function () { return s.actors[p]; }); };
/**
 * feedActor feeds a message into an actor.
 * The message may be processed immediately or stored for later.
 */
exports.feedActor = function (m, to, from, s) { return Match_1.match(to)
    .caseOf(ActorDOA, function (a) { return exports.feedActorDOA(new DroppedMessage(m, a, from.path), a, s); })
    .caseOf(ActorL, function (a) { return exports.feedActorL(m, a, s); })
    .end(); };
/**
 * feedActorDOA handles bounced messages
 * @param {DroppedMessage} m
 * @param {ActorDOA} a
 */
exports.feedActorDOA = function (m, a, s) {
    return s.log(m).mapIn(a);
};
/**
 * feedActorL
 */
exports.feedActorL = function (m, a, s) { return Match_1.match(a.behaviour)
    .caseOf(Function, function (b) { return exports.delayIO(function () { return exports.evalAxiomChain(b(m), a, s); }); })
    .orElse(function () { return exports.storeAuditedMessage(m, a, s); })
    .end(); };
/**
 * takeMessage takes the next message out of an actor's mailbox.
 */
exports.takeMessage = function (a) { return a.mailbox.maybeTake(); };
/**
 * storeAuditedMessage audits the message then stores it
 * @param {*} m The message
 * @param {Actor} a
 * @param {System} s
 */
exports.storeAuditedMessage = function (m, a, s) {
    return s.log(new StoredMessage(a.path, m)).chain(function () { return exports.storeMessage(m, a); });
};
/**
 * storeMessage sends a message to an actor's mailbox
 */
exports.storeMessage = function (m, a) { return Match_1.match(a)
    .caseOf(ActorL, function (a) { return a.mailbox.put(m); })
    .end(); };
/**
 * takeBehaviour gets the next behaviour of an actor.
 * The behaviour is removed from the actor to prevent duplicate processing.
 */
exports.takeBehaviour = function (a) {
    return IO_1.safeIO(function () { var b = a.behaviour; a.behaviour = null; return Maybe_1.fromAny(b); });
};
exports.consumeOrStore = function (mb, b, a, s) {
    return mb.map(function (m) { return exports.feedActor(m, a, a, s); }).orJust(function () { return exports.putBehaviour(b, a).chainIn(s); }).get();
};
/**
 * putBehaviour changes the behaviour of an Actor.
 * @param {Behaviour} b
 * @param {Actor} a
 */
exports.putBehaviour = function (b, a) {
    return IO_1.safeIO(function () { a.behaviour = b; return a; });
};
/**
 * delayIO delays the execution of an IO function
 */
exports.delayIO = function (f, n) {
    if (n === void 0) { n = 100; }
    return IO_1.safeIO(function () { return void setTimeout(function () { return f().run(); }, n); });
};
/**
 * spawn a new child actor
 */
exports.spawn = function (template) { return Free_1.liftF(new Spawn(template)); };
/**
 * tell another actor a message
 */
exports.tell = function (to, message) {
    return Free_1.liftF(new Tell(to, message));
};
/**
 * task allows an asynchronous operation to be performed, placing its result in
 * an actor's mailbox.
 */
exports.task = function (f, to) {
    if (to === void 0) { to = '.'; }
    return Free_1.liftF(new Task(f, to));
};
/**
 * effect allows a side-effectfull computation to occur.
 */
exports.effect = function (f) { return Free_1.liftF(new Effect(IO_1.safeIO(f))); };
/**
 * run an IO operation safely
 */
exports.run = function (io) { return Free_1.liftF(new Effect(io)); };
/**
 * stream input into an actor's mailbox
 */
exports.stream = function (source, to) {
    if (to === void 0) { to = '.'; }
    return Free_1.liftF(new Stream(to, source));
};
/**
 * receive the next message with the passed behaviour
 */
exports.receive = function (behaviour) { return Free_1.liftF(new Receive(behaviour)); };
/**
 * finalReceive receives the next message and effectively puts the actor into
 * an idle state.
 */
exports.finalReceive = function (b) {
    return Free_1.liftF(new Receive(function (m) { return b(m) || exports.noop(); }));
};
/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 */
exports.raise = function (error) { return Free_1.liftF(new Raise(error)); };
/**
 * noop means do nothing, effectively putting the Actor in an idle mode forever.
 */
exports.noop = function () { return Free_1.liftF(new Noop()); };
//# sourceMappingURL=index.js.map