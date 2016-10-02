import must from 'must';
import Address from '../src/Address';

const URL = 'http://node.example.com/nodes/active';
var addr;

describe('Address', function() {

    beforeEach(function() {
        addr = Address.fromString(URL);
    });


    describe('Address#is', function() {

        it('should tell us when a path is equal to it', function() {

            must(addr.is(URL)).be.true();
            must(addr.is('/nodes/active')).be.false();

        });

    });

    describe('Address#isBelow', function() {

        it('should tell us when the Address is below a path', function() {

            must(addr.isBelow('http://node.example.com/nodes')).be.true();
            must(addr.is('/main/http://node.example.com/nodes')).be.false();

        });

    });

    describe('Address#isAbove', function() {

        it('should tell us when the Address is above a path', function() {

            must(addr.isAbove('http://node.example.com/nodes/active/child')).be.true();
            must(addr.is('/main/http://node.example.com/nodes/active/child')).be.false();

        });

    });



});
