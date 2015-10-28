var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getFilterLogs',
    uninstallFilter = function(host, id) {
        Helpers.send(host, {id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_uninstallFilter', params: [id] }, function(){});
    };

// TEST
var asyncTest = function(host, filterId, logsInfo, done){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [filterId]

    }, function(result, status){

        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.equal(result.result.length, logsInfo.length, 'logs should be '+ logsInfo.length);

        _.each(result.result, function(log, index){
            Helpers.logTest(log, logsInfo[index]);
        });

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
    Helpers.eachHost(function(key, host){

        // OPTIONS FILTER
        describe(key, function(){

            _.each(config.logs, function(log){
                it('should return the correct log, when filtering without defining an address', function(done){
                    // INSTALL a options filter first
                    Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                        
                        // PARAMETERS
                        params: [{
                            "fromBlock": Helpers.fromDecimal(log.block.blockHeader.number),
                            "toBlock": Helpers.fromDecimal(log.block.blockHeader.number)
                        }]

                    }, function(optionsFilterId){

                        asyncTest(host, optionsFilterId.result, [log], function(){

                            // remove filter
                            uninstallFilter(host, optionsFilterId.result);

                            done();
                        });
                    });


                });

                it('should return the correct log, when filtering with address', function(done){
                    // INSTALL a options filter first
                    Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                        
                        // PARAMETERS
                        params: [{
                            "address": '0x'+ log.tx.to,
                            "fromBlock": Helpers.fromDecimal(log.block.blockHeader.number),
                            "toBlock": Helpers.fromDecimal(log.block.blockHeader.number)
                        }]

                    }, function(optionsFilterId){

                        asyncTest(host, optionsFilterId.result, [log], function(){

                            // remove filter
                            uninstallFilter(host, optionsFilterId.result);

                            done();
                        });

                    });

                });
            });

            it('should return a list of logs, when asking without defining an address and using toBlock "latest"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest'
                    }]

                }, function(optionsFilterId){

                    asyncTest(host, optionsFilterId.result, config.logs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });
            });

            it('should return a list of logs, when asking without defining an address and using toBlock "pending"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'pending'
                    }]

                }, function(optionsFilterId){

                    asyncTest(host, optionsFilterId.result, config.logs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });
            });

            it('should return a list of logs, when filtering with defining an address and using toBlock "latest"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        'address': "0x"+ config.logs[0].tx.to
                    }]

                }, function(optionsFilterId){

                    asyncTest(host, optionsFilterId.result, config.logs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });
            });

            it('should return a list of logs, when filtering with defining an address and using toBlock "pending"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'pending',
                        'address': "0x"+ config.logs[0].tx.to
                    }]

                }, function(optionsFilterId){

                    asyncTest(host, optionsFilterId.result, config.logs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });
            });

            it('should return a list of logs, when filtering by topic "0x0000000000000000000000000000000000000000000000000000000000000001"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": ['0x0000000000000000000000000000000000000000000000000000000000000001']
                    }]

                }, function(optionsFilterId){

                    // get only the logs which have true as the first index arg
                    var newLogs = _.filter(config.logs, function(log){
                        return (log.anonymous && log.indexArgs[0] === true);
                    });

                    asyncTest(host, optionsFilterId.result, newLogs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });

            });

            it('should return a list of anonymous logs, when filtering by topic "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"', function(done){
                // INSTALL a options filter first
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": [null, null, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff']
                    }]

                }, function(optionsFilterId){

                    // get only the logs which have true as the first index arg
                    var newLogs = _.filter(config.logs, function(log){
                        return (log.anonymous && log.indexArgs[2] === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
                    });

                    asyncTest(host, optionsFilterId.result, newLogs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });

            });

            it('should return a list of logs, when filtering by topic "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"', function(done){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        "topics": [null, null, null, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff']
                    }]

                }, function(optionsFilterId){

                    // get only the logs which have true as the first index arg
                    var newLogs = _.filter(config.logs, function(log){
                        return (!log.anonymous && log.indexArgs[2] === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
                    });

                    asyncTest(host, optionsFilterId.result, newLogs, function(){

                        // remove filter
                        uninstallFilter(host, optionsFilterId.result);

                        done();
                    });
                });
            });


            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
