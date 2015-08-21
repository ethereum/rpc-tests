var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getFilterLogs',
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
                it('should return the correct log, when filtering without defining an address', function(){
                    // INSTALL a options filter first
                    var optionsFilterId = Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                        
                        // PARAMETERS
                        params: [{
                            "fromBlock": Helpers.fromDecimal(log.block.blockHeader.number),
                            "toBlock": Helpers.fromDecimal(log.block.blockHeader.number)
                        }]

                    });

                    syncTest(host, optionsFilterId.result, [log]);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });

                it('should return the correct log, when filtering with address', function(){
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

                    syncTest(host, optionsFilterId.result, [log]);

                    // remove filter
                    uninstallFilter(host, optionsFilterId.result);
                });
            });

            it('should return a list of logs, when asking without defining an address and using toBlock "latest"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest'
                    }]

                });

                syncTest(host, optionsFilterId.result, config.logs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of logs, when asking without defining an address and using toBlock "pending"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'pending'
                    }]

                });
                syncTest(host, optionsFilterId.result, config.logs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of logs, when filtering with defining an address and using toBlock "latest"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        'address': "0x"+ config.logs[0].tx.to
                    }]

                });
                syncTest(host, optionsFilterId.result, config.logs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of logs, when filtering with defining an address and using toBlock "pending"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'pending',
                        'address': "0x"+ config.logs[0].tx.to
                    }]

                });
                syncTest(host, optionsFilterId.result, config.logs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of logs, when filtering by topic "0x0000000000000000000000000000000000000000000000000000000000000001"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": ['0x0000000000000000000000000000000000000000000000000000000000000001']
                    }]

                });

                // get only the logs which have true as the first index arg
                var newLogs = _.filter(config.logs, function(log){
                    return (log.anonymous && log.indexArgs[0] === true);
                });

                syncTest(host, optionsFilterId.result, newLogs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of anonymous logs, when filtering by topic "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": [null, null, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff']
                    }]

                });

                // get only the logs which have true as the first index arg
                var newLogs = _.filter(config.logs, function(log){
                    return (log.anonymous && log.indexArgs[2] === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
                });

                syncTest(host, optionsFilterId.result, newLogs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });

            it('should return a list of logs, when filtering by topic "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": [null, null, null, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff']
                    }]

                });

                // get only the logs which have true as the first index arg
                var newLogs = _.filter(config.logs, function(log){
                    return (!log.anonymous && log.indexArgs[2] === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
                });

                syncTest(host, optionsFilterId.result, newLogs);

                // remove filter
                uninstallFilter(host, optionsFilterId.result);
            });


            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
