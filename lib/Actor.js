'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = exports.tick = exports.nextTick = exports.select = exports.accept = exports.fold = exports.put = exports.getChild = exports.map = exports.replace = exports.fromTemplate = exports.ActorSTP = exports.createActorCP = exports.ActorCP = exports.ChildT = exports.createActorP = exports.ActorP = exports.ParentT = exports.createActorST = exports.ActorST = exports.StreamT = exports.createActorFT = exports.ActorFT = exports.FutureT = exports.createActorL = exports.ActorL = exports.LocalT = exports.System = exports.ActorIO = exports.Actor = exports.Template = undefined;
exports.DuplicateActorIdError = DuplicateActorIdError;

var _child_process = require('child_process');

var _uuid = require('uuid');

var _be = require('./be');

var _Type3 = require('./Type');

var _monad = require('./monad');

var _Maybe = require('./fpl/monad/Maybe');

var _util = require('./util');

var _Ops = require('./Ops');

var _Exec = require('./Exec');

var _MVar = require('./MVar');

var _Match = require('./Match');

var _paths = require('./paths');

var paths = _interopRequireWildcard(_paths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DuplicateActorIdError
 */
function DuplicateActorIdError(path, id) {

    this.message = 'Id \'' + id + '\' at path \'' + path + '\' is in use!';
    this.path = path;
    this.id = id;
    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

DuplicateActorIdError.prototype = Object.create(Error.prototype);
DuplicateActorIdError.prototype.constructor = DuplicateActorIdError;

exports.default = DuplicateActorIdError;

/**
 * Template is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */

var Template = exports.Template = function (_Type) {
    _inherits(Template, _Type);

    function Template() {
        _classCallCheck(this, Template);

        return _possibleConstructorReturn(this, (Template.__proto__ || Object.getPrototypeOf(Template)).apply(this, arguments));
    }

    return Template;
}(_Type3.Type);

/**
 * Actor
 */


var Actor = exports.Actor = function (_Type2) {
    _inherits(Actor, _Type2);

    function Actor(props, checks) {
        _classCallCheck(this, Actor);

        var _this2 = _possibleConstructorReturn(this, (Actor.__proto__ || Object.getPrototypeOf(Actor)).call(this, props, checks));

        _this2.fold = (0, _util.partial)(fold, _this2);
        _this2.map = (0, _util.partial)(map, _this2);

        return _this2;
    }

    return Actor;
}(_Type3.Type);

/**
 * ActorIO
 */


var ActorIO = exports.ActorIO = function (_Actor) {
    _inherits(ActorIO, _Actor);

    function ActorIO() {
        _classCallCheck(this, ActorIO);

        return _possibleConstructorReturn(this, (ActorIO.__proto__ || Object.getPrototypeOf(ActorIO)).apply(this, arguments));
    }

    return ActorIO;
}(Actor);

/**
 * System
 * @property {Array<Op>} ops
 */


var System = exports.System = function (_Actor2) {
    _inherits(System, _Actor2);

    function System(props) {
        _classCallCheck(this, System);

        var _this4 = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, props, {
            path: (0, _be.force)(''),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            actors: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            log: (0, _be.or)((0, _be.type)(Function), (0, _be.force)(_defaultLogger))
        }));

        _this4.spawn = function (t) {
            return _this4.copy({ ops: _this4.ops ? _this4.ops.chain(function () {
                    return (0, _Ops.spawn)(t);
                }) : (0, _Ops.spawn)(t) });
        };
        _this4.tick = function () {
            return tick(_monad.IO.of(_this4.copy({ ops: null })), _this4);
        };
        _this4.start = function () {
            return start(_this4);
        };

        return _this4;
    }

    return System;
}(Actor);

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */


var LocalT = exports.LocalT = function (_Template) {
    _inherits(LocalT, _Template);

    function LocalT(props) {
        _classCallCheck(this, LocalT);

        return _possibleConstructorReturn(this, (LocalT.__proto__ || Object.getPrototypeOf(LocalT)).call(this, props, {

            id: (0, _be.type)(String),
            start: (0, _be.or)((0, _be.type)(Function), (0, _be.force)(function () {}))

        }));
    }

    return LocalT;
}(Template);

/**
 * ActorL
 */


var ActorL = exports.ActorL = function (_Actor3) {
    _inherits(ActorL, _Actor3);

    function ActorL(props) {
        _classCallCheck(this, ActorL);

        return _possibleConstructorReturn(this, (ActorL.__proto__ || Object.getPrototypeOf(ActorL)).call(this, props, {

            id: (0, _be.type)(String),
            parent: (0, _be.type)(String),
            path: (0, _be.type)(String),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mailbox: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            actors: (0, _be.or)((0, _be.type)(Array), (0, _be.force)([])),
            template: (0, _be.type)(Template)

        }));
    }

    return ActorL;
}(Actor);

/**
 * createActorL from a template
 * @summary createActorL :: (string,LocalT) →  ActorL
 */


var createActorL = exports.createActorL = function createActorL(parent, template) {
    return new ActorL({
        id: template.id,
        parent: parent,
        path: _address(parent, template.id),
        ops: template.start(),
        template: template
    });
};

/**
 * FutureT is the template for spawning future actors.
 * @property {string} id
 * @property {string} to
 * @property {Future} future
 */

var FutureT = exports.FutureT = function (_Template2) {
    _inherits(FutureT, _Template2);

    function FutureT(props) {
        _classCallCheck(this, FutureT);

        return _possibleConstructorReturn(this, (FutureT.__proto__ || Object.getPrototypeOf(FutureT)).call(this, props, {
            id: (0, _be.call)(function () {
                return 'future-' + (0, _uuid.v4)();
            }),
            to: (0, _be.or)((0, _be.type)(String), (0, _be.force)(paths.SELF)),
            f: (0, _be.type)(Function)
        }));
    }

    return FutureT;
}(Template);

