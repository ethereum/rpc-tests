var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// TEST
var asyncTest = function(host, done){
    Helpers.send(host, [{
        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_accounts',
        
        // PARAMETERS
        params: []

    },
    {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBalance',
        
        // PARAMETERS
        params: ['0xbcde5374fce5edbc8e2a8697c15331677e6ebf0b','latest']

    },
    {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'net_listening',
        
        // PARAMETERS
        params: []

    },
    {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_gasPrice',
        
        // PARAMETERS
        params: []

    }], function(result, status) {
        assert.equal(status, 200, 'has status code');
        assert.isArray(result, 'is array');
        assert.property(result[0], 'result', (result.error) ? result.error.message : 'error');

        // eth_accounts
        assert.isArray(result[0].result, 'is array');

        // eth_getBalance
        var balance = config.testBlocks.postState['bcde5374fce5edbc8e2a8697c15331677e6ebf0b'].balance;
        assert.isNumber(+result[1].result, 'is a number');
        assert.equal(+result[1].result, balance, 'is the same as '+ balance);

        // net_listening
        assert.isBoolean(result[2].result, 'is boolean');

        // eth_gasPrice
        assert.isNumber(+result[3].result, 'is a number');
        assert.isAbove(+result[3].result, 0, 'is a number');

        done();
    });
};


describe('RPC Batch call', function(){
    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return an array with the results of each of the method calls', function(done){
                asyncTest(host, done);
            });
        });
    });
});

