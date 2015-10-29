var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');

var method = 'eth_getTransactionReceipt';


// TEST
var asyncTest = function(host, done, method, params, block, index){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params
    }, function(result){

        assert.property(result, 'result', (result.error) ? result.error.message : 'error');

        if(!block)
            assert.isNull(result.result);
        else if(block === 'pending') {
            assert.isObject(result.result, 'is object');
            assert.isNull(result.transactionIndex);
            assert.isNull(result.blockNumber);
            assert.isNull(result.blockHash);
        } else {
            assert.isObject(result.result, 'expected transaction to be an object. transaction location: ' + block.blockHeader.hash + ', ' + index);
            Helpers.transactionReceiptTest(result.result, block.transactions[index], index, block);
        }

        done();
    });

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



describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            _.each(config.testBlocks.blocks, function(bl){
                _.each(bl.transactions, function(tx, index){
                    it('should return a transaction receipt with the proper structure', function(done){
                        
                        Helpers.send(host, {
                            id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByHash',
                            
                            // PARAMETERS
                            params: ['0x'+ bl.blockHeader.hash, false]
                        }, function(givenBlock){

                            if(bl.reverted)
                                asyncTest(host, done, method, [givenBlock.result.transactions[index]], null, index);
                            else
                                asyncTest(host, done, method, [givenBlock.result.transactions[index]], bl, index);
                        });

                    });
                });
            });  

            it('should return null when no transaction was found', function(done){
                asyncTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d'], null);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method, []);
            });
        });
    });
});


