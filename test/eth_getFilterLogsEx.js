var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getFilterLogsEx',
    uninstallFilter = function(host, id) {
        Helpers.send(host, {id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_uninstallFilter', params: [id] });
    };

// TEST
var syncTest = function(host, filterId, logsInfo){

    var result = Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [filterId]

    });
        
    assert.property(result, 'result', (result.error) ? result.error.message : 'error');
    assert.equal(result.result.length, logsInfo.length, 'logs should be '+ logsInfo.length);

    _.each(result.result, function(log, index){
        Helpers.logExTest(log, logsInfo[index]);
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
    Helpers.eachHost(function(key, host){

        // OPTIONS FILTER
        describe(key, function(){

            _.each(config.logs, function(log){
                it('should return the correct log, when filtering without defining an address', function(){
                    // INSTALL a options filter first
                    var optionsFilterId = Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilterEx',
                        
                        // PARAMETERS
                        params: [{
                            "fromBlock": '0x' + log.block.blockHeader.hash,
                            "toBlock": '0x' + log.block.blockHeader.hash
                        }]

                    });

                    syncTest(host, optionsFilterId.result, [log]);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });

                it('should return the correct log, when filtering with address', function(){
                    // INSTALL a options filter first
                    var optionsFilterId = Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilterEx',
                        
                        // PARAMETERS
                        params: [{
                            "address": '0x'+ log.tx.to,
                            "fromBlock": '0x' + log.block.blockHeader.hash,
                            "toBlock": '0x' + log.block.blockHeader.hash
                        }]

                    });

                    syncTest(host, optionsFilterId.result, [log]);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });
            });


            it('should return the reverted logs', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilterEx',
                    
                    // PARAMETERS
                    params: [config.specialLogQuery]

                });

                syncTest(host, optionsFilterId.result, config.specialLogResult);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

        });
    });
});
