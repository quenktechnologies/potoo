'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _Actor = require('potoo-lib/Actor');

var _System = require('potoo-lib/System');

var _lens = require('potoo-lib/lens');

var lens = _interopRequireWildcard(_lens);

var _Op = require('potoo-lib/Op');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sys = new _System.System();
var actor = {
    parent: ''
};

var r = (0, _System.exec)((0, _Op.noop)(), actor, sys);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvc3Bhd25UaHJlZUFjdG9ycy5qcyJdLCJuYW1lcyI6WyJsZW5zIiwic3lzIiwiYWN0b3IiLCJwYXJlbnQiLCJyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlBLEk7O0FBQ1o7Ozs7OztBQUtBLElBQUlDLE1BQU0sb0JBQVY7QUFDQSxJQUFJQyxRQUFRO0FBQ1JDLFlBQVE7QUFEQSxDQUFaOztBQUlBLElBQUlDLElBQUksa0JBQUssZUFBTCxFQUFhRixLQUFiLEVBQW9CRCxHQUFwQixDQUFSIiwiZmlsZSI6InNwYXduVGhyZWVBY3RvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVzdCBmcm9tICdtdXN0JztcbmltcG9ydCB7IExvY2FsVCwgQWN0b3JMLCBBY3RvciB9IGZyb20gJ3BvdG9vLWxpYi9BY3Rvcic7XG5pbXBvcnQgeyBTeXN0ZW0sIGV4ZWMsIGFjdG9yQ2hlY2tlZExlbnMgfSBmcm9tICdwb3Rvby1saWIvU3lzdGVtJztcbmltcG9ydCAqIGFzIGxlbnMgZnJvbSAncG90b28tbGliL2xlbnMnO1xuaW1wb3J0IHsgbm9vcCwgc3Bhd24gfSBmcm9tICdwb3Rvby1saWIvT3AnO1xuXG5cblxuXG5sZXQgc3lzID0gbmV3IFN5c3RlbSgpO1xubGV0IGFjdG9yID0ge1xuICAgIHBhcmVudDogJydcbn07XG5cbmxldCByID0gZXhlYyhub29wKCksIGFjdG9yLCBzeXMpXG4iXX0=
