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
        config.logTest(log, logsInfo[index]);
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

            logs = _.compact(_.flatten(_.map(config.testBlocks.blocks, function(block){
                var txs =_.filter(block.transactions, function(tx){ return (tx.data.length < 40 && tx.data !== '0x'); });
                if(!_.isEmpty(txs)) {
                    return _.map(txs, function(tx, txIndex){
                        return {tx: tx, txIndex: txIndex, block: block};
                    });
                } else {
                    return;
                }
            })));

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

            it('should return a list of logs, when asking with defining an address', function(){
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
