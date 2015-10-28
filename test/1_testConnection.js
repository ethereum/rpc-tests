var config = require('../lib/config');
var useIpc = process.argv[process.argv.length-1] === '--ipc';

if(useIpc) {

    // remove http hosts from config
    delete config.hosts.cpp;
    delete config.hosts.go;
    delete config.hosts.python;

} else {
    var Helpers = require('../lib/helpers');

    delete config.hosts.ipc;

    Helpers.eachHost(function(key, host){
        try {
            Helpers.send(host);

        } catch(e) {
            // remove offline host from config
            delete config.hosts[Helpers.getKeyByValue(config.hosts, host)];

            console.log('Can\'t connect to '+ key + ' at '+  host);
        }
    });
}

