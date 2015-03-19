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
            assert.strictEqual(+result.number, Number(blockHeader.number), 'block number should be ' + blockHeader.number);
            assert.strictEqual(result.hash, '0x'+ blockHeader.hash, 'blockHash should be 0x' + blockHeader.hash);
            assert.strictEqual(result.parentHash, '0x'+ block.parentblockHeader.hash, 'parentHash should be 0x' + blockHeader.parentblockHeader.hash);
            assert.strictEqual(result.nonce, '0x'+ blockHeader.nonce, 'block number should be ' + blockHeader.number);
            assert.strictEqual(result.sha3Uncles, '0x'+ blockHeader.uncleHash, 'uncleHash should be 0x' + blockHeader.uncleHash);
            assert.strictEqual(result.logsBloom, '0x'+ blockHeader.bloom, 'bloom should be 0x' + blockHeader.bloom);
            assert.strictEqual(result.transactionsRoot, '0x'+ blockHeader.transactionsTrie, 'transactionsRoot should be 0x' + blockHeader.transactionsTrie);
            assert.strictEqual(result.stateRoot, '0x'+ blockHeader.stateRoot, 'stateRoot should be ' + blockHeader.stateRoot);
            assert.strictEqual(result.miner, '0x'+ blockHeader.coinbase, 'miner should be 0x' + blockHeader.coinbase);
            assert.strictEqual(+result.difficulty, Number(blockHeader.difficulty), 'difficulty should be ' + blockHeader.difficulty);
            assert.strictEqual(result.extraData, blockHeader.extraData, 'extraData should be ' + blockHeader.extraData);
            assert.strictEqual(+result.gasLimit, Number(blockHeader.gasLimit), 'gasLimit should be ' + blockHeader.gasLimit);
            assert.strictEqual(+result.gasUsed, Number(blockHeader.gasUsed), 'gasUsed should be ' + blockHeader.gasUsed);
            assert.strictEqual(+result.timestamp, Number(blockHeader.timestamp), 'timestamp should be ' + blockHeader.timestamp);
            assert.isNumber(+result.minGasPrice, 'minGasPrice should be a number');
            assert.isNumber(+result.size, 'size should be a number');
            assert.isNumber(+result.totalDifficulty, 'totalDifficulty should be a number');
    },
    transactionTest: function(result, tx, index, block){

            assert.strictEqual(result.blockHash, '0x'+ block.blockHeader.hash, 'blockHash should be 0x' + block.blockHeader.hash);
            assert.strictEqual(+result.blockNumber, Number(block.blockHeader.number), 'block number should be ' + block.blockHeader.number);

            assert.match(result.hash, /^0x/, 'hash should be a hash');
            assert.strictEqual(+result.transactionIndex, index, 'transactionIndex should be ' + index);
            assert.strictEqual(+result.nonce, Number(tx.nonce), 'nonce should be ' + Number(tx.nonce));
            assert.strictEqual(+result.gasLimit, Number(tx.gasLimit), 'gasLimit should be ' + tx.gasLimit);
            assert.strictEqual(+result.gasPrice, Number(tx.gasPrice), 'gasPrice should be ' + tx.gasPrice);
            assert.strictEqual(+result.value, Number(tx.value), 'value should be ' + tx.value);
            assert.strictEqual(result.data, tx.data, 'data should be ' + tx.data);
            assert.strictEqual(result.to, '0x'+ tx.to, 'to should be 0x'+ tx.to);
            assert.isAddress(Helpers.isAddress(result.from), 'from should be an address');
    }
};


module.exports = config;
