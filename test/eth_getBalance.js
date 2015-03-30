var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getBalance';

// TODO check fo balance
// TODO TEST for specific states (blocks) and pending?

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

        assert.equal(+result.result, expectedResult, 'should have balance '+ expectedResult);

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

            _.each(config.testBlocks.postState, function(state, key){
                it('should return the correct balance at defaultBlock "latest" at address 0x'+key, function(done){
                    asyncTest(host, done, ['0x'+ key, 'latest'], state.balance);
                });
            });

            _.each(config.testBlocks.pre, function(state, key){
                it('should return the correct balance at defaultBlock 0 at address 0x'+key, function(done){
                    asyncTest(host, done, ['0x'+ key, '0x0'], state.balance);
                });
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
