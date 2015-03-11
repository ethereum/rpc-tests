var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_newBlockFilter';


// TEST
var asyncTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [param]

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'is hex');
        assert.isNumber(+result.result, 'can be converted to a number');

        done();
    });
};


var asyncErrorTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: param ? [param] : []

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};



describe(method, function(){

    for (var key in config.hosts) {
        describe(key.toUpperCase(), function(){
            it('should return a number as hexstring when passing "latest"', function(done){
                asyncTest(config.hosts[key], done, 'latest');
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return a number as hexstring when passing "pending"', function(done){
                asyncTest(config.hosts[key], done, 'pending');
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done);
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when a wrong parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done, 'something');
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when a wrong parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done, 23);
            });
        });
    }
});
