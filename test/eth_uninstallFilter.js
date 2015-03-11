var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_uninstallFilter';

// TEST
var asyncTest = function(host, done, filterId){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [filterId]

    }, function(result, status) {
        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isTrue(result.result);

        done();

    });
};

var asyncErrorTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: param ? [param] : []

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};



describe(method, function(){
    for (var key in config.hosts) {

        // BLOCK FILTER
        describe(key.toUpperCase(), function(){
            // INSTALL a block filter first
            var blockFilterId = Helpers.send(config.hosts.cpp, {
                id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newBlockFilter',
                
                // PARAMETERS
                params: ['latest']

            });

            it('should return a boolean when uninstalling a block filter', function(done){
                asyncTest(config.hosts[key], done, blockFilterId.result);
            });
        });
        // OPTIONS FILTER
        describe(key.toUpperCase(), function(){
            // INSTALL a options filter first
            var optionsFilterId = Helpers.send(config.hosts.cpp, {
                id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                
                // PARAMETERS
                params: [{
                    "fromBlock": "0x1", // 1
                    "toBlock": "0x2", // 2
                    "address": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc",
                    "topics": ['0x01e0aa27e54970936aa910a71', '0x6aa910a7186fdf']
                }]

            });

            it('should return a boolean when uninstalling a options filter', function(done){
                asyncTest(config.hosts[key], done, optionsFilterId.result);
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done);
            });
        });
    }
});
