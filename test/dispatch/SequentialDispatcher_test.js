import must from 'must';
import sinon from 'sinon';
import Promise from 'bluebird';
import { Context, Reference } from 'potoo-lib';
import { SequentialDispatcher, Mailbox } from 'potoo-lib/dispatch';

var dispatcher, context, inbox, message, parent;

describe('SequentialDispatcher', function() {

    beforeEach(function() {

        message = 'hello';
        context = sinon.createStubInstance(Context);
        inbox = sinon.createStubInstance(Mailbox);
        root = sinon.createStubInstance(Reference);

        parent = sinon.createStubInstance(Reference);
        parent.tell = p => { throw p.error; };

        context.inbox.returns(inbox);
        context.root.returns(root);

        inbox.dequeue.returns(message);

    });

    beforeEach(function() {

        dispatcher = new SequentialDispatcher(parent);

    });

    it('should resolve scheduled promises with the value of the receive function', function() {

        return dispatcher.schedule(m => m, context).
        then(result => must(result).be(message));

    });

    it('should dispatch sequentially', function() {

        var one = sinon.spy();
        var two = sinon.spy();
        var three = sinon.spy();

        return dispatcher.schedule(one, context).
        then(() => dispatcher.dispatch()).
        then(() => dispatcher.dispatch()).
        then(() => dispatcher.schedule(two, context)).
        then(() => dispatcher.dispatch()).
        then(() => dispatcher.dispatch()).
        then(() => dispatcher.schedule(three, context)).
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

        inbox.dequeue = () => Promise.resolve(null);

        return dispatcher.schedule(m => m, context, 5000).
        catch(e => {
            must(e).be.instanceOf(Error);
            threw = true;
        }).
        finally(() => must(threw).be(true));

    });


});
