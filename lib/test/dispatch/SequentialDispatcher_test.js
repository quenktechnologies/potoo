'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _potooLib = require('potoo-lib');

var _dispatch = require('potoo-lib/dispatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatcher, context, message, parent;

describe('SequentialDispatcher', function () {

    beforeEach(function () {

        message = 'hello';
        context = _sinon2.default.createStubInstance(_potooLib.Context);
        root = _sinon2.default.createStubInstance(_potooLib.Reference);

        parent = _sinon2.default.createStubInstance(_potooLib.Reference);
        parent.tell = function (p) {
            throw p.error;
        };

        context.root.returns(root);
        context.parent.returns(parent);
    });

    beforeEach(function () {

        dispatcher = new _dispatch.SequentialDispatcher();
    });

    it('should resolve ask\'d promises with the value of the receive function', function () {

        setTimeout(function () {
            return dispatcher.tell(message);
        }, 200);

        return dispatcher.ask({ receive: function receive(m) {
                return m;
            }, context: context }).then(function (result) {
            return (0, _must2.default)(result).be(message);
        });
    });

    it('should dispatch sequentially', function () {

        var buffer = [];
        var receive = function receive(m) {
            return function (x) {
                return buffer.push(m);
            };
        };

        setTimeout(function () {
            return dispatcher.tell(message);
        }, 100);
        setTimeout(function () {
            return dispatcher.tell(message);
        }, 200);
        setTimeout(function () {
            return dispatcher.tell(message);
        }, 300);

        return _bluebird2.default.all([dispatcher.ask({ receive: receive('one'), context: context }), dispatcher.ask({ receive: receive('two'), context: context }), dispatcher.ask({ receive: receive('three'), context: context })]).then(function () {
            return new _bluebird2.default(function (r) {
                return setTimeout(r, 600);
            });
        }).then(function () {

            (0, _must2.default)(buffer.join(',')).be('one,two,three');
        });
    });

    it('should obey timeout for dispatches', function () {

        var threw = false;

        return dispatcher.ask({ receive: function receive(m) {
                return m;
            }, context: context, time: 3000 }).catch(function (e) {
            (0, _must2.default)(e).be.instanceOf(Error);
            threw = true;
        }).finally(function () {
            return (0, _must2.default)(threw).be(true);
        });
    });

    it('should not deadlock if the receive promise is returned', function () {

        dispatcher.tell(message);

        var blocks = [];

        var receive = function receive(m) {

            blocks.push(m);

            if (blocks.length < 10) {
                dispatcher.tell(message);
                return dispatcher.ask({ receive: receive, context: context });
            }

            return 'done';
        };

        return dispatcher.ask({ receive: receive, context: context, time: 5000 }).then(function (m) {
            return (0, _must2.default)(blocks.length > 9).be(true);
        });
    });

    it('should not remove a behaviour if it returns null or undefiend', function () {

        var count = 0;
        var success = false;
        var receive = function receive(m) {

            count++;

            if (count === 10) return success = true;
        };
        var make = function make(i) {
            return setTimeout(function () {
                return dispatcher.tell(message);
            }, 5 * (1 + i));
        };

        for (var i = 0; i < 10; i++) {
            make(i);
        }return dispatcher.ask({ receive: receive, context: context }).then(function () {
            return (0, _must2.default)(success).be(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvZGlzcGF0Y2gvU2VxdWVudGlhbERpc3BhdGNoZXJfdGVzdC5qcyJdLCJuYW1lcyI6WyJkaXNwYXRjaGVyIiwiY29udGV4dCIsIm1lc3NhZ2UiLCJwYXJlbnQiLCJkZXNjcmliZSIsImJlZm9yZUVhY2giLCJjcmVhdGVTdHViSW5zdGFuY2UiLCJyb290IiwidGVsbCIsInAiLCJlcnJvciIsInJldHVybnMiLCJpdCIsInNldFRpbWVvdXQiLCJhc2siLCJyZWNlaXZlIiwibSIsInRoZW4iLCJyZXN1bHQiLCJiZSIsImJ1ZmZlciIsInB1c2giLCJhbGwiLCJyIiwiam9pbiIsInRocmV3IiwidGltZSIsImNhdGNoIiwiZSIsImluc3RhbmNlT2YiLCJFcnJvciIsImZpbmFsbHkiLCJibG9ja3MiLCJsZW5ndGgiLCJjb3VudCIsInN1Y2Nlc3MiLCJtYWtlIiwiaSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQUlBLFVBQUosRUFBZ0JDLE9BQWhCLEVBQXlCQyxPQUF6QixFQUFrQ0MsTUFBbEM7O0FBRUFDLFNBQVMsc0JBQVQsRUFBaUMsWUFBVzs7QUFFeENDLGVBQVcsWUFBVzs7QUFFbEJILGtCQUFVLE9BQVY7QUFDQUQsa0JBQVUsZ0JBQU1LLGtCQUFOLG1CQUFWO0FBQ0FDLGVBQU8sZ0JBQU1ELGtCQUFOLHFCQUFQOztBQUVBSCxpQkFBUyxnQkFBTUcsa0JBQU4scUJBQVQ7QUFDQUgsZUFBT0ssSUFBUCxHQUFjLGFBQUs7QUFBRSxrQkFBTUMsRUFBRUMsS0FBUjtBQUFnQixTQUFyQzs7QUFFQVQsZ0JBQVFNLElBQVIsQ0FBYUksT0FBYixDQUFxQkosSUFBckI7QUFDQU4sZ0JBQVFFLE1BQVIsQ0FBZVEsT0FBZixDQUF1QlIsTUFBdkI7QUFHSCxLQWJEOztBQWVBRSxlQUFXLFlBQVc7O0FBRWxCTCxxQkFBYSxvQ0FBYjtBQUVILEtBSkQ7O0FBTUFZLE9BQUcsdUVBQUgsRUFB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QUFYLENBQWUsRUFBRUMsZ0JBQUYsRUFBV2QsZ0JBQVgsRUFBb0J5QixNQUFNLElBQTFCLEVBQWYsRUFDUFQsSUFETyxDQUNGO0FBQUEsbUJBQUssb0JBQUtlLE9BQU9DLE1BQVAsR0FBZ0IsQ0FBckIsRUFBd0JkLEVBQXhCLENBQTJCLElBQTNCLENBQUw7QUFBQSxTQURFLENBQVA7QUFHSCxLQXRCRDs7QUF3QkFQLE9BQUcsK0RBQUgsRUFBb0UsWUFBVzs7QUFFM0UsWUFBSXNCLFFBQVEsQ0FBWjtBQUNBLFlBQUlDLFVBQVUsS0FBZDtBQUNBLFlBQUlwQixVQUFVLFNBQVZBLE9BQVUsSUFBSzs7QUFFZm1COztBQUVBLGdCQUFJQSxVQUFVLEVBQWQsRUFDSSxPQUFPQyxVQUFVLElBQWpCO0FBRVAsU0FQRDtBQVFBLFlBQUlDLE9BQU8sU0FBUEEsSUFBTztBQUFBLG1CQUFLdkIsV0FBVztBQUFBLHVCQUFNYixXQUFXUSxJQUFYLENBQWdCTixPQUFoQixDQUFOO0FBQUEsYUFBWCxFQUEyQyxLQUFLLElBQUltQyxDQUFULENBQTNDLENBQUw7QUFBQSxTQUFYOztBQUVBLGFBQUssSUFBSUEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEVBQXBCLEVBQXdCQSxHQUF4QjtBQUNJRCxpQkFBS0MsQ0FBTDtBQURKLFNBR0EsT0FBT3JDLFdBQVdjLEdBQVgsQ0FBZSxFQUFFQyxnQkFBRixFQUFXZCxnQkFBWCxFQUFmLEVBQ1BnQixJQURPLENBQ0Y7QUFBQSxtQkFBTSxvQkFBS2tCLE9BQUwsRUFBY2hCLEVBQWQsQ0FBaUIsSUFBakIsQ0FBTjtBQUFBLFNBREUsQ0FBUDtBQUdILEtBcEJEO0FBc0JILENBbEhEIiwiZmlsZSI6IlNlcXVlbnRpYWxEaXNwYXRjaGVyX3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVzdCBmcm9tICdtdXN0JztcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBDb250ZXh0LCBSZWZlcmVuY2UgfSBmcm9tICdwb3Rvby1saWInO1xuaW1wb3J0IHsgU2VxdWVudGlhbERpc3BhdGNoZXIsIE1haWxib3ggfSBmcm9tICdwb3Rvby1saWIvZGlzcGF0Y2gnO1xuXG52YXIgZGlzcGF0Y2hlciwgY29udGV4dCwgbWVzc2FnZSwgcGFyZW50O1xuXG5kZXNjcmliZSgnU2VxdWVudGlhbERpc3BhdGNoZXInLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbWVzc2FnZSA9ICdoZWxsbyc7XG4gICAgICAgIGNvbnRleHQgPSBzaW5vbi5jcmVhdGVTdHViSW5zdGFuY2UoQ29udGV4dCk7XG4gICAgICAgIHJvb3QgPSBzaW5vbi5jcmVhdGVTdHViSW5zdGFuY2UoUmVmZXJlbmNlKTtcblxuICAgICAgICBwYXJlbnQgPSBzaW5vbi5jcmVhdGVTdHViSW5zdGFuY2UoUmVmZXJlbmNlKTtcbiAgICAgICAgcGFyZW50LnRlbGwgPSBwID0+IHsgdGhyb3cgcC5lcnJvcjsgfTtcblxuICAgICAgICBjb250ZXh0LnJvb3QucmV0dXJucyhyb290KTtcbiAgICAgICAgY29udGV4dC5wYXJlbnQucmV0dXJucyhwYXJlbnQpO1xuXG5cbiAgICB9KTtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgZGlzcGF0Y2hlciA9IG5ldyBTZXF1ZW50aWFsRGlzcGF0Y2hlcigpO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlc29sdmUgYXNrXFwnZCBwcm9taXNlcyB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUgcmVjZWl2ZSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZGlzcGF0Y2hlci50ZWxsKG1lc3NhZ2UpLCAyMDApO1xuXG4gICAgICAgIHJldHVybiBkaXNwYXRjaGVyLmFzayh7IHJlY2VpdmU6IG0gPT4gbSwgY29udGV4dCB9KS5cbiAgICAgICAgdGhlbihyZXN1bHQgPT4gbXVzdChyZXN1bHQpLmJlKG1lc3NhZ2UpKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkaXNwYXRjaCBzZXF1ZW50aWFsbHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYnVmZmVyID0gW107XG4gICAgICAgIHZhciByZWNlaXZlID0gKG0pID0+IHggPT4gYnVmZmVyLnB1c2gobSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkaXNwYXRjaGVyLnRlbGwobWVzc2FnZSksIDEwMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZGlzcGF0Y2hlci50ZWxsKG1lc3NhZ2UpLCAyMDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRpc3BhdGNoZXIudGVsbChtZXNzYWdlKSwgMzAwKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5hc2soeyByZWNlaXZlOiByZWNlaXZlKCdvbmUnKSwgY29udGV4dCB9KSxcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuYXNrKHsgcmVjZWl2ZTogcmVjZWl2ZSgndHdvJyksIGNvbnRleHQgfSksXG4gICAgICAgICAgICBkaXNwYXRjaGVyLmFzayh7IHJlY2VpdmU6IHJlY2VpdmUoJ3RocmVlJyksIGNvbnRleHQgfSlcbiAgICAgICAgXSkuXG4gICAgICAgIHRoZW4oKCkgPT4gbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIDYwMCkpKS5cbiAgICAgICAgdGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIG11c3QoYnVmZmVyLmpvaW4oJywnKSkuYmUoJ29uZSx0d28sdGhyZWUnKTtcblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvYmV5IHRpbWVvdXQgZm9yIGRpc3BhdGNoZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhyZXcgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gZGlzcGF0Y2hlci5hc2soeyByZWNlaXZlOiBtID0+IG0sIGNvbnRleHQsIHRpbWU6IDMwMDAgfSkuXG4gICAgICAgIGNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgbXVzdChlKS5iZS5pbnN0YW5jZU9mKEVycm9yKTtcbiAgICAgICAgICAgIHRocmV3ID0gdHJ1ZTtcbiAgICAgICAgfSkuXG4gICAgICAgIGZpbmFsbHkoKCkgPT4gbXVzdCh0aHJldykuYmUodHJ1ZSkpO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBkZWFkbG9jayBpZiB0aGUgcmVjZWl2ZSBwcm9taXNlIGlzIHJldHVybmVkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgZGlzcGF0Y2hlci50ZWxsKG1lc3NhZ2UpO1xuXG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcblxuICAgICAgICB2YXIgcmVjZWl2ZSA9IG0gPT4ge1xuXG4gICAgICAgICAgICBibG9ja3MucHVzaChtKTtcblxuICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPCAxMCkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIudGVsbChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2hlci5hc2soeyByZWNlaXZlLCBjb250ZXh0IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJ2RvbmUnO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoZXIuYXNrKHsgcmVjZWl2ZSwgY29udGV4dCwgdGltZTogNTAwMCB9KS5cbiAgICAgICAgdGhlbihtID0+IG11c3QoYmxvY2tzLmxlbmd0aCA+IDkpLmJlKHRydWUpKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVtb3ZlIGEgYmVoYXZpb3VyIGlmIGl0IHJldHVybnMgbnVsbCBvciB1bmRlZmllbmQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICB2YXIgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICB2YXIgcmVjZWl2ZSA9IG0gPT4ge1xuXG4gICAgICAgICAgICBjb3VudCsrO1xuXG4gICAgICAgICAgICBpZiAoY291bnQgPT09IDEwKVxuICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzID0gdHJ1ZTtcblxuICAgICAgICB9O1xuICAgICAgICB2YXIgbWFrZSA9IGkgPT4gc2V0VGltZW91dCgoKSA9PiBkaXNwYXRjaGVyLnRlbGwobWVzc2FnZSksIDUgKiAoMSArIGkpKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspXG4gICAgICAgICAgICBtYWtlKGkpO1xuXG4gICAgICAgIHJldHVybiBkaXNwYXRjaGVyLmFzayh7IHJlY2VpdmUsIGNvbnRleHQgfSkuXG4gICAgICAgIHRoZW4oKCkgPT4gbXVzdChzdWNjZXNzKS5iZSh0cnVlKSk7XG5cbiAgICB9KTtcblxufSk7XG4iXX0=