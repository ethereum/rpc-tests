var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_accounts';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isArray(result.result, 'is array');
        // we should have at least one account here (coinbase)
        assert.isTrue(Helpers.isAddress(result.result[0]));
    
        done();
    });
};


describe(method, function(){
    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return an array with accounts', function(done){
                asyncTest(host, done);
            });
        });
    });
});

