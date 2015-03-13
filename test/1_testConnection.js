var config = require('../lib/config'),
    Helpers = require('../lib/helpers');

Helpers.eachHost(function(key, host){
    try {
        Helpers.send(host);
    } catch(e) {
        // remove offline host from config
        delete config.hosts[Helpers.getKeyByValue(config.hosts, host)];

        describe(key, function(){
            it('couldn\'t connect', function(){
                throw new Error('Can\'t connect to '+ host);
            });
        });
    }
});