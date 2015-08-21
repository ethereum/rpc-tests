var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getStorageAt';


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
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');

        expectedResult = Helpers.padLeft(expectedResult, 64);

        assert.equal(result.result, expectedResult, 'should match '+ expectedResult);

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

            _.each(config.testBlocks.postState, function(state, key){
                _.each(state.storage, function(storage, index){
                    // fix block test file
                    index = index.replace('0x0','0x');
                    it('should return '+ storage +' when the defaultBlock is "latest" for storage position '+ index +' at address 0x'+ key, function(done){
                        asyncTest(host, done, [
                            '0x'+ key,
                            index,
                            'latest'
                            ], storage);
                    });
                });
            });

            _.each(config.testBlocks.pre, function(state, key){
                _.each(state.storage, function(storage, index){
                    // fix block test file
                    index = index.replace('0x0','0x');
                    it('should return '+ storage +' when the defaultBlock is 0 for storage position '+ index +' at address 0x'+ key, function(done){
                        asyncTest(host, done, [
                            '0x' + key,
                            index,
                            '0x0'
                            ], storage);
                    });
                });
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
