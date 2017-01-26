import must from 'must';
import sinon from 'sinon';
import Promise from 'bluebird';
import { Context, Reference } from 'potoo-lib';
import { SequentialDispatcher, Mailbox, Envelope } from 'potoo-lib/dispatch';
import { Event, ReceiveEvent } from 'potoo-lib/dispatch/events';

var dispatcher, context, message, parent, root;

describe('SequentialDispatcher', function() {

    beforeEach(function() {

        message = 'hello';
        context = sinon.createStubInstance(Context);
        root = sinon.createStubInstance(Reference);

        parent = sinon.createStubInstance(Reference);
        parent.tell = p => { throw p.error; };

        context.root.returns(root);
        context.parent.returns(parent);

    });

    beforeEach(function() {

        dispatcher = new SequentialDispatcher(root);

    });

    it('should resolve ask\'d promises with the value of the receive function', function() {

        setTimeout(() => dispatcher.tell(new Envelope({ message })), 200);

        return dispatcher.ask({ receive: m => m, context }).
        then(result => must(result).be(message));

    });

    it('should dispatch sequentially', function() {

        var buffer = [];
        var receive = (m) => x => buffer.push(m);

        setTimeout(() => dispatcher.tell(new Envelope({ message })), 100);
        setTimeout(() => dispatcher.tell(new Envelope({ message })), 200);
        setTimeout(() => dispatcher.tell(new Envelope({ message })), 300);

        return Promise.all([
            dispatcher.ask({ receive: receive('one'), context }),
            dispatcher.ask({ receive: receive('two'), context }),
            dispatcher.ask({ receive: receive('three'), context })
        ]).
        then(() => new Promise(r => setTimeout(r, 600))).then(() => {

            must(buffer.join(',')).be('one,two,three');

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

        dispatcher.tell(new Envelope({ message }));

        var blocks = [];

        var receive = m => {

            blocks.push(m);

            if (blocks.length < 10) {
                dispatcher.tell(new Envelope({ message }));
                return dispatcher.ask({ receive, context });
            }

            return 'done';

        };

        return dispatcher.ask({ receive, context, time: 5000 }).
        then(m => must(blocks.length > 9).be(true));

    });

    it('should not remove a behaviour if it returns null or undefiend', function() {

        var count = 0;
        var success = false;
        var receive = m => {

            count++;

            if (count === 10)
                return success = true;

        };
        var make = i => setTimeout(() => dispatcher.tell(new Envelope({ message })), 5 * (1 + i));

        for (var i = 0; i < 10; i++)
            make(i);

        return dispatcher.ask({ receive, context }).
        then(() => must(success).be(true));

    });

    it('should generate events', function() {

        var receive = m => (m === message) ? true : null;
        var ok = false;
        var events = [];

        root.tell = e => {

            if (e instanceof Event)
                events.push(e.constructor.name);

        }

        dispatcher.tell(new Envelope({ message: new Date() }));
        dispatcher.tell(new Envelope({ message }));

        return dispatcher.ask({ receive, context }).
        then(() => must(events).eql([
            'MessageEvent',
            'MessageEvent',
            'ReceiveEvent',
            'MessageUnhandledEvent',
            'MessageHandledEvent',
        ]));

    });

});
