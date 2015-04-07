var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getBlockTransactionCountByNumber';


// TEST
var asyncTest = function(host, done, params, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'is hex');
        assert.isNumber(+result.result, 'can be converted to a number');

        assert.equal(+result.result, expectedResult, 'should be '+ expectedResult);

        done();
    });
};


var asyncErrorTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

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
            _.each(config.testBlocks.blocks, function(block){
                it('should return '+block.transactions.length+' as a hexstring', function(done){
                    asyncTest(host, done, [Helpers.fromDecimal(block.blockHeader.number)], block.transactions.length);
                });
            });

            it('should return '+config.testBlocks.blocks[config.testBlocks.blocks.length-1].transactions.length+' as a hexstring when "latest" (block: '+config.testBlocks.blocks[config.testBlocks.blocks.length-1].blockHeader.hash+')', function(done){
                asyncTest(host, done, ['latest'], config.testBlocks.blocks[config.testBlocks.blocks.length-1].transactions.length);
            });

            it('should return 0 as a hexstring when "pending"', function(done){
                asyncTest(host, done, ['latest'], 0);
            });

            it('should return 0 as a hexstring when "earliest" (block: '+config.testBlocks.genesisBlockHeader.hash+')', function(done){
                asyncTest(host, done, ['latest'], 0);
            });

            it('should return null if the block doesnt exist', function(done){
                asyncTest(host, done, [Helpers.fromDecimal(99999)], null);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
