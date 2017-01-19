'use strict';

var _must = require('must');

var _must2 = _interopRequireDefault(_must);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _potooLib = require('potoo-lib');

var _ChildContext = require('potoo-lib/ChildContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context, root, parent, strategy, child, dispatch;
var throwit = function throwit(e) {
    throw e;
};
var _start = function _start() {};

describe('ChildContext', function () {

    beforeEach(function () {

        root = _sinon2.default.createStubInstance(_potooLib.Reference);
        parent = _sinon2.default.createStubInstance(_potooLib.Context);
        parent.error = throwit;
        parent.select = function () {
            throw 'meta human';
        };
        child = _sinon2.default.createStubInstance(_potooLib.Context);
        dispatch = _sinon2.default.createStubInstance(_potooLib.Reference);

        context = new _ChildContext.ChildContext('/', parent, root, { strategy: throwit, dispatch: dispatch, start: _start });
    });

    describe('path', function () {

        it('must default to /main', function () {

            (0, _must2.default)(context.path()).be('/');
        });
    });

    describe('spawn', function () {

        it('must produce an actor reference', function () {

            (0, _must2.default)(context.spawn({ start: _start })).be.instanceOf(_ChildContext.LocalReference);
        });
    });

    describe('select', function () {

        it('must select existing References', function () {

            var one, two, three;

            one = context.spawn({

                start: function start() {

                    two = this.spawn({
                        start: function start() {

                            three = this.spawn({ start: _start }, 'three');
                        }
                    }, 'two');
                }
            }, 'one');

            (0, _must2.default)(context.select('/one')).eql(one);
            (0, _must2.default)(context.select('/one/two')).eql(two);
            (0, _must2.default)(context.select('/one/two/three')).eql(three);
        });
    });

    xdescribe('ChildContext#isChild', function () {

        it('must work', function () {

            var one = context.concernOf(new Testing.ConcernFactory(), 'one');
            var two = context.concernOf(new Testing.ConcernFactory(), 'two');
            var three = context.concernOf(new Testing.ConcernFactory(), 'three');

            (0, _must2.default)(context.isChild(one)).be(true);
            (0, _must2.default)(context.isChild(two)).be(true);
            (0, _must2.default)(context.isChild(three)).be(true);
        });

        it('must not go crazy if child is this context', function () {

            (0, _must2.default)(context.isChild(context)).be(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvQ2hpbGRDb250ZXh0X3Rlc3QuanMiXSwibmFtZXMiOlsiY29udGV4dCIsInJvb3QiLCJwYXJlbnQiLCJzdHJhdGVneSIsImNoaWxkIiwiZGlzcGF0Y2giLCJ0aHJvd2l0IiwiZSIsInN0YXJ0IiwiZGVzY3JpYmUiLCJiZWZvcmVFYWNoIiwiY3JlYXRlU3R1Ykluc3RhbmNlIiwiZXJyb3IiLCJzZWxlY3QiLCJpdCIsInBhdGgiLCJiZSIsInNwYXduIiwiaW5zdGFuY2VPZiIsIm9uZSIsInR3byIsInRocmVlIiwiZXFsIiwieGRlc2NyaWJlIiwiY29uY2Vybk9mIiwiVGVzdGluZyIsIkNvbmNlcm5GYWN0b3J5IiwiaXNDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxPQUFKLEVBQWFDLElBQWIsRUFBbUJDLE1BQW5CLEVBQTJCQyxRQUEzQixFQUFxQ0MsS0FBckMsRUFBNENDLFFBQTVDO0FBQ0EsSUFBSUMsVUFBVSxTQUFWQSxPQUFVLElBQUs7QUFBRSxVQUFNQyxDQUFOO0FBQVUsQ0FBL0I7QUFDQSxJQUFJQyxTQUFRLFNBQVJBLE1BQVEsR0FBTSxDQUFFLENBQXBCOztBQUVBQyxTQUFTLGNBQVQsRUFBeUIsWUFBVzs7QUFFaENDLGVBQVcsWUFBVzs7QUFFbEJULGVBQU8sZ0JBQU1VLGtCQUFOLHFCQUFQO0FBQ0FULGlCQUFTLGdCQUFNUyxrQkFBTixtQkFBVDtBQUNBVCxlQUFPVSxLQUFQLEdBQWVOLE9BQWY7QUFDQUosZUFBT1csTUFBUCxHQUFnQixZQUFNO0FBQUUsa0JBQU0sWUFBTjtBQUFxQixTQUE3QztBQUNBVCxnQkFBUSxnQkFBTU8sa0JBQU4sbUJBQVI7QUFDQU4sbUJBQVcsZ0JBQU1NLGtCQUFOLHFCQUFYOztBQUVBWCxrQkFBVSwrQkFBaUIsR0FBakIsRUFBc0JFLE1BQXRCLEVBQThCRCxJQUE5QixFQUFvQyxFQUFFRSxVQUFVRyxPQUFaLEVBQXFCRCxrQkFBckIsRUFBK0JHLGFBQS9CLEVBQXBDLENBQVY7QUFFSCxLQVhEOztBQWFBQyxhQUFTLE1BQVQsRUFBaUIsWUFBVzs7QUFFeEJLLFdBQUcsdUJBQUgsRUFBNEIsWUFBVzs7QUFFbkMsZ0NBQUtkLFFBQVFlLElBQVIsRUFBTCxFQUFxQkMsRUFBckIsQ0FBd0IsR0FBeEI7QUFFSCxTQUpEO0FBTUgsS0FSRDs7QUFVQVAsYUFBUyxPQUFULEVBQWtCLFlBQVc7O0FBRXpCSyxXQUFHLGlDQUFILEVBQXNDLFlBQVc7O0FBRTdDLGdDQUFLZCxRQUFRaUIsS0FBUixDQUFjLEVBQUVULGFBQUYsRUFBZCxDQUFMLEVBQStCUSxFQUEvQixDQUFrQ0UsVUFBbEM7QUFFSCxTQUpEO0FBTUgsS0FSRDs7QUFVQVQsYUFBUyxRQUFULEVBQW1CLFlBQVc7O0FBRTFCSyxXQUFHLGlDQUFILEVBQXNDLFlBQVc7O0FBRTdDLGdCQUFJSyxHQUFKLEVBQVNDLEdBQVQsRUFBY0MsS0FBZDs7QUFFQUYsa0JBQU1uQixRQUFRaUIsS0FBUixDQUFjOztBQUVoQlQsdUJBQU8saUJBQVc7O0FBRWRZLDBCQUFNLEtBQUtILEtBQUwsQ0FBVztBQUNiVCwrQkFBTyxpQkFBVzs7QUFFZGEsb0NBQVEsS0FBS0osS0FBTCxDQUFXLEVBQUVULGFBQUYsRUFBWCxFQUFzQixPQUF0QixDQUFSO0FBRUg7QUFMWSxxQkFBWCxFQU1ILEtBTkcsQ0FBTjtBQVFIO0FBWmUsYUFBZCxFQWFILEtBYkcsQ0FBTjs7QUFlQSxnQ0FBS1IsUUFBUWEsTUFBUixDQUFlLE1BQWYsQ0FBTCxFQUE2QlMsR0FBN0IsQ0FBaUNILEdBQWpDO0FBQ0EsZ0NBQUtuQixRQUFRYSxNQUFSLENBQWUsVUFBZixDQUFMLEVBQWlDUyxHQUFqQyxDQUFxQ0YsR0FBckM7QUFDQSxnQ0FBS3BCLFFBQVFhLE1BQVIsQ0FBZSxnQkFBZixDQUFMLEVBQXVDUyxHQUF2QyxDQUEyQ0QsS0FBM0M7QUFFSCxTQXZCRDtBQXlCSCxLQTNCRDs7QUE2QkFFLGNBQVUsc0JBQVYsRUFBa0MsWUFBVzs7QUFFekNULFdBQUcsV0FBSCxFQUFnQixZQUFXOztBQUV2QixnQkFBSUssTUFBTW5CLFFBQVF3QixTQUFSLENBQWtCLElBQUlDLFFBQVFDLGNBQVosRUFBbEIsRUFBZ0QsS0FBaEQsQ0FBVjtBQUNBLGdCQUFJTixNQUFNcEIsUUFBUXdCLFNBQVIsQ0FBa0IsSUFBSUMsUUFBUUMsY0FBWixFQUFsQixFQUFnRCxLQUFoRCxDQUFWO0FBQ0EsZ0JBQUlMLFFBQVFyQixRQUFRd0IsU0FBUixDQUFrQixJQUFJQyxRQUFRQyxjQUFaLEVBQWxCLEVBQWdELE9BQWhELENBQVo7O0FBRUEsZ0NBQUsxQixRQUFRMkIsT0FBUixDQUFnQlIsR0FBaEIsQ0FBTCxFQUEyQkgsRUFBM0IsQ0FBOEIsSUFBOUI7QUFDQSxnQ0FBS2hCLFFBQVEyQixPQUFSLENBQWdCUCxHQUFoQixDQUFMLEVBQTJCSixFQUEzQixDQUE4QixJQUE5QjtBQUNBLGdDQUFLaEIsUUFBUTJCLE9BQVIsQ0FBZ0JOLEtBQWhCLENBQUwsRUFBNkJMLEVBQTdCLENBQWdDLElBQWhDO0FBRUgsU0FWRDs7QUFZQUYsV0FBRyw0Q0FBSCxFQUFpRCxZQUFXOztBQUV4RCxnQ0FBS2QsUUFBUTJCLE9BQVIsQ0FBZ0IzQixPQUFoQixDQUFMLEVBQStCZ0IsRUFBL0IsQ0FBa0MsS0FBbEM7QUFFSCxTQUpEO0FBT0gsS0FyQkQ7QUF1QkgsQ0F2RkQiLCJmaWxlIjoiQ2hpbGRDb250ZXh0X3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVzdCBmcm9tICdtdXN0JztcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBDb250ZXh0LCBSZWZlcmVuY2UgfSBmcm9tICdwb3Rvby1saWInO1xuaW1wb3J0IHsgQ2hpbGRDb250ZXh0LCBMb2NhbFJlZmVyZW5jZSB9IGZyb20gJ3BvdG9vLWxpYi9DaGlsZENvbnRleHQnO1xuXG52YXIgY29udGV4dCwgcm9vdCwgcGFyZW50LCBzdHJhdGVneSwgY2hpbGQsIGRpc3BhdGNoO1xudmFyIHRocm93aXQgPSBlID0+IHsgdGhyb3cgZTsgfTtcbnZhciBzdGFydCA9ICgpID0+IHt9O1xuXG5kZXNjcmliZSgnQ2hpbGRDb250ZXh0JywgZnVuY3Rpb24oKSB7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJvb3QgPSBzaW5vbi5jcmVhdGVTdHViSW5zdGFuY2UoUmVmZXJlbmNlKTtcbiAgICAgICAgcGFyZW50ID0gc2lub24uY3JlYXRlU3R1Ykluc3RhbmNlKENvbnRleHQpO1xuICAgICAgICBwYXJlbnQuZXJyb3IgPSB0aHJvd2l0O1xuICAgICAgICBwYXJlbnQuc2VsZWN0ID0gKCkgPT4geyB0aHJvdyAnbWV0YSBodW1hbic7IH07XG4gICAgICAgIGNoaWxkID0gc2lub24uY3JlYXRlU3R1Ykluc3RhbmNlKENvbnRleHQpO1xuICAgICAgICBkaXNwYXRjaCA9IHNpbm9uLmNyZWF0ZVN0dWJJbnN0YW5jZShSZWZlcmVuY2UpO1xuXG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ2hpbGRDb250ZXh0KCcvJywgcGFyZW50LCByb290LCB7IHN0cmF0ZWd5OiB0aHJvd2l0LCBkaXNwYXRjaCwgc3RhcnQgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdwYXRoJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaXQoJ211c3QgZGVmYXVsdCB0byAvbWFpbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBtdXN0KGNvbnRleHQucGF0aCgpKS5iZSgnLycpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc3Bhd24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnbXVzdCBwcm9kdWNlIGFuIGFjdG9yIHJlZmVyZW5jZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBtdXN0KGNvbnRleHQuc3Bhd24oeyBzdGFydCB9KSkuYmUuaW5zdGFuY2VPZihMb2NhbFJlZmVyZW5jZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZWxlY3QnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnbXVzdCBzZWxlY3QgZXhpc3RpbmcgUmVmZXJlbmNlcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgb25lLCB0d28sIHRocmVlO1xuXG4gICAgICAgICAgICBvbmUgPSBjb250ZXh0LnNwYXduKHtcblxuICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB0d28gPSB0aGlzLnNwYXduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocmVlID0gdGhpcy5zcGF3bih7IHN0YXJ0IH0sICd0aHJlZScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgJ3R3bycpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAnb25lJyk7XG5cbiAgICAgICAgICAgIG11c3QoY29udGV4dC5zZWxlY3QoJy9vbmUnKSkuZXFsKG9uZSk7XG4gICAgICAgICAgICBtdXN0KGNvbnRleHQuc2VsZWN0KCcvb25lL3R3bycpKS5lcWwodHdvKTtcbiAgICAgICAgICAgIG11c3QoY29udGV4dC5zZWxlY3QoJy9vbmUvdHdvL3RocmVlJykpLmVxbCh0aHJlZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHhkZXNjcmliZSgnQ2hpbGRDb250ZXh0I2lzQ2hpbGQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnbXVzdCB3b3JrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBvbmUgPSBjb250ZXh0LmNvbmNlcm5PZihuZXcgVGVzdGluZy5Db25jZXJuRmFjdG9yeSgpLCAnb25lJyk7XG4gICAgICAgICAgICB2YXIgdHdvID0gY29udGV4dC5jb25jZXJuT2YobmV3IFRlc3RpbmcuQ29uY2VybkZhY3RvcnkoKSwgJ3R3bycpO1xuICAgICAgICAgICAgdmFyIHRocmVlID0gY29udGV4dC5jb25jZXJuT2YobmV3IFRlc3RpbmcuQ29uY2VybkZhY3RvcnkoKSwgJ3RocmVlJyk7XG5cbiAgICAgICAgICAgIG11c3QoY29udGV4dC5pc0NoaWxkKG9uZSkpLmJlKHRydWUpO1xuICAgICAgICAgICAgbXVzdChjb250ZXh0LmlzQ2hpbGQodHdvKSkuYmUodHJ1ZSk7XG4gICAgICAgICAgICBtdXN0KGNvbnRleHQuaXNDaGlsZCh0aHJlZSkpLmJlKHRydWUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdtdXN0IG5vdCBnbyBjcmF6eSBpZiBjaGlsZCBpcyB0aGlzIGNvbnRleHQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbXVzdChjb250ZXh0LmlzQ2hpbGQoY29udGV4dCkpLmJlKGZhbHNlKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgfSk7XG5cbn0pO1xuIl19