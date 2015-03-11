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
        assert.isTrue(Helpers.isAddress(result.result[0]));

        done();
    });
};

describe(method, function(){
    for (var key in config.hosts) {
        describe(key.toUpperCase(), function(){
            it('should return an array with accounts', function(done){
                asyncTest(config.hosts[key], done);
            });
        });
    }
});
