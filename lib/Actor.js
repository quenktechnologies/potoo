'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = exports.tick = exports.nextTick = exports.select = exports.accept = exports.fold = exports.put = exports.get = exports.map = exports.replace = exports.fromTemplate = exports.ActorSTP = exports.createActorCP = exports.ActorCP = exports.ChildT = exports.createActorP = exports.ActorP = exports.ParentT = exports.createActorST = exports.ActorST = exports.StreamT = exports.createActorFT = exports.ActorFT = exports.FutureT = exports.createActorL = exports.ActorL = exports.LocalT = exports.System = exports.ActorIO = exports.Actor = exports.Template = undefined;
exports.DuplicateActorIdError = DuplicateActorIdError;

var _child_process = require('child_process');

var _uuid = require('uuid');

var _be = require('./be');

var _Type3 = require('./Type');

var _monad = require('./monad');

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
                    return mvar.put((0, _Ops.tell)(_monad.Maybe.not(template.to).orJust(paths.SELF).extract(), m));
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
 * get a child actor from its parent using its id
 * @summary (string,Actor) →  Actor|null
 */
var get = exports.get = function get(id, a) {
    return a.fold(function (p, c) {
        return p ? p : c.id === id ? c : null;
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rvci5qcyJdLCJuYW1lcyI6WyJEdXBsaWNhdGVBY3RvcklkRXJyb3IiLCJwYXRocyIsInBhdGgiLCJpZCIsIm1lc3NhZ2UiLCJzdGFjayIsIkVycm9yIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiaGFzT3duUHJvcGVydHkiLCJjYXB0dXJlU3RhY2tUcmFjZSIsInByb3RvdHlwZSIsIk9iamVjdCIsImNyZWF0ZSIsIlRlbXBsYXRlIiwiQWN0b3IiLCJwcm9wcyIsImNoZWNrcyIsImZvbGQiLCJtYXAiLCJBY3RvcklPIiwiU3lzdGVtIiwib3BzIiwiYWN0b3JzIiwiQXJyYXkiLCJsb2ciLCJGdW5jdGlvbiIsIl9kZWZhdWx0TG9nZ2VyIiwic3Bhd24iLCJjb3B5IiwiY2hhaW4iLCJ0IiwidGljayIsIm9mIiwic3RhcnQiLCJMb2NhbFQiLCJTdHJpbmciLCJBY3RvckwiLCJwYXJlbnQiLCJtYWlsYm94IiwidGVtcGxhdGUiLCJjcmVhdGVBY3RvckwiLCJfYWRkcmVzcyIsIkZ1dHVyZVQiLCJ0byIsIlNFTEYiLCJmIiwiQWN0b3JGVCIsIm12YXIiLCJjcmVhdGVBY3RvckZUIiwiX2lkZW50IiwiYWJvcnQiLCJmb3JrIiwicHV0IiwiZXJyb3IiLCJub3QiLCJvckp1c3QiLCJleHRyYWN0IiwibSIsIlN0cmVhbVQiLCJBY3RvclNUIiwiY3JlYXRlQWN0b3JTVCIsIlBhcmVudFQiLCJBY3RvclAiLCJwcm9jZXNzIiwiY3JlYXRlQWN0b3JQIiwib24iLCJDaGlsZFQiLCJBY3RvckNQIiwiaGFuZGxlIiwiY3JlYXRlQWN0b3JDUCIsIl9mb3JrIiwiQWN0b3JTVFAiLCJmcm9tVGVtcGxhdGUiLCJjYXNlT2YiLCJlbmQiLCJyZXBsYWNlIiwiYSIsInAiLCJjIiwiZ2V0IiwiY29uY2F0IiwibyIsImFjY3VtIiwicmVkdWNlIiwiYWNjZXB0Iiwic2VuZCIsInNlbGVjdCIsImhpdCIsImNoaWxkIiwic3RhcnRzV2l0aCIsIm5leHRUaWNrIiwic2V0VGltZW91dCIsImlvIiwicyIsInJ1biIsImNvbnNvbGUiLCJvcCIsIl9fZGlybmFtZSIsImVudiIsIkFDVE9SX1NUQVJUIiwieCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBZWdCQSxxQixHQUFBQSxxQjs7QUFmaEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlDLEs7Ozs7Ozs7Ozs7QUFFWjs7O0FBR08sU0FBU0QscUJBQVQsQ0FBK0JFLElBQS9CLEVBQXFDQyxFQUFyQyxFQUF5Qzs7QUFFNUMsU0FBS0MsT0FBTCxhQUFzQkQsRUFBdEIscUJBQXNDRCxJQUF0QztBQUNBLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLEVBQUwsR0FBVUEsRUFBVjtBQUNBLFNBQUtFLEtBQUwsR0FBYyxJQUFJQyxLQUFKLENBQVUsS0FBS0YsT0FBZixDQUFELENBQTBCQyxLQUF2QztBQUNBLFNBQUtFLElBQUwsR0FBWSxLQUFLQyxXQUFMLENBQWlCRCxJQUE3Qjs7QUFFQSxRQUFJRCxNQUFNRyxjQUFOLENBQXFCLG1CQUFyQixDQUFKLEVBQ0lILE1BQU1JLGlCQUFOLENBQXdCLElBQXhCLEVBQThCLEtBQUtGLFdBQW5DO0FBRVA7O0FBRURSLHNCQUFzQlcsU0FBdEIsR0FBa0NDLE9BQU9DLE1BQVAsQ0FBY1AsTUFBTUssU0FBcEIsQ0FBbEM7QUFDQVgsc0JBQXNCVyxTQUF0QixDQUFnQ0gsV0FBaEMsR0FBOENSLHFCQUE5Qzs7a0JBRWVBLHFCOztBQUVmOzs7Ozs7O0lBTWFjLFEsV0FBQUEsUTs7Ozs7Ozs7Ozs7O0FBRWI7Ozs7O0lBR2FDLEssV0FBQUEsSzs7O0FBRVQsbUJBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUEsbUhBRWpCRCxLQUZpQixFQUVWQyxNQUZVOztBQUl2QixlQUFLQyxJQUFMLEdBQVksbUJBQVFBLElBQVIsU0FBWjtBQUNBLGVBQUtDLEdBQUwsR0FBVyxtQkFBUUEsR0FBUixTQUFYOztBQUx1QjtBQU8x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QUFFQSxJQUFNZ0QsU0FBUyxTQUFUQSxNQUFTO0FBQUEsV0FBS21ELENBQUw7QUFBQSxDQUFmIiwiZmlsZSI6IkFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9yayB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHR5cGUsIGZvcmNlLCBjYWxsLCBvciB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgeyBJTywgRnJlZSwgTWF5YmUgfSBmcm9tICcuL21vbmFkJztcbmltcG9ydCB7IHBhcnRpYWwgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgc3Bhd24sIHRlbGwsIHJlY2VpdmUgYXMgb3ByZWNlaXZlLCByYWlzZSB9IGZyb20gJy4vT3BzJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICcuL0V4ZWMnO1xuaW1wb3J0IHsgbWFrZU1WYXIsIE1WYXIgfSBmcm9tICcuL01WYXInO1xuaW1wb3J0IHsgbWF0Y2ggfSBmcm9tICcuL01hdGNoJztcbmltcG9ydCAqIGFzIHBhdGhzIGZyb20gJy4vcGF0aHMnO1xuXG4vKipcbiAqIER1cGxpY2F0ZUFjdG9ySWRFcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gRHVwbGljYXRlQWN0b3JJZEVycm9yKHBhdGgsIGlkKSB7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBgSWQgJyR7aWR9JyBhdCBwYXRoICcke3BhdGh9JyBpcyBpbiB1c2UhYDtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpKS5zdGFjaztcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICBpZiAoRXJyb3IuaGFzT3duUHJvcGVydHkoJ2NhcHR1cmVTdGFja1RyYWNlJykpXG4gICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG59XG5cbkR1cGxpY2F0ZUFjdG9ySWRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5EdXBsaWNhdGVBY3RvcklkRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRHVwbGljYXRlQWN0b3JJZEVycm9yO1xuXG5leHBvcnQgZGVmYXVsdCBEdXBsaWNhdGVBY3RvcklkRXJyb3JcblxuLyoqXG4gKiBUZW1wbGF0ZSBpcyBhIHRlbXBsYXRlIGZvciBjcmVhdGluZyBhY3RvcnMgdGhhdCBydW4gaW5cbiAqIHRoZSBzYW1lIGV2ZW50IGxvb3AgYXMgdGhlIHN5c3RlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCAtIG11c3QgYmUgdW5pcXVlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzdGFydCAtIEFjdG9yIOKGkiAgQWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgVHlwZSB7fVxuXG4vKipcbiAqIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvciBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNoZWNrcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCBjaGVja3MpO1xuXG4gICAgICAgIHRoaXMuZm9sZCA9IHBhcnRpYWwoZm9sZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubWFwID0gcGFydGlhbChtYXAsIHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JJT1xuICovXG5leHBvcnQgY2xhc3MgQWN0b3JJTyBleHRlbmRzIEFjdG9yIHt9XG5cbi8qKlxuICogU3lzdGVtXG4gKiBAcHJvcGVydHkge0FycmF5PE9wPn0gb3BzXG4gKi9cbmV4cG9ydCBjbGFzcyBTeXN0ZW0gZXh0ZW5kcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBwYXRoOiBmb3JjZSgnJyksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKG51bGwpKSxcbiAgICAgICAgICAgIGFjdG9yczogb3IodHlwZShBcnJheSksIGZvcmNlKFtdKSksXG4gICAgICAgICAgICBsb2c6IG9yKHR5cGUoRnVuY3Rpb24pLCBmb3JjZShfZGVmYXVsdExvZ2dlcikpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3Bhd24gPSB0ID0+IHRoaXMuY29weSh7IG9wczogdGhpcy5vcHMgPyB0aGlzLm9wcy5jaGFpbigoKSA9PiBzcGF3bih0KSkgOiBzcGF3bih0KSB9KTtcbiAgICAgICAgdGhpcy50aWNrID0gKCkgPT4gdGljayhJTy5vZih0aGlzLmNvcHkoeyBvcHM6IG51bGwgfSkpLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zdGFydCA9ICgpID0+IHN0YXJ0KHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogTG9jYWxUIGlzIGEgdGVtcGxhdGUgZm9yIGNyZWF0aW5nIGEgbG9jYWwgYWN0b3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc3RhcnRcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsVCBleHRlbmRzIFRlbXBsYXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHN0YXJ0OiBvcih0eXBlKEZ1bmN0aW9uKSwgZm9yY2UoKCkgPT4ge30pKVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JMXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvckwgZXh0ZW5kcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG5cbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXJlbnQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHBhdGg6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgbWFpbGJveDogb3IodHlwZShBcnJheSksIGZvcmNlKFtdKSksXG4gICAgICAgICAgICBhY3RvcnM6IG9yKHR5cGUoQXJyYXkpLCBmb3JjZShbXSkpLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHR5cGUoVGVtcGxhdGUpXG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBjcmVhdGVBY3RvckwgZnJvbSBhIHRlbXBsYXRlXG4gKiBAc3VtbWFyeSBjcmVhdGVBY3RvckwgOjogKHN0cmluZyxMb2NhbFQpIOKGkiAgQWN0b3JMXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvckwgPSAocGFyZW50LCB0ZW1wbGF0ZSkgPT4gbmV3IEFjdG9yTCh7XG4gICAgaWQ6IHRlbXBsYXRlLmlkLFxuICAgIHBhcmVudCxcbiAgICBwYXRoOiBfYWRkcmVzcyhwYXJlbnQsIHRlbXBsYXRlLmlkKSxcbiAgICBvcHM6IHRlbXBsYXRlLnN0YXJ0KCksXG4gICAgdGVtcGxhdGVcbn0pO1xuXG4vKipcbiAqIEZ1dHVyZVQgaXMgdGhlIHRlbXBsYXRlIGZvciBzcGF3bmluZyBmdXR1cmUgYWN0b3JzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9cbiAqIEBwcm9wZXJ0eSB7RnV0dXJlfSBmdXR1cmVcbiAqL1xuZXhwb3J0IGNsYXNzIEZ1dHVyZVQgZXh0ZW5kcyBUZW1wbGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBpZDogY2FsbCgoKSA9PiBgZnV0dXJlLSR7djQoKX1gKSxcbiAgICAgICAgICAgIHRvOiBvcih0eXBlKFN0cmluZyksIGZvcmNlKHBhdGhzLlNFTEYpKSxcbiAgICAgICAgICAgIGY6IHR5cGUoRnVuY3Rpb24pXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JGVCBjb250YWlucyBhIEZ1dHVyZSwgYSBjb21wdXRhdGlvbiB0aGF0IHdlIGV4cGVjdCB0byBiZSBjb21wbGV0ZSBzb21ldGltZVxuICogbGF0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvckZUIGV4dGVuZHMgQWN0b3JJTyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBpZDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgcGF0aDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEZyZWUpLCBmb3JjZShudWxsKSksXG4gICAgICAgICAgICBtdmFyOiB0eXBlKE1WYXIpLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHR5cGUoVGVtcGxhdGUpXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogY3JlYXRlQWN0b3JGVCBmcm9tIGEgdGVtcGxhdGVcbiAqIEBzdW1tYXJ5IGNyZWF0ZUFjdG9yRlQgOjogKHN0cmluZyxGdXR1cmVUKSDihpIgIElPPEFjdG9yRlQ+XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvckZUID0gKHBhcmVudCwgdGVtcGxhdGUpID0+XG4gICAgbWFrZU1WYXIoKVxuICAgIC5jaGFpbihtdmFyID0+IElPLm9mKCgpID0+IG5ldyBBY3RvckZUKHtcbiAgICAgICAgaWQ6IHRlbXBsYXRlLmlkLFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIHBhdGg6IF9hZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpLFxuICAgICAgICBvcHM6IG9wcmVjZWl2ZShfaWRlbnQpLFxuICAgICAgICBtdmFyLFxuICAgICAgICBhYm9ydDogdGVtcGxhdGVcbiAgICAgICAgICAgIC5mKClcbiAgICAgICAgICAgIC5mb3JrKGVycm9yID0+IG12YXIucHV0KHJhaXNlKGVycm9yKSksXG4gICAgICAgICAgICAgICAgbSA9PiBtdmFyXG4gICAgICAgICAgICAgICAgLnB1dCh0ZWxsKE1heWJlXG4gICAgICAgICAgICAgICAgICAgIC5ub3QodGVtcGxhdGUudG8pXG4gICAgICAgICAgICAgICAgICAgIC5vckp1c3QocGF0aHMuU0VMRilcbiAgICAgICAgICAgICAgICAgICAgLmV4dHJhY3QoKSwgbSkpKSxcbiAgICAgICAgdGVtcGxhdGVcbiAgICB9KSkpO1xuXG4vKipcbiAqIFN0cmVhbVRcbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbVQgZXh0ZW5kcyBUZW1wbGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7XG4gICAgICAgICAgICBpZDogdHlwZShTdHJpbmcpLFxuICAgICAgICAgICAgdG86IG9yKHR5cGUoU3RyaW5nKSwgZm9yY2UocGF0aHMuU0VMRikpLFxuICAgICAgICAgICAgZjogdHlwZShGdW5jdGlvbilcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFjdG9yU1QgZXh0ZW5kcyBBY3RvcklPIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBtdmFyOiB0eXBlKE1WYXIpLFxuICAgICAgICAgICAgb3BzOiBvcih0eXBlKEZyZWUpLCBmb3JjZShudWxsKSlcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBjcmVhdGVBY3RvclNUIGZyb20gYSB0ZW1wbGF0ZVxuICogQHN1bW1hcnkgY3JlYXRlQWN0b3JTVCA6OiAoc3RyaW5nLCB0ZW1wbGF0ZSkg4oaSICBJTzxBY3RvclNUPlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0b3JTVCA9IChwYXJlbnQsIHRlbXBsYXRlKSA9PlxuICAgIG1ha2VNVmFyKClcbiAgICAuY2hhaW4obXZhciA9PlxuICAgICAgICB0ZW1wbGF0ZS5mKG0gPT4gbXZhci5wdXQodGVsbCh0ZW1wbGF0ZS50bywgbSkpKVxuICAgICAgICAubWFwKCgpID0+IG5ldyBBY3RvclNUKHtcbiAgICAgICAgICAgIGlkOiB0ZW1wbGF0ZS5pZCxcbiAgICAgICAgICAgIHBhdGg6IF9hZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpLFxuICAgICAgICAgICAgb3BzOiBvcHJlY2VpdmUoX2lkZW50KSxcbiAgICAgICAgICAgIG12YXJcbiAgICAgICAgfSkpKTtcblxuLyoqXG4gKiBQYXJlbnRUXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXJlbnRUIGV4dGVuZHMgVGVtcGxhdGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBpZDogdHlwZShTdHJpbmcpIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogQWN0b3JQXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3RvclAgZXh0ZW5kcyBBY3RvcklPIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcblxuICAgICAgICAgICAgaWQ6IHR5cGUoU3RyaW5nKSxcbiAgICAgICAgICAgIHByb2Nlc3M6IHR5cGUoT2JqZWN0KSxcbiAgICAgICAgICAgIHBhdGg6IG9yKHR5cGUoU3RyaW5nKSwgZm9yY2UoYHByb2Nlc3MtJHt2NCgpfWApKSxcbiAgICAgICAgICAgIG9wczogb3IodHlwZShGcmVlKSwgZm9yY2UobnVsbCkpLFxuICAgICAgICAgICAgbXZhcjogdHlwZShNVmFyKVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogY3JlYXRlQWN0b3JQIGZyb20gYSB0ZW1wbGF0ZVxuICogQHN1bW1hcnkgY3JlYXRlQWN0b3JQIDo6IChzdHJpbmcsIFBhcmVudFQpIOKGkiAgSU88QWN0b3JQPlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlQWN0b3JQID0gKHBhcmVudCwgdGVtcGxhdGUpID0+XG4gICAgbWFrZU1WYXIoKVxuICAgIC5jaGFpbihtdmFyID0+IElPLm9mKCgpID0+IHtcblxuICAgICAgICBwcm9jZXNzLm9uKCdtZXNzYWdlJywgKHsgbWVzc2FnZSwgdG8gfSkgPT4gbXZhci5wdXQodGVsbCh0bywgbWVzc2FnZSkpKTtcblxuICAgICAgICByZXR1cm4gbmV3IEFjdG9yUCh7XG5cbiAgICAgICAgICAgIGlkOiB0ZW1wbGF0ZS5pZCxcbiAgICAgICAgICAgIHBhdGg6IF9hZGRyZXNzKHBhcmVudCwgdGVtcGxhdGUuaWQpLFxuICAgICAgICAgICAgcHJvY2VzcyxcbiAgICAgICAgICAgIG12YXIsXG4gICAgICAgICAgICBvcHM6IG9wcmVjZWl2ZShfaWRlbnQpLFxuICAgICAgICAgICAgdGVtcGxhdGVcblxuICAgICAgICB9KTtcblxuICAgIH0pKTtcblxuLyoqXG4gKiBDaGlsZFRcbiAqL1xuZXhwb3J0IGNsYXNzIENoaWxkVCBleHRlbmRzIFRlbXBsYXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHsgaWQ6IGZvcmNlKGBjaGlsZC0ke3Y0KCl9YCkgfSlcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEFjdG9yQ1BcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdG9yQ1AgZXh0ZW5kcyBBY3RvcklPIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBwYXRoOiB0eXBlKFN0cmluZyksXG4gICAgICAgICAgICBvcHM6IG9yKHR5cGUoRnJlZSksIGZvcmNlKG51bGwpKSxcbiAgICAgICAgICAgIG12YXI6IHR5cGUoTVZhciksXG4gICAgICAgICAgICBoYW5kbGU6IHR5cGUoT2JqZWN0KVxuICAgICAgICB9KTtcblxuICAgIH1cbn1cblxuLyoqXG4gKiBjcmVhdGVBY3RvckNQIGZyb20gYSB0ZW1wbGF0ZVxuICogQHN1bW1hcnkgY3JlYXRlQWN0b3JDUCA6OiAoc3RyaW5nLENoaWxkVCkg4oaSICBJTzxBY3RvckNQXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVBY3RvckNQID0gKHBhcmVudCwgdGVtcGxhdGUpID0+XG4gICAgbWFrZU1WYXIoKVxuICAgIC5jaGFpbihtdmFyID0+XG4gICAgICAgIF9mb3JrKHRlbXBsYXRlLnN0YXJ0KVxuICAgICAgICAuY2hhaW4oaGFuZGxlID0+IHtcblxuICAgICAgICAgICAgaGFuZGxlLm9uKCdtZXNzYWdlJywgKHsgdG8sIG1lc3NhZ2UgfSkgPT4gbXZhci5wdXQodGVsbCh0bywgbWVzc2FnZSkpKVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IEFjdG9yQ1Aoe1xuICAgICAgICAgICAgICAgIGlkOiB0ZW1wbGF0ZS5pZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBfYWRkcmVzcyhwYXJlbnQsIHRlbXBsYXRlLmlkKSxcbiAgICAgICAgICAgICAgICBoYW5kbGUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgb3BzOiBvcHJlY2VpdmUoX2lkZW50KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSkpO1xuXG5cbi8qKlxuICogQWN0b3JTVFAgaXMgYSBzdG9wcGVkIEFjdG9yIHJlYWR5IGZvciByZW1vdmFsLlxuICovXG5leHBvcnQgY2xhc3MgQWN0b3JTVFAgZXh0ZW5kcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCB7IHBhdGg6IHR5cGUoU3RyaW5nKSB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY29uc3QgZnJvbVRlbXBsYXRlID0gKHBhcmVudCwgdGVtcGxhdGUpID0+IG1hdGNoKHRlbXBsYXRlKVxuICAgIC5jYXNlT2YoTG9jYWxULCBwYXJ0aWFsKGNyZWF0ZUFjdG9yTCwgcGFyZW50KSlcbiAgICAuY2FzZU9mKEZ1dHVyZVQsIHBhcnRpYWwoY3JlYXRlQWN0b3JGVCwgcGFyZW50KSlcbiAgICAuY2FzZU9mKFN0cmVhbVQsIHBhcnRpYWwoY3JlYXRlQWN0b3JTVCwgcGFyZW50KSlcbiAgICAuY2FzZU9mKFBhcmVudFQsIHBhcnRpYWwoY3JlYXRlQWN0b3JQLCBwYXJlbnQpKVxuICAgIC5jYXNlT2YoQ2hpbGRULCBwYXJ0aWFsKGNyZWF0ZUFjdG9yQ1AsIHBhcmVudCkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHJlcGxhY2UgYW4gYWN0b3Igd2l0aCBhIG5ldyB2ZXJzaW9uLlxuICogUmV0dXJucyB0aGUgcGFyZW50IGFjdG9yIChzZWNvbmQgYXJnKSB1cGRhdGVkIHdpdGggdGhlIG5ldyBhY3Rvci5cbiAqIElmIHRoZSBwYXJlbnQgcGF0aCBpcyB0aGUgc2FtZSBwYXRoIGFzIHRoZSBhY3RvciB0byByZXBsYWNlLCBpdCBpc1xuICogcmVwbGFjZWQgaW5zdGVhZC5cbiAqIE5vIGNoYW5nZSBpcyBtYWRlIGlmIHRoZSBhY3RvciBpcyBub3QgZm91bmQuXG4gKiBAc3VtbWFyeSAoQWN0b3IsIEFjdG9yKSDihpIgIEFjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gKGEsIHApID0+XG4gICAgcC5wYXRoID09PSBhLnBhdGggP1xuICAgIGEgOiBwLm1hcChjID0+IGMucGF0aCA9PT0gYS5wYXRoID8gYSA6IGMubWFwKHBhcnRpYWwocmVwbGFjZSwgYSkpKTtcblxuLyoqXG4gKiBtYXAgb3ZlciBhbiBBY3RvciB0cmVhdGluZyBpdCBsaWtlIGEgRnVuY3RvclxuICogQHN1bW1hcnkgeyhBY3RvcixGdW5jdGlvbikg4oaSICBBY3Rvcn1cbiAqL1xuZXhwb3J0IGNvbnN0IG1hcCA9IChhLCBmKSA9PiBtYXRjaChhKVxuICAgIC5jYXNlT2YoQWN0b3JGVCwgYSA9PiBhKVxuICAgIC5jYXNlT2YoQWN0b3IsIGEgPT4gYS5jb3B5KHsgYWN0b3JzOiBhLmFjdG9ycy5tYXAoZikgfSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIGdldCBhIGNoaWxkIGFjdG9yIGZyb20gaXRzIHBhcmVudCB1c2luZyBpdHMgaWRcbiAqIEBzdW1tYXJ5IChzdHJpbmcsQWN0b3IpIOKGkiAgQWN0b3J8bnVsbFxuICovXG5leHBvcnQgY29uc3QgZ2V0ID0gKGlkLCBhKSA9PiBhLmZvbGQoKHAsIGMpID0+IHAgPyBwIDogYy5pZCA9PT0gaWQgPyBjIDogbnVsbCk7XG5cbi8qKlxuICogcHV0IGFuIGFjdG9yIGludG8gYW5vdGhlciBtYWtpbmcgaXQgYSBjaGlsZFxuICogUmV0dXJucyB0aGUgcGFyZW50IChjaGlsZCxwYXJlbnQpIOKGkiAgcGFyZW50XG4gKiBAc3VtbWFyeSAoQWN0b3IsIEFjdG9yKSDihpIgIEFjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBwdXQgPSAoYSwgcCkgPT4gcC5jb3B5KHsgYWN0b3JzOiBwLmFjdG9ycy5jb25jYXQoYSkgfSk7XG5cbi8qKlxuICogZm9sZCBhIGRhdGEgc3RydWN0dXJlIGludG8gYW4gYWN1bXVsYXRlZCBzaW1wbGVyIG9uZVxuICogQHN1bW1hcnkgZm9sZCA6OiAoQWN0b3IsICrihpIgKiwgKikg4oaSICAqXG4gKi9cbmV4cG9ydCBjb25zdCBmb2xkID0gKG8sIGYsIGFjY3VtKSA9PiBtYXRjaChvKVxuICAgIC5jYXNlT2YoQWN0b3JJTywgKCkgPT4gYWNjdW0pXG4gICAgLmNhc2VPZihBY3RvciwgYSA9PiBhLmFjdG9ycy5yZWR1Y2UoZiwgYWNjdW0pKVxuICAgIC5lbmQoKVxuXG4vKipcbiAqIGFjY2VwdCBhbGxvd3MgYW4gQWN0b3IgdG8gYWNjZXB0IHRoZSBsYXRlc3QgbWVzc2FnZSBhZGRyZXNzZWQgdG8gaXQuXG4gKiBAcGFyYW0geyp9IG1cbiAqIEBzdW1tYXJ5IHsqLEFjdG9yKSDihpIgIEFjdG9yfElPPEFjdG9yPnxEcm9wfVxuICovXG5leHBvcnQgY29uc3QgYWNjZXB0ID0gKG0sIGEpID0+IG1hdGNoKGEpXG4gICAgLmNhc2VPZihBY3RvckwsIGEgPT4gYS5jb3B5KHsgbWFpbGJveDogYS5tYWlsYm94LmNvbmNhdChtKSB9KSlcbiAgICAuY2FzZU9mKEFjdG9yUCwgYSA9PiBJTy5vZigoKSA9PiB7IGEucHJvY2Vzcy5zZW5kKG0pOyByZXR1cm4gYTsgfSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHNlbGVjdCBhbiBhY3RvciBpbiB0aGUgc3lzdGVtIHVzaW5nIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAqIEBzdW1tYXJ5IChzdHJpbmcsIEFjdG9yKSDihpIgIEFjdG9yfG51bGxcbiAqL1xuZXhwb3J0IGNvbnN0IHNlbGVjdCA9IChwLCBhKSA9PiBmb2xkKGEsIChoaXQsIGNoaWxkKSA9PlxuICAgIChoaXQgP1xuICAgICAgICBoaXQgOlxuICAgICAgICBwID09PSBjaGlsZC5wYXRoID9cbiAgICAgICAgY2hpbGQgOlxuICAgICAgICBwLnN0YXJ0c1dpdGgoY2hpbGQucGF0aCkgP1xuICAgICAgICBzZWxlY3QocCwgY2hpbGQpIDogbnVsbCksIG51bGwpO1xuXG5leHBvcnQgY29uc3QgbmV4dFRpY2sgPSBmID0+XG4gICAgSU8ub2YoKCkgPT4gc2V0VGltZW91dChmLCAxMDApKTtcblxuLyoqXG4gKiB0aWNrXG4gKiBAc3VtbWFyeSB0aWNrIDo6IChBY3RvciwgSU88QWN0b3I+KSDihpIgIElPPEFjdG9yPlxuICovXG5leHBvcnQgY29uc3QgdGljayA9IChpbywgYSkgPT5cbiAgICBleGVjKGEuY29weSh7IG9wczogbnVsbCB9KSwgYS5mb2xkKHRpY2ssIGlvKSwgYS5vcHMpO1xuXG4vKipcbiAqIHN0YXJ0IHRoZSBzeXN0ZW0uXG4gKiBOb3RlOiBzdGFydCBkb2VzIG5vdCBhY3R1YWxsIHN0YXJ0IHRoZSBzeXN0ZW0gYnV0IHJldHVybnMgYW4gSU8gY2xhc3MuXG4gKiBAc3VtbWFyeSBzdGFydCA6OiBTeXN0ZW0g4oaSICBJTzxudWxsPlxuICovXG5leHBvcnQgY29uc3Qgc3RhcnQgPSBzID0+IG1hdGNoKHMpXG4gICAgLmNhc2VPZihTeXN0ZW0sIHMgPT4gdGljayhJTy5vZihzKSwgcykuY2hhaW4ocyA9PiBuZXh0VGljaygoKSA9PiBzdGFydChzKS5ydW4oKSkpKVxuICAgIC5lbmQoKTtcblxuY29uc3QgX2RlZmF1bHRMb2dnZXIgPSBvcCA9PiBJTy5vZigoKSA9PiBjb25zb2xlLmxvZyhvcCkpO1xuXG5jb25zdCBfYWRkcmVzcyA9IChwYXJlbnQsIGlkKSA9PiAoKHBhcmVudCA9PT0gJycpIHx8IChwYXJlbnQgPT09ICcvJykpID8gaWQgOiBgJHtwYXJlbnR9LyR7aWR9YDtcblxuY29uc3QgX2ZvcmsgPSBwYXRoID0+IElPLm9mKCgpID0+IGZvcmsoYCR7X19kaXJuYW1lfS9wcm9jZXNzLmpzYCwgeyBlbnY6IHsgQUNUT1JfU1RBUlQ6IHBhdGggfSB9KSk7XG5cbmNvbnN0IF9pZGVudCA9IHggPT4geDtcbiJdfQ==