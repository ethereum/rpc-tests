var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');


// TEST
var asyncTest = function(host, done, method, params, block){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');

        if(!block)
            assert.isNull(result.result);
        else if(block === 'pending') {

            assert.match(result.result.hash, /^0x/, 'block hash should start with 0x');
            assert.match(result.result.parentHash, /^0x/, 'parentHash should start with 0x');
            assert.match(result.result.sha3Uncles, /^0x/, 'sha3Uncles should start with 0x');
            assert.match(result.result.stateRoot, /^0x/, 'stateRoot should start with 0x');
            assert.match(result.result.transactionsRoot, /^0x/, 'transactionsRoot should start with 0x');
            assert.match(result.result.parentHash, /^0x/, 'block hash should start with 0x');
            assert.equal(result.result.miner, '0x0000000000000000000000000000000000000000', 'nonce should be 0x0000000000000000000000000000000000000000');
            assert.equal(result.result.logsBloom, '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000','logsBloom should be 512 bytes');
            assert.equal(result.result.nonce, '0x0000000000000000','nonce should be 0x0000000000000000');
            // assert.isNull(result.result.miner, 'miner should be null');
            // assert.isNull(result.result.logsBloom, 'logsBloom should be null');
            // assert.isNull(result.result.nonce, 'nonce should be null');

        } else {
            assert.isObject(result.result, 'is object');
            
            Helpers.blockTest(result.result, block.blockHeader);

            // test for transaction objects
            if(params[1]) {
                _.each(result.result.transactions, function(tx, index){
                    Helpers.transactionTest(tx, block.transactions[index], index, block);
                });

            // test for correct transaction hashes
            } else {
                _.each(result.result.transactions, function(tx, index){
                    assert.match(tx, /^0x/, 'should be an transaction hash');
                });
            }

            // test uncles
            if(block.uncleHeaders.length > 0) {
                assert.isArray(result.result.uncles, 'should contain uncles');

                _.each(block.uncleHeaders, function(uncle, index){
                    assert.strictEqual(result.result.uncles[index], '0x'+ uncle.hash);
                });
            }
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



var method1 = 'eth_getBlockByNumber';
describe(method1, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){

            _.each(config.testBlocks.blocks.filter(function (block) { return block.reverted !== true; }), function(block){

                it('should return a block with the proper structure, containing array of transaction objects', function(done){
                    asyncTest(host, done, method1, [Helpers.fromDecimal(block.blockHeader.number), true], block);
                });

                it('should return a block with the proper structure, containing array of transaction hashes', function(done){
                    asyncTest(host, done, method1, [Helpers.fromDecimal(block.blockHeader.number), false], block);
                });

            });

            it('should return a the genisis block when using "earliest"', function(done){
                asyncTest(host, done, method1, ['earliest', false], {blockHeader: config.testBlocks.genesisBlockHeader, transactions: [], uncleHeaders: []});
            });

            it('should return a the last block when using "latest"', function(done){
                asyncTest(host, done, method1, ['latest', false], config.testBlocks.blocks[config.testBlocks.blocks.length-1]);
            });

            it('should return a the pending block when using "pending"', function(done){
                asyncTest(host, done, method1, ['pending', false], 'pending');
            });

            it('should return null when no block was found', function(done){
                asyncTest(host, done, method1, ['0xbbbbbb', true], null);
            });
            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method1, ['0xbbb']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method1, []);
            });
        });
    });
});


var method2 = 'eth_getBlockByHash';
describe(method2, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){

            _.each(config.testBlocks.blocks, function(block){
                it('should return a block with the proper structure, containing array of transaction objects', function(done){
                    asyncTest(host, done, method2, ['0x'+ block.blockHeader.hash, true], block);
                });

                it('should return a block with the proper structure, containing array of transaction hashes', function(done){
                    asyncTest(host, done, method2, ['0x'+ block.blockHeader.hash, false], block);
                });
            });

            it('should return null when no block was found', function(done){
                asyncTest(host, done, method2, ['0x878a132155f53adb7c993ded4cfb687977397d63d873fcdbeb06c18cac907a5c', true], null);
            });
            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method2, ['0x878a132155f53adb7c993ded4cfb687977397d63d873fcdbeb06c18cac907a5c']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method2, []);
            });
        });
    });
});
