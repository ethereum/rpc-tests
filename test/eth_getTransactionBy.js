var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');



// TEST
var syncTest = function(host, method, params, block, index){

    var result = Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params
    });

    assert.property(result, 'result', (result.error) ? result.error.message : 'error');

    if(!block)
        assert.isNull(result.result);
    else if(block === 'pending')
        assert.isObject(result.result, 'is object');
    else {
        assert.isObject(result.result, 'expected transaction to be an object. transaction location: ' + block.blockHeader.hash + ', ' + index);
        Helpers.transactionTest(result.result, block.transactions[index], index, block);
    }
};


var asyncErrorTest = function(host, done, method, params){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};



var method1 = 'eth_getTransactionByHash';
describe(method1, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            _.each(config.testBlocks.blocks, function(bl){
                _.each(bl.transactions, function(tx, index){
                    it('should return a transaction with the proper structure', function(){
                        
                        var givenBlock = Helpers.send(host, {
                            id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByHash',
                            
                            // PARAMETERS
                            params: ['0x'+ bl.blockHeader.hash, false]
                        });

                        syncTest(host, method1, [givenBlock.result.transactions[index]], bl, index);
                    });
                });
            });  

            it('should return null when no transaction was found', function(){
                syncTest(host, method1, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d'], null);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method1, []);
            });
        });
    });
});


var method2 = 'eth_getTransactionByBlockHashAndIndex';
describe(method2, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            _.each(config.testBlocks.blocks, function(bl){
                _.each(bl.transactions, function(tx, index){
                    it('should return a transaction with the proper structure', function(){
                        syncTest(host, method2, ['0x'+ bl.blockHeader.hash, Helpers.fromDecimal(index)], bl, index);
                    });
                });
            });

            it('should return null when no transaction was found', function(){
                syncTest(host, method2, ['0x'+ config.testBlocks.blocks[0].blockHeader.hash, '0xb'], null);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method2, []);
            });
        });
    });
});


var method3 = 'eth_getTransactionByBlockNumberAndIndex';
describe(method3, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            _.each(config.testBlocks.blocks.filter(function (block) { return block.reverted !== true }), function(bl){
                _.each(bl.transactions, function(tx, index){
                    it('should return a transaction with the proper structure', function(){
                        syncTest(host, method3, [Helpers.fromDecimal(bl.blockHeader.number), Helpers.fromDecimal(index)], bl, index);
                    });
                });
            });

            it('should return no transactions at the genisis block when using "earliest"', function(){
                syncTest(host, method3, ['earliest', '0x0'], null);
            });

            it('should return one transaction at 0 for the last block when using "latest"', function(){
                syncTest(host, method3, ['latest', '0x0'], config.testBlocks.blocks[config.testBlocks.blocks.length-1], 0);
            });

            it('should return transactions for the pending block when using "pending" and sending transactions before', function(done){

                // send transaction
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_sendTransaction',
                    
                    // PARAMETERS
                    params: [{
                        "from": config.senderAddress,
                        "to": config.contractAddress,
                        "value" : 0,
                    }]

                });

                setTimeout(function(){

                    syncTest(host, method3, ['pending', '0x0'], 'pending');

                    done();
                }, 1000);
            });

            it('should return null when no transaction was found', function(){
                syncTest(host, method3, ['0x2', '0xb'], null);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method3, []);
            });
        });
    });
});