/**
 * ActorFT contains a Future, a computation that we expect to be complete sometime
 * later.
 */


var ActorFT = exports.ActorFT = function (_ActorIO) {
    _inherits(ActorFT, _ActorIO);

    function ActorFT(props) {
        _classCallCheck(this, ActorFT);

        return _possibleConstructorReturn(this, (ActorFT.__proto__ || Object.getPrototypeOf(ActorFT)).call(this, props, {
            id: (0, _be.type)(String),
            path: (0, _be.type)(String),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mvar: (0, _be.type)(_MVar.MVar),
            template: (0, _be.type)(Template)
        }));
    }

    return ActorFT;
}(ActorIO);

/**
 * createActorFT from a template
 * @summary createActorFT :: (string,FutureT) →  IO<ActorFT>
 */


var createActorFT = exports.createActorFT = function createActorFT(parent, template) {
    return (0, _MVar.makeMVar)().chain(function (mvar) {
        return _monad.IO.of(function () {
            return new ActorFT({
                id: template.id,
                parent: parent,
                path: _address(parent, template.id),
                ops: (0, _Ops.receive)(_ident),
                mvar: mvar,
                abort: template.f().fork(function (error) {
                    return mvar.put((0, _Ops.raise)(error));
                }, function (m) {
                    return mvar.put((0, _Ops.tell)(_Maybe.Maybe.not(template.to).orJust(paths.SELF).extract(), m));
                }),
                template: template
            });
        });
    });
};

/**
 * StreamT
 */

var StreamT = exports.StreamT = function (_Template3) {
    _inherits(StreamT, _Template3);

    function StreamT(props) {
        _classCallCheck(this, StreamT);

        return _possibleConstructorReturn(this, (StreamT.__proto__ || Object.getPrototypeOf(StreamT)).call(this, props, {
            id: (0, _be.type)(String),
            to: (0, _be.or)((0, _be.type)(String), (0, _be.force)(paths.SELF)),
            f: (0, _be.type)(Function)
        }));
    }

    return StreamT;
}(Template);

var ActorST = exports.ActorST = function (_ActorIO2) {
    _inherits(ActorST, _ActorIO2);

    function ActorST(props) {
        _classCallCheck(this, ActorST);

        return _possibleConstructorReturn(this, (ActorST.__proto__ || Object.getPrototypeOf(ActorST)).call(this, props, {
            id: (0, _be.type)(String),
            path: (0, _be.type)(String),
            mvar: (0, _be.type)(_MVar.MVar),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null))
        }));
    }

    return ActorST;
}(ActorIO);

/**
 * createActorST from a template
 * @summary createActorST :: (string, template) →  IO<ActorST>
 */


var createActorST = exports.createActorST = function createActorST(parent, template) {
    return (0, _MVar.makeMVar)().chain(function (mvar) {
        return template.f(function (m) {
            return mvar.put((0, _Ops.tell)(template.to, m));
        }).map(function () {
            return new ActorST({
                id: template.id,
                path: _address(parent, template.id),
                ops: (0, _Ops.receive)(_ident),
                mvar: mvar
            });
        });
    });
};

/**
 * ParentT
 */

var ParentT = exports.ParentT = function (_Template4) {
    _inherits(ParentT, _Template4);

    function ParentT(props) {
        _classCallCheck(this, ParentT);

        return _possibleConstructorReturn(this, (ParentT.__proto__ || Object.getPrototypeOf(ParentT)).call(this, props, { id: (0, _be.type)(String) }));
    }

    return ParentT;
}(Template);

/**
 * ActorP
 */


var ActorP = exports.ActorP = function (_ActorIO3) {
    _inherits(ActorP, _ActorIO3);

    function ActorP(props) {
        _classCallCheck(this, ActorP);

        return _possibleConstructorReturn(this, (ActorP.__proto__ || Object.getPrototypeOf(ActorP)).call(this, props, {

            id: (0, _be.type)(String),
            process: (0, _be.type)(Object),
            path: (0, _be.or)((0, _be.type)(String), (0, _be.force)('process-' + (0, _uuid.v4)())),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mvar: (0, _be.type)(_MVar.MVar)

        }));
    }

    return ActorP;
}(ActorIO);

/**
 * createActorP from a template
 * @summary createActorP :: (string, ParentT) →  IO<ActorP>
 */


var createActorP = exports.createActorP = function createActorP(parent, template) {
    return (0, _MVar.makeMVar)().chain(function (mvar) {
        return _monad.IO.of(function () {

            process.on('message', function (_ref) {
                var message = _ref.message,
                    to = _ref.to;
                return mvar.put((0, _Ops.tell)(to, message));
            });

            return new ActorP({

                id: template.id,
                path: _address(parent, template.id),
                process: process,
                mvar: mvar,
                ops: (0, _Ops.receive)(_ident),
                template: template

            });
        });
    });
};

/**
 * ChildT
 */

var ChildT = exports.ChildT = function (_Template5) {
    _inherits(ChildT, _Template5);

    function ChildT(props) {
        _classCallCheck(this, ChildT);

        return _possibleConstructorReturn(this, (ChildT.__proto__ || Object.getPrototypeOf(ChildT)).call(this, props, { id: (0, _be.force)('child-' + (0, _uuid.v4)()) }));
    }

    return ChildT;
}(Template);

/**
 * ActorCP
 */


var ActorCP = exports.ActorCP = function (_ActorIO4) {
    _inherits(ActorCP, _ActorIO4);

    function ActorCP(props) {
        _classCallCheck(this, ActorCP);

        return _possibleConstructorReturn(this, (ActorCP.__proto__ || Object.getPrototypeOf(ActorCP)).call(this, props, {
            id: (0, _be.type)(String),
            path: (0, _be.type)(String),
            ops: (0, _be.or)((0, _be.type)(_monad.Free), (0, _be.force)(null)),
            mvar: (0, _be.type)(_MVar.MVar),
            handle: (0, _be.type)(Object)
        }));
    }

    return ActorCP;
}(ActorIO);

