var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++,
        jsonrpc: "2.0",
        method: "net_listening",
        params: []

    }, function(result, status) {
        
        assert.equal(status, 200);
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.deepEqual(result.result, true);

        done();

    });
};


describe('net_listening', function(){
    for (var key in config.hosts) {
        describe(key.toUpperCase(), function(){
            it('should return a boolean', function(done){
                asyncTest(config.hosts[key], done);
            });
        });
    }
});
