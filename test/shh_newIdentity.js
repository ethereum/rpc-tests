var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'shh_newIdentity';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {
        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.match(result.result, /0x[\da-f]+/i, 'is identity');

        config.coinbase = result.result;

        done();

    });
};


describe(method, function(){
    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return an identity', function(done){
                asyncTest(host, done);
            });
        });
    });
});