/**
 * createActorCP from a template
 * @summary createActorCP :: (string,ChildT) →  IO<ActorCP
 */


var createActorCP = exports.createActorCP = function createActorCP(parent, template) {
    return (0, _MVar.makeMVar)().chain(function (mvar) {
        return _fork(template.start).chain(function (handle) {

            handle.on('message', function (_ref2) {
                var to = _ref2.to,
                    message = _ref2.message;
                return mvar.put((0, _Ops.tell)(to, message));
            });

            return new ActorCP({
                id: template.id,
                path: _address(parent, template.id),
                handle: handle,
                template: template,
                ops: (0, _Ops.receive)(_ident)
            });
        });
    });
};

/**
 * ActorSTP is a stopped Actor ready for removal.
 */

var ActorSTP = exports.ActorSTP = function (_Actor4) {
    _inherits(ActorSTP, _Actor4);

    function ActorSTP(props) {
        _classCallCheck(this, ActorSTP);

        return _possibleConstructorReturn(this, (ActorSTP.__proto__ || Object.getPrototypeOf(ActorSTP)).call(this, props, { path: (0, _be.type)(String) }));
    }

    return ActorSTP;
}(Actor);

var fromTemplate = exports.fromTemplate = function fromTemplate(parent, template) {
    return (0, _Match.match)(template).caseOf(LocalT, (0, _util.partial)(createActorL, parent)).caseOf(FutureT, (0, _util.partial)(createActorFT, parent)).caseOf(StreamT, (0, _util.partial)(createActorST, parent)).caseOf(ParentT, (0, _util.partial)(createActorP, parent)).caseOf(ChildT, (0, _util.partial)(createActorCP, parent)).end();
};

/**
 * replace an actor with a new version.
 * Returns the parent actor (second arg) updated with the new actor.
 * If the parent path is the same path as the actor to replace, it is
 * replaced instead.
 * No change is made if the actor is not found.
 * @summary (Actor, Actor) →  Actor
 */
var replace = exports.replace = function replace(a, p) {
    return p.path === a.path ? a : p.map(function (c) {
        return c.path === a.path ? a : c.map((0, _util.partial)(replace, a));
    });
};

/**
 * map over an Actor treating it like a Functor
 * @summary {(Actor,Function) →  Actor}
 */
var map = exports.map = function map(a, f) {
    return (0, _Match.match)(a).caseOf(ActorFT, function (a) {
        return a;
    }).caseOf(Actor, function (a) {
        return a.copy({ actors: a.actors.map(f) });
    }).end();
};

/**
 * getChild gets a child actor from its parent using its id
 * @summary (string,Actor) →  Maybe<Actor>
 */
var getChild = exports.getChild = function getChild(id, a) {
    return (0, _Maybe.fromAny)(a.fold(function (p, c) {
        return p ? p : c.id === id ? c : null;
    }));
};

/**
 * put an actor into another making it a child
 * Returns the parent (child,parent) →  parent
 * @summary (Actor, Actor) →  Actor
 */
var put = exports.put = function put(a, p) {
    return p.copy({ actors: p.actors.concat(a) });
};

/**
 * fold a data structure into an acumulated simpler one
 * @summary fold :: (Actor, *→ *, *) →  *
 */
var fold = exports.fold = function fold(o, f, accum) {
    return (0, _Match.match)(o).caseOf(ActorIO, function () {
        return accum;
    }).caseOf(Actor, function (a) {
        return a.actors.reduce(f, accum);
    }).end();
};

/**
 * accept allows an Actor to accept the latest message addressed to it.
 * @param {*} m
 * @summary {*,Actor) →  Actor|IO<Actor>|Drop}
 */
var accept = exports.accept = function accept(m, a) {
    return (0, _Match.match)(a).caseOf(ActorL, function (a) {
        return a.copy({ mailbox: a.mailbox.concat(m) });
    }).caseOf(ActorP, function (a) {
        return _monad.IO.of(function () {
            a.process.send(m);return a;
        });
    }).end();
};

/**
 * select an actor in the system using the specified path.
 * @summary (string, Actor) →  Actor|null
 */
var select = exports.select = function select(p, a) {
    return fold(a, function (hit, child) {
        return hit ? hit : p === child.path ? child : p.startsWith(child.path) ? select(p, child) : null;
    }, null);
};

var nextTick = exports.nextTick = function nextTick(f) {
    return _monad.IO.of(function () {
        return setTimeout(f, 100);
    });
};

/**
 * tick
 * @summary tick :: (Actor, IO<Actor>) →  IO<Actor>
 */
var tick = exports.tick = function tick(io, a) {
    return (0, _Exec.exec)(a.copy({ ops: null }), a.fold(tick, io), a.ops);
};

/**
 * start the system.
 * Note: start does not actuall start the system but returns an IO class.
 * @summary start :: System →  IO<null>
 */
var start = exports.start = function start(s) {
    return (0, _Match.match)(s).caseOf(System, function (s) {
        return tick(_monad.IO.of(s), s).chain(function (s) {
            return nextTick(function () {
                return start(s).run();
            });
        });
    }).end();
};

var _defaultLogger = function _defaultLogger(op) {
    return _monad.IO.of(function () {
        return console.log(op);
    });
};

var _address = function _address(parent, id) {
    return parent === '' || parent === '/' ? id : parent + '/' + id;
};

var _fork = function _fork(path) {
    return _monad.IO.of(function () {
        return (0, _child_process.fork)(__dirname + '/process.js', { env: { ACTOR_START: path } });
    });
};

