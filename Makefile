.DELETE_ON_ERROR:

BIN = ./node_modules/.bin
PATH := $(BIN):$(PATH)

test: lint
	@mocha -t 5000 -b -R spec spec.js

lint:
	@jsxhint index.js example/

install link:
	@npm $@

example::
	@node-dev --no-deps example/server.js

release-patch: test
	@$(call release,patch)

release-minor: test
	@$(call release,minor)

release-major: test
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish

define release
	npm version $(1)
endef
