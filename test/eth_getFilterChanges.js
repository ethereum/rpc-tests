var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

return;

// METHOD
var method = 'eth_getFilterChanges',
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

    // console.log(filterId, result.result);
        
    assert.property(result, 'result', (result.error) ? result.error.message : 'error');
    assert.equal(result.result.length, logsInfo.length, 'logs should be '+ logsInfo.length);

    _.each(result.result, function(log, index){
        Helpers.logTest(log, logsInfo[index]);
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
                it('should return the correct log once after a transaction was send and when filtering without defining an address', function(){
                    // INSTALL a options filter first
                    var optionsFilterId = Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                        
                        // PARAMETERS
                        params: [{
                            "fromBlock": Helpers.fromDecimal(log.block.blockHeader.number),
                            "toBlock": Helpers.fromDecimal(log.block.blockHeader.number)
                        }]

                    });

                    syncTest(host, optionsFilterId.result, []);

                    // send transaction
                    Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_sendTransaction',
                        
                        // PARAMETERS
                        params: [{
                            "from": config.senderAddress,
                            "to": config.contractAddress,
                            "data": log.call,
                            "gas" : "0x4cb2f",
                            "gasPrice" : "0x1",
                        }]

                    });

                    // MINE!

                    syncTest(host, optionsFilterId.result, [log]);

                    syncTest(host, optionsFilterId.result, []);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });

                it('should return the correct log once after a transaction was send and when filtering with address', function(){
                    // INSTALL a options filter first
                    var optionsFilterId = Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                        
                        // PARAMETERS
                        params: [{
                            "address": '0x'+ log.tx.to,
                            "fromBlock": Helpers.fromDecimal(log.block.blockHeader.number),
                            "toBlock": Helpers.fromDecimal(log.block.blockHeader.number)
                        }]

                    });

                    syncTest(host, optionsFilterId.result, []);

                    // send transaction
                    Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_sendTransaction',
                        
                        // PARAMETERS
                        params: [{
                            "from": config.senderAddress,
                            "to": config.contractAddress,
                            "data": log.call,
                            "gas" : "0x4cb2f",
                            "gasPrice" : "0x1",
                        }]

                    });

                    // MINE!

                    syncTest(host, optionsFilterId.result, [log]);

                    syncTest(host, optionsFilterId.result, []);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });
            });


            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
