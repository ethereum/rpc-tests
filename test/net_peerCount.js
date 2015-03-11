var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

var method = 'net_peerCount';

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++,
        jsonrpc: "2.0",
        method: method,
        params: []

    }, function(result, status) {
        
        assert.equal(status, 200);
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isNumber(+result.result);

        done();
    });
};

describe(method, function(){
    for (var key in config.hosts) {
        describe(key.toUpperCase(), function(){
            it('should return a return a number', function(done){
                asyncTest(config.hosts[key], done);
            });
        });
    }
});
