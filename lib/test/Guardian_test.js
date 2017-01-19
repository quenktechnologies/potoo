'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _Guardian = require('potoo-lib/Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

var _System = require('potoo-lib/System');

var _System2 = _interopRequireDefault(_System);

var _ChildContext = require('potoo-lib/ChildContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var guardian, system;

describe('Guardian', function () {

    beforeEach(function () {

        system = _sinon2.default.createStubInstance(_System2.default);
        guardian = new _Guardian2.default(system);
    });

    describe('spawn', function () {

        it('should create a new actor reference', function () {

            (0, _must2.default)(guardian.spawn({ start: function start() {} })).be.instanceOf(_ChildContext.LocalReference);
        });
    });

    describe('select().tell()', function () {

        it('must drop messages', function () {

            guardian.select('/naps').tell('a message');
            (0, _must2.default)(system.publish.called).be(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvR3VhcmRpYW5fdGVzdC5qcyJdLCJuYW1lcyI6WyJndWFyZGlhbiIsInN5c3RlbSIsImRlc2NyaWJlIiwiYmVmb3JlRWFjaCIsImNyZWF0ZVN0dWJJbnN0YW5jZSIsIml0Iiwic3Bhd24iLCJzdGFydCIsImJlIiwiaW5zdGFuY2VPZiIsInNlbGVjdCIsInRlbGwiLCJwdWJsaXNoIiwiY2FsbGVkIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxRQUFKLEVBQWNDLE1BQWQ7O0FBRUFDLFNBQVMsVUFBVCxFQUFxQixZQUFXOztBQUc1QkMsZUFBVyxZQUFXOztBQUVsQkYsaUJBQVMsZ0JBQU1HLGtCQUFOLGtCQUFUO0FBQ0FKLG1CQUFXLHVCQUFhQyxNQUFiLENBQVg7QUFFSCxLQUxEOztBQU9BQyxhQUFTLE9BQVQsRUFBa0IsWUFBVzs7QUFFekJHLFdBQUcscUNBQUgsRUFBMEMsWUFBVzs7QUFFakQsZ0NBQUtMLFNBQVNNLEtBQVQsQ0FBZSxFQUFFQyxPQUFPLGlCQUFNLENBQUUsQ0FBakIsRUFBZixDQUFMLEVBQTBDQyxFQUExQyxDQUE2Q0MsVUFBN0M7QUFFSCxTQUpEO0FBTUgsS0FSRDs7QUFVQVAsYUFBUyxpQkFBVCxFQUE0QixZQUFXOztBQUVuQ0csV0FBRyxvQkFBSCxFQUF5QixZQUFXOztBQUVoQ0wscUJBQVNVLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUJDLElBQXpCLENBQThCLFdBQTlCO0FBQ0EsZ0NBQUtWLE9BQU9XLE9BQVAsQ0FBZUMsTUFBcEIsRUFBNEJMLEVBQTVCLENBQStCLElBQS9CO0FBRUgsU0FMRDtBQU9ILEtBVEQ7QUFXSCxDQS9CRCIsImZpbGUiOiJHdWFyZGlhbl90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG11c3QgZnJvbSAnbXVzdCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuaW1wb3J0IEd1YXJkaWFuIGZyb20gJ3BvdG9vLWxpYi9HdWFyZGlhbic7XG5pbXBvcnQgU3lzdGVtIGZyb20gJ3BvdG9vLWxpYi9TeXN0ZW0nO1xuaW1wb3J0IHsgTG9jYWxSZWZlcmVuY2UgfSBmcm9tICdwb3Rvby1saWIvQ2hpbGRDb250ZXh0JztcblxudmFyIGd1YXJkaWFuLCBzeXN0ZW07XG5cbmRlc2NyaWJlKCdHdWFyZGlhbicsIGZ1bmN0aW9uKCkge1xuXG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHN5c3RlbSA9IHNpbm9uLmNyZWF0ZVN0dWJJbnN0YW5jZShTeXN0ZW0pO1xuICAgICAgICBndWFyZGlhbiA9IG5ldyBHdWFyZGlhbihzeXN0ZW0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc3Bhd24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBhY3RvciByZWZlcmVuY2UnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbXVzdChndWFyZGlhbi5zcGF3bih7IHN0YXJ0OiAoKSA9PiB7fSB9KSkuYmUuaW5zdGFuY2VPZihMb2NhbFJlZmVyZW5jZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZWxlY3QoKS50ZWxsKCknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnbXVzdCBkcm9wIG1lc3NhZ2VzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGd1YXJkaWFuLnNlbGVjdCgnL25hcHMnKS50ZWxsKCdhIG1lc3NhZ2UnKTtcbiAgICAgICAgICAgIG11c3Qoc3lzdGVtLnB1Ymxpc2guY2FsbGVkKS5iZSh0cnVlKTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiJdfQ==