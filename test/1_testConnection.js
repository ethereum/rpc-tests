var config = require('../lib/config'),
    Helpers = require('../lib/helpers');

Helpers.eachHost(function(key, host){
    try {
        Helpers.send(host);
    } catch(e) {
        // remove offline host from config
        delete config.hosts[Helpers.getKeyByValue(config.hosts, host)];

        console.log('Can\'t connect to '+ key + ' at '+  host);
    }
});