var _ident = function _ident(x) {
    return x;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rvci5qcyJdLCJuYW1lcyI6WyJEdXBsaWNhdGVBY3RvcklkRXJyb3IiLCJwYXRocyIsInBhdGgiLCJpZCIsIm1lc3NhZ2UiLCJzdGFjayIsIkVycm9yIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiaGFzT3duUHJvcGVydHkiLCJjYXB0dXJlU3RhY2tUcmFjZSIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsIlRlbXBsYXRlIiwiQWN0b3IiLCJwcm9wcyIsImNoZWNrcyIsImZvbGQiLCJtYXAiLCJBY3RvcklPIiwiU3lzdGVtIiwib3BzIiwiYWN0b3JzIiwiQXJyYXkiLCJsb2ciLCJGdW5jdGlvbiIsIl9kZWZhdWx0TG9nZ2VyIiwic3Bhd24iLCJjb3B5IiwiY2hhaW4iLCJ0IiwidGljayIsIm9mIiwic3RhcnQiLCJMb2NhbFQiLCJTdHJpbmciLCJBY3RvckwiLCJwYXJlbnQiLCJtYWlsYm94IiwidGVtcGxhdGUiLCJjcmVhdGVBY3RvckwiLCJfYWRkcmVzcyIsIkZ1dHVyZVQiLCJ0byIsIlNFTEYiLCJmIiwiQWN0b3JGVCIsIm12YXIiLCJjcmVhdGVBY3RvckZUIiwiX2lkZW50IiwiYWJvcnQiLCJmb3JrIiwicHV0IiwiZXJyb3IiLCJub3QiLCJvckp1c3QiLCJleHRyYWN0IiwibSIsIlN0cmVhbVQiLCJBY3RvclNUIiwiY3JlYXRlQWN0b3JTVCIsIlBhcmVudFQiLCJBY3RvclAiLCJwcm9jZXNzIiwiY3JlYXRlQWN0b3JQIiwib24iLCJDaGlsZFQiLCJBY3RvckNQIiwiaGFuZGxlIiwiY3JlYXRlQWN0b3JDUCIsIl9mb3JrIiwiQWN0b3JTVFAiLCJmcm9tVGVtcGxhdGUiLCJjYXNlT2YiLCJlbmQiLCJyZXBsYWNlIiwiYSIsInAiLCJjIiwiZ2V0Q2hpbGQiLCJjb25jYXQiLCJvIiwiYWNjdW0iLCJyZWR1Y2UiLCJhY2NlcHQiLCJzZW5kIiwic2VsZWN0IiwiaGl0IiwiY2hpbGQiLCJzdGFydHNXaXRoIiwibmV4dFRpY2siLCJzZXRUaW1lb3V0IiwiaW8iLCJzIiwicnVuIiwiY29uc29sZSIsIm9wIiwiX19kaXJuYW1lIiwiZW52IiwiQUNUT1JfU1RBUlQiLCJ4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFnQmdCQSxxQixHQUFBQSxxQjs7QUFoQmhCOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztJQUFZQyxLOzs7Ozs7Ozs7O0FBRVo7OztBQUdPLFNBQVNELHFCQUFULENBQStCRSxJQUEvQixFQUFxQ0MsRUFBckMsRUFBeUM7O0FBRTVDLFNBQUtDLE9BQUwsYUFBc0JELEVBQXRCLHFCQUFzQ0QsSUFBdEM7QUFDQSxTQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLRSxLQUFMLEdBQWMsSUFBSUMsS0FBSixDQUFVLEtBQUtGLE9BQWYsQ0FBRCxDQUEwQkMsS0FBdkM7QUFDQSxTQUFLRSxJQUFMLEdBQVksS0FBS0MsV0FBTCxDQUFpQkQsSUFBN0I7O0FBRUEsUUFBSUQsTUFBTUcsY0FBTixDQUFxQixtQkFBckIsQ0FBSixFQUNJSCxNQUFNSSxpQkFBTixDQUF3QixJQUF4QixFQUE4QixLQUFLRixXQUFuQztBQUVQOztBQUVEUixzQkFBc0JXLFNBQXRCLEdBQWtDQyxPQUFPQyxNQUFQLENBQWNQLE1BQU1LLFNBQXBCLENBQWxDO0FBQ0FYLHNCQUFzQlcsU0FBdEIsQ0FBZ0NILFdBQWhDLEdBQThDUixxQkFBOUM7O2tCQUVlQSxxQjs7QUFFZjs7Ozs7OztJQU1hYyxRLFdBQUFBLFE7Ozs7Ozs7Ozs7OztBQUViOzs7OztJQUdhQyxLLFdBQUFBLEs7OztBQUVULG1CQUFZQyxLQUFaLEVBQW1CQyxNQUFuQixFQUEyQjtBQUFBOztBQUFBLG1IQUVqQkQsS0FGaUIsRUFFVkMsTUFGVTs7QUFJdkIsZUFBS0MsSUFBTCxHQUFZLG1CQUFRQSxJQUFSLFNBQVo7QUFDQSxlQUFLQyxHQUFMLEdBQVcsbUJBQVFBLEdBQVIsU0FB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QUFBLEtBQU4sQ0FBUjtBQUFBLENBQWQ7O0FBRUEsSUFBTWdELFNBQVMsU0FBVEEsTUFBUztBQUFBLFdBQUttRCxDQUFMO0FBQUEsQ0FBZiIsImZpbGUiOiJBY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcmsgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyB0eXBlLCBmb3JjZSwgY2FsbCwgb3IgfSBmcm9tICcuL2JlJztcbmltcG9ydCB7IFR5cGUgfSBmcm9tICcuL1R5cGUnO1xuaW1wb3J0IHsgSU8sIEZyZWUgfSBmcm9tICcuL21vbmFkJztcbmltcG9ydCB7IGZyb21BbnksIE1heWJlIH0gZnJvbSAnLi9mcGwvbW9uYWQvTWF5YmUnO1xuaW1wb3J0IHsgcGFydGlhbCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBzcGF3biwgdGVsbCwgcmVjZWl2ZSBhcyBvcHJlY2VpdmUsIHJhaXNlIH0gZnJvbSAnLi9PcHMnO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJy4vRXhlYyc7XG5pbXBvcnQgeyBtYWtlTVZhciwgTVZhciB9IGZyb20gJy4vTVZhcic7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0ICogYXMgcGF0aHMgZnJvbSAnLi9wYXRocyc7XG5cbi8qKlxuICogRHVwbGljYXRlQWN0b3JJZEVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEdXBsaWNhdGVBY3RvcklkRXJyb3IocGF0aCwgaWQpIHtcblxuICAgIHRoaXMubWVzc2FnZSA9IGBJZCAnJHtpZH0nIGF0IHBhdGggJyR7cGF0aH0nIGlzIGluIHVzZSFgO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuRHVwbGljYXRlQWN0b3JJZEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkR1cGxpY2F0ZUFjdG9ySWRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEdXBsaWNhdGVBY3RvcklkRXJyb3I7XG5cbmV4cG9ydCBkZWZhdWx0IER1cGxpY2F0ZUFjdG9ySWRFcnJvclxuXG4vKipcbiAqIFRlbXBsYXRlIGlzIGEgdGVtcGxhdGUgZm9yIGNyZWF0aW5nIGFjdG9ycyB0aGF0IHJ1biBpblxuICogdGhlIHNhbWUgZXZlbnQgbG9vcCBhcyB0aGUgc3lzdGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIC0gbXVzdCBiZSB1bmlxdWVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHN0YXJ0IC0gQWN0b3Ig4oaSICBBY3RvclxuICovXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBUeXBlIHt9XG5cbi8qKlxuICogQWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yIGV4dGVuZHMgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY2hlY2tzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIGNoZWNrcyk7XG5cbiAgICAgICAgdGhpcy5mb2xkID0gcGFydGlhbChmb2xkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5tYXAgPSBwYXJ0aWFsKG1hcCwgdGhpcyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvcklPXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvcklPIGV4dGVuZHMgQWN0b3Ige31cblxuLyoqXG4gKiBTeXN0ZW1cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8T3A+fSBvcHNcbiAqL1xuZXhwb3J0IGNsYXNzIFN5c3RlbSBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIHBhdGg6IGZvcmNlKCcnKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgYWN0b3JzOiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIGxvZzogb3IodHlwZShGdW5jdGlvbiksIGZvcmNlKF9kZWZhdWx0TG9nZ2VyKSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zcGF3biA9IHQgPT4gdGhpcy5jb3B5KHsgb3BzOiB0aGlzLm9wcyA/IHRoaXMub3BzLmNoYWluKCgpID0+IHNwYXduKHQpKSA6IHNwYXduKHQpIH0pO1xuICAgICAgICB0aGlzLnRpY2sgPSAoKSA9PiB0aWNrKElPLm9mKHRoaXMuY29weSh7IG9wczogbnVsbCB9KSksIHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gKCkgPT4gc3RhcnQodGhpcyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBMb2NhbFQgaXMgYSB0ZW1wbGF0ZSBmb3IgY3JlYXRpbmcgYSBsb2NhbCBhY3RvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzdGFydFxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxUIGV4dGVuZHMgVGVtcGxhdGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBpZDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgc3RhcnQ6IG9yKHR5cGUoRnVuY3Rpb24pLCBmb3JjZSgoKSA9PiB7fSkpXG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvckxcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yTCBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHBhcmVudDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgcGF0aDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEZyZWUpLCBmb3JjZShudWxsKSksXG4gICAgICAgICAgICBtYWlsYm94OiBvcih0eXBlKEFycmF5KSwgZm9yY2UoW10pKSxcbiAgICAgICAgICAgIGFjdG9yczogb3IodHlwZShBcnJheSksIGZvcmNlKFtdKSksXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdHlwZShUZW1wbGF0ZSlcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGNyZWF0ZUFjdG9yTCBmcm9tIGEgdGVtcGxhdGVcbiAqIEBzdW1tYXJ5IGNyZWF0ZUFjdG9yTCA6OiAoc3RyaW5nLExvY2FsVCkg4oaSICBBY3RvckxcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdG9yTCA9IChwYXJlbnQsIHRlbXBsYXRlKSA9PiBuZXcgQWN0b3JMKHtcbiAgICBpZDogdGVtcGxhdGUuaWQsXG4gICAgcGFyZW50LFxuICAgIHBhdGg6IF9hZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpLFxuICAgIG9wczogdGVtcGxhdGUuc3RhcnQoKSxcbiAgICB0ZW1wbGF0ZVxufSk7XG5cbi8qKlxuICogRnV0dXJlVCBpcyB0aGUgdGVtcGxhdGUgZm9yIHNwYXduaW5nIGZ1dHVyZSBhY3RvcnMuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHtGdXR1cmV9IGZ1dHVyZVxuICovXG5leHBvcnQgY2xhc3MgRnV0dXJlVCBleHRlbmRzIFRlbXBsYXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiBjYWxsKCgpID0+IGBmdXR1cmUtJHt2NCgpfWApLFxuICAgICAgICAgICAgdG86IG9yKHR5cGUoU3RyaW5nKSwgZm9yY2UocGF0aHMuU0VMRikpLFxuICAgICAgICAgICAgZjogdHlwZShGdW5jdGlvbilcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvckZUIGNvbnRhaW5zIGEgRnV0dXJlLCBhIGNvbXB1dGF0aW9uIHRoYXQgd2UgZXhwZWN0IHRvIGJlIGNvbXBsZXRlIHNvbWV0aW1lXG4gKiBsYXRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yRlQgZXh0ZW5kcyBBY3RvcklPIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKG51bGwpKSxcbiAgICAgICAgICAgIG12YXI6IHR5cGUoTVZhciksXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdHlwZShUZW1wbGF0ZSlcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBjcmVhdGVBY3RvckZUIGZyb20gYSB0ZW1wbGF0ZVxuICogQHN1bW1hcnkgY3JlYXRlQWN0b3JGVCA6OiAoc3RyaW5nLEZ1dHVyZVQpIOKGkiAgSU88QWN0b3JGVD5cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdG9yRlQgPSAocGFyZW50LCB0ZW1wbGF0ZSkgPT5cbiAgICBtYWtlTVZhcigpXG4gICAgLmNoYWluKG12YXIgPT4gSU8ub2YoKCkgPT4gbmV3IEFjdG9yRlQoe1xuICAgICAgICBpZDogdGVtcGxhdGUuaWQsXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgcGF0aDogX2FkZHJlc3MocGFyZW50LCB0ZW1wbGF0ZS5pZCksXG4gICAgICAgIG9wczogb3ByZWNlaXZlKF9pZGVudCksXG4gICAgICAgIG12YXIsXG4gICAgICAgIGFib3J0OiB0ZW1wbGF0ZVxuICAgICAgICAgICAgLmYoKVxuICAgICAgICAgICAgLmZvcmsoZXJyb3IgPT4gbXZhci5wdXQocmFpc2UoZXJyb3IpKSxcbiAgICAgICAgICAgICAgICBtID0+IG12YXJcbiAgICAgICAgICAgICAgICAucHV0KHRlbGwoTWF5YmVcbiAgICAgICAgICAgICAgICAgICAgLm5vdCh0ZW1wbGF0ZS50bylcbiAgICAgICAgICAgICAgICAgICAgLm9ySnVzdChwYXRocy5TRUxGKVxuICAgICAgICAgICAgICAgICAgICAuZXh0cmFjdCgpLCBtKSkpLFxuICAgICAgICB0ZW1wbGF0ZVxuICAgIH0pKSk7XG5cbi8qKlxuICogU3RyZWFtVFxuICovXG5leHBvcnQgY2xhc3MgU3RyZWFtVCBleHRlbmRzIFRlbXBsYXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICB0bzogb3IodHlwZShTdHJpbmcpLCBmb3JjZShwYXRocy5TRUxGKSksXG4gICAgICAgICAgICBmOiB0eXBlKEZ1bmN0aW9uKVxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWN0b3JTVCBleHRlbmRzIEFjdG9ySU8ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG12YXI6IHR5cGUoTVZhciksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKG51bGwpKVxuICAgICAgICB9KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGNyZWF0ZUFjdG9yU1QgZnJvbSBhIHRlbXBsYXRlXG4gKiBAc3VtbWFyeSBjcmVhdGVBY3RvclNUIDo6IChzdHJpbmcsIHRlbXBsYXRlKSDihpIgIElPPEFjdG9yU1Q+XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvclNUID0gKHBhcmVudCwgdGVtcGxhdGUpID0+XG4gICAgbWFrZU1WYXIoKVxuICAgIC5jaGFpbihtdmFyID0+XG4gICAgICAgIHRlbXBsYXRlLmYobSA9PiBtdmFyLnB1dCh0ZWxsKHRlbXBsYXRlLnRvLCBtKSkpXG4gICAgICAgIC5tYXAoKCkgPT4gbmV3IEFjdG9yU1Qoe1xuICAgICAgICAgICAgaWQ6IHRlbXBsYXRlLmlkLFxuICAgICAgICAgICAgcGF0aDogX2FkZHJlc3MocGFyZW50LCB0ZW1wbGF0ZS5pZCksXG4gICAgICAgICAgICBvcHM6IG9wcmVjZWl2ZShfaWRlbnQpLFxuICAgICAgICAgICAgbXZhclxuICAgICAgICB9KSkpO1xuXG4vKipcbiAqIFBhcmVudFRcbiAqL1xuZXhwb3J0IGNsYXNzIFBhcmVudFQgZXh0ZW5kcyBUZW1wbGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IGlkOiB0eXBlKFN0cmluZykgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBBY3RvclBcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yUCBleHRlbmRzIEFjdG9ySU8ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuXG4gICAgICAgICAgICBpZDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgcHJvY2VzczogdHlwZShPYmplY3QpLFxuICAgICAgICAgICAgcGF0aDogb3IodHlwZShTdHJpbmcpLCBmb3JjZShgcHJvY2Vzcy0ke3Y0KCl9YCkpLFxuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEZyZWUpLCBmb3JjZShudWxsKSksXG4gICAgICAgICAgICBtdmFyOiB0eXBlKE1WYXIpXG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBjcmVhdGVBY3RvclAgZnJvbSBhIHRlbXBsYXRlXG4gKiBAc3VtbWFyeSBjcmVhdGVBY3RvclAgOjogKHN0cmluZywgUGFyZW50VCkg4oaSICBJTzxBY3RvclA+XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvclAgPSAocGFyZW50LCB0ZW1wbGF0ZSkgPT5cbiAgICBtYWtlTVZhcigpXG4gICAgLmNoYWluKG12YXIgPT4gSU8ub2YoKCkgPT4ge1xuXG4gICAgICAgIHByb2Nlc3Mub24oJ21lc3NhZ2UnLCAoeyBtZXNzYWdlLCB0byB9KSA9PiBtdmFyLnB1dCh0ZWxsKHRvLCBtZXNzYWdlKSkpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQWN0b3JQKHtcblxuICAgICAgICAgICAgaWQ6IHRlbXBsYXRlLmlkLFxuICAgICAgICAgICAgcGF0aDogX2FkZHJlc3MocGFyZW50LCB0ZW1wbGF0ZS5pZCksXG4gICAgICAgICAgICBwcm9jZXNzLFxuICAgICAgICAgICAgbXZhcixcbiAgICAgICAgICAgIG9wczogb3ByZWNlaXZlKF9pZGVudCksXG4gICAgICAgICAgICB0ZW1wbGF0ZVxuXG4gICAgICAgIH0pO1xuXG4gICAgfSkpO1xuXG4vKipcbiAqIENoaWxkVFxuICovXG5leHBvcnQgY2xhc3MgQ2hpbGRUIGV4dGVuZHMgVGVtcGxhdGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBpZDogZm9yY2UoYGNoaWxkLSR7djQoKX1gKSB9KVxuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JDUFxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JDUCBleHRlbmRzIEFjdG9ySU8ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywge1xuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgbXZhcjogdHlwZShNVmFyKSxcbiAgICAgICAgICAgIGhhbmRsZTogdHlwZShPYmplY3QpXG4gICAgICAgIH0pO1xuXG4gICAgfVxufVxuXG4vKipcbiAqIGNyZWF0ZUFjdG9yQ1AgZnJvbSBhIHRlbXBsYXRlXG4gKiBAc3VtbWFyeSBjcmVhdGVBY3RvckNQIDo6IChzdHJpbmcsQ2hpbGRUKSDihpIgIElPPEFjdG9yQ1BcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUFjdG9yQ1AgPSAocGFyZW50LCB0ZW1wbGF0ZSkgPT5cbiAgICBtYWtlTVZhcigpXG4gICAgLmNoYWluKG12YXIgPT5cbiAgICAgICAgX2ZvcmsodGVtcGxhdGUuc3RhcnQpXG4gICAgICAgIC5jaGFpbihoYW5kbGUgPT4ge1xuXG4gICAgICAgICAgICBoYW5kbGUub24oJ21lc3NhZ2UnLCAoeyB0bywgbWVzc2FnZSB9KSA9PiBtdmFyLnB1dCh0ZWxsKHRvLCBtZXNzYWdlKSkpXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgQWN0b3JDUCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRlbXBsYXRlLmlkLFxuICAgICAgICAgICAgICAgIHBhdGg6IF9hZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpLFxuICAgICAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICBvcHM6IG9wcmVjZWl2ZShfaWRlbnQpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KSk7XG5cblxuLyoqXG4gKiBBY3RvclNUUCBpcyBhIHN0b3BwZWQgQWN0b3IgcmVhZHkgZm9yIHJlbW92YWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvclNUUCBleHRlbmRzIEFjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgcGF0aDogdHlwZShTdHJpbmcpIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBmcm9tVGVtcGxhdGUgPSAocGFyZW50LCB0ZW1wbGF0ZSkgPT4gbWF0Y2godGVtcGxhdGUpXG4gICAgLmNhc2VPZihMb2NhbFQsIHBhcnRpYWwoY3JlYXRlQWN0b3JMLCBwYXJlbnQpKVxuICAgIC5jYXNlT2YoRnV0dXJlVCwgcGFydGlhbChjcmVhdGVBY3RvckZULCBwYXJlbnQpKVxuICAgIC5jYXNlT2YoU3RyZWFtVCwgcGFydGlhbChjcmVhdGVBY3RvclNULCBwYXJlbnQpKVxuICAgIC5jYXNlT2YoUGFyZW50VCwgcGFydGlhbChjcmVhdGVBY3RvclAsIHBhcmVudCkpXG4gICAgLmNhc2VPZihDaGlsZFQsIHBhcnRpYWwoY3JlYXRlQWN0b3JDUCwgcGFyZW50KSlcbiAgICAuZW5kKCk7XG5cbi8qKlxuICogcmVwbGFjZSBhbiBhY3RvciB3aXRoIGEgbmV3IHZlcnNpb24uXG4gKiBSZXR1cm5zIHRoZSBwYXJlbnQgYWN0b3IgKHNlY29uZCBhcmcpIHVwZGF0ZWQgd2l0aCB0aGUgbmV3IGFjdG9yLlxuICogSWYgdGhlIHBhcmVudCBwYXRoIGlzIHRoZSBzYW1lIHBhdGggYXMgdGhlIGFjdG9yIHRvIHJlcGxhY2UsIGl0IGlzXG4gKiByZXBsYWNlZCBpbnN0ZWFkLlxuICogTm8gY2hhbmdlIGlzIG1hZGUgaWYgdGhlIGFjdG9yIGlzIG5vdCBmb3VuZC5cbiAqIEBzdW1tYXJ5IChBY3RvciwgQWN0b3IpIOKGkiAgQWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSAoYSwgcCkgPT5cbiAgICBwLnBhdGggPT09IGEucGF0aCA/XG4gICAgYSA6IHAubWFwKGMgPT4gYy5wYXRoID09PSBhLnBhdGggPyBhIDogYy5tYXAocGFydGlhbChyZXBsYWNlLCBhKSkpO1xuXG4vKipcbiAqIG1hcCBvdmVyIGFuIEFjdG9yIHRyZWF0aW5nIGl0IGxpa2UgYSBGdW5jdG9yXG4gKiBAc3VtbWFyeSB7KEFjdG9yLEZ1bmN0aW9uKSDihpIgIEFjdG9yfVxuICovXG5leHBvcnQgY29uc3QgbWFwID0gKGEsIGYpID0+IG1hdGNoKGEpXG4gICAgLmNhc2VPZihBY3RvckZULCBhID0+IGEpXG4gICAgLmNhc2VPZihBY3RvciwgYSA9PiBhLmNvcHkoeyBhY3RvcnM6IGEuYWN0b3JzLm1hcChmKSB9KSlcbiAgICAuZW5kKCk7XG5cbi8qKlxuICogZ2V0Q2hpbGQgZ2V0cyBhIGNoaWxkIGFjdG9yIGZyb20gaXRzIHBhcmVudCB1c2luZyBpdHMgaWRcbiAqIEBzdW1tYXJ5IChzdHJpbmcsQWN0b3IpIOKGkiAgTWF5YmU8QWN0b3I+XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDaGlsZCA9IChpZCwgYSkgPT4gZnJvbUFueShhLmZvbGQoKHAsIGMpID0+IHAgPyBwIDogYy5pZCA9PT0gaWQgPyBjIDogbnVsbCkpO1xuXG4vKipcbiAqIHB1dCBhbiBhY3RvciBpbnRvIGFub3RoZXIgbWFraW5nIGl0IGEgY2hpbGRcbiAqIFJldHVybnMgdGhlIHBhcmVudCAoY2hpbGQscGFyZW50KSDihpIgIHBhcmVudFxuICogQHN1bW1hcnkgKEFjdG9yLCBBY3Rvcikg4oaSICBBY3RvclxuICovXG5leHBvcnQgY29uc3QgcHV0ID0gKGEsIHApID0+IHAuY29weSh7IGFjdG9yczogcC5hY3RvcnMuY29uY2F0KGEpIH0pO1xuXG4vKipcbiAqIGZvbGQgYSBkYXRhIHN0cnVjdHVyZSBpbnRvIGFuIGFjdW11bGF0ZWQgc2ltcGxlciBvbmVcbiAqIEBzdW1tYXJ5IGZvbGQgOjogKEFjdG9yLCAq4oaSICosICopIOKGkiAgKlxuICovXG5leHBvcnQgY29uc3QgZm9sZCA9IChvLCBmLCBhY2N1bSkgPT4gbWF0Y2gobylcbiAgICAuY2FzZU9mKEFjdG9ySU8sICgpID0+IGFjY3VtKVxuICAgIC5jYXNlT2YoQWN0b3IsIGEgPT4gYS5hY3RvcnMucmVkdWNlKGYsIGFjY3VtKSlcbiAgICAuZW5kKClcblxuLyoqXG4gKiBhY2NlcHQgYWxsb3dzIGFuIEFjdG9yIHRvIGFjY2VwdCB0aGUgbGF0ZXN0IG1lc3NhZ2UgYWRkcmVzc2VkIHRvIGl0LlxuICogQHBhcmFtIHsqfSBtXG4gKiBAc3VtbWFyeSB7KixBY3Rvcikg4oaSICBBY3RvcnxJTzxBY3Rvcj58RHJvcH1cbiAqL1xuZXhwb3J0IGNvbnN0IGFjY2VwdCA9IChtLCBhKSA9PiBtYXRjaChhKVxuICAgIC5jYXNlT2YoQWN0b3JMLCBhID0+IGEuY29weSh7IG1haWxib3g6IGEubWFpbGJveC5jb25jYXQobSkgfSkpXG4gICAgLmNhc2VPZihBY3RvclAsIGEgPT4gSU8ub2YoKCkgPT4geyBhLnByb2Nlc3Muc2VuZChtKTsgcmV0dXJuIGE7IH0pKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBzZWxlY3QgYW4gYWN0b3IgaW4gdGhlIHN5c3RlbSB1c2luZyB0aGUgc3BlY2lmaWVkIHBhdGguXG4gKiBAc3VtbWFyeSAoc3RyaW5nLCBBY3Rvcikg4oaSICBBY3RvcnxudWxsXG4gKi9cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSAocCwgYSkgPT4gZm9sZChhLCAoaGl0LCBjaGlsZCkgPT5cbiAgICAoaGl0ID9cbiAgICAgICAgaGl0IDpcbiAgICAgICAgcCA9PT0gY2hpbGQucGF0aCA/XG4gICAgICAgIGNoaWxkIDpcbiAgICAgICAgcC5zdGFydHNXaXRoKGNoaWxkLnBhdGgpID9cbiAgICAgICAgc2VsZWN0KHAsIGNoaWxkKSA6IG51bGwpLCBudWxsKTtcblxuZXhwb3J0IGNvbnN0IG5leHRUaWNrID0gZiA9PlxuICAgIElPLm9mKCgpID0+IHNldFRpbWVvdXQoZiwgMTAwKSk7XG5cbi8qKlxuICogdGlja1xuICogQHN1bW1hcnkgdGljayA6OiAoQWN0b3IsIElPPEFjdG9yPikg4oaSICBJTzxBY3Rvcj5cbiAqL1xuZXhwb3J0IGNvbnN0IHRpY2sgPSAoaW8sIGEpID0+XG4gICAgZXhlYyhhLmNvcHkoeyBvcHM6IG51bGwgfSksIGEuZm9sZCh0aWNrLCBpbyksIGEub3BzKTtcblxuLyoqXG4gKiBzdGFydCB0aGUgc3lzdGVtLlxuICogTm90ZTogc3RhcnQgZG9lcyBub3QgYWN0dWFsbCBzdGFydCB0aGUgc3lzdGVtIGJ1dCByZXR1cm5zIGFuIElPIGNsYXNzLlxuICogQHN1bW1hcnkgc3RhcnQgOjogU3lzdGVtIOKGkiAgSU88bnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHN0YXJ0ID0gcyA9PiBtYXRjaChzKVxuICAgIC5jYXNlT2YoU3lzdGVtLCBzID0+IHRpY2soSU8ub2YocyksIHMpLmNoYWluKHMgPT4gbmV4dFRpY2soKCkgPT4gc3RhcnQocykucnVuKCkpKSlcbiAgICAuZW5kKCk7XG5cbmNvbnN0IF9kZWZhdWx0TG9nZ2VyID0gb3AgPT4gSU8ub2YoKCkgPT4gY29uc29sZS5sb2cob3ApKTtcblxuY29uc3QgX2FkZHJlc3MgPSAocGFyZW50LCBpZCkgPT4gKChwYXJlbnQgPT09ICcnKSB8fCAocGFyZW50ID09PSAnLycpKSA/IGlkIDogYCR7cGFyZW50fS8ke2lkfWA7XG5cbmNvbnN0IF9mb3JrID0gcGF0aCA9PiBJTy5vZigoKSA9PiBmb3JrKGAke19fZGlybmFtZX0vcHJvY2Vzcy5qc2AsIHsgZW52OiB7IEFDVE9SX1NUQVJUOiBwYXRoIH0gfSkpO1xuXG5jb25zdCBfaWRlbnQgPSB4ID0+IHg7XG4iXX0=