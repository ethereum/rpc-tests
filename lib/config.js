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
    blockTest: function(result, block){
            assert.strictEqual(+result.number, Number(block.blockHeader.number));
            assert.strictEqual(result.hash, '0x'+ block.blockHeader.hash);
            assert.strictEqual(result.parentHash, '0x'+ parentBlock.blockHeader.hash);
            assert.strictEqual(result.nonce, '0x'+ block.blockHeader.nonce);
            assert.strictEqual(result.sha3Uncles, '0x'+ block.blockHeader.uncleHash);
            assert.strictEqual(result.logsBloom, '0x'+ block.blockHeader.bloom);
            assert.strictEqual(result.transactionsRoot, '0x'+ block.blockHeader.transactionsTrie);
            assert.strictEqual(result.stateRoot, '0x'+ block.blockHeader.stateRoot);
            assert.strictEqual(result.miner, '0x'+ block.blockHeader.coinbase);
            assert.strictEqual(+result.difficulty, Number(block.blockHeader.difficulty));
            assert.strictEqual(result.extraData, block.blockHeader.extraData);
            assert.strictEqual(+result.gasLimit, Number(block.blockHeader.gasLimit));
            assert.strictEqual(+result.gasUsed, Number(block.blockHeader.gasUsed));
            assert.strictEqual(+result.timestamp, Number(block.blockHeader.timestamp));
            assert.strictEqual(+result.gasLimit, Number(block.blockHeader.gasLimit));
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