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
        assert.strictEqual(result.parentHash, '0x'+ blockHeader.parentHash, 'parentHash should be 0x' + blockHeader.parentHash);
        assert.strictEqual(result.nonce, '0x'+ blockHeader.nonce, 'block nonce should be ' + blockHeader.nonce);
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
        
        assert.strictEqual(result.blockHash, '0x'+ block.blockHeader.hash, 'transaction blockHash should be 0x' + block.blockHeader.hash);
        assert.strictEqual(+result.blockNumber, Number(block.blockHeader.number), 'transaction block number should be ' + block.blockHeader.number);

        assert.strictEqual(+result.transactionIndex, index, 'transactionIndex should be ' + index);
        assert.match(result.hash, /^0x/, 'transaction hash should be a hash');
        assert.strictEqual(+result.nonce, Number(tx.nonce), 'transaction nonce should be ' + Number(tx.nonce));
        assert.strictEqual(+result.gas, Number(tx.gasLimit), 'transaction gasLimit should be ' + tx.gasLimit);
        assert.strictEqual(+result.gasPrice, Number(tx.gasPrice), 'transaction gasPrice should be ' + tx.gasPrice);
        assert.strictEqual(+result.value, Number(tx.value), 'transaction value should be ' + tx.value);
        assert.strictEqual(result.input, tx.data, 'transaction data should be ' + tx.data);
        assert.match(result.from, /^0x/, 'transaction from should be an address');

        if(!result.to)
            assert.isNull(result.to, 'transaction to should be null in an contract creation transaction');
        else
            assert.strictEqual(result.to, '0x'+ tx.to, 'transaction to should be 0x'+ tx.to);
    }
};


module.exports = config;
