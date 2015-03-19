var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_getUncleCountByBlockHash';

// GET test BLOCK 4
var block4 = Helpers.getBlockByNumber(4);
var block5 = Helpers.getBlockByNumber(5);
var block6 = Helpers.getBlockByNumber(6);

// TEST
var asyncTest = function(host, done, params, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'is hex');
        assert.isNumber(+result.result, 'can be converted to a number');

        assert.equal(+result.result, expectedResult, 'should be '+ expectedResult);

        done();
    });
};


var asyncErrorTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};



describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return 2 as a hexstring', function(done){
                asyncTest(host, done, ['0x'+ block4.blockHeader.hash], 2);
            });

            it('should return 1 as a hexstring', function(done){
                asyncTest(host, done, ['0x'+ block6.blockHeader.hash], 1);
            });

            it('should return 0 as a hexstring', function(done){
                asyncTest(host, done, ['0x'+ block5.blockHeader.hash], 0);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
