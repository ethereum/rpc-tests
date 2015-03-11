var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'shh_newFilter';


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
            it('should return a number as hexstring when all options are passed', function(done){
                asyncTest(config.hosts[key], done, {
                    "topics": ['0x6aa910a7186fdf'],
                    "to": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc"
                });
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return a number as hexstring when a few options are passed', function(done){
                asyncTest(config.hosts[key], done, {
                    "topics": ['0x6aa910a7186fdf']
                });
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when a wrong parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done, {
                    "to": 2,
                });
            });
        });
        describe(key.toUpperCase(), function(){
            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(config.hosts[key], done);
            });
        });
    }
});
