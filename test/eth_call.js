var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_call';


// TEST
var asyncTest = function(host, done, params, expectedResult, isAddress){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'should be a string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');
        assert.equal(result.result.length, 66, 'should be 64 Bytes long');

        if(isAddress)
            assert.equal(result.result.slice(-20), expectedResult.slice(-20), 'should return '+ expectedResult.slice(-20));
        else
            assert.equal(result.result, expectedResult, 'should return '+ expectedResult);

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

            console.log(calls);

            _.each(calls, function(call){
                it('calling '+ call.name +' ('+ call.call +') should return the correct value when the using the correct block ('+ call.blockNumber +') as default block', function(done){
                    asyncTest(host, done, [{
                        to: call.to,
                        data: call.call
                    }, Helpers.fromDecimal(call.blockNumber)], call.result, true);
                });
            });

            // it('should return an error when no parameter is passed', function(done){
            //     asyncErrorTest(host, done);
            // });
        });
    });
});
