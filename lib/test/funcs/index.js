'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _funcs = require('potoo-lib/funcs');

var funcs = _interopRequireWildcard(_funcs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func;

describe('funcs', function () {

    beforeEach(function () {

        func = null;
    });

    describe('Or', function () {

        it('should execute the right if the left fails', function () {

            func = new funcs.Or(function (v) {
                return false;
            }, function (v) {
                return true;
            });
            (0, _must2.default)(func.call(null, false)).be(true);
            (0, _must2.default)(funcs.or(function (v) {
                return false;
            }, function (v) {
                return true;
            })(false)).be(true);
        });

        it('should not execute the right if the left succeeds', function () {

            func = new funcs.Or(function (v) {
                return v;
            }, function (v) {
                return false;
            });
            (0, _must2.default)(func.call(null, true)).be(true);
            (0, _must2.default)(funcs.or(function (v) {
                return v;
            }, function (v) {
                return false;
            })(true)).be(true);
        });
    });

    describe('InstanceOf', function () {

        it('should not execute if the instanceof check fails', function () {

            func = new funcs.InstanceOf(Date, function (d) {
                return 22;
            });
            (0, _must2.default)(func.call(null, 'today')).be(null);
            (0, _must2.default)(funcs.insof(Date, function (d) {
                return 22;
            })('today')).be(null);
        });

        it('should execute if the instanceof check succeeds', function () {

            func = new funcs.InstanceOf(Date, function (d) {
                return 22;
            });
            (0, _must2.default)(func.call(null, new Date())).be(22);
            (0, _must2.default)(funcs.insof(Date, function (d) {
                return 22;
            })(new Date())).be(22);
        });
    });

    describe('Required', function () {

        it('should not execute if the spec fails', function () {

            var check = { name: true, age: false };
            var value = { name: 'Halesh', age: 44 };
            var f = function f(d) {
                return 'success';
            };

            func = new funcs.Required(check, f);
            (0, _must2.default)(func.call(null, value)).be(null);
            (0, _must2.default)(funcs.required(check, f)(value)).be(null);
        });

        it('should execute if the check succeeds', function () {

            var check = { name: true, age: false, gender: true };
            var value = { name: 'Halesh', age: 44 };
            var f = function f(d) {
                return 'success';
            };

            func = new funcs.Required(check, f);
            (0, _must2.default)(func.call(null, value)).be(null);
            (0, _must2.default)(funcs.required(check, f)(value)).be(null);
        });
    });

    describe('ok', function () {

        it('should work', function () {

            (0, _must2.default)(funcs.ok(false, function (x) {
                return x;
            })(22)).be(null);
            (0, _must2.default)(funcs.ok(true, function (x) {
                return x;
            })(22)).be(22);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvZnVuY3MvaW5kZXguanMiXSwibmFtZXMiOlsiZnVuY3MiLCJmdW5jIiwiZGVzY3JpYmUiLCJiZWZvcmVFYWNoIiwiaXQiLCJPciIsImNhbGwiLCJiZSIsIm9yIiwidiIsIkluc3RhbmNlT2YiLCJEYXRlIiwiaW5zb2YiLCJjaGVjayIsIm5hbWUiLCJhZ2UiLCJ2YWx1ZSIsImYiLCJSZXF1aXJlZCIsInJlcXVpcmVkIiwiZ2VuZGVyIiwib2siLCJ4Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUVaLElBQUlDLElBQUo7O0FBRUFDLFNBQVMsT0FBVCxFQUFrQixZQUFXOztBQUV6QkMsZUFBVyxZQUFXOztBQUVsQkYsZUFBTyxJQUFQO0FBRUgsS0FKRDs7QUFNQUMsYUFBUyxJQUFULEVBQWUsWUFBVzs7QUFFdEJFLFdBQUcsNENBQUgsRUFBaUQsWUFBVzs7QUFFeERILG1CQUFPLElBQUlELE1BQU1LLEVBQVYsQ0FBYTtBQUFBLHVCQUFLLEtBQUw7QUFBQSxhQUFiLEVBQXlCO0FBQUEsdUJBQUssSUFBTDtBQUFBLGFBQXpCLENBQVA7QUFDQSxnQ0FBS0osS0FBS0ssSUFBTCxDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBTCxFQUE2QkMsRUFBN0IsQ0FBZ0MsSUFBaEM7QUFDQSxnQ0FBS1AsTUFBTVEsRUFBTixDQUFTO0FBQUEsdUJBQUssS0FBTDtBQUFBLGFBQVQsRUFBcUI7QUFBQSx1QkFBSyxJQUFMO0FBQUEsYUFBckIsRUFBZ0MsS0FBaEMsQ0FBTCxFQUE2Q0QsRUFBN0MsQ0FBZ0QsSUFBaEQ7QUFFSCxTQU5EOztBQVFBSCxXQUFHLG1EQUFILEVBQXdELFlBQVc7O0FBRS9ESCxtQkFBTyxJQUFJRCxNQUFNSyxFQUFWLENBQWE7QUFBQSx1QkFBS0ksQ0FBTDtBQUFBLGFBQWIsRUFBcUI7QUFBQSx1QkFBSyxLQUFMO0FBQUEsYUFBckIsQ0FBUDtBQUNBLGdDQUFLUixLQUFLSyxJQUFMLENBQVUsSUFB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OztBQTRCQUwsYUFBUyxJQUFULEVBQWUsWUFBVzs7QUFFdEJFLFdBQUcsYUFBSCxFQUFrQixZQUFXOztBQUV6QixnQ0FBS0osTUFBTXFCLEVBQU4sQ0FBUyxLQUFULEVBQWdCO0FBQUEsdUJBQUtDLENBQUw7QUFBQSxhQUFoQixFQUF3QixFQUF4QixDQUFMLEVBQWtDZixFQUFsQyxDQUFxQyxJQUFyQztBQUNBLGdDQUFLUCxNQUFNcUIsRUFBTixDQUFTLElBQVQsRUFBZTtBQUFBLHVCQUFLQyxDQUFMO0FBQUEsYUFBZixFQUF1QixFQUF2QixDQUFMLEVBQWlDZixFQUFqQyxDQUFvQyxFQUFwQztBQUVILFNBTEQ7QUFPSCxLQVREO0FBWUgsQ0F6RkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVzdCBmcm9tICdtdXN0JztcbmltcG9ydCAqIGFzIGZ1bmNzIGZyb20gJ3BvdG9vLWxpYi9mdW5jcyc7XG5cbnZhciBmdW5jO1xuXG5kZXNjcmliZSgnZnVuY3MnLCBmdW5jdGlvbigpIHtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgZnVuYyA9IG51bGw7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdPcicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdzaG91bGQgZXhlY3V0ZSB0aGUgcmlnaHQgaWYgdGhlIGxlZnQgZmFpbHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgZnVuYyA9IG5ldyBmdW5jcy5Pcih2ID0+IGZhbHNlLCB2ID0+IHRydWUpO1xuICAgICAgICAgICAgbXVzdChmdW5jLmNhbGwobnVsbCwgZmFsc2UpKS5iZSh0cnVlKTtcbiAgICAgICAgICAgIG11c3QoZnVuY3Mub3IodiA9PiBmYWxzZSwgdiA9PiB0cnVlKShmYWxzZSkpLmJlKHRydWUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGV4ZWN1dGUgdGhlIHJpZ2h0IGlmIHRoZSBsZWZ0IHN1Y2NlZWRzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGZ1bmMgPSBuZXcgZnVuY3MuT3IodiA9PiB2LCB2ID0+IGZhbHNlKTtcbiAgICAgICAgICAgIG11c3QoZnVuYy5jYWxsKG51bGwsIHRydWUpKS5iZSh0cnVlKTtcbiAgICAgICAgICAgIG11c3QoZnVuY3Mub3IodiA9PiB2LCB2ID0+IGZhbHNlKSh0cnVlKSkuYmUodHJ1ZSk7XG5cbiAgICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0luc3RhbmNlT2YnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBleGVjdXRlIGlmIHRoZSBpbnN0YW5jZW9mIGNoZWNrIGZhaWxzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGZ1bmMgPSBuZXcgZnVuY3MuSW5zdGFuY2VPZihEYXRlLCBkID0+IDIyKTtcbiAgICAgICAgICAgIG11c3QoZnVuYy5jYWxsKG51bGwsICd0b2RheScpKS5iZShudWxsKTtcbiAgICAgICAgICAgIG11c3QoZnVuY3MuaW5zb2YoRGF0ZSwgZCA9PiAyMikoJ3RvZGF5JykpLmJlKG51bGwpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZXhlY3V0ZSBpZiB0aGUgaW5zdGFuY2VvZiBjaGVjayBzdWNjZWVkcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBmdW5jID0gbmV3IGZ1bmNzLkluc3RhbmNlT2YoRGF0ZSwgZCA9PiAyMik7XG4gICAgICAgICAgICBtdXN0KGZ1bmMuY2FsbChudWxsLCBuZXcgRGF0ZSgpKSkuYmUoMjIpO1xuICAgICAgICAgICAgbXVzdChmdW5jcy5pbnNvZihEYXRlLCBkID0+IDIyKShuZXcgRGF0ZSgpKSkuYmUoMjIpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUmVxdWlyZWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBleGVjdXRlIGlmIHRoZSBzcGVjIGZhaWxzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjaGVjayA9IHsgbmFtZTogdHJ1ZSwgYWdlOiBmYWxzZSB9O1xuICAgICAgICAgICAgdmFyIHZhbHVlID0geyBuYW1lOiAnSGFsZXNoJywgYWdlOiA0NCB9O1xuICAgICAgICAgICAgdmFyIGYgPSBkID0+ICdzdWNjZXNzJztcblxuICAgICAgICAgICAgZnVuYyA9IG5ldyBmdW5jcy5SZXF1aXJlZChjaGVjaywgZik7XG4gICAgICAgICAgICBtdXN0KGZ1bmMuY2FsbChudWxsLCB2YWx1ZSkpLmJlKG51bGwpO1xuICAgICAgICAgICAgbXVzdChmdW5jcy5yZXF1aXJlZChjaGVjaywgZikodmFsdWUpKS5iZShudWxsKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGV4ZWN1dGUgaWYgdGhlIGNoZWNrIHN1Y2NlZWRzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjaGVjayA9IHsgbmFtZTogdHJ1ZSwgYWdlOiBmYWxzZSAsIGdlbmRlcjp0cnVlfTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHsgbmFtZTogJ0hhbGVzaCcsIGFnZTogNDQgfTtcbiAgICAgICAgICAgIHZhciBmID0gZCA9PiAnc3VjY2Vzcyc7XG5cbiAgICAgICAgICAgIGZ1bmMgPSBuZXcgZnVuY3MuUmVxdWlyZWQoY2hlY2ssIGYpO1xuICAgICAgICAgICAgbXVzdChmdW5jLmNhbGwobnVsbCwgdmFsdWUpKS5iZShudWxsKTtcbiAgICAgICAgICAgIG11c3QoZnVuY3MucmVxdWlyZWQoY2hlY2ssIGYpKHZhbHVlKSkuYmUobnVsbCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdzaG91bGQgd29yaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBtdXN0KGZ1bmNzLm9rKGZhbHNlLCB4ID0+IHgpKDIyKSkuYmUobnVsbCk7XG4gICAgICAgICAgICBtdXN0KGZ1bmNzLm9rKHRydWUsIHggPT4geCkoMjIpKS5iZSgyMik7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuXG59KTtcbiJdfQ==