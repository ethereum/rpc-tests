var config = require('../lib/config'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    _ = require('underscore'),
    BigNumber = require('bignumber.js'),
    assert = require('chai').assert;

var Helpers = {
    send: function(host, data, callback) {
        var xhr = new XMLHttpRequest();

        // ASYNC
        if(typeof callback === 'function') {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        callback(JSON.parse(xhr.responseText), xhr.status);
                    } else {
                        // remove offline host from config
                        throw new Error('Can\'t connect to '+ host + "\n Send: "+ JSON.stringify(data, null, 2));
                    }
                }
            };

            xhr.open('POST', host, true);
            xhr.send(JSON.stringify(data));

        // SYNC
        } else {
            xhr.open('POST', host, false);
            xhr.send(JSON.stringify(data));

            if(xhr.readyState === 4 && xhr.status !== 200) {
                throw new Error('Can\'t connect to '+ host + "\n Send: "+ JSON.stringify(data, null, 2));
            }

            return JSON.parse(xhr.responseText);
        }
    },
    eachHost: function(callback){
        for (var key in config.hosts) {
            (function(key){
                callback(key.toUpperCase(), config.hosts[key]);
            })(key);
        }
    },
    getKeyByValue: function(object, value) {
        for( var prop in object ) {
            if( object.hasOwnProperty( prop ) ) {
                 if( object[ prop ] === value )
                     return prop;
            }
        }
    },
    getBlockByNumber: function(number){
        return _.find(config.testBlocks.blocks, function(bl){
            return (bl.blockHeader.number == number) ? bl : false;
        });
    },
    fromDecimal: function(number){
        return '0x' + new BigNumber((number).toString(10),10).toString(16);
    },
    fromAscii: function(str) {
        var hex = "";
        for(var i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i).toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }

        return '0x'+ hex;
    },
    toAscii: function(hex) {
        // Find termination
        var str = "";
        var i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) {
                break;
            }

            str += String.fromCharCode(code);
        }

        return str;
    },
    // toDecimal: function (value) {
    //     return toBigNumber(value).toNumber();
    // },
    isAddress: function(address) {
        if (!_.isString(address)) {
            return false;
        }

        return (/^[x0-9a-f]{0,42}$/i.test(address) && (address.length === 42|| address.length === 40));
    },

    // TESTS
    blockTest: function(result, blockHeader){
        assert.strictEqual(+result.number, +blockHeader.number, 'block number should be ' + (+blockHeader.number));
        assert.strictEqual(result.hash, '0x'+ blockHeader.hash, 'blockHash should be 0x' + blockHeader.hash);
        assert.strictEqual(result.parentHash, '0x'+ blockHeader.parentHash, 'parentHash should be 0x' + blockHeader.parentHash);
        assert.strictEqual(result.nonce, '0x'+ blockHeader.nonce, 'block nonce should be ' + (+blockHeader.nonce));
        assert.strictEqual(result.sha3Uncles, '0x'+ blockHeader.uncleHash, 'uncleHash should be 0x' + blockHeader.uncleHash);
        assert.strictEqual(result.logsBloom, '0x'+ blockHeader.bloom, 'bloom should be 0x' + blockHeader.bloom);
        assert.strictEqual(result.transactionsRoot, '0x'+ blockHeader.transactionsTrie, 'transactionsRoot should be 0x' + blockHeader.transactionsTrie);
        assert.strictEqual(result.stateRoot, '0x'+ blockHeader.stateRoot, 'stateRoot should be ' + blockHeader.stateRoot);
        assert.strictEqual(result.miner, '0x'+ blockHeader.coinbase, 'miner should be 0x' + blockHeader.coinbase);
        assert.strictEqual(+result.difficulty, +blockHeader.difficulty, 'difficulty should be ' + blockHeader.difficulty);
        assert.strictEqual(result.extraData, blockHeader.extraData, 'extraData should be ' + blockHeader.extraData);
        assert.strictEqual(+result.gasLimit, +blockHeader.gasLimit, 'gasLimit should be ' + (+blockHeader.gasLimit));
        assert.strictEqual(+result.gasUsed, +blockHeader.gasUsed, 'gasUsed should be ' + (+blockHeader.gasUsed));
        assert.strictEqual(+result.timestamp, +blockHeader.timestamp, 'timestamp should be ' + (+blockHeader.timestamp));
        assert.isNumber(+result.size, 'size should be a number');
        assert.isNumber(+result.totalDifficulty, 'totalDifficulty should be a number');
    },
    transactionTest: function(result, tx, index, block){
        
        assert.strictEqual(result.blockHash, '0x'+ block.blockHeader.hash, 'transaction blockHash should be 0x' + block.blockHeader.hash);
        assert.strictEqual(+result.blockNumber, +block.blockHeader.number, 'transaction block number should be ' + (+block.blockHeader.number));

        assert.strictEqual(+result.transactionIndex, index, 'transactionIndex should be ' + index);
        assert.match(result.hash, /^0x/, 'transaction hash should start with 0x');
        assert.strictEqual(+result.nonce, +tx.nonce, 'transaction nonce should be ' + (+tx.nonce));
        assert.strictEqual(+result.gas, +tx.gasLimit, 'transaction gasLimit should be ' + (+tx.gasLimit));
        assert.strictEqual(+result.gasPrice, +tx.gasPrice, 'transaction gasPrice should be ' + (+tx.gasPrice));
        assert.strictEqual(+result.value, +tx.value, 'transaction value should be ' + (+tx.value));
        assert.strictEqual(result.input, tx.data, 'transaction data should be ' + (+tx.data));
        assert.match(result.from, /^0x/, 'transaction from should be an address');

        if(!result.to)
            assert.isNull(result.to, 'transaction to should be null in an contract creation transaction');
        else
            assert.strictEqual(result.to, '0x'+ tx.to, 'transaction to should be 0x'+ tx.to);

    },
    /**
    Tests a log based on an "logInfo" given.
    The logs are based on the RPCTestContract.sol logs.
    The object contains the calling code and its expected arguments:

        {
            call: '0x9dc2c8f5',
            anonymous: true,
            indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', -23],
            args: [42]
        }

    */
    logTest: function(result, logInfo){

        assert.isNumber(+result.logIndex, 'logIndex should be a number');
        assert.strictEqual(+result.transactionIndex, logInfo.txIndex, 'transactionIndex should be ' + logInfo.txIndex);
        assert.match(result.transactionHash, /^0x/, 'transactionHash should start with 0x');
        assert.isAbove(result.transactionHash.length, 19, 'transactionHash should be not just "0x"');
        assert.strictEqual(result.blockHash, '0x'+ logInfo.block.blockHeader.hash, 'transaction blockHash should be 0x' + logInfo.block.blockHeader.hash);
        assert.strictEqual(+result.blockNumber, +logInfo.block.blockHeader.number, 'transaction block number should be ' + (+logInfo.block.blockHeader.number));
        assert.strictEqual(result.address, '0x'+ logInfo.tx.to, 'log address should 0x'+ logInfo.tx.to);
        assert.isArray(result.topics);
        assert.match(result.data, /^0x/, 'log data should start with 0x');
        assert.equal(!result.polarity, !!logInfo.block.reverted);

        if(!logInfo.anonymous) {
            assert.include(config.compiledTestContract, result.topics[0].replace('0x',''), 'the topic signature should be in the compiled code');
            // and then remove the signature from the topics
            result.topics.shift();
        }

        // test non-indexed params
        var data = (result.data.length <= 66) ? [result.data] : [result.data.slice(0,66), '0x'+ result.data.slice(66)];
        _.each(logInfo.args, function(arg, index){
            if(arg > 0)
                assert.strictEqual(+data[index], arg, 'log data should be a positive number');
            else
                assert.strictEqual(new BigNumber(data[index], 16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)).minus(1).toNumber(), arg, 'log data should be a negative number');
        });

        // test index args
        _.each(logInfo.indexArgs, function(arg, index){
            if(arg === true) {
                assert.strictEqual(Boolean(result.topics[index]), arg, 'should be TRUE');
            }
            else if(arg === 'msg.sender') {
                assert.isObject(_.find(config.testBlocks.postState, function(value, key){ return key === result.topics[index].slice(26); }), 'should be a existing address in the "postState"');
            } else {
                assert.strictEqual(result.topics[index], arg, 'log topic should match '+ arg);
            }
        });
    },

    logExTest: function (result, logInfo) {
        assert.strictEqual(result.blockHash, '0x'+ logInfo.block.blockHeader.hash, 'transaction blockHash should be 0x' + logInfo.block.blockHeader.hash);
        assert.strictEqual(+result.blockNumber, +logInfo.block.blockHeader.number, 'transaction block number should be ' + (+logInfo.block.blockHeader.number));
        assert.equal(!result.polarity, !!logInfo.block.reverted);
        assert.isArray(result.logs);
        var log = result.logs[0]
        // there is only one log in each block in tests
        if (log) {
            assert.isNumber(+log.logIndex, 'logIndex should be a number');
            assert.strictEqual(+log.transactionIndex, logInfo.txIndex, 'transactionIndex should be ' + logInfo.txIndex);
            assert.match(log.transactionHash, /^0x/, 'transactionHash should start with 0x');
            assert.match(log.data, /^0x/, 'log data should start with 0x');
            assert.isArray(log.topics);
        }

    }
};


module.exports = Helpers;
