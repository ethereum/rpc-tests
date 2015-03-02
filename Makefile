REPORTER = dot

test:
	@./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		test/*.js

.PHONY: test
