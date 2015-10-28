REPORTER = dot

MOCHA = @./node_modules/mocha/bin/mocha --reporter $(REPORTER)

test:
	$(MOCHA) test/*.js

test.eth:
	$(MOCHA) test/1_testConnection.js test/eth_*.js

test.shh:
	$(MOCHA) test/1_testConnection.js test/shh_*.js

test.net:
	$(MOCHA) test/1_testConnection.js test/net_*.js

test.ipc:
	$(MOCHA) test/*.js --ipc

test.eth.ipc:
	$(MOCHA) test/1_testConnection.js test/eth_*.js --ipc

test.shh.ipc:
	$(MOCHA) test/1_testConnection.js test/shh_*.js --ipc

test.net.ipc:
	$(MOCHA) test/1_testConnection.js test/net_*.js --ipc


.PHONY: test
