var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'shh_hasIdentity';


// TEST
var asyncTest = function(host, done, param, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [param]

    }, function(result){

        assert.property(result, 'result', (result.error) ? result.error.message : 'error');

        if(expectedResult)
            assert.isTrue(result.result, 'should return TRUE');
        else
            assert.isFalse(result.result, 'should return FALSE');

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

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            it('should return TRUE if the identity already exists', function(done){
                
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'shh_newIdentity',
                    
                    // PARAMETERS
                    params: []
                }, function(identity){

                    asyncTest(host, done, identity.result, true);
                });

            });

            it('should return FALSE if the identity doesn\'t exists', function(done){
                asyncTest(host, done, '0x2599F5fa71695aa16e6ae0c37258ae842a90cb60f6804d2486b35dfc89adaea819e589ed904e1fb9316a11753eb44b5806af6ef7e2739eb96cf05e9bb3cc08bc', false);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
