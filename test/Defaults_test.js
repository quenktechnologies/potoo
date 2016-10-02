import must from 'must';
import Defaults from '../src/Defaults';
import Testing from '../src/testing/Testing';
import SimpleDispatcher from '../src/dispatch/SimpleDispatcher';
import SimpleMailbox from '../src/dispatch/SimpleMailbox';
import OneForOneStrategy from '../src/OneForOneStrategy';
import LocalReference from '../src/LocalReference';

var factory;

describe('Defaults', function() {

    beforeEach(function() {
        factory = new Defaults((context) => new Testing.Concern());
    });

    describe('Defaults#dispatcher', function() {

        it('should provide a SimpleDispatcher', function() {

            must(factory.dispatcher(new Testing.ConcernFactory(), new Testing.ChildContext())).be.instanceOf(SimpleDispatcher);

        });

    });

    describe('Defaults#mailbox', function() {

        it('should provide a SimpleMailbox', function() {

            must(factory.mailbox(new Testing.Dispatcher())).be.instanceOf(SimpleMailbox);

        });

    });

    describe('Defaults#errorHandlingStrategy', function() {

        it('should provide a OneForOneStrategy', function() {

            must(factory.errorHandlingStrategy()).be.instanceOf(OneForOneStrategy);

        });


    });

    describe('Defaults#reference', function() {

        it('should provide a LocalReference', function() {

            must(factory.reference(new Testing.ChildContext())).be.instanceOf(LocalReference);

        });

    });

});
