var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'net_version';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,

        // PARAMETERS
        params: []

    }, function(result, status) {

        assert.equal(status, 200);
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^(\d+)\.(\d+)\.(\d+)$/, 'is version');

        done();
    });
};

describe(method, function(){
    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a network protocol version', function(done){
                asyncTest(host, done);
            });
        });
    });
});
