import must from 'must';
import sinon from 'sinon';
import Promise from 'bluebird';
import { Context, Reference } from 'potoo-lib';
import { SequentialDispatcher, Mailbox } from 'potoo-lib/dispatch';

var dispatcher, context, message, parent;

describe('SequentialDispatcher', function() {

    beforeEach(function() {

        message = 'hello';
        context = sinon.createStubInstance(Context);
        root = sinon.createStubInstance(Reference);

        parent = sinon.createStubInstance(Reference);
        parent.tell = p => { throw p.error; };

        context.root.returns(root);


    });

    beforeEach(function() {

        dispatcher = new SequentialDispatcher(parent);

    });

    it('should resolve ask\'d promises with the value of the receive function', function() {

        setTimeout(() => dispatcher.tell(message), 200);

        return dispatcher.ask({ receive: m => m, context }).
        then(result => must(result).be(message));

    });

    it('should dispatch sequentially', function() {

        var one = sinon.spy();
        var two = sinon.spy();
        var three = sinon.spy();

        setTimeout(() => dispatcher.tell(message), 100);
        setTimeout(() => dispatcher.tell(message), 200);
        setTimeout(() => dispatcher.tell(message), 300);
        setTimeout(() => dispatcher.tell(message), 100);
        setTimeout(() => dispatcher.tell(message), 200);
        setTimeout(() => dispatcher.tell(message), 300);

        return Promise.all([
            dispatcher.ask({ receive: one, context }),
            dispatcher.ask({ receive: two, context }),
            dispatcher.ask({ receive: three, context })
        ]).
        then(() => new Promise(r => setTimeout(r, 600))).
        then(() => {

            must(one.callCount).be(1);
            must(two.callCount).be(1);
            must(three.callCount).be(1);
            must(one.calledBefore(two)).be(true);
            must(two.calledBefore(three)).be(true);

        });

    });

    it('should obey timeout for dispatches', function() {

        var threw = false;

        return dispatcher.ask({ receive: m => m, context, time: 3000 }).
        catch(e => {
            must(e).be.instanceOf(Error);
            threw = true;
        }).
        finally(() => must(threw).be(true));

    });

    it('should not deadlock if the receive promise is returned', function() {

        dispatcher.tell(message);

        var blocks = [];

        var receive = m => {

            blocks.push(m);

            if (blocks.length < 10) {
                dispatcher.tell(message);
                return dispatcher.ask({ receive, context });
            }

            return 'done';

        };

        return dispatcher.ask({ receive, context, time: 5000 }).
        then(m =>  must(blocks.length > 9).be(true) );

    });

});
