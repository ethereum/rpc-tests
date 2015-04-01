var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;
    _ = require('underscore');


// TEST
var syncTest = function(host, method, params, uncle){

    var result = Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params
    });

    assert.property(result, 'result', (result.error) ? result.error.message : 'error');
    assert.isObject(result.result, 'is object');

    if(!uncle)
        assert.isNull(result.result);
    else
        config.blockTest(result.result, uncle);
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


var method1 = 'eth_getUncleByBlockHashAndIndex';
describe(method1, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){

            _.each(config.testBlocks.blocks, function(block){
                _.each(block.uncleHeaders, function(uncle, index){
                    it('should return an uncle with the proper structure', function(){
                        syncTest(host, method1, ['0x'+ block.blockHeader.hash, Helpers.fromDecimal(index), false], uncle);
                    });
                });
            });

            it('should return null when no uncle was found', function(){
                syncTest(host, method1, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d', '0xb', false], null);
            });
            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method1, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d', '0xb']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method1, []);
            });
        });
    });
});


var method2 = 'eth_getUncleByBlockNumberAndIndex';
describe(method2, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){

            _.each(config.testBlocks.blocks, function(block){
                _.each(block.uncleHeaders, function(uncle, index){
                    it('should return an uncle with the proper structure', function(){
                        syncTest(host, method2, [Helpers.fromDecimal(block.blockHeader.number), Helpers.fromDecimal(index)], uncle);
                    });
                });
            });

            it('should return null when no uncle was found', function(){
                syncTest(host, method2, ['0x2', '0xbbb', false], null);
            });
            it('should return an error when the wrong parameters is passed', function(done){
                asyncErrorTest(host, done, method2, ['0xd2f1575105fd2272914d77355b8dab5afbdde4b012abd849e8b32111be498b0d', '0xb']);
            });
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done, method2, []);
            });
        });
    });
});

