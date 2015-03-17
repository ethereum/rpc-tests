var assert = require('chai').assert;
// var chai = require('chai');
// chai.config.includeStack = false;
// chai.config.showDiff = false;

var config = {
    rpcMessageId: 1,
    testBlocks: require('./tests/BlockTests/bcJS_API_Test.json').JS_API_Tests,
    hosts: {
        cpp: 'http://localhost:8080',
        go: 'http://localhost:8545'
    },
    blockTest: function(result, blockHeader){
            assert.strictEqual(+result.number, Number(blockHeader.number));
            assert.strictEqual(result.hash, '0x'+ blockHeader.hash);
            assert.strictEqual(result.parentHash, '0x'+ block.parentblockHeader.hash);
            assert.strictEqual(result.nonce, '0x'+ blockHeader.nonce);
            assert.strictEqual(result.sha3Uncles, '0x'+ blockHeader.uncleHash);
            assert.strictEqual(result.logsBloom, '0x'+ blockHeader.bloom);
            assert.strictEqual(result.transactionsRoot, '0x'+ blockHeader.transactionsTrie);
            assert.strictEqual(result.stateRoot, '0x'+ blockHeader.stateRoot);
            assert.strictEqual(result.miner, '0x'+ blockHeader.coinbase);
            assert.strictEqual(+result.difficulty, Number(blockHeader.difficulty));
            assert.strictEqual(result.extraData, blockHeader.extraData);
            assert.strictEqual(+result.gasLimit, Number(blockHeader.gasLimit));
            assert.strictEqual(+result.gasUsed, Number(blockHeader.gasUsed));
            assert.strictEqual(+result.timestamp, Number(blockHeader.timestamp));
            assert.strictEqual(+result.gasLimit, Number(blockHeader.gasLimit));
            assert.isNumber(+result.minGasPrice);
            assert.isNumber(+result.size);
            assert.isNumber(+result.totalDifficulty);
    },
    transactionTest: function(result, tx, index, block){

            assert.strictEqual(result.blockHash, '0x'+ block.blockHeader.hash);
            assert.strictEqual(+result.blockNumber, Number(block.blockHeader.number));

            assert.match(result.hash, /^0x/);
            assert.strictEqual(+result.transactionIndex, index);
            assert.strictEqual(+result.nonce, Number(tx.nonce));
            assert.strictEqual(+result.gasLimit, Number(tx.gasLimit));
            assert.strictEqual(+result.gasPrice, Number(tx.gasPrice));
            assert.strictEqual(+result.value, Number(tx.value));
            assert.strictEqual(result.data, tx.data);
            assert.strictEqual(result.to, '0x'+ tx.to);
            assert.isAddress(Helpers.isAddress(result.from));
    }
};


module.exports = config;