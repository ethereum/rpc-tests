var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getFilterLogs';

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

            var logs = [{
                call: '0x9dc2c8f5',
                anonymous: true,
                indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
                args: [-23, 42]
            },{
                call: '0xfd408767',
                anonymous: false,
                indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
                args: [-23, 42]
            },{
                call: '0xe8beef5b',
                anonymous: true,
                indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
                args: [42]
            },{
                call: '0xf38b0600',
                anonymous: false,
                indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
                args: [42]
            },{
                call: '0x76bc21d9',
                anonymous: true,
                indexArgs: [true, 'msg.sender'],
                args: [42]
            },{
                call: '0x102accc1',
                anonymous: false,
                indexArgs: [true, 'msg.sender'],
                args: [42]
            },{
                call: '0x4e7ad367',
                anonymous: true,
                indexArgs: [true],
                args: [42]
            },{
                call: '0xb61c0503',
                anonymous: false,
                indexArgs: [true],
                args: [42]
            },{
                call: '0xa6780857',
                anonymous: true,
                indexArgs: [],
                args: [42]
            },{
                call: '0x65538c73',
                anonymous: false,
                indexArgs: [],
                args: [42]
            }];
            // add the log.block, log.tx and log.txIndex
            logs = _.map(logs, function(log){
                var transaction = null,
                    txIndex = null;
                log.block = _.find(config.testBlocks.blocks, function(block){
                    return _.find(block.transactions, function(tx, index){
                        if (tx.data === log.call){
                            transaction = tx;
                            txIndex = index;
                            return true;
                        } else
                            return false;
                    });
                });
                log.tx = transaction;
                log.txIndex = txIndex;
                return log;
            });

            _.each(logs, function(log){
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

                    // console.log('#####################');
                    // console.log('Filter ID', optionsFilterId.result);

                    syncTest(host, optionsFilterId.result, [log]);

                    // remove filter
                    var result = Helpers.send(host, {id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_uninstallFilter', params: [optionsFilterId.result] });

                    // console.log('Uninstalled filter', result.result);

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
                    var result = Helpers.send(host, {id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_uninstallFilter', params: [optionsFilterId.result] });

                });
            });

            it('should return a list of logs, when asking without defining an address', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest'
                    }]

                });
                syncTest(host, optionsFilterId.result, logs);
            });

            it('should return a list of logs, when filtering with defining an address', function(){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "fromBlock": '0x0',
                        "toBlock": 'latest',
                        'address': "0x"+ logs[0].tx.to
                    }]

                });
                syncTest(host, optionsFilterId.result, logs);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
