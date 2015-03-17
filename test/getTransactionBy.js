var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');

var method = '';


// GET test BLOCK 3
var block = _.find(config.testBlocks.blocks, function(bl, index){
        return (bl.blockHeader.number == 3) ? bl : false;
    });


// TEST
var syncTest = function(host, method, params, block){

    var result = Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params
    });

    assert.property(result, 'result', (result.error) ? result.error.message : 'error');
    assert.isObject(result.result, 'is object');

    config.transactionTest(result.result, block.transactions[1], 1, block);
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



method = 'eth_getTransactionByHash';
describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a transaction with the proper structure', function(done){
                
                var givenBlock = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByHash',
                    
                    // PARAMETERS
                    params: ['0x'+ block.blockHeader.hash, false]
                });

                syncTest(host, method, [givenBlock.transactions[1].hash], block);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method, []);
            });
        });
    });
});


method = 'eth_getTransactionByBlockHashAndIndex';
describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a transaction with the proper structure', function(done){
                
                var givenBlock = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByHash',
                    
                    // PARAMETERS
                    params: ['0x'+ block.blockHeader.hash, false]
                });

                syncTest(host, method, [givenBlock.hash, '0x1'], block);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method, []);
            });
        });
    });
});


method = 'eth_getTransactionByBlockNumberAndIndex';
describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a transaction with the proper structure', function(done){
                
                var givenBlock = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByHash',
                    
                    // PARAMETERS
                    params: ['0x'+ block.blockHeader.hash, false]
                });

                syncTest(host, method, ['0x3', '0x1'], block);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method, []);
            });
        });
    });
});

