var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');


// GET test BLOCK 4
var block = _.find(config.testBlocks.blocks, function(bl, index){
        return (bl.blockHeader.number == 4) ? bl : false;
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

    config.blockTest(result.result, block.uncleHeaders[1]);
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


var method1 = 'eth_getUncleByBlockHashAndIndex';
describe(method1, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return an uncle with the proper structure', function(done){
                
                var givenBlock = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method1: 'eth_getBlockByHash',
                    
                    // PARAMETERS
                    params: ['0x'+ block.blockHeader.hash, false]
                });

                syncTest(host, method1, [givenBlock.hash, '0x1'], block);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method1, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method1, []);
            });
        });
    });
});


var method2 = 'eth_getUncleByBlockNumberAndIndex';
describe(method2, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return an uncle with the proper structure', function(done){
                
                var givenBlock = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method2: 'eth_getBlockByHash',
                    
                    // PARAMETERS
                    params: ['0x'+ block.blockHeader.hash, false]
                });

                syncTest(host, method2, ['0x4', '0x1'], block);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method2, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method2, []);
            });
        });
    });
});

