var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');

var method = '';


// GET test BLOCK 5 and 6 as parent
var block1 = _.find(config.testBlocks.blocks, function(bl){
        return (bl.blockHeader.number == 6) ? bl : false;
    });
block1.blockHeader.parentblockHeader = _.find(config.testBlocks.blocks, function(bl){
    return (bl.blockHeader.number == 5) ? bl : false;
});

var block2 = _.find(config.testBlocks.blocks, function(bl){
        return (bl.blockHeader.number == 3) ? bl.blockHeader : false;
    });
block2.blockHeader.parentblockHeader = _.find(config.testBlocks.blocks, function(bl){
    return (bl.blockHeader.number == 2) ? bl.blockHeader : false;
});


// TEST
var asyncTest = function(host, done, method, params, block){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isObject(result.result, 'is object');

        config.blockTest(result.result, block.blockHeader);

        // test for transaction objects
        if(params[1]) {
            _.each(result.result.transactions, function(tx, index){
                config.transactionTest(tx, block.transactions[index], index, block);
            });

        // test for correct transaction hashes
        } else {
            _.each(result.result.transactions, function(tx, index){
                assert.strictEqual(tx, '0x'+ block.transactions[index].hash);
            });
        }

        // test uncles
        if(result.result.uncles) {
            _.each(result.result.uncles, function(uncle, index){
                assert.strictEqual(uncle, '0x'+ block.uncleHeaders[index].hash);
            });
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



method = 'eth_getBlockByHash';
describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a block with the proper structure, containing array of transaction objects', function(done){
                asyncTest(host, done, method, ['0x3', true], block2);
            });

            it('should return a block with the proper structure, containing array of transaction hashes', function(done){
                asyncTest(host, done, method, ['0x6', false], block1);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d', true]);
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


method = 'eth_getBlockByNumber';
describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return a block with the proper structure, containing array of transaction objects', function(done){
                asyncTest(host, done, method, ['0x'+ block2.blockHeader.hash, true], block2);
            });

            it('should return a block with the proper structure, containing array of transaction hashes', function(done){
                asyncTest(host, done, method, ['0x'+ block1.blockHeader.hash, false], block1);
            });

            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d', true]);
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
