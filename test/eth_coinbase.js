var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_coinbase';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {
        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isTrue(Helpers.isAddress(result.result));

        config.coinbase = result.result;

        done();

    });
};


describe(method, function(){
    Helpers.each(function(key, host){
        describe(key, function(){
            it('should return a coinbase address', function(done){
                asyncTest(host, done);
            });
        });
    });
});
