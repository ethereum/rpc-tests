REPORTER = dot

test:
	@./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		test/*.js

test_eth:
	@./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		test/1_testConnection.js test/eth_*.js

.PHONY: test
