var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_call';


// TEST
var asyncTest = function(host, done, params, expectedResult, type, call){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'should be a string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');

        if(type === 'empty')
            assert.equal(result.result, expectedResult, 'should be "0x"');
        else
            assert.equal(result.result.length, 66, 'should be 32 Bytes long');

        if(type === 'getAddress')
            assert.equal(result.result.slice(-20), expectedResult.slice(-20), 'should return '+ expectedResult.slice(-20));
        else
            assert.equal(result.result, expectedResult, 'should return '+ expectedResult);

        done();
    });
};


var asyncErrorTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: param

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

            var calls = [{
                name: 'getBool',
                call: '0x12a7b914',
                setter: '0x1e26fd33',
            },
            {
                name: 'getBytes32',
                call: '0x1f903037',
                setter: '0xc2b12a73'
            },
            {
                name: 'getUint8',
                call: '0x343a875d',
                setter: '0x1774e646'
            },
            {
                name: 'getAddress',
                call: '0x38cc4831',
                setter: '0xe30081a0'
            },
            {
                name: 'getInt8',
                call: '0x57cb2fc4',
                setter: '0x9a19a953'
            },
            {
                name: 'getUint256',
                call: '0x68895979',
                setter: '0xd2282dc5'
            },
            {
                name: 'getInt256',
                call: '0xf5b53e17',
                setter: '0xa53b1c1e'
            }];
            // add the block and the result
            calls = _.map(calls, function(call){
                var result = null,
                    to = null;
                call.block = _.find(config.testBlocks.blocks, function(block){
                    return _.find(block.transactions, function(tx, index){
                        if (tx.data.indexOf(call.setter) === 0){
                            result = tx.data.replace(call.setter, '');
                            to = tx.to;
                            return true;
                        } else
                            return false;
                    });
                });
                call.result = '0x'+ result;
                call.to = '0x'+ to;
                call.blockNumber = Number(call.block.blockHeader.number);
                delete call.block;
                return call;
            });

            _.each(calls, function(call){
                it('calling '+ call.name +' ('+ call.call +') should return the correct value, when the using the correct block ('+ call.blockNumber +') as default block', function(done){
                    asyncTest(host, done, [{
                        to: call.to,
                        data: call.call
                    }, Helpers.fromDecimal(call.blockNumber)], call.result, call.name);
                });

                it('calling '+ call.name +' ('+ call.call +') should return "0x0000000000000000000000000000000000000000000000000000000000000000", when using the wrong block ('+ call.blockNumber - 1 +') as default block', function(done){
                    asyncTest(host, done, [{
                        to: call.to,
                        data: call.call
                    }, Helpers.fromDecimal(call.blockNumber -1)], '0x0000000000000000000000000000000000000000000000000000000000000000', null, call);
                });

                it('calling '+ call.name +' ('+ call.call +') should return "0x", when using a block (0) where no contract is deployed', function(done){
                    asyncTest(host, done, [{
                        to: call.to,
                        data: call.call
                    }, '0x0'], '0x', 'empty');
                });
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, []);
            });

            // it('should return an error when no second parameter is passed', function(done){
            //     asyncErrorTest(host, done, [{to: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'}]);
            // });
        });
    });
});
