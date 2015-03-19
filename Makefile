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


.PHONY: test
