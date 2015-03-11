var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'web3_sha3';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: ["0x74657374"] // "test"

    }, function(result, status) {
        
        assert.equal(status, 200);
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.equal(result.result, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658');

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
    for (var key in config.hosts) {
        describe(key.toUpperCase(), function(){
            it('should return a generated hash', function(done){
                asyncTest(config.hosts[key], done);
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done);
            });
        });
    }
});